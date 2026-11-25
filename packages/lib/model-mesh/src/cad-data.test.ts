import { Color } from "three"
import { makeCadMesh } from "./cad-scene"
import { expect, test } from "vitest"
import { prepareCadModel } from "./cad-data"
import type { ImportedMesh } from "./cad"

test("centers the whole assembly before reducing precision and skips unmeshed shapes", () => {
  function triangle(x: number): ImportedMesh {
    return {
      attributes: { position: { array: [x, 0, 0, x + 2, 0, 0, x, 3, 0] } },
      index: { array: [0, 1, 2] },
      brep_faces: [],
    }
  }
  const base = 1e10
  const empty = { ...triangle(0), index: { array: [] } }
  expect(prepareCadModel([empty])).toBeNull()
  const red: ImportedMesh = {
    ...triangle(base + 6),
    color: [0.4, 0.2, 0.2],
    brep_faces: [
      { first: 0, last: 0, color: [1, 0, 0] },
      { first: 1, last: 1, color: null },
    ],
  }
  const model = prepareCadModel([empty, triangle(base), red])!
  expect(model.size).toEqual([8, 3, 0])
  expect(model.meshes.map(({ positions }) => positions[0])).toEqual([-4, 2])
  expect(model.meshes[1]?.faces).toEqual([
    { first: 0, last: 0, color: [1, 0, 0] },
  ])
})

test("retains the CAD importer’s linear body and face colors", () => {
  const mesh = makeCadMesh(
    {
      positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]),
      indices: new Uint32Array([0, 1, 2, 1, 2, 3]),
      color: [0.604, 0.604, 0.604],
      faces: [{ first: 0, last: 0, color: [0.402, 0.402, 0.402] }],
    },
    new Color(0x123456)
  )
  const colors = mesh.geometry.getAttribute("color")
  expect(colors.getX(0)).toBeCloseTo(0.402)
  expect(colors.getX(3)).toBeCloseTo(0.604)
  expect(mesh.material.vertexColors).toBe(true)
})
