import CompressPDFWorker from './compress-pdf.worker.ts?worker'
import { PDF_ERROR } from './pdf-errors'
import type { PdfCompressionOptions } from '@utils/pdf'

type CompressWorkerResult =
  | {
      ok: true
      blob: Blob
    }
  | {
      ok: false
      code: string
    }

export const compressPdfWithWorker = async (
  file: File,
  options: PdfCompressionOptions,
): Promise<Blob> => {
  if (!window.Worker) {
    throw new Error(PDF_ERROR.WorkerUnsupported)
  }

  const worker = new CompressPDFWorker()

  return new Promise<Blob>((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<CompressWorkerResult>) => {
      worker.terminate()

      if (event.data.ok) {
        resolve(event.data.blob)
        return
      }

      reject(new Error(event.data.code))
    }

    worker.onerror = () => {
      worker.terminate()
      reject(new Error(PDF_ERROR.CompressionFailed))
    }

    worker.postMessage({
      file,
      options,
    })
  })
}
