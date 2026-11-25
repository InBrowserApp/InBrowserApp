import { convertMesh } from "@workspace/model-mesh/convert"
import type { MeshConversionInput } from "@workspace/model-mesh/convert"

self.onmessage = async (
  event: MessageEvent<{ file: File; format: MeshConversionInput }>
) => {
  const { file, format } = event.data
  try {
    self.postMessage(await convertMesh(file, format))
  } catch {
    self.postMessage(null)
  }
}
