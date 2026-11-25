import { Box3, Mesh, MeshPhongMaterial, BufferGeometry } from "three"
import { describe, expect, it } from "vitest"
import { loadObj, parseObj } from "./obj"
import { parseStl } from "./stl"
import { findLocalFile } from "./local-files"

const source = "v 0 0 0\nv 2 0 0\nv 0 3 0\nf 1 2 3\n"

describe("STL and OBJ geometry", () => {
  it("reads ASCII STL coordinates", () => {
    const data = new TextEncoder().encode(
      "solid triangle\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 2 0 0\nvertex 0 3 0\nendloop\nendfacet\nendsolid triangle"
    )
    const model = parseStl(data.buffer)
    expect(model.geometry.getAttribute("position").count).toBe(3)
    expect(new Box3().setFromObject(model).max.toArray()).toEqual([2, 3, 0])
  })

  it("reads binary STL even if its header starts with solid", () => {
    const data = new ArrayBuffer(134)
    new Uint8Array(data).set(new TextEncoder().encode("solid binary"))
    const view = new DataView(data)
    view.setUint32(80, 1, true)
    view.setFloat32(92, 1, true)
    view.setFloat32(108, 2, true)
    view.setFloat32(124, 3, true)
    const model = parseStl(data)
    expect(model.geometry.getAttribute("position").count).toBe(3)
    expect(new Box3().setFromObject(model).max.toArray()).toEqual([2, 3, 0])
  })

  it("reads Wavefront OBJ coordinates", () => {
    expect(new Box3().setFromObject(parseObj(source)).max.toArray()).toEqual([
      2, 3, 0,
    ])
  })

  it("applies a local material and preserves the rest of the mesh", async () => {
    const model = new File(
      [`mtllib library.mtl\nusemtl blue\n${source}`],
      "triangle.obj"
    )
    const materials = new File(["newmtl blue\nKd 0 0 1"], "library.mtl")
    const { object, missingResources } = await loadObj(model, [materials])
    const mesh = object.children[0] as Mesh<BufferGeometry, MeshPhongMaterial>
    expect(mesh.material.color.getHex()).toBe(0x0000ff)
    expect(missingResources).toBe(false)
    expect(new Box3().setFromObject(object).max.toArray()).toEqual([2, 3, 0])
  })

  it("falls back to geometry when the referenced material library is absent", async () => {
    const model = new File(
      [`mtllib absent.mtl\nusemtl blue\n${source}`],
      "triangle.obj"
    )
    const { object, missingResources } = await loadObj(model, [])
    expect(new Box3().setFromObject(object).max.toArray()).toEqual([2, 3, 0])
    expect(missingResources).toBe(true)
  })
})

it("resolves encoded and nested companion filenames without ambiguous matches", () => {
  const texture = new File([], "paint tile.png")
  expect(findLocalFile([texture], "textures/paint%20tile.png")).toBe(texture)
  expect(
    findLocalFile([texture, new File([], texture.name)], texture.name)
  ).toBeUndefined()
  expect(findLocalFile([texture], "missing.png")).toBeUndefined()
})
