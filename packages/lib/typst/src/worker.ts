import { compile } from "./compile"
import type { WorkerReply } from "./types"

type Scope = {
  onmessage: ((event: MessageEvent<File>) => void) | null
  postMessage: (message: WorkerReply, transfer?: Transferable[]) => void
}
const scope = globalThis as unknown as Scope
scope.onmessage = async ({ data }) => {
  const result = await compile(data, (phase) =>
    scope.postMessage({ type: "progress", phase })
  )
  scope.postMessage(
    { type: "complete", ...result },
    result.pdf ? [result.pdf] : []
  )
}
