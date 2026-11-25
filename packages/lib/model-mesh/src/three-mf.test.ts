// @vitest-environment jsdom
import { strToU8, unzipSync, zipSync } from "fflate"
import { Box3, Vector3 } from "three"
import { expect, it } from "vitest"
import { load3mf } from "./three-mf"

function archive(unit?: string) {
  return zipSync({
    "_rels/.rels": strToU8(
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Target="/3D/root.model" Id="r0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>' +
        "</Relationships>"
    ),
    "3D/root.model": strToU8(
      `<model xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"${unit ? ` unit="${unit}"` : ""}>
        <resources>
          <object id="1" type="model">
            <mesh>
              <vertices><vertex x="0" y="0" z="0"/><vertex x="1" y="0" z="0"/><vertex x="0" y="2" z="0"/></vertices>
              <triangles><triangle v1="0" v2="1" v3="2"/></triangles>
            </mesh>
          </object>
        </resources>
        <build><item objectid="1"/><item objectid="1" transform="1 0 0 0 1 0 0 0 1 3 0 0"/></build>
      </model>`
    ),
  }).slice().buffer
}

it("keeps build placements and applies the model's unit to the entire build", async () => {
  const model = await load3mf(archive("inch"))
  const size = new Box3().setFromObject(model).getSize(new Vector3())
  expect(model.children).toHaveLength(2)
  expect(size.x).toBeCloseTo(101.6)
  expect(size.y).toBeCloseTo(50.8)
})

it("uses millimeters for a model with no declared unit", async () => {
  const size = new Box3()
    .setFromObject(await load3mf(archive()))
    .getSize(new Vector3())
  expect(size.toArray()).toEqual([4, 2, 0])
})

it("does not silently assign dimensions to an unrecognized unit", async () => {
  await expect(load3mf(archive("yard"))).rejects.toThrow("Unsupported 3MF unit")
})

it("normalizes package-relative roots and whitespace in build transforms", async () => {
  const entries = unzipSync(new Uint8Array(archive()))
  const decoder = new TextDecoder()
  entries["_rels/.rels"] = strToU8(
    decoder
      .decode(entries["_rels/.rels"])
      .replace("/3D/root.model", "project/print.model")
  )
  entries["project/print.model"] = strToU8(
    decoder
      .decode(entries["3D/root.model"])
      .replace("1 0 0 0 1 0 0 0 1 3 0 0", "1  0 0 0 1 0 0 0 1 3   0 0")
  )
  delete entries["3D/root.model"]
  const bounds = new Box3().setFromObject(
    await load3mf(zipSync(entries).slice().buffer)
  )
  expect(bounds.max.toArray()).toEqual([4, 2, 0])
})

it("keeps Production object IDs scoped to their parts and scales child model units", async () => {
  const previous = unzipSync(new Uint8Array(archive()))
  const rootXml = `<model xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06">
    <resources><object id="1" type="model"><components>
      <component objectid="1" p:path="/3D/Objects/first.model"/>
      <component objectid="1" p:path="/3D/Objects/second.model" transform="1 0 0 0 1 0 0 0 1 30 0 0"/>
    </components></object></resources><build><item objectid="1"/></build>
  </model>`
  const input = zipSync({
    "_rels/.rels": previous["_rels/.rels"]!,
    "3D/root.model": strToU8(rootXml),
    "3D/Objects/first.model": previous["3D/root.model"]!,
    "3D/Objects/second.model": unzipSync(new Uint8Array(archive("inch")))[
      "3D/root.model"
    ]!,
  }).slice().buffer
  const model = await load3mf(input)
  const [first, second] = model.children[0]!.children
  expect(new Box3().setFromObject(first!).max.x).toBeCloseTo(1)
  expect(new Box3().setFromObject(second!).max.x).toBeCloseTo(55.4)
})
