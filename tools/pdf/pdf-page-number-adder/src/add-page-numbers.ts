import AddPageNumbersWorker from './add-page-numbers.worker.ts?worker'
import { PDF_ERROR } from './pdf-errors'
import type { AddPageNumbersPayload, AddPageNumbersWorkerResponse } from './types'

export const addPageNumbersWithWorker = async (
  payload: AddPageNumbersPayload,
): Promise<AddPageNumbersWorkerResponse> => {
  if (!window.Worker) {
    throw new Error(PDF_ERROR.WorkerUnsupported)
  }

  const worker = new AddPageNumbersWorker()

  return new Promise<AddPageNumbersWorkerResponse>((resolve, reject) => {
    const onMessage = (event: MessageEvent<AddPageNumbersWorkerResponse>) => {
      worker.terminate()
      resolve(event.data)
    }

    const onError = () => {
      worker.terminate()
      reject(new Error(PDF_ERROR.AddFailed))
    }

    worker.onmessage = onMessage
    worker.onerror = onError
    worker.postMessage(payload)
  })
}
