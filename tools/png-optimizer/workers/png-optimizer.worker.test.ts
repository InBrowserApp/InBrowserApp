import { afterEach, describe, expect, it, vi } from "vitest"

import {
  optimizePngArrayBuffer,
  toWorkerErrorMessage,
} from "./png-optimizer.worker"

const oxipngMocks = vi.hoisted(() => ({
  init: vi.fn(async () => undefined),
  optimiseRaw: vi.fn(async (input: ArrayBuffer) => input.slice(0, 2)),
}))

vi.mock("@jsquash/oxipng/optimise", () => ({
  default: oxipngMocks.optimiseRaw,
  init: oxipngMocks.init,
}))

type WorkerMessagePayload = {
  id: number
  input: ArrayBuffer
  options: {
    interlace: boolean
    level: number
    optimiseAlpha: boolean
  }
  wasmUrl: string
}

afterEach(() => {
  vi.resetModules()
  vi.unstubAllGlobals()
  oxipngMocks.init.mockClear()
  oxipngMocks.optimiseRaw.mockClear()
})

describe("png optimizer worker", () => {
  it("initializes oxipng and optimizes the input buffer", async () => {
    const input = new Uint8Array([1, 2, 3, 4]).buffer

    await expect(
      optimizePngArrayBuffer(
        input,
        { interlace: false, level: 2, optimiseAlpha: true },
        "/mock/oxipng.wasm"
      )
    ).resolves.toHaveProperty("byteLength", 2)
    expect(oxipngMocks.init).toHaveBeenCalledWith("/mock/oxipng.wasm")
    expect(oxipngMocks.optimiseRaw).toHaveBeenCalledWith(input, {
      interlace: false,
      level: 2,
      optimiseAlpha: true,
    })
  })

  it("reinitializes when the wasm URL changes", async () => {
    await optimizePngArrayBuffer(
      new ArrayBuffer(1),
      {
        interlace: false,
        level: 1,
        optimiseAlpha: true,
      },
      "/one.wasm"
    )
    await optimizePngArrayBuffer(
      new ArrayBuffer(1),
      {
        interlace: false,
        level: 1,
        optimiseAlpha: true,
      },
      "/two.wasm"
    )

    expect(oxipngMocks.init).toHaveBeenCalledTimes(2)
  })

  it("stringifies worker errors", () => {
    expect(toWorkerErrorMessage(new Error("boom"))).toBe("boom")
    expect(toWorkerErrorMessage("failed")).toBe("failed")
  })

  it("registers a message handler that posts optimized output", async () => {
    let messageListener:
      | ((event: MessageEvent<WorkerMessagePayload>) => void | Promise<void>)
      | null = null
    const postMessage = vi.fn()

    vi.stubGlobal("self", {
      addEventListener: vi.fn(
        (type: string, listener: typeof messageListener) => {
          if (type === "message") {
            messageListener = listener
          }
        }
      ),
      postMessage,
    })

    await import("./png-optimizer.worker")

    expect(messageListener).toBeTruthy()

    await messageListener!({
      data: {
        id: 1,
        input: new Uint8Array([1, 2, 3]).buffer,
        options: { interlace: false, level: 2, optimiseAlpha: true },
        wasmUrl: "/mock/oxipng.wasm",
      },
    } as MessageEvent<WorkerMessagePayload>)

    expect(postMessage).toHaveBeenCalledWith(
      {
        id: 1,
        ok: true,
        output: expect.any(ArrayBuffer),
      },
      [expect.any(ArrayBuffer)]
    )
  })

  it("posts worker failures as error messages", async () => {
    let messageListener:
      | ((event: MessageEvent<WorkerMessagePayload>) => void | Promise<void>)
      | null = null
    const postMessage = vi.fn()

    oxipngMocks.optimiseRaw.mockRejectedValueOnce(new Error("bad png"))
    vi.stubGlobal("self", {
      addEventListener: vi.fn(
        (type: string, listener: typeof messageListener) => {
          if (type === "message") {
            messageListener = listener
          }
        }
      ),
      postMessage,
    })

    await import("./png-optimizer.worker")

    await messageListener!({
      data: {
        id: 2,
        input: new ArrayBuffer(1),
        options: { interlace: false, level: 2, optimiseAlpha: true },
        wasmUrl: "/mock/oxipng.wasm",
      },
    } as MessageEvent<WorkerMessagePayload>)

    expect(postMessage).toHaveBeenCalledWith({
      id: 2,
      message: "bad png",
      ok: false,
    })
  })
})
