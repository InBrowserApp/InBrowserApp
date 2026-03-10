/// <reference lib="webworker" />

import { encode } from '@jsquash/avif'
import type { AvifEncodeRequest, AvifEncodeWorkerResult } from '../types'

const workerScope = self as DedicatedWorkerGlobalScope

workerScope.onmessage = async (event: MessageEvent<AvifEncodeRequest>) => {
  try {
    const { pixels, width, height, options } = event.data
    const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height)
    const encoded = await encode(imageData, options)
    const buffer = toArrayBuffer(encoded)

    workerScope.postMessage({ ok: true, buffer } satisfies AvifEncodeWorkerResult, [buffer])
  } catch {
    workerScope.postMessage({ ok: false, code: 'ENCODE_FAILED' } satisfies AvifEncodeWorkerResult)
  }
}

function toArrayBuffer(value: ArrayBuffer | Uint8Array): ArrayBuffer {
  if (value instanceof ArrayBuffer) return value

  return value.slice().buffer
}
