import { parseHar } from "../core/parse"

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    self.postMessage({ capture: parseHar(await event.data.text()) })
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : "readFailed",
    })
  }
}
