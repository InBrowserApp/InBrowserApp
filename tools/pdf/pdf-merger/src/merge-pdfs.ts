import MergePDFWorker from './merge-pdfs.worker.ts?worker'
import { PDF_ERROR } from './pdf-errors'

type MergeWorkerResult =
  | {
      ok: true
      blob: Blob
    }
  | {
      ok: false
      code: string
    }

export const mergePdfsWithWorker = async (files: File[]): Promise<Blob> => {
  if (!window.Worker) {
    throw new Error(PDF_ERROR.WorkerUnsupported)
  }

  const worker = new MergePDFWorker()

  return new Promise<Blob>((resolve, reject) => {
    const handleSuccess = (event: MessageEvent<MergeWorkerResult>) => {
      worker.terminate()
      if (event.data.ok) {
        resolve(event.data.blob)
        return
      }

      reject(new Error(event.data.code))
    }

    const handleError = () => {
      worker.terminate()
      reject(new Error(PDF_ERROR.MergeFailed))
    }

    worker.onmessage = handleSuccess
    worker.onerror = handleError
    worker.postMessage({ files })
  })
}
