import { parseOdt } from "./parse"
import { failure } from "./failure"
import type { Result } from "./types"

self.onmessage = async (
  event: MessageEvent<{ buffer: ArrayBuffer; name: string }>
) => {
  let result: Result
  try {
    result = { document: await parseOdt(event.data.buffer) }
  } catch (reason) {
    result = { error: failure(reason) }
  }
  self.postMessage(result)
}
