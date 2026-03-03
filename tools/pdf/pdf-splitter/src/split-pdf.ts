import SplitPDFWorker from './split-pdf.worker.ts?worker'
import { PDF_ERROR } from './pdf-errors'
import type { SplitMultipleMode, SplitOutputMode } from './split-pdf.worker'

type SplitWorkerFile = {
  name: string
  blob: Blob
}

type SplitWorkerResponse =
  | {
      ok: true
      result:
        | {
            kind: 'single'
            file: SplitWorkerFile
          }
        | {
            kind: 'multiple'
            files: SplitWorkerFile[]
          }
    }
  | {
      ok: false
      code: string
    }

export type SplitPDFPayload = {
  file: File
  pages: number[]
  segments: number[][]
  outputMode: SplitOutputMode
  multipleMode: SplitMultipleMode
  outputBaseName: string
}

export const splitPdfWithWorker = async (
  payload: SplitPDFPayload,
): Promise<SplitWorkerResponse> => {
  if (!window.Worker) {
    throw new Error(PDF_ERROR.WorkerUnsupported)
  }

  const worker = new SplitPDFWorker()

  return new Promise<SplitWorkerResponse>((resolve, reject) => {
    const onMessage = (event: MessageEvent<SplitWorkerResponse>) => {
      worker.terminate()
      resolve(event.data)
    }

    const onError = () => {
      worker.terminate()
      reject(new Error(PDF_ERROR.SplitFailed))
    }

    worker.onmessage = onMessage
    worker.onerror = onError
    worker.postMessage(payload)
  })
}
