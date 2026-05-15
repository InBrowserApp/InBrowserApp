/// <reference lib="webworker" />

import { encode } from "@jsquash/avif"

import type {
  AvifEncodeRequest,
  AvifWorkerRequestMessage,
  AvifWorkerResponseMessage,
} from "./avif-worker-types"

const workerScope = self as DedicatedWorkerGlobalScope

function toArrayBuffer(value: ArrayBuffer | Uint8Array) {
  if (value instanceof ArrayBuffer) {
    return value
  }

  const copy = new Uint8Array(value.byteLength)

  copy.set(value)

  return copy.buffer
}

async function encodeRequest(request: AvifEncodeRequest) {
  const imageData = new ImageData(
    new Uint8ClampedArray(request.pixels),
    request.width,
    request.height
  )
  const encoded = await encode(imageData, request.options)

  return toArrayBuffer(encoded)
}

if (typeof workerScope !== "undefined" && "addEventListener" in workerScope) {
  workerScope.addEventListener(
    "message",
    async (event: MessageEvent<AvifWorkerRequestMessage>) => {
      try {
        const buffer = await encodeRequest(event.data.request)

        workerScope.postMessage(
          {
            buffer,
            id: event.data.id,
            ok: true,
          } satisfies AvifWorkerResponseMessage,
          [buffer]
        )
      } catch {
        workerScope.postMessage({
          code: "ENCODE_FAILED",
          id: event.data.id,
          ok: false,
        } satisfies AvifWorkerResponseMessage)
      }
    }
  )
}

export { encodeRequest, toArrayBuffer }
