// @vitest-environment node
import { Box3 } from "three"
import { expect, test } from "vitest"
import { inspectMesh } from "./inspect"
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

test("keeps distinct ASCII coordinates that would collapse in binary STL", async () => {
  const file = asciiStl([["100000000 0 0", "100000001 0 0", "100000000 1 0"]])
  const result = await repairStl(file)
  expect(result.before.surfaceArea).toBe(0.5)
  expect(result.after.degenerateFaces).toBe(0)
  const output = new File([result.stl!], "repaired.stl")
  expect(await output.text()).toContain("100000001")
  expect(await inspectMesh(output)).toEqual(result.after)
})

test("keeps the binary header and per-face attributes on retained triangles", async () => {
  const base = await repairStl(asciiStl(tetrahedron))
  const binary = new Uint8Array(84 + 5 * 50)
  binary.set(new Uint8Array(await base.stl!.arrayBuffer()))
  binary.set(new TextEncoder().encode("COLOR=rgba"))
  binary.copyWithin(84 + 4 * 50, 84, 134)
  const source = new DataView(binary.buffer)
  source.setUint32(80, 5, true)
  for (let face = 0; face < 5; face++)
    source.setUint16(132 + face * 50, 10 + face, true)
  const result = await repairStl(new File([binary], "colored.stl"))
  const output = new DataView(await result.stl!.arrayBuffer())
  expect(output.getUint32(80, true)).toBe(4)
  expect(new TextDecoder().decode(output.buffer.slice(0, 10))).toBe(
    "COLOR=rgba"
  )
  expect(
    Array.from({ length: 4 }, (_, i) => output.getUint16(132 + i * 50, true))
  ).toEqual([10, 11, 12, 13])
})
