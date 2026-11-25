import { Box3 } from "three"
import type { Mesh } from "three"

export type MeshFormat = "stl" | "obj"

export async function readMeshFile(file: File, format: MeshFormat) {
  if (!file.name.toLowerCase().endsWith(`.${format}`)) {
    throw new Error("Unexpected mesh format")
  }
  const object =
    format === "stl"
      ? (await import("./stl")).parseStl(await file.arrayBuffer())
      : (await import("./obj")).parseObj(await file.text())
  let faces = 0
  const bounds = new Box3()
  object.traverse((node) => {
    const mesh = node as Mesh
    if (!mesh.isMesh) return
    const positions = mesh.geometry.getAttribute("position")
    const vertices = mesh.geometry.index?.count ?? positions.count
    if (vertices % 3 !== 0) throw new Error("Incomplete mesh triangle")
    faces += vertices / 3
    bounds.expandByObject(mesh)
  })
  if (
    !faces ||
    !Number.isFinite(bounds.min.lengthSq() + bounds.max.lengthSq())
  ) {
    throw new Error("No usable mesh faces")
  }
  return object
}
