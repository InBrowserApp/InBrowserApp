import { Box3 } from "three"
import { expect, it } from "vitest"
import { convertMesh } from "./convert"
import { parseObj } from "./obj"
import { parseStl } from "./stl"

it("writes ASCII STL triangles as Wavefront OBJ with the same axes and coordinates", async () => {
  const source = new File(
    [
      "solid t\nfacet normal 0 0 1\nouter loop\nvertex 1 2 3\nvertex 6 2 3\nvertex 1 8 3\nendloop\nendfacet\nendsolid t",
    ],
    "part.STL"
  )
  const result = await convertMesh(source, "stl")
  const bounds = new Box3().setFromObject(parseObj(await result.text()))
  expect(result.type).toBe("model/obj")
  expect(bounds.min.toArray()).toEqual([1, 2, 3])
  expect(bounds.max.toArray()).toEqual([6, 8, 3])
})

it("writes polygon faces to binary STL and reads the binary file back", async () => {
  const source = new File(
    ["v 0 0 1\nv 2 0 1\nv 2 3 1\nv 0 3 1\nf -4 -3 -2 -1"],
    "part.obj"
  )
  const stl = await convertMesh(source, "obj")
  const bytes = await stl.arrayBuffer()
  expect(stl.type).toBe("model/stl")
  expect(bytes.byteLength).toBe(184)
  expect(new DataView(bytes).getUint32(80, true)).toBe(2)
  expect(new Box3().setFromObject(parseStl(bytes)).max.toArray()).toEqual([
    2, 3, 1,
  ])
  const obj = await convertMesh(new File([stl], "part.stl"), "stl")
  expect(
    new Box3().setFromObject(parseObj(await obj.text())).max.toArray()
  ).toEqual([2, 3, 1])
})

it("rejects OBJ points and lines when no surface faces can be exported", async () => {
  const source = new File(["v 0 0 0\nv 1 0 0\nl 1 2"], "lines.obj")
  await expect(convertMesh(source, "obj")).rejects.toThrow(
    "No usable mesh faces"
  )
})

it("writes one OBJ vertex per exact position while preserving the triangles", async () => {
  const source = new File(
    [
      "solid square\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 2 0 0\nvertex 2 2 0\nendloop\nendfacet\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 2 2 0\nvertex 0 2 0\nendloop\nendfacet\nendsolid square",
    ],
    "square.stl"
  )
  const file = await convertMesh(source, "stl")
  const lines = (await file.text()).trim().split("\n")
  expect(lines.filter((line) => line.startsWith("v "))).toHaveLength(4)
  expect(lines.filter((line) => line.startsWith("f "))).toEqual([
    "f 1 2 3",
    "f 1 3 4",
  ])
})

it("rejects malformed STL vertex counts instead of writing dangling OBJ indices", async () => {
  const source = new File(
    [
      "solid t\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 2 0 0\nvertex 2 2 0\nvertex 0 2 0\nendloop\nendfacet\nendsolid t",
    ],
    "bad.stl"
  )
  await expect(convertMesh(source, "stl")).rejects.toThrow(
    "Incomplete mesh triangle"
  )
})
