import OrganizerWorker from './organize-pdf.worker.ts?worker'
import { PDF_ERROR } from './pdf-errors'

export type OrganizedPagePayload = {
  sourcePageNumber: number
  rotation: number
}

export type OrganizePDFPayload = {
  file: File
  pages: OrganizedPagePayload[]
  outputFileName: string
}

export type OrganizePdfWorkerResponse =
  | {
      ok: true
      result: {
        file: {
          name: string
          blob: Blob
        }
      }
    }
  | {
      ok: false
      code: string
    }

export const organizePdfWithWorker = async (
  payload: OrganizePDFPayload,
): Promise<OrganizePdfWorkerResponse> => {
  if (!window.Worker) {
    throw new Error(PDF_ERROR.WorkerUnsupported)
  }

  const worker = new OrganizerWorker()

  return await new Promise<OrganizePdfWorkerResponse>((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<OrganizePdfWorkerResponse>) => {
      worker.terminate()
      resolve(event.data)
    }

    worker.onerror = () => {
      worker.terminate()
      reject(new Error(PDF_ERROR.ExportFailed))
    }

    worker.postMessage(payload)
  })
}
