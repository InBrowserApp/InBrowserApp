import { env } from "onnxruntime-web/webgpu"
import mjsUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url"
import wasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?gzip-url"

export type WebGpuAdapter = NonNullable<typeof env.webgpu.adapter> & {
  readonly info?: { readonly isFallbackAdapter?: boolean }
}

export async function findWebGpuAdapter() {
  try {
    const gpu = (
      navigator as Navigator & {
        gpu?: {
          requestAdapter: (options: {
            powerPreference: string
          }) => Promise<WebGpuAdapter | null>
        }
      }
    ).gpu
    const adapter = await gpu?.requestAdapter({
      powerPreference: "high-performance",
    })
    return adapter && !adapter.info?.isFallbackAdapter ? adapter : undefined
  } catch {
    return undefined
  }
}

export async function initializeWebGpu(adapter: WebGpuAdapter) {
  const response = await fetch(new URL(wasmUrl, self.location.href))
  if (!response.ok || !response.body)
    throw new Error("Could not load the WebGPU runtime")
  env.wasm.wasmBinary = await new Response(
    response.body.pipeThrough(new DecompressionStream("gzip"))
  ).arrayBuffer()
  env.wasm.wasmPaths = { mjs: new URL(mjsUrl, self.location.href).href }
  env.wasm.numThreads = 1
  env.webgpu.adapter = adapter
}
