import { parseDocument } from "./parse"
import { failure } from "./errors"

self.onmessage = (
  event: MessageEvent<{ buffer: ArrayBuffer; name: string }>
) => {
  try {
    self.postMessage({
      source: parseDocument(event.data.buffer, event.data.name),
    })
  } catch (reason) {
    self.postMessage({ error: failure(reason).code })
  }
}
