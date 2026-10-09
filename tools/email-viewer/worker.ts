import { parseEmail } from "./parse"
import { failure } from "./failure"
import type { Result } from "./types"

self.onmessage = async (
  event: MessageEvent<{ buffer: ArrayBuffer; name: string }>
) => {
  let result: Result
  try {
    result = { email: await parseEmail(event.data.buffer, event.data.name) }
  } catch (reason) {
    result = { error: failure(reason) }
  }
  self.postMessage(result)
}
