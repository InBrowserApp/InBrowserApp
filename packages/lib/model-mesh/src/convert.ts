import { OBJExporter } from "three/addons/exporters/OBJExporter.js"
import { STLExporter } from "three/addons/exporters/STLExporter.js"
import { readMeshFile } from "./mesh-file"
import type { MeshFormat } from "./mesh-file"

export async function convertMesh(file: File, format: MeshFormat) {
  const model = await readMeshFile(file, format)
  if (format === "stl") {
    return new Blob([new OBJExporter().parse(model)], { type: "model/obj" })
  }
  const output = new STLExporter().parse(model, { binary: true })
  return new Blob([output], { type: "model/stl" })
}
