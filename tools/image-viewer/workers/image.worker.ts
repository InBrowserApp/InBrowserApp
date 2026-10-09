import { failureOf } from "../core/failure"
import type { Request, Reply } from "../types"
import { openImage, renderImage } from "./decode"

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  let reply: Reply
  try {
    reply =
      data.type === "open"
        ? { id: data.id, type: "opened", result: await openImage(data.file) }
        : { id: data.id, type: "rendered", preview: renderImage(data.index) }
  } catch (reason) {
    reply = { id: data.id, type: "error", failure: failureOf(reason) }
  }
  const preview =
    reply.type === "opened"
      ? reply.result.preview
      : reply.type === "rendered"
        ? reply.preview
        : null
  self.postMessage(reply, { transfer: preview ? [preview.png.buffer] : [] })
}
