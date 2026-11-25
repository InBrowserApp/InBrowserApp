import { findLocalFile } from "./local-files"
import { DoubleSide, LoadingManager, Texture } from "three"
import { MTLLoader } from "three/addons/loaders/MTLLoader.js"
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"
import type { Group, Material, Mesh } from "three"
import { triangulateObj } from "./triangulate-obj"

const emptyTexture =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jAtkAAAAASUVORK5CYII="

export function parseObj(source: string) {
  return new OBJLoader().parse(triangulateObj(source)) as Group & {
    materialLibraries: string[]
  }
}

export async function loadObj(model: File, companions: File[]) {
  const source = await model.text()
  const textureUrls = new Map<File, string>()
  const materialLoaders = new Map<string, ReturnType<MTLLoader["parse"]>>()
  const manager = new LoadingManager()
  let loading = false
  let missingResources = false
  const ready = new Promise<void>((resolve) => {
    manager.onStart = () => {
      loading = true
    }
    manager.onLoad = resolve
  })
  manager.onError = () => {
    missingResources = true
  }
  manager.setURLModifier((url) => {
    const file = findLocalFile(companions, url)
    if (!file) {
      missingResources = true
      return emptyTexture
    }
    let local = textureUrls.get(file)
    if (!local) {
      local = URL.createObjectURL(file)
      textureUrls.set(file, local)
    }
    return local
  })

  try {
    // Parse first so OBJLoader owns the syntax and triangulation. Preserve
    // its fallback material when an individual OBJ material cannot be found.
    const object = parseObj(source)
    const libraries = object.materialLibraries.flatMap((reference) =>
      findLocalFile(companions, reference)
        ? [reference]
        : (reference
            .match(/.*?\.mtl(?=\s+|$)/gi)
            ?.map((name) => name.trim()) ?? [reference])
    )
    for (const reference of libraries) {
      const file = findLocalFile(companions, reference)
      if (!file) {
        missingResources = true
        continue
      }
      const base = reference.replaceAll("\\", "/").replace(/[^/]*$/, "")
      const loader = new MTLLoader(manager)
      loader.setMaterialOptions({ side: DoubleSide })
      const materials = loader.parse(await file.text(), base)
      for (const name of Object.keys(materials.materialsInfo)) {
        if (!materialLoaders.has(name)) materialLoaders.set(name, materials)
      }
    }

    const defaults = new Set<Material>()
    const replacements = new Set<Material>()
    object.traverse((node) => {
      const mesh = node as Mesh
      if (!mesh.isMesh) return
      function apply(material: Material) {
        const loader = materialLoaders.get(material.name)
        if (loader) {
          defaults.add(material)
          const replacement = loader.create(material.name)
          replacement.vertexColors ||= material.vertexColors
          replacements.add(replacement)
          return replacement
        }
        if (material.name && object.materialLibraries.length)
          missingResources = true
        material.side = DoubleSide
        return material
      }
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(apply)
        : apply(mesh.material)
    })
    for (const material of defaults) material.dispose()
    if (loading) await ready
    for (const material of replacements) {
      for (const [key, value] of Object.entries(material)) {
        if (
          value instanceof Texture &&
          (!value.image || value.image.src === emptyTexture)
        ) {
          Object.assign(material, { [key]: null })
          value.dispose()
        }
      }
    }
    return { object, missingResources }
  } finally {
    for (const url of textureUrls.values()) URL.revokeObjectURL(url)
  }
}
