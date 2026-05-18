import type { SplitMultipleMode, SplitOutputMode } from "../core/pdf-document"

type SplitWorkerRequest = Readonly<{
  multipleMode: SplitMultipleMode
  outputBaseName: string
  outputMode: SplitOutputMode
  pages: readonly number[]
  segments: readonly (readonly number[])[]
  sourceBytes: ArrayBuffer
}>

type SplitWorkerResponse =
  | Readonly<{
      ok: true
      result: readonly {
        bytes: Uint8Array
        name: string
      }[]
    }>
  | Readonly<{
      code: string
      ok: false
    }>

async function splitPdfWithWorker(request: SplitWorkerRequest) {
  if (!window.Worker) {
    throw new Error("worker-not-supported")
  }

  const worker = new Worker(
    new URL("../workers/split-pdf.worker.ts", import.meta.url),
    { type: "module" }
  )

  return new Promise<SplitWorkerResponse>((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<SplitWorkerResponse>) => {
      worker.terminate()
      resolve(event.data)
    }

    worker.onerror = () => {
      worker.terminate()
      reject(new Error("split-failed"))
    }

    worker.postMessage(request, [request.sourceBytes])
  })
}

export { splitPdfWithWorker }
export type { SplitWorkerRequest, SplitWorkerResponse }
