import ApplyWatermarkWorker from './apply-watermark.worker.ts?worker'
import { PDF_ERROR } from './pdf-errors'
import type { ApplyWatermarkPayload, ApplyWatermarkWorkerResponse } from './types'

export const applyWatermarkWithWorker = async (
  payload: ApplyWatermarkPayload,
): Promise<ApplyWatermarkWorkerResponse> => {
  if (!window.Worker) {
    throw new Error(PDF_ERROR.WorkerUnsupported)
  }

  const worker = new ApplyWatermarkWorker()

  return new Promise<ApplyWatermarkWorkerResponse>((resolve, reject) => {
    const onMessage = (event: MessageEvent<ApplyWatermarkWorkerResponse>) => {
      worker.terminate()
      resolve(event.data)
    }

    const onError = () => {
      worker.terminate()
      reject(new Error(PDF_ERROR.ApplyFailed))
    }

    worker.onmessage = onMessage
    worker.onerror = onError
    worker.postMessage(payload)
  })
}
