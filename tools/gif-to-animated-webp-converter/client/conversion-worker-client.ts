import { normalizeGifToAnimatedWebpOptions } from "../core/gif-frame-rendering"

import type { GifToAnimatedWebpResult } from "../core/animated-webp-conversion"
import type { GifToAnimatedWebpOptions } from "../core/gif-frame-rendering"
import type {
  GifToAnimatedWebpWorkerRequest,
  GifToAnimatedWebpWorkerResponse,
} from "../workers/worker-types"

type PendingGifConversionRequest = Readonly<{
  reject: (reason?: unknown) => void
  resolve: (value: GifToAnimatedWebpWorkerResponse & { ok: true }) => void
}>

const WORKER_UNAVAILABLE_ERROR = "GIF_TO_ANIMATED_WEBP_WORKER_UNAVAILABLE"

let conversionWorker: Worker | null = null
let nextRequestId = 0

const pendingRequests = new Map<number, PendingGifConversionRequest>()

function rejectAllPendingRequests(reason: unknown) {
  for (const { reject } of pendingRequests.values()) {
    reject(reason)
  }

  pendingRequests.clear()
}

function handleWorkerMessage(
  event: MessageEvent<GifToAnimatedWebpWorkerResponse>
) {
  const pendingRequest = pendingRequests.get(event.data.id)

  if (!pendingRequest) {
    return
  }

  pendingRequests.delete(event.data.id)

  if (event.data.ok) {
    pendingRequest.resolve(event.data)
    return
  }

  pendingRequest.reject(new Error(event.data.message))
}

function handleWorkerError(error: ErrorEvent) {
  const reason =
    error.error instanceof Error
      ? error.error
      : new Error(error.message || "GIF conversion worker crashed")

  rejectAllPendingRequests(reason)
  conversionWorker?.terminate()
  conversionWorker = null
}

function getConversionWorker() {
  if (typeof Worker === "undefined") {
    throw new Error(WORKER_UNAVAILABLE_ERROR)
  }

  if (conversionWorker) {
    return conversionWorker
  }

  conversionWorker = new Worker(
    new URL("../workers/gif-to-animated-webp.worker.ts", import.meta.url),
    { type: "module" }
  )
  conversionWorker.addEventListener("message", handleWorkerMessage)
  conversionWorker.addEventListener("error", handleWorkerError)

  return conversionWorker
}

async function convertGifFileToAnimatedWebpWithWorker(
  file: File,
  options: Partial<GifToAnimatedWebpOptions>,
  outputName: string
): Promise<GifToAnimatedWebpResult> {
  const worker = getConversionWorker()
  const normalizedOptions = normalizeGifToAnimatedWebpOptions(options)
  const input = await file.arrayBuffer()

  const response = await new Promise<
    GifToAnimatedWebpWorkerResponse & { ok: true }
  >((resolve, reject) => {
    const id = ++nextRequestId

    pendingRequests.set(id, { reject, resolve })
    worker.postMessage(
      {
        id,
        input,
        options: normalizedOptions,
        outputName,
      } satisfies GifToAnimatedWebpWorkerRequest,
      [input]
    )
  })
  const blob = new Blob([response.result.buffer], { type: "image/webp" })

  return {
    blob,
    file,
    originalHeight: response.result.originalHeight,
    originalWidth: response.result.originalWidth,
    outputHeight: response.result.outputHeight,
    outputName: response.result.outputName,
    outputWidth: response.result.outputWidth,
  }
}

function terminateGifToAnimatedWebpWorker() {
  rejectAllPendingRequests(new Error("GIF conversion worker terminated"))
  conversionWorker?.terminate()
  conversionWorker = null
}

export {
  WORKER_UNAVAILABLE_ERROR,
  convertGifFileToAnimatedWebpWithWorker,
  terminateGifToAnimatedWebpWorker,
}
