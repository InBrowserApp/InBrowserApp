import { Texture } from "three"
import type { Mesh, Object3D, Material, BufferGeometry } from "three"

export function disposeModel(model: Object3D) {
  const geometries = new Set<BufferGeometry>()
  const materials = new Set<Material>()
  const textures = new Set<Texture>()
  model.traverse((node) => {
    const { geometry, material } = node as Mesh
    if (geometry) geometries.add(geometry)
    if (material) {
      for (const item of Array.isArray(material) ? material : [material]) {
        materials.add(item)
      }
    }
  })
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value instanceof Texture) textures.add(value)
    }
    material.dispose()
  }
  for (const texture of textures) {
    if (
      typeof ImageBitmap !== "undefined" &&
      texture.image instanceof ImageBitmap
    ) {
      texture.image.close()
    }
    texture.dispose()
  }
  for (const geometry of geometries) geometry.dispose()
}
