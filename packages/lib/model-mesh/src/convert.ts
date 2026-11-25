import { STLExporter } from "three/addons/exporters/STLExporter.js"
import { readMeshFile } from "./mesh-file"
import type { Mesh } from "three"
import type { MeshFormat } from "./mesh-file"

function writeObj(mesh: Mesh) {
  const positions = mesh.geometry.getAttribute("position")
  const vertices = new Map<string, number>()
  const faces: string[] = []
  for (let i = 0; i < positions.count; i += 3) {
    const face = []
    for (let vertex = i; vertex < i + 3; vertex++) {
      const line = `v ${positions.getX(vertex)} ${positions.getY(vertex)} ${positions.getZ(vertex)}`
      let index = vertices.get(line)
      if (index === undefined) {
        index = vertices.size + 1
        vertices.set(line, index)
      }
      face.push(index)
    }
    faces.push(`f ${face.join(" ")}`)
  }
  return new Blob(
    [[...vertices.keys()].join("\n"), "\ns off\n", faces.join("\n"), "\n"],
    { type: "model/obj" }
  )
}

export async function convertMesh(file: File, format: MeshFormat) {
  const model = await readMeshFile(file, format)
  if (format === "stl") return writeObj(model as Mesh)
  const output = new STLExporter().parse(model, { binary: true })
  return new Blob([output], { type: "model/stl" })
}
