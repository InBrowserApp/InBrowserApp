/// <reference lib="webworker" />

import { encryptPdf } from "./core/encrypt"

export type ProtectRequest = { file: File; password: string }

const worker = self as DedicatedWorkerGlobalScope
worker.onmessage = async ({ data }: MessageEvent<ProtectRequest>) => {
  try {
    worker.postMessage(await encryptPdf(data.file, data.password))
  } catch {
    worker.postMessage(null)
  }
}
