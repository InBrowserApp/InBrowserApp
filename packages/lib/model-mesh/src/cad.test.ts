import { createRequire } from "node:module"
import initialize from "occt-import-js"
import { expect, test } from "vitest"
import bracket from "./mounting-bracket.step?raw"

test("tessellates the STEP example at its original size and placement in millimeters", async () => {
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
  expect(result.meshes).toHaveLength(1)
  const mesh = result.meshes[0]!
  const coordinates = mesh.attributes.position.array
  for (const [axis, size] of [60, 36, 36].entries()) {
    const values = coordinates.filter((_, index) => index % 3 === axis)
    expect(Math.min(...values)).toBe(0)
    expect(Math.max(...values)).toBe(size)
  }
  expect(mesh.index.array.length).toBeGreaterThan(60)
})
