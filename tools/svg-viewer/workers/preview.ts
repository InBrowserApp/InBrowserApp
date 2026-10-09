import { failure, read } from "../core/read"

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    self.postMessage({ preview: await read(event.data) })
  } catch (reason) {
    self.postMessage({ error: failure(reason) })
  }
}
