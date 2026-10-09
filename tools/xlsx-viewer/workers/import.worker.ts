import { normalizeSpreadsheet } from "./normalize"
import type { ImportOptions } from "../formats"

self.onmessage = (
  event: MessageEvent<{
    data: ArrayBuffer
    name: string
    options: ImportOptions
  }>
) => {
  try {
    const { data, name, options } = event.data
    const result = normalizeSpreadsheet(data, name, options)
    self.postMessage({ result }, { transfer: [result.data] })
  } catch (error) {
    const message =
      error instanceof RangeError
        ? "TOO_LARGE"
        : error instanceof Error
          ? error.message
          : "INVALID"
    self.postMessage({ error: message })
  }
}
