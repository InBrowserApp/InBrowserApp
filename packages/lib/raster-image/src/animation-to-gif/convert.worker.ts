import { encodeAnimationGif } from "./encode"
import type { AnimationFormat, ConversionReply } from "./types"

self.onmessage = async ({
  data: { file, format },
}: MessageEvent<{ file: File; format: AnimationFormat }>) => {
  let reply: ConversionReply
  try {
    reply = { result: await encodeAnimationGif(file, format) }
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : ""
    reply = {
      error: message === "invalid" || message === "limit" ? message : "failed",
    }
  }
  self.postMessage(reply)
}
