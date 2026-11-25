import { inspectMesh } from "@workspace/model-mesh/inspect"

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    self.postMessage(await inspectMesh(event.data))
  } catch {
    self.postMessage(null)
  }
}
