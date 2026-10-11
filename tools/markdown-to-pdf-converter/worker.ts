import { parse } from "./core/parse"
import { failure } from "./core/errors"

export type WorkerResult = { html: string } | { error: string }

self.onmessage = async (event: MessageEvent<File>) => {
  let response: WorkerResult
  try {
    const bytes = new Uint8Array(await event.data.arrayBuffer())
    response = { html: parse(bytes) }
  } catch (reason) {
    response = { error: failure(reason).code }
  }
  self.postMessage(response)
}
