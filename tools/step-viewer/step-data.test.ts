import { createRequire } from "node:module"
import initialize from "occt-import-js"
import { Color } from "three"
import { makeMesh } from "./model-scene"
import { expect, test } from "vitest"
import bracket from "./mounting-bracket.step?raw"
import { prepareModel } from "./step-data"
import type { ImportedMesh } from "./step-data"

test("tessellates the STEP example at its real size in millimeters", async () => {
  const require = createRequire(import.meta.url)
  const occt = await initialize({
    locateFile: () =>
      require.resolve("occt-import-js/dist/occt-import-js.wasm"),
  })
  const result = occt.ReadStepFile(new TextEncoder().encode(bracket), {
    linearUnit: "millimeter",
    angularDeflection: 0.2,
  })
  expect(result.success).toBe(true)
  if (!result.success) throw new Error("The bracket is not valid STEP geometry")
  const model = prepareModel(result.meshes)
  expect(model?.size).toEqual([60, 36, 36])
  expect(model?.meshes).toHaveLength(1)
  expect(model?.meshes[0]?.indices.length).toBeGreaterThan(60)
})

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
  expect(prepareModel([empty])).toBeNull()
  const red: ImportedMesh = {
    ...triangle(base + 6),
    color: [0.4, 0.2, 0.2],
    brep_faces: [
      { first: 0, last: 0, color: [1, 0, 0] },
      { first: 1, last: 1, color: null },
    ],
  }
  const model = prepareModel([empty, triangle(base), red])!
  expect(model.size).toEqual([8, 3, 0])
  expect(model.meshes.map(({ positions }) => positions[0])).toEqual([-4, 2])
  expect(model.meshes[1]?.faces).toEqual([
    { first: 0, last: 0, color: [1, 0, 0] },
  ])
})

test("retains the CAD importer’s linear body and face colors", () => {
  const mesh = makeMesh(
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
