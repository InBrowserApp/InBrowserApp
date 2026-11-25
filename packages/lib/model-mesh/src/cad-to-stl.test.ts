import { Box3 } from "three"
import { expect, test, vi } from "vitest"
import { convertMesh } from "./convert"
import { parseStl } from "./stl"

vi.mock("./cad", () => ({
  readStep: async () =>
    [25.4, 76.2].map((x) => ({
      attributes: {
        position: { array: [x, 12, 8, x + 25.4, 12, 8, x, 22, 8] },
      },
      index: { array: [0, 1, 2] },
    })),
}))

test("exports assembly triangles in their original millimeter coordinates", async () => {
  const result = await convertMesh(new File(["STEP"], "assembly.stp"), "step")
  const bytes = await result.arrayBuffer()
  expect(new DataView(bytes).getUint32(80, true)).toBe(2)
  const bounds = new Box3().setFromObject(parseStl(bytes))
  expect(bounds.min.toArray()).toEqual([expect.closeTo(25.4), 12, 8])
  expect(bounds.max.toArray()).toEqual([expect.closeTo(101.6), 22, 8])
})
