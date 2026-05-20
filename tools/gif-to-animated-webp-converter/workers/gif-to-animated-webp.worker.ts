/// <reference lib="webworker" />

import {
  convertGifBytesToAnimatedWebp,
  toArrayBuffer,
} from "../core/animated-webp-conversion"

import type {
  GifToAnimatedWebpWorkerRequest,
  GifToAnimatedWebpWorkerResponse,
} from "./worker-types"

type WorkerScopeLike = Readonly<{
  addEventListener: (
    type: "message",
    listener: (
      event: MessageEvent<GifToAnimatedWebpWorkerRequest>
    ) => void | Promise<void>
  ) => void
  postMessage: (
    message: GifToAnimatedWebpWorkerResponse,
    transfer?: Transferable[]
  ) => void
}>

function toWorkerErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

async function convertRequest(request: GifToAnimatedWebpWorkerRequest) {
  const result = await convertGifBytesToAnimatedWebp(
    new Uint8Array(request.input),
    request.options,
    request.outputName
  )
  const buffer = toArrayBuffer(result.bytes)

  return {
    originalHeight: result.originalHeight,
    originalWidth: result.originalWidth,
    outputHeight: result.outputHeight,
    outputName: result.outputName,
    outputWidth: result.outputWidth,
    buffer,
  }
}

const workerScope = globalThis.self as WorkerScopeLike | undefined

if (typeof workerScope?.addEventListener === "function") {
  workerScope.addEventListener(
    "message",
    async (event: MessageEvent<GifToAnimatedWebpWorkerRequest>) => {
      try {
        const result = await convertRequest(event.data)

        workerScope.postMessage(
          {
            id: event.data.id,
            ok: true,
            result,
          } satisfies GifToAnimatedWebpWorkerResponse,
          [result.buffer]
        )
      } catch (error) {
        workerScope.postMessage({
          id: event.data.id,
          message: toWorkerErrorMessage(error),
          ok: false,
        } satisfies GifToAnimatedWebpWorkerResponse)
      }
    }
  )
}

export { convertRequest, toWorkerErrorMessage }
