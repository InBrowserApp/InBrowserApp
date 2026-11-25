import { packGltf } from "@workspace/model-mesh/gltf-pack"

self.onmessage = async ({
  data,
}: MessageEvent<{ file: File; assets: File[] }>) => {
  try {
    self.postMessage(await packGltf(data.file, data.assets))
  } catch {
    self.postMessage(null)
  }
}
