import { Vector3 } from "three"
import { readMeshFile } from "./mesh-file"
import type { Mesh, Object3D } from "three"

export type MeshReport = {
  surfaceArea: number
  volume: number | null
  triangles: number
  vertices: number
  shells: number
  boundaryEdges: number
  nonManifoldEdges: number
  nonManifoldVertices: number
  inconsistentEdges: number
  degenerateFaces: number
  duplicateFaces: number
}

type Face = [number, number, number]
type Edge = { faces: number[]; winding: number }

function edgeKey(a: number, b: number) {
  return a < b ? `${a}:${b}` : `${b}:${a}`
}

function countNonManifoldVertices(
  incident: number[][],
  faces: Face[],
  edges: Map<string, Edge>
) {
  return incident.reduce((count, touching, vertex) => {
    if (!touching.length) return count
    const remaining = new Set(touching)
    const queue = [touching[0]!]
    remaining.delete(queue[0]!)
    while (queue.length) {
      const face = faces[queue.pop()!]!
      for (const neighbor of face) {
        if (neighbor === vertex) continue
        const adjacent = edges.get(edgeKey(vertex, neighbor))!.faces
        if (adjacent.length > 2) return count + 1
        for (const next of adjacent) {
          if (remaining.delete(next)) queue.push(next)
        }
      }
    }
    return count + Number(remaining.size > 0)
  }, 0)
}

export function analyzeMesh(object: Object3D): MeshReport {
  const vertexIndex = new Map<string, number>()
  const incident: number[][] = []
  const faces: Face[] = []
  const edges = new Map<string, Edge>()
  const faceKeys = new Set<string>()
  let triangles = 0
  let surfaceArea = 0
  let sixTimesVolume = 0
  let origin: Vector3 | undefined
  let degenerateFaces = 0
  let duplicateFaces = 0

  function vertexId(point: Vector3) {
    const key = `${point.x}:${point.y}:${point.z}`
    const existing = vertexIndex.get(key)
    if (existing !== undefined) return existing
    const id = vertexIndex.size
    vertexIndex.set(key, id)
    incident.push([])
    return id
  }

  function addEdge(a: number, b: number, face: number) {
    const key = edgeKey(a, b)
    const winding = a < b ? 1 : -1
    const edge = edges.get(key)
    if (edge) {
      edge.faces.push(face)
      edge.winding += winding
    } else {
      edges.set(key, { faces: [face], winding })
    }
  }

  const a = new Vector3()
  const b = new Vector3()
  const c = new Vector3()
  const ab = new Vector3()
  const ac = new Vector3()
  const offset = new Vector3()
  object.updateMatrixWorld(true)
  object.traverse((node) => {
    const mesh = node as Mesh
    if (!mesh.isMesh) return
    const { geometry, matrixWorld } = mesh
    const positions = geometry.getAttribute("position")
    const index = geometry.index
    const length = index?.count ?? positions.count
    for (let i = 0; i < length; i += 3) {
      a.fromBufferAttribute(positions, index ? index.getX(i) : i).applyMatrix4(
        matrixWorld
      )
      b.fromBufferAttribute(
        positions,
        index ? index.getX(i + 1) : i + 1
      ).applyMatrix4(matrixWorld)
      c.fromBufferAttribute(
        positions,
        index ? index.getX(i + 2) : i + 2
      ).applyMatrix4(matrixWorld)
      const ids: Face = [vertexId(a), vertexId(b), vertexId(c)]
      triangles += 1
      const cross = ab.subVectors(b, a).cross(ac.subVectors(c, a))
      const twiceArea = cross.length()
      if (twiceArea === 0) {
        degenerateFaces += 1
        continue
      }
      origin ??= a.clone()
      surfaceArea += twiceArea / 2
      sixTimesVolume += offset.subVectors(a, origin).dot(cross)

      const faceKey = [...ids].sort((first, second) => first - second).join(":")
      if (faceKeys.has(faceKey)) duplicateFaces += 1
      faceKeys.add(faceKey)

      const face = faces.length
      faces.push(ids)
      for (const id of ids) incident[id]!.push(face)
      const [first, second, third] = ids
      addEdge(first, second, face)
      addEdge(second, third, face)
      addEdge(third, first, face)
    }
  })

  const parent = faces.map((_, index) => index)
  function find(index: number) {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]!]!
      index = parent[index]!
    }
    return index
  }

  let boundaryEdges = 0
  let nonManifoldEdges = 0
  let inconsistentEdges = 0
  for (const edge of edges.values()) {
    const [first, ...neighbors] = edge.faces
    const count = edge.faces.length
    if (count === 1) boundaryEdges += 1
    if (count > 2) nonManifoldEdges += 1
    if (count === 2 && edge.winding !== 0) inconsistentEdges += 1
    for (const neighbor of neighbors) parent[find(neighbor)] = find(first!)
  }

  const shells = new Set(parent.map((_, index) => find(index))).size
  const nonManifoldVertices = countNonManifoldVertices(incident, faces, edges)
  const defects =
    boundaryEdges +
    nonManifoldEdges +
    nonManifoldVertices +
    inconsistentEdges +
    degenerateFaces +
    duplicateFaces
  return {
    surfaceArea,
    volume: defects ? null : Math.abs(sixTimesVolume) / 6,
    triangles,
    vertices: vertexIndex.size,
    shells,
    boundaryEdges,
    nonManifoldEdges,
    nonManifoldVertices,
    inconsistentEdges,
    degenerateFaces,
    duplicateFaces,
  }
}

export async function inspectMesh(file: File) {
  const format = file.name.toLowerCase().split(".").at(-1)
  if (format !== "stl" && format !== "obj")
    throw new Error("Unexpected mesh format")
  return analyzeMesh(await readMeshFile(file, format))
}
