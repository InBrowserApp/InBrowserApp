import { analyze } from "./analyze"

self.onmessage = async (event: MessageEvent<File>) => {
  self.postMessage(await analyze(event.data))
}
