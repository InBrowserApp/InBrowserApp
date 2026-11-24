import { gzipSync } from "node:zlib"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

const { create, env } = vi.hoisted(() => ({
  create: vi.fn(),
  env: { wasm: {} as { wasmBinary?: ArrayBuffer } },
}))
vi.mock("onnxruntime-web/webgpu?url", () => ({
  default:
    "data:text/javascript,export const { InferenceSession, env, Tensor } = globalThis.upscalerTestRuntime",
}))
vi.mock(
  "onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?gzip-url",
  () => ({
    default: "/runtime.wasm.gz",
  })
)
vi.mock("../models/realesr-general-x4v3.onnx?url", () => ({
  default: "/model.onnx",
}))

const weights = new Uint8Array([19, 23, 31])
const runtime = new Uint8Array([1, 2, 3])
const fetchAsset = vi.fn<(url: string) => Promise<Response>>()

beforeEach(() => {
  vi.resetModules()
  vi.resetAllMocks()
  fetchAsset.mockImplementation(async (url) =>
    url === "/model.onnx"
      ? new Response(weights)
      : new Response(new Uint8Array(gzipSync(runtime)))
  )
  vi.stubGlobal("fetch", fetchAsset)
  vi.stubGlobal("upscalerTestRuntime", {
    InferenceSession: { create },
    env,
    Tensor: class {},
  })
})

afterEach(() => vi.unstubAllGlobals())

it("loads and inflates the same-origin assets once for both providers", async () => {
  const { createSession } = await import("./model")

  await createSession("webgpu")
  await createSession("wasm")

  expect(fetchAsset.mock.calls).toEqual([["/model.onnx"], ["/runtime.wasm.gz"]])
  expect(new Uint8Array(env.wasm.wasmBinary!)).toEqual(runtime)
  expect(create).toHaveBeenNthCalledWith(1, weights.buffer, {
    executionProviders: ["webgpu"],
  })
  expect(create).toHaveBeenNthCalledWith(2, weights.buffer, {
    executionProviders: ["wasm"],
  })
})

it.each(["/model.onnx", "/runtime.wasm.gz"])(
  "fails model initialization when the request for %s fails",
  async (missing) => {
    const { createSession } = await import("./model")
    fetchAsset.mockImplementation(async (url) =>
      url === missing
        ? new Response(null, { status: 503 })
        : new Response(new Uint8Array(gzipSync(runtime)))
    )

    await expect(createSession("wasm")).rejects.toThrow(/Could not load/)
    expect(create).not.toHaveBeenCalled()
  }
)
