import { LoadingManager } from "three"
import {
  DRACO_GLTF_CONFIG,
  DRACOLoader,
} from "three/addons/loaders/DRACOLoader.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js"
import { findLocalFile, localFolder } from "./local-files"

export async function loadGltf(model: File, companions: File[]) {
  const manager = new LoadingManager()
  const urls = new Map<File, string>()
  let missingResources = false
  let unreadableResources = false
  manager.onError = () => {
    unreadableResources = true
  }
  manager.setURLModifier((reference) => {
    // Embedded buffers and image URLs created by GLTFLoader are local.
    if (/^(data|blob):/i.test(reference)) return reference
    const file = findLocalFile(companions, reference)
    if (!file) {
      missingResources = true
      throw new Error("Missing local glTF resource")
    }
    let url = urls.get(file)
    if (!url) {
      url = URL.createObjectURL(file)
      urls.set(file, url)
    }
    return url
  })
  const draco = new DRACOLoader().setDecoderPath(DRACO_GLTF_CONFIG)
  try {
    const { scene, animations } = await new GLTFLoader(manager)
      .setDRACOLoader(draco)
      .setMeshoptDecoder(MeshoptDecoder)
      .parseAsync(await model.arrayBuffer(), localFolder(model))
    return {
      object: scene,
      animations,
      missingResources: missingResources || unreadableResources,
    }
  } catch (error) {
    if (missingResources) {
      throw new Error("Missing local glTF resource", {
        cause: "missingCompanions",
      })
    }
    throw error
  } finally {
    draco.dispose()
    for (const url of urls.values()) URL.revokeObjectURL(url)
  }
}
