import { BufferGeometry, Float32BufferAttribute, Group, Mesh } from "three"
import { STLExporter } from "three/addons/exporters/STLExporter.js"
import { readMeshFile } from "./mesh-file"
import type { Object3D } from "three"
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

export type MeshConversionInput = MeshFormat | "step"

function binaryStl(model: Object3D) {
  const output = new STLExporter().parse(model, { binary: true })
  return new Blob([output], { type: "model/stl" })
}

async function convertStep(file: File) {
  const { readStep } = await import("./cad")
  const meshes = await readStep(await file.arrayBuffer())
  if (!meshes) throw new Error("No STEP surfaces")

  const assembly = new Group()
  for (const { attributes, index } of meshes) {
    if (!index.array.length) continue
    const geometry = new BufferGeometry()
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(attributes.position.array, 3)
    )
    geometry.setIndex(index.array)
    assembly.add(new Mesh(geometry))
  }
  if (!assembly.children.length) throw new Error("No STEP surfaces")
  return binaryStl(assembly)
}

export async function convertMesh(file: File, format: MeshConversionInput) {
  if (format === "step") return convertStep(file)
  const model = await readMeshFile(file, format)
  return format === "stl" ? writeObj(model as Mesh) : binaryStl(model)
}
