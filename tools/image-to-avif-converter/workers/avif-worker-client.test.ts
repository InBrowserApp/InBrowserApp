import { afterEach, describe, expect, test, vi } from "vitest"

import { DEFAULT_AVIF_OPTIONS } from "../core/avif-conversion"
import { encodeAvifWithWorker, terminateAvifWorker } from "./avif-worker-client"

import type { AvifWorkerRequestMessage } from "./avif-worker-types"

type WorkerListener = (event: MessageEvent<unknown>) => void
type WorkerErrorListener = (event: ErrorEvent) => void

class MockWorker {
  static instances: MockWorker[] = []

  private readonly errorListeners = new Set<WorkerErrorListener>()
  private readonly messageListeners = new Set<WorkerListener>()

  lastPostedMessage: AvifWorkerRequestMessage | null = null
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

  postMessage(message: AvifWorkerRequestMessage) {
    this.lastPostedMessage = message
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
}

vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker)

afterEach(() => {
  terminateAvifWorker()
  MockWorker.instances.length = 0
})

function createEncodeRequest() {
  return {
    height: 1,
    options: {
      bitDepth: 8,
      lossless: DEFAULT_AVIF_OPTIONS.lossless,
      quality: DEFAULT_AVIF_OPTIONS.quality,
      speed: DEFAULT_AVIF_OPTIONS.speed,
    },
    pixels: new ArrayBuffer(4),
    width: 1,
  } as const
}

function getLastWorker() {
  const worker = MockWorker.instances.at(-1)

  expect(worker).toBeTruthy()

  return worker!
}

describe("avif-worker-client", () => {
  test("resolves successful worker responses", async () => {
    const encodePromise = encodeAvifWithWorker(createEncodeRequest())
    const worker = getLastWorker()
    const id = worker.lastPostedMessage?.id
    const buffer = new ArrayBuffer(3)

    worker.emitMessage({ buffer, id, ok: true })

    await expect(encodePromise).resolves.toBe(buffer)
  })

  test("rejects worker error responses", async () => {
    const encodePromise = encodeAvifWithWorker(createEncodeRequest())
    const worker = getLastWorker()
    const id = worker.lastPostedMessage?.id

    worker.emitMessage({ code: "ENCODE_FAILED", id, ok: false })

    await expect(encodePromise).rejects.toThrow("ENCODE_FAILED")
  })

  test("reuses the singleton worker and ignores unrelated responses", async () => {
    const firstPromise = encodeAvifWithWorker(createEncodeRequest())
    const worker = getLastWorker()
    const firstId = worker.lastPostedMessage?.id
    const secondPromise = encodeAvifWithWorker(createEncodeRequest())
    const secondId = worker.lastPostedMessage?.id

    expect(MockWorker.instances).toHaveLength(1)

    worker.emitMessage({ buffer: new ArrayBuffer(1), id: 999_999, ok: true })
    worker.emitMessage({
      buffer: new ArrayBuffer(2),
      id: firstId,
      ok: true,
    })
    worker.emitMessage({
      buffer: new ArrayBuffer(3),
      id: secondId,
      ok: true,
    })

    await expect(firstPromise).resolves.toHaveProperty("byteLength", 2)
    await expect(secondPromise).resolves.toHaveProperty("byteLength", 3)
  })

  test("tears down the worker on runtime crashes", async () => {
    const encodePromise = encodeAvifWithWorker(createEncodeRequest())
    const worker = getLastWorker()

    worker.emitError("Worker crashed")

    await expect(encodePromise).rejects.toThrow("Worker crashed")
    expect(worker.terminated).toBe(true)
  })
})
