import { convert, type Request } from "./core/convert"

self.onmessage = (event: MessageEvent<Request>) => {
  try {
    self.postMessage({ result: convert(event.data) })
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
