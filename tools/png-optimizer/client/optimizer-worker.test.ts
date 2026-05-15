import { afterEach, describe, expect, it, vi } from "vitest"

import {
  optimizePngArrayBuffer,
  optimizePngFile,
  terminatePngOptimizerWorker,
} from "./optimizer-worker"

type WorkerListener = (event: MessageEvent<unknown>) => void
type WorkerErrorListener = (event: ErrorEvent) => void

class MockWorker {
  static instances: MockWorker[] = []

  private readonly errorListeners = new Set<WorkerErrorListener>()
  private readonly messageListeners = new Set<WorkerListener>()

  lastPostedMessage: unknown = null
  lastTransfer: Transferable[] | undefined
  terminated = false

  constructor() {
    MockWorker.instances.push(this)
  }

  addEventListener(type: "message", listener: WorkerListener): void
  addEventListener(type: "error", listener: WorkerErrorListener): void
  addEventListener(
    type: string,
    listener: WorkerListener | WorkerErrorListener
  ) {
    if (type === "message") {
      this.messageListeners.add(listener as WorkerListener)
      return
    }

    if (type === "error") {
      this.errorListeners.add(listener as WorkerErrorListener)
    }
  }

  postMessage(message: unknown, transfer?: Transferable[]) {
    this.lastPostedMessage = message
    this.lastTransfer = transfer
  }

  terminate() {
    this.terminated = true
  }

  emitMessage(message: unknown) {
    for (const listener of this.messageListeners) {
      listener({ data: message } as MessageEvent<unknown>)
    }
  }

  emitError(message: string) {
    for (const listener of this.errorListeners) {
      listener({ error: new Error(message), message } as ErrorEvent)
    }
  }

  emitUnknownError() {
    for (const listener of this.errorListeners) {
      listener({ message: "" } as ErrorEvent)
    }
  }
}

vi.mock("@jsquash/oxipng/codec/pkg/squoosh_oxipng_bg.wasm?url", () => ({
  default: "/mock/oxipng.wasm",
}))

vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker)

afterEach(() => {
  terminatePngOptimizerWorker()
  MockWorker.instances.length = 0
})

function getLastWorker() {
  const worker = MockWorker.instances.at(-1)

  expect(worker).toBeTruthy()

  return worker!
}

async function getLastWorkerAfterMicrotask() {
  await Promise.resolve()

  return getLastWorker()
}

describe("png optimizer worker client", () => {
  it("resolves successful worker responses", async () => {
    const input = new Uint8Array([1, 2, 3]).buffer
    const promise = optimizePngArrayBuffer(input, {
      interlace: false,
      level: 2,
      optimiseAlpha: true,
    })
    const worker = getLastWorker()
    const request = worker.lastPostedMessage as {
      id: number
      input: ArrayBuffer
      wasmUrl: string
    }
    const output = new Uint8Array([1, 2]).buffer

    expect(request.input).toBe(input)
    expect(request.wasmUrl).toBe("/mock/oxipng.wasm")
    expect(worker.lastTransfer).toEqual([input])

    worker.emitMessage({
      id: request.id,
      ok: true,
      output,
    })

    await expect(promise).resolves.toBe(output)
  })

  it("rejects worker error responses", async () => {
    const promise = optimizePngArrayBuffer(new ArrayBuffer(1), {
      interlace: false,
      level: 2,
      optimiseAlpha: true,
    })
    const worker = getLastWorker()
    const request = worker.lastPostedMessage as { id: number }

    worker.emitMessage({
      id: request.id,
      message: "invalid png",
      ok: false,
    })

    await expect(promise).rejects.toThrow("invalid png")
  })

  it("reuses the worker and ignores unrelated responses", async () => {
    const first = optimizePngArrayBuffer(new ArrayBuffer(1), {
      interlace: false,
      level: 1,
      optimiseAlpha: true,
    })
    const worker = getLastWorker()
    const firstRequest = worker.lastPostedMessage as { id: number }
    const second = optimizePngArrayBuffer(new ArrayBuffer(2), {
      interlace: true,
      level: 4,
      optimiseAlpha: false,
    })
    const secondRequest = worker.lastPostedMessage as { id: number }

    expect(MockWorker.instances).toHaveLength(1)

    worker.emitMessage({ id: 999, ok: true, output: new ArrayBuffer(9) })
    worker.emitMessage({
      id: firstRequest.id,
      ok: true,
      output: new ArrayBuffer(1),
    })
    worker.emitMessage({
      id: secondRequest.id,
      ok: true,
      output: new ArrayBuffer(2),
    })

    await expect(first).resolves.toHaveProperty("byteLength", 1)
    await expect(second).resolves.toHaveProperty("byteLength", 2)
  })

  it("creates an optimization result for PNG files", async () => {
    const file = new File(["123456"], "photo.png", { type: "image/png" })
    const promise = optimizePngFile(file, { level: 3 })
    const worker = await getLastWorkerAfterMicrotask()
    const request = worker.lastPostedMessage as { id: number }

    worker.emitMessage({
      id: request.id,
      ok: true,
      output: new Uint8Array([1, 2, 3]).buffer,
    })

    await expect(promise).resolves.toMatchObject({
      optimizedBytes: 3,
      originalBytes: 6,
      outputName: "photo-optimized.png",
      savedBytes: 3,
    })
  })

  it("rejects invalid files before starting the worker", async () => {
    await expect(
      optimizePngFile(new File(["jpg"], "photo.jpg", { type: "image/jpeg" }), {
        level: 2,
      })
    ).rejects.toThrow("PNG_OPTIMIZER_INVALID_FILE")
    expect(MockWorker.instances).toHaveLength(0)
  })

  it("tears down the worker on runtime crashes", async () => {
    const promise = optimizePngArrayBuffer(new ArrayBuffer(1), {
      interlace: false,
      level: 2,
      optimiseAlpha: true,
    })
    const worker = getLastWorker()

    worker.emitError("worker crashed")

    await expect(promise).rejects.toThrow("worker crashed")
    expect(worker.terminated).toBe(true)
  })

  it("uses a generic error for unknown worker crashes", async () => {
    const promise = optimizePngArrayBuffer(new ArrayBuffer(1), {
      interlace: false,
      level: 2,
      optimiseAlpha: true,
    })
    const worker = getLastWorker()

    worker.emitUnknownError()

    await expect(promise).rejects.toThrow("PNG optimizer worker crashed")
    expect(worker.terminated).toBe(true)
  })
})
