import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
} from "three"
import type { CadMesh, Triple } from "./cad-data"

export function makeCadMesh(data: CadMesh, baseColor: Color) {
  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(data.positions, 3))
  geometry.setIndex(new BufferAttribute(data.indices, 1))
  if (data.normals) {
    geometry.setAttribute("normal", new BufferAttribute(data.normals, 3))
  } else {
    geometry.computeVertexNormals()
  }

  const fromRgb = ([r, g, b]: Triple) => new Color().setRGB(r, g, b)
  const color = data.color ? fromRgb(data.color) : baseColor
  if (data.faces.length) {
    const colors = new Float32Array(data.positions.length)
    for (let i = 0; i < colors.length; i += 3) color.toArray(colors, i)
    for (const face of data.faces) {
      const faceColor = fromRgb(face.color)
      // Open CASCADE emits separate vertices per B-rep face.
      for (let i = face.first * 3; i < (face.last + 1) * 3; i++) {
        faceColor.toArray(colors, data.indices[i]! * 3)
      }
    }
    geometry.setAttribute("color", new BufferAttribute(colors, 3))
  }

  return new Mesh(
    geometry,
    new MeshStandardMaterial({
      color: data.faces.length ? 0xffffff : color,
      vertexColors: Boolean(data.faces.length),
      roughness: 0.72,
      side: DoubleSide,
    })
  )
}
