// @vitest-environment node
import { Box3 } from "three"
import { expect, test } from "vitest"
import { repairStl } from "./repair"
import { parseStl } from "./stl"

const a = "10 20 30"
const b = "40 20 30"
const c = "10 50 30"
const d = "10 20 60"
const tetrahedron = [
  [a, b, c],
  [a, b, d],
  [a, d, c],
  [b, c, d],
]

function asciiStl(faces: string[][]) {
  const triangles = faces
    .map((points) =>
      [
        "facet normal 0 0 0",
        "outer loop",
        ...points.map((point) => `vertex ${point}`),
        "endloop",
        "endfacet",
      ].join("\n")
    )
    .join("\n")
  return new File([`solid test\n${triangles}\nendsolid test\n`], "sample.stl")
}

test("repairs a flipped, duplicate and degenerate face without moving vertices", async () => {
  const result = await repairStl(
    asciiStl([...tetrahedron, [d, b, a], [a, a, c]])
  )
  expect(result.before).toMatchObject({
    triangles: 6,
    duplicateFaces: 1,
    degenerateFaces: 1,
    volume: null,
  })
  expect(result.after).toMatchObject({
    triangles: 4,
    duplicateFaces: 0,
    degenerateFaces: 0,
    inconsistentEdges: 0,
    volume: 4500,
  })
  expect(result.flipped).toBe(1)
  const bytes = await result.stl!.arrayBuffer()
  const mesh = parseStl(bytes)
  const bounds = new Box3().setFromObject(mesh)
  expect(bounds.min.toArray()).toEqual([10, 20, 30])
  expect(bounds.max.toArray()).toEqual([40, 50, 60])
  expect(new DataView(bytes).getUint32(80, true)).toBe(4)

  const roundTrip = await repairStl(new File([bytes], "binary.STL"))
  expect(roundTrip.flipped).toBe(0)
  expect(roundTrip.after).toEqual(result.after)
})

test("leaves ambiguous winding and open boundaries visible", async () => {
  const result = await repairStl(asciiStl(tetrahedron.slice(0, 2)))
  expect(result.flipped).toBe(0)
  expect(result.after).toMatchObject({
    boundaryEdges: 4,
    inconsistentEdges: 1,
    volume: null,
  })
})

test("leaves non-manifold joins visible and does not force a shell outward", async () => {
  const face = [a, b, "10 0 30"]
  const result = await repairStl(asciiStl([...tetrahedron, face]))
  expect(result.after.nonManifoldEdges).toBe(1)
  expect(result.after.volume).toBeNull()

  const inward = tetrahedron.map((face, index) =>
    index === 0 ? face : [...face].reverse()
  )
  const inside = await repairStl(asciiStl(inward))
  expect(inside.flipped).toBe(0)
  expect(inside.after.inconsistentEdges).toBe(0)
})

test("reports when discarding zero-area triangles leaves no STL to export", async () => {
  const result = await repairStl(
    asciiStl([
      [a, a, b],
      [a, b, "70 20 30"],
    ])
  )
  expect(result.before.degenerateFaces).toBe(2)
  expect(result.after.triangles).toBe(0)
  expect(result.stl).toBeNull()
})
