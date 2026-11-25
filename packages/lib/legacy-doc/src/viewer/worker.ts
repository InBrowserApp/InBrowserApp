import { parseDocument } from "./parse"
import { failure } from "./failure"
import type { Result } from "./types"

self.onmessage = (
  event: MessageEvent<{ buffer: ArrayBuffer; name: string }>
) => {
  let result: Result
  try {
    result = { document: parseDocument(event.data.buffer, event.data.name) }
  } catch (reason) {
    result = { error: failure(reason) }
  }
  self.postMessage(result)
}
