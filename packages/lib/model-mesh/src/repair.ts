import { BufferGeometry, Float32BufferAttribute, Mesh, Vector3 } from "three"
import { analyzeMesh } from "./inspect"
import { readMeshFile } from "./mesh-file"
import { exportStl } from "./stl"
import type { MeshReport } from "./inspect"

type Face = [number, number, number]
type Side = { face: number; forward: boolean }
type Neighbor = { face: number; opposite: boolean }

export type MeshRepair = {
  before: MeshReport
  after: MeshReport
  flipped: number
  stl: Blob | null
}

function orientFaces(faces: Face[]) {
  const edges = new Map<string, Side[]>()
  faces.forEach(([a, b, c], face) => {
    for (const [start, end] of [
      [a, b],
      [b, c],
      [c, a],
    ] as const) {
      const forward = start < end
      const key = forward ? `${start}:${end}` : `${end}:${start}`
      const side = { face, forward }
      const touches = edges.get(key)
      if (touches) touches.push(side)
      else edges.set(key, [side])
    }
  })

  const neighbors = faces.map((): Neighbor[] => [])
  for (const sides of edges.values()) {
    if (sides.length !== 2) continue
    const [a, b] = sides as [Side, Side]
    const opposite = a.forward === b.forward
    neighbors[a.face]!.push({ face: b.face, opposite })
    neighbors[b.face]!.push({ face: a.face, opposite })
  }

  const direction: (boolean | undefined)[] = []
  let reoriented = 0
  for (let seed = 0; seed < faces.length; seed++) {
    if (direction[seed] !== undefined) continue
    const component = [seed]
    direction[seed] = false
    let consistent = true
    let flipped = 0
    for (let i = 0; i < component.length; i++) {
      const face = component[i]!
      const flip = direction[face]!
      flipped += Number(flip)
      for (const next of neighbors[face]!) {
        const expected = flip !== next.opposite
        if (direction[next.face] === undefined) {
          direction[next.face] = expected
          component.push(next.face)
        } else if (direction[next.face] !== expected) {
          consistent = false
        }
      }
    }
    const unchanged = component.length - flipped
    if (!consistent || flipped === unchanged) continue
    const invert = flipped > unchanged
    for (const face of component) {
      if (direction[face] === invert) continue
      const [a, b, c] = faces[face]!
      faces[face] = [a, c, b]
      reoriented++
    }
  }
  return reoriented
}

export async function repairStl(file: File): Promise<MeshRepair> {
  const input = (await readMeshFile(file, "stl")) as Mesh
  const before = analyzeMesh(input)
  const { position } = input.geometry.attributes
  const points: number[] = []
  const indices = new Map<string, number>()
  const seen = new Set<string>()
  const faces: Face[] = []

  function indexOf(point: Vector3) {
    const key = `${point.x}:${point.y}:${point.z}`
    const existing = indices.get(key)
    if (existing !== undefined) return existing
    const index = indices.size
    indices.set(key, index)
    points.push(point.x, point.y, point.z)
    return index
  }

  const a = new Vector3()
  const b = new Vector3()
  const c = new Vector3()
  const ab = new Vector3()
  const ac = new Vector3()
  for (let i = 0; i < position.count; i += 3) {
    a.fromBufferAttribute(position, i)
    b.fromBufferAttribute(position, i + 1)
    c.fromBufferAttribute(position, i + 2)
    if (!ab.subVectors(b, a).cross(ac.subVectors(c, a)).lengthSq()) continue
    const face: Face = [indexOf(a), indexOf(b), indexOf(c)]
    const key = [...face].sort((a, b) => a - b).join(":")
    if (seen.has(key)) continue
    seen.add(key)
    faces.push(face)
  }

  const flipped = orientFaces(faces)
  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3))
  geometry.setIndex(faces.flat())
  const mesh = new Mesh(geometry)
  return {
    before,
    after: analyzeMesh(mesh),
    flipped,
    stl: faces.length ? exportStl(mesh) : null,
  }
}
