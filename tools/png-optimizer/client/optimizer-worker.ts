import oxipngWasmUrl from "@jsquash/oxipng/codec/pkg/squoosh_oxipng_bg.wasm?url"

import {
  PNG_MIME_TYPE,
  assertSupportedPngFile,
  createPngOptimizationResult,
  normalizePngOptimizerOptions,
} from "../core/png-optimizer"

import type {
  PngOptimizationResult,
  PngOptimizerOptions,
} from "../core/png-optimizer"

type PngOptimizerWorkerRequestMessage = Readonly<{
  id: number
  input: ArrayBuffer
  options: PngOptimizerOptions
  wasmUrl: string
}>

type PngOptimizerWorkerResponseMessage =
  | Readonly<{
      id: number
      ok: true
      output: ArrayBuffer
    }>
  | Readonly<{
      id: number
      ok: false
      message: string
    }>

type PendingPngOptimizerRequest = Readonly<{
  reject: (reason?: unknown) => void
  resolve: (value: ArrayBuffer) => void
}>

const WORKER_UNAVAILABLE_ERROR = "PNG_OPTIMIZER_WORKER_UNAVAILABLE"

let optimizerWorker: Worker | null = null
let nextRequestId = 0

const pendingRequests = new Map<number, PendingPngOptimizerRequest>()

function rejectAllPendingRequests(reason: unknown) {
  for (const { reject } of pendingRequests.values()) {
    reject(reason)
  }

  pendingRequests.clear()
}

function handleWorkerMessage(
  event: MessageEvent<PngOptimizerWorkerResponseMessage>
) {
  const pendingRequest = pendingRequests.get(event.data.id)

  if (!pendingRequest) {
    return
  }

  pendingRequests.delete(event.data.id)

  if (event.data.ok) {
    pendingRequest.resolve(event.data.output)
    return
  }

  pendingRequest.reject(new Error(event.data.message))
}

function handleWorkerError(error: ErrorEvent) {
  const reason =
    error.error instanceof Error
      ? error.error
      : new Error(error.message || "PNG optimizer worker crashed")

  rejectAllPendingRequests(reason)
  optimizerWorker?.terminate()
  optimizerWorker = null
}

function getOptimizerWorker() {
  if (!("Worker" in globalThis)) {
    throw new Error(WORKER_UNAVAILABLE_ERROR)
  }

  if (optimizerWorker) {
    return optimizerWorker
  }

  optimizerWorker = new Worker(
    new URL("../workers/png-optimizer.worker.ts", import.meta.url),
    { type: "module" }
  )
  optimizerWorker.addEventListener("message", handleWorkerMessage)
  optimizerWorker.addEventListener("error", handleWorkerError)

  return optimizerWorker
}

async function optimizePngArrayBuffer(
  input: ArrayBuffer,
  options: PngOptimizerOptions
) {
  const worker = getOptimizerWorker()

  return await new Promise<ArrayBuffer>((resolve, reject) => {
    const id = ++nextRequestId

    pendingRequests.set(id, { reject, resolve })
    worker.postMessage(
      {
        id,
        input,
        options,
        wasmUrl: oxipngWasmUrl,
      } satisfies PngOptimizerWorkerRequestMessage,
      [input]
    )
  })
}

async function optimizePngFile(
  file: File,
  options: Partial<PngOptimizerOptions>
): Promise<PngOptimizationResult> {
  assertSupportedPngFile(file)

  const normalizedOptions = normalizePngOptimizerOptions(options)
  const optimizedBuffer = await optimizePngArrayBuffer(
    await file.arrayBuffer(),
    normalizedOptions
  )
  const optimizedBlob = new Blob([optimizedBuffer], { type: PNG_MIME_TYPE })

  return createPngOptimizationResult(file, optimizedBlob, normalizedOptions)
}

function terminatePngOptimizerWorker() {
  rejectAllPendingRequests(new Error("PNG optimizer worker terminated"))
  optimizerWorker?.terminate()
  optimizerWorker = null
}

export {
  WORKER_UNAVAILABLE_ERROR,
  optimizePngArrayBuffer,
  optimizePngFile,
  terminatePngOptimizerWorker,
}
