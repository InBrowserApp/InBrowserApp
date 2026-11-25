import { convertMesh } from "@workspace/model-mesh/convert"
import type {
  MeshConversionInput,
  MeshConversionOptions,
} from "@workspace/model-mesh/convert"

self.onmessage = async (
  event: MessageEvent<{
    file: File
    format: MeshConversionInput
    options?: MeshConversionOptions
  }>
) => {
  const { file, format, options } = event.data
  try {
    self.postMessage(await convertMesh(file, format, options))
  } catch {
    self.postMessage(null)
  }
}
