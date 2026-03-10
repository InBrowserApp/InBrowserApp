import EncodeAvifWorker from './encode-avif.worker.ts?worker'
import type { AvifEncodeRequest, AvifEncodeWorkerResult } from '../types'

export async function encodeAvifWithWorker(payload: AvifEncodeRequest) {
  if (!window.Worker) {
    throw new Error('WORKER_UNSUPPORTED')
  }

  const worker = new EncodeAvifWorker()

  return new Promise<ArrayBuffer>((resolve, reject) => {
    const cleanup = () => {
      worker.onmessage = null
      worker.onerror = null
      worker.terminate()
    }

    worker.onmessage = (event: MessageEvent<AvifEncodeWorkerResult>) => {
      cleanup()

      if (event.data.ok) {
        resolve(event.data.buffer)
        return
      }

      reject(new Error(event.data.code))
    }

    worker.onerror = () => {
      cleanup()
      reject(new Error('ENCODE_FAILED'))
    }

    worker.postMessage(payload, [payload.pixels])
  })
}
