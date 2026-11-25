import { DoubleSide, Mesh, MeshStandardMaterial } from "three"
import { STLLoader } from "three/addons/loaders/STLLoader.js"

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
