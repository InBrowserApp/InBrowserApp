import MergePdfWorker from './merge-pdf.worker.ts?worker'

export async function mergePDFs(files: File[]): Promise<Blob> {
  if (!window.Worker) {
    throw new Error('Web Worker is not supported')
  }

  const worker = new MergePdfWorker()

  return new Promise<Blob>((resolve, reject) => {
    worker.onmessage = (e: MessageEvent<Blob>) => {
      worker.terminate()
      resolve(e.data)
    }

    worker.onerror = (e: ErrorEvent) => {
      worker.terminate()
      reject(e.error)
    }

    worker.postMessage(files)
  })
}
