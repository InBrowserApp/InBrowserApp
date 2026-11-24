import ortUrl from "onnxruntime-web/webgpu?url"
import wasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?gzip-url"

import modelUrl from "../models/realesr-general-x4v3.onnx?url"

type Runtime = typeof import("onnxruntime-web/webgpu")

let model: Promise<ArrayBuffer> | undefined
let runtime: Promise<Runtime> | undefined

function loadRuntime() {
  return (runtime ??= (async () => {
    // Load the upstream module as an asset so Vite does not also emit its
    // default, uncompressed WASM file. The matching Asyncify binary is gzipped.
    const [ort, response] = await Promise.all([
      import(/* @vite-ignore */ ortUrl) as Promise<Runtime>,
      fetch(wasmUrl),
    ])
    if (!response.ok || !response.body) {
      throw new Error("Could not load the inference runtime")
    }
    const stream = response.body.pipeThrough(new DecompressionStream("gzip"))
    ort.env.wasm.numThreads = 1
    ort.env.wasm.wasmBinary = await new Response(stream).arrayBuffer()
    return ort
  })())
}

function loadModel() {
  return (model ??= (async () => {
    const response = await fetch(modelUrl)
    if (!response.ok) {
      throw new Error("Could not load the upscaling model")
    }
    return response.arrayBuffer()
  })())
}

export async function createSession(backend: "webgpu" | "wasm") {
  const [bytes, { InferenceSession, Tensor }] = await Promise.all([
    loadModel(),
    loadRuntime(),
  ])
  const session = await InferenceSession.create(bytes, {
    executionProviders: [backend],
  })
  return { session, Tensor }
}
