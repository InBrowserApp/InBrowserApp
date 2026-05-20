import optimiseRaw, { init } from "@jsquash/oxipng/optimise"

import type { OxipngOptions } from "../client/optimize-png-options"

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

type WorkerScopeLike = Readonly<{
  addEventListener: (
    type: "message",
    listener: (event: MessageEvent<OptimizePngWorkerRequestMessage>) => void
  ) => void
  postMessage: (
    message: OptimizePngWorkerResponseMessage,
    transfer?: Transferable[]
  ) => void
}>

let activeWasmUrl = ""
let runtimePromise: ReturnType<typeof init> | null = null

function getRuntime(wasmUrl: string) {
  if (!runtimePromise || activeWasmUrl !== wasmUrl) {
    activeWasmUrl = wasmUrl
    runtimePromise = init(wasmUrl)
  }

  return runtimePromise
}

async function optimizePngArrayBuffer(
  input: ArrayBuffer,
  options: OxipngOptions,
  wasmUrl: string
) {
  await getRuntime(wasmUrl)

  return await optimiseRaw(input, options)
}

function toWorkerErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

const workerScope = globalThis.self as WorkerScopeLike | undefined

/* v8 ignore start -- runs only inside a Web Worker scope */
if (typeof workerScope?.addEventListener === "function") {
  workerScope.addEventListener(
    "message",
    async (event: MessageEvent<OptimizePngWorkerRequestMessage>) => {
      const { id, input, options, wasmUrl } = event.data

      try {
        const output = await optimizePngArrayBuffer(input, options, wasmUrl)
        const response = {
          id,
          ok: true,
          output,
        } as const satisfies OptimizePngWorkerResponseMessage

        workerScope.postMessage(response, [output])
      } catch (error) {
        workerScope.postMessage({
          id,
          message: toWorkerErrorMessage(error),
          ok: false,
        } satisfies OptimizePngWorkerResponseMessage)
      }
    }
  )
}
/* v8 ignore stop */

export { optimizePngArrayBuffer, toWorkerErrorMessage }
export type {
  OptimizePngWorkerRequestMessage,
  OptimizePngWorkerResponseMessage,
}
