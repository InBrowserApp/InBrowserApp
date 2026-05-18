import { copyBytesToArrayBuffer, mergePdfBuffers } from "../core/pdf-merger"

import type { PdfMergeProgress } from "../core/pdf-merger"
import type {
  PdfMergeWorkerRequestMessage,
  PdfMergeWorkerResponseMessage,
} from "../client/pdf-merge-worker"

type WorkerScopeLike = Readonly<{
  addEventListener: (
    type: "message",
    listener: (event: MessageEvent<PdfMergeWorkerRequestMessage>) => void
  ) => void
  postMessage: (
    message: PdfMergeWorkerResponseMessage,
    transfer?: Transferable[]
  ) => void
}>

function toWorkerErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

async function mergePdfWorkerRequest(
  request: PdfMergeWorkerRequestMessage,
  postMessage: WorkerScopeLike["postMessage"]
) {
  try {
    const bytes = await mergePdfBuffers(request.sources, (progress) => {
      postMessage({
        id: request.id,
        ok: true,
        progress,
        type: "progress",
      })
    })

    const output = copyBytesToArrayBuffer(bytes)

    postMessage(
      {
        id: request.id,
        ok: true,
        output,
        type: "result",
      },
      [output]
    )
  } catch (error) {
    postMessage({
      id: request.id,
      message: toWorkerErrorMessage(error),
      ok: false,
      type: "error",
    })
  }
}

const workerScope = globalThis.self as WorkerScopeLike | undefined

if (typeof workerScope?.addEventListener === "function") {
  workerScope.addEventListener(
    "message",
    (event: MessageEvent<PdfMergeWorkerRequestMessage>) => {
      void mergePdfWorkerRequest(event.data, workerScope.postMessage)
    }
  )
}

export { mergePdfWorkerRequest, toWorkerErrorMessage }
export type { PdfMergeProgress }
