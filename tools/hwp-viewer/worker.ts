import type { HwpDocument } from "@rhwp/core"
import { openEngine } from "./engine"
import { failure } from "./failure"
import type { Request, Reply } from "./types"
let document: HwpDocument | undefined
self.onmessage = async (event: MessageEvent<Request>) => {
  const request = event.data
  let reply: Reply
  try {
    if (request.type === "open") {
      document?.free()
      document = undefined
      document = await openEngine(new Uint8Array(request.buffer))
      reply = { id: request.id, total: document.pageCount() }
    } else {
      if (
        !document ||
        !Number.isInteger(request.index) ||
        request.index < 0 ||
        request.index >= document.pageCount()
      )
        throw new Error("pageError")
      reply = { id: request.id, page: document.renderPageSvg(request.index) }
    }
  } catch (error) {
    reply = { id: request.id, error: failure(error) }
  }
  self.postMessage(reply)
}
