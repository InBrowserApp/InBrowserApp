import { parseDocument } from "./core/parse"
import { failure } from "./core/errors"

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
