import { convertMesh } from "@workspace/model-mesh/convert"
import type { MeshFormat } from "@workspace/model-mesh/mesh-file"

self.onmessage = async (
  event: MessageEvent<{ file: File; format: MeshFormat }>
) => {
  const { file, format } = event.data
  try {
    self.postMessage(await convertMesh(file, format))
  } catch {
    self.postMessage(null)
  }
}
