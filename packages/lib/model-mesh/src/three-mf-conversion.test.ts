// @vitest-environment node
import { strToU8, unzipSync, zipSync } from "fflate"
import { Box3 } from "three"
import { expect, test } from "vitest"
import { convertMesh } from "./convert"
import { parseStl } from "./stl"
import {
  modelRelationship,
  production,
  rootRelationships,
} from "./three-mf-package"

const triangle = `solid part
facet normal 0 0 1
outer loop
vertex 0 0 0
vertex 2 0 0
vertex 0 1 0
endloop
endfacet
endsolid part`

test("stores the chosen STL scale in a 3MF package and imports it as millimeters", async () => {
  const stl = new File([triangle], "part.stl")
  const output = await convertMesh(stl, "stl", { target: "3mf", unit: "inch" })
  const entries = unzipSync(new Uint8Array(await output.arrayBuffer()))
  const source = new TextDecoder().decode(entries["3D/3dmodel.model"])
  expect(source).toContain('unit="inch"')
  expect(source).toContain('type="surface"')
  expect(source).toContain('<vertex x="2"')
  expect(entries["[Content_Types].xml"]).toBeDefined()
  const result = await convertMesh(new File([output], "part.3mf"), "3mf")
  const box = new Box3().setFromObject(parseStl(await result.arrayBuffer()))
  expect(box.max.toArray()).toEqual([
    expect.closeTo(50.8),
    expect.closeTo(25.4),
    0,
  ])
})

test("exports repeated, rotated, mirrored and translated Production instances in their own model units", async () => {
  const rootPath = "3D/root.model"
  const childPath = "3D/Objects/part.model"
  const root = `<model xmlns:p="${production}"><resources><object id="1"><components><component objectid="1" p:path="/${childPath}"/></components></object></resources><build><item objectid="1"/><item objectid="1" transform="0 1 0 1 0 0 0 0 1 100 0 0"/></build></model>`
  const child =
    '<model unit="inch"><resources><object id="0001"><mesh><vertices><vertex x="0" y="0" z="0"/><vertex x="2" y="0" z="0"/><vertex x="0" y="1" z="0"/></vertices><triangles><triangle v1="0" v2="1" v3="2"/></triangles></mesh></object></resources></model>'
  const input = zipSync({
    [rootRelationships]: strToU8(
      `<Relationships><Relationship Target="/${rootPath}" Type="${modelRelationship}"/></Relationships>`
    ),
    [rootPath]: strToU8(root),
    [childPath]: strToU8(child),
  }).slice().buffer
  const output = await convertMesh(new File([input], "assembly.3mf"), "3mf")
  const bytes = await output.arrayBuffer()
  expect(new DataView(bytes).getUint32(80, true)).toBe(2)
  const bounds = new Box3().setFromObject(parseStl(bytes))
  expect(bounds.max.toArray()).toEqual([
    expect.closeTo(125.4),
    expect.closeTo(50.8),
    0,
  ])
  expect(new DataView(bytes).getFloat32(142, true)).toBe(1)
})

test("records mixed outward and inward disconnected shells as a surface", async () => {
  const vertices = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
  const triangles = [
    [0, 2, 1],
    [0, 1, 3],
    [0, 3, 2],
    [1, 2, 3],
  ]
  function tetrahedron(scale: number, origin: number, flip: boolean) {
    return triangles
      .map((face) => {
        const winding = flip ? [...face].reverse() : face
        const points = winding.map((id) =>
          vertices[id]!.map(
            (value, axis) => value * scale + (axis ? 0 : origin)
          ).join(" ")
        )
        return `facet normal 0 0 1\nouter loop\n${points.map((point) => `vertex ${point}`).join("\n")}\nendloop\nendfacet`
      })
      .join("\n")
  }
  const stl = new File(
    [
      `solid shells\n${tetrahedron(2, 0, false)}\n${tetrahedron(1, 4, true)}\nendsolid shells`,
    ],
    "shells.stl"
  )
  const output = await convertMesh(stl, "stl", { target: "3mf" })
  const model = new TextDecoder().decode(
    unzipSync(new Uint8Array(await output.arrayBuffer()))["3D/3dmodel.model"]
  )
  expect(model).toContain('type="surface"')
})

test("retains degenerate triangle coordinates with three distinct vertex indices", async () => {
  const stl = new File(
    [triangle.replace("vertex 0 1 0", "vertex 2 0 0")],
    "surface.stl"
  )
  const output = await convertMesh(stl, "stl", { target: "3mf" })
  const model = new TextDecoder().decode(
    unzipSync(new Uint8Array(await output.arrayBuffer()))["3D/3dmodel.model"]
  )
  expect(model).toContain('<triangle v1="0" v2="1" v3="2"/>')
  expect(model.match(/<vertex /g)).toHaveLength(3)
})

test("reports unsupported required geometry instead of silently exporting only a fallback mesh", async () => {
  const stl = new File([triangle], "part.stl")
  const output = await convertMesh(stl, "stl", { target: "3mf" })
  const entries = unzipSync(new Uint8Array(await output.arrayBuffer()))
  const path = "3D/3dmodel.model"
  entries[path] = strToU8(
    new TextDecoder()
      .decode(entries[path])
      .replace(
        "<model ",
        '<model requiredextensions="b" xmlns:b="http://schemas.microsoft.com/3dmanufacturing/beamlattice/2017/02" '
      )
  )
  await expect(
    convertMesh(
      new File([zipSync(entries).slice().buffer], "lattice.3mf"),
      "3mf"
    )
  ).rejects.toThrow("Unsupported required 3MF extension")
})
