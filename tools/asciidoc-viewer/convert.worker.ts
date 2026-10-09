import { convert, decode } from "./core/convert"
import { failure } from "./core/failure"
import type { WorkerResult } from "./types"

self.onmessage = async (event: MessageEvent<File>) => {
  let response: WorkerResult
  try {
    const bytes = new Uint8Array(await event.data.arrayBuffer())
    response = { result: await convert(decode(bytes)) }
  } catch (reason) {
    response = { error: failure(reason) }
  }
  self.postMessage(response)
}
