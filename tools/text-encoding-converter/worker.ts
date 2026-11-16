import { convertInput } from "./core/convert"
import type { ConversionRequest, WorkerResponse } from "./types"

self.onmessage = async (event: MessageEvent<ConversionRequest>) => {
  try {
    const { input, ...options } = event.data
    const data =
      typeof input === "string"
        ? input
        : new Uint8Array(await input.arrayBuffer())
    const result = convertInput(data, options)
    const response: WorkerResponse = { result }
    self.postMessage(response, { transfer: result.bytes ? [result.bytes] : [] })
  } catch {
    self.postMessage({ failed: true } satisfies WorkerResponse)
  }
}
