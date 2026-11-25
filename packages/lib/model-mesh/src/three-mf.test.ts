import { strToU8, zipSync } from "fflate"
import { Box3, Vector3 } from "three"
import { expect, it } from "vitest"
import { parse3mf } from "./three-mf"

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

it("keeps build placements and applies the model's unit to the entire build", () => {
  const model = parse3mf(archive("inch"))
  const size = new Box3().setFromObject(model).getSize(new Vector3())
  expect(model.children).toHaveLength(2)
  expect(size.x).toBeCloseTo(101.6)
  expect(size.y).toBeCloseTo(50.8)
})

it("uses millimeters for a model with no declared unit", () => {
  const size = new Box3()
    .setFromObject(parse3mf(archive()))
    .getSize(new Vector3())
  expect(size.toArray()).toEqual([4, 2, 0])
})

it("does not silently assign dimensions to an unrecognized unit", () => {
  expect(() => parse3mf(archive("yard"))).toThrow("Unsupported 3MF unit")
})
