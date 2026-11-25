import { repairStl } from "@workspace/model-mesh/repair"

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    self.postMessage(await repairStl(event.data))
  } catch {
    self.postMessage(null)
  }
}
