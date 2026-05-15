import optimiseRaw, { init } from "@jsquash/oxipng/optimise"

import type { PngOptimizerOptions } from "../core/png-optimizer"

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

type WorkerScopeLike = Readonly<{
  addEventListener: (
    type: "message",
    listener: (event: MessageEvent<PngOptimizerWorkerRequestMessage>) => void
  ) => void
  postMessage: (
    message: PngOptimizerWorkerResponseMessage,
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
  options: PngOptimizerOptions,
  wasmUrl: string
) {
  await getRuntime(wasmUrl)

  return await optimiseRaw(input, options)
}

function toWorkerErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

const workerScope = globalThis.self as WorkerScopeLike | undefined

if (typeof workerScope?.addEventListener === "function") {
  workerScope.addEventListener(
    "message",
    async (event: MessageEvent<PngOptimizerWorkerRequestMessage>) => {
      const { id, input, options, wasmUrl } = event.data

      try {
        const output = await optimizePngArrayBuffer(input, options, wasmUrl)
        const response = {
          id,
          ok: true,
          output,
        } as const satisfies PngOptimizerWorkerResponseMessage

        workerScope.postMessage(response, [output])
      } catch (error) {
        workerScope.postMessage({
          id,
          message: toWorkerErrorMessage(error),
          ok: false,
        } satisfies PngOptimizerWorkerResponseMessage)
      }
    }
  )
}

export { optimizePngArrayBuffer, toWorkerErrorMessage }
export type {
  PngOptimizerWorkerRequestMessage,
  PngOptimizerWorkerResponseMessage,
}
