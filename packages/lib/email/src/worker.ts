import { parseEmail } from "./parse"
import { failure } from "./failure"
import type { ParseOptions, Result } from "./types"

self.onmessage = async (
  event: MessageEvent<{
    buffer: ArrayBuffer
    name: string
    options?: ParseOptions
  }>
) => {
  let result: Result
  try {
    result = {
      email: await parseEmail(
        event.data.buffer,
        event.data.name,
        event.data.options
      ),
    }
  } catch (reason) {
    result = { error: failure(reason) }
  }
  self.postMessage(result)
}
