import { DoubleSide, Mesh, MeshStandardMaterial } from "three"
import { STLExporter } from "three/addons/exporters/STLExporter.js"
import { STLLoader } from "three/addons/loaders/STLLoader.js"
import type { Object3D } from "three"

export function exportStl(model: Object3D) {
  model.updateMatrixWorld(true)
  const output = new STLExporter().parse(model, { binary: true })
  return new Blob([output], { type: "model/stl" })
}

export function parseStl(data: ArrayBuffer) {
  const geometry = new STLLoader().parse(data)
  return new Mesh(
    geometry,
    new MeshStandardMaterial({
      color: geometry.hasAttribute("color") ? 0xffffff : 0x659ce8,
      vertexColors: geometry.hasAttribute("color"),
      side: DoubleSide,
      roughness: 0.75,
    })
  )
}
