import { compressPdf } from "./compress"
import type { CompressionRequest, CompressionResult } from "./protocol"

self.onmessage = async ({ data }: MessageEvent<CompressionRequest>) => {
  let result: CompressionResult
  try {
    result = await compressPdf(data.file, data.level)
  } catch {
    result = { status: "compressionFailed" }
  }
  self.postMessage(result)
}
