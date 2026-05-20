import oxipngWasmUrl from "@jsquash/oxipng/codec/pkg/squoosh_oxipng_bg.wasm?url"

import {
  DEFAULT_OXIPNG_OPTIONS,
  type OxipngOptions,
} from "./optimize-png-options"

type OptimizePngWorkerRequestMessage = Readonly<{
  id: number
  input: ArrayBuffer
  options: OxipngOptions
  wasmUrl: string
}>

type OptimizePngWorkerResponseMessage =
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

type PendingOptimizeRequest = Readonly<{
  reject: (reason?: unknown) => void
  resolve: (value: ArrayBuffer) => void
}>

const WORKER_UNAVAILABLE_ERROR = "FAVICON_OPTIMIZER_WORKER_UNAVAILABLE"

let optimizerWorker: Worker | null = null
let nextRequestId = 0

const pendingRequests = new Map<number, PendingOptimizeRequest>()

/* v8 ignore start -- Web Worker boot path only exercised in browser/staging */
function rejectAllPendingRequests(reason: unknown) {
  for (const { reject } of pendingRequests.values()) {
    reject(reason)
  }

  pendingRequests.clear()
}

function handleWorkerMessage(
  event: MessageEvent<OptimizePngWorkerResponseMessage>
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
      : new Error(error.message || "Favicon PNG optimizer worker crashed")

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
    new URL("../workers/optimize-png.worker.ts", import.meta.url),
    { type: "module" }
  )
  optimizerWorker.addEventListener("message", handleWorkerMessage)
  optimizerWorker.addEventListener("error", handleWorkerError)

  return optimizerWorker
}

async function optimizePngBytes(
  bytes: Uint8Array,
  options: OxipngOptions = DEFAULT_OXIPNG_OPTIONS
): Promise<Uint8Array<ArrayBuffer>> {
  const worker = getOptimizerWorker()
  const input = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer

  const output = await new Promise<ArrayBuffer>((resolve, reject) => {
    const id = ++nextRequestId

    pendingRequests.set(id, { reject, resolve })
    worker.postMessage(
      {
        id,
        input,
        options,
        wasmUrl: oxipngWasmUrl,
      } satisfies OptimizePngWorkerRequestMessage,
      [input]
    )
  })

  return new Uint8Array(output)
}
/* v8 ignore stop */

export { optimizePngBytes }
