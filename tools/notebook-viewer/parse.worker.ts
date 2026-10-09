import { parse } from "./core/parse"
import { decode, failure } from "./core/failure"
import type { WorkerResult } from "./types"
self.onmessage = async (event: MessageEvent<File>) => {
  let response: WorkerResult
  try {
    response = {
      result: parse(decode(new Uint8Array(await event.data.arrayBuffer()))),
    }
  } catch (reason) {
    response = { error: failure(reason) }
  }
  self.postMessage(response)
}
