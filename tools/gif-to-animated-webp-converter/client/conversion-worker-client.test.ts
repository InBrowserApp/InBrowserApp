import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import {
  WORKER_UNAVAILABLE_ERROR,
  convertGifFileToAnimatedWebpWithWorker,
  terminateGifToAnimatedWebpWorker,
} from "./conversion-worker-client"

import type {
  GifToAnimatedWebpWorkerRequest,
  GifToAnimatedWebpWorkerResponse,
} from "../workers/worker-types"

type WorkerListener = (event: MessageEvent<unknown>) => void
type WorkerErrorListener = (event: ErrorEvent) => void

class MockWorker {
  static instances: MockWorker[] = []

  private readonly errorListeners = new Set<WorkerErrorListener>()
  private readonly messageListeners = new Set<WorkerListener>()

  lastPostedMessage: GifToAnimatedWebpWorkerRequest | null = null
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

  postMessage(
    message: GifToAnimatedWebpWorkerRequest,
    transfer?: Transferable[]
  ) {
    this.lastPostedMessage = message
    this.lastTransfer = transfer
  }

  terminate() {
    this.terminated = true
  }

  emitMessage(message: GifToAnimatedWebpWorkerResponse) {
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

beforeEach(() => {
  vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker)
})

afterEach(() => {
  terminateGifToAnimatedWebpWorker()
  MockWorker.instances.length = 0
  vi.unstubAllGlobals()
})

function getLastWorker() {
  const worker = MockWorker.instances.at(-1)

  expect(worker).toBeTruthy()

  return worker!
}

async function getLastWorkerAfterPost() {
  await Promise.resolve()

  return getLastWorker()
}

describe("conversion worker client", () => {
  test("converts a GIF file through a reusable worker", async () => {
    const file = new File(["GIF89a"], "clip.gif", { type: "image/gif" })
    const promise = convertGifFileToAnimatedWebpWithWorker(
      file,
      { scale: 125 },
      "clip.webp"
    )
    const worker = await getLastWorkerAfterPost()
    const request = worker.lastPostedMessage!
    const output = new Uint8Array([1, 2, 3]).buffer

    expect(request.outputName).toBe("clip.webp")
    expect(request.options.scale).toBe(125)
    expect(request.input.byteLength).toBe(6)
    expect(worker.lastTransfer).toEqual([request.input])

    worker.emitMessage({
      id: request.id,
      ok: true,
      result: {
        buffer: output,
        originalHeight: 20,
        originalWidth: 30,
        outputHeight: 25,
        outputName: "clip.webp",
        outputWidth: 38,
      },
    })

    await expect(promise).resolves.toMatchObject({
      file,
      originalHeight: 20,
      originalWidth: 30,
      outputHeight: 25,
      outputName: "clip.webp",
      outputWidth: 38,
    })

    const second = convertGifFileToAnimatedWebpWithWorker(
      file,
      {},
      "clip-2.webp"
    )
    await Promise.resolve()
    const secondRequest = worker.lastPostedMessage!

    expect(MockWorker.instances).toHaveLength(1)

    worker.emitMessage({
      id: secondRequest.id,
      ok: true,
      result: {
        buffer: new ArrayBuffer(1),
        originalHeight: 20,
        originalWidth: 30,
        outputHeight: 20,
        outputName: "clip-2.webp",
        outputWidth: 30,
      },
    })

    await expect(second).resolves.toHaveProperty("outputName", "clip-2.webp")
  })

  test("rejects worker errors and ignores unrelated responses", async () => {
    const promise = convertGifFileToAnimatedWebpWithWorker(
      new File(["GIF89a"], "clip.gif", { type: "image/gif" }),
      {},
      "clip.webp"
    )
    const worker = await getLastWorkerAfterPost()
    const request = worker.lastPostedMessage!

    worker.emitMessage({
      id: 999,
      ok: true,
      result: {
        buffer: new ArrayBuffer(1),
        originalHeight: 1,
        originalWidth: 1,
        outputHeight: 1,
        outputName: "ignored.webp",
        outputWidth: 1,
      },
    })
    worker.emitMessage({
      id: request.id,
      message: "INVALID_GIF",
      ok: false,
    })

    await expect(promise).rejects.toThrow("INVALID_GIF")
  })

  test("tears down the worker on runtime crashes", async () => {
    const promise = convertGifFileToAnimatedWebpWithWorker(
      new File(["GIF89a"], "clip.gif", { type: "image/gif" }),
      {},
      "clip.webp"
    )
    const worker = await getLastWorkerAfterPost()

    worker.emitError("worker crashed")

    await expect(promise).rejects.toThrow("worker crashed")
    expect(worker.terminated).toBe(true)
  })

  test("throws when workers are unavailable", async () => {
    vi.stubGlobal("Worker", undefined)

    await expect(
      convertGifFileToAnimatedWebpWithWorker(
        new File(["GIF89a"], "clip.gif"),
        {},
        "clip.webp"
      )
    ).rejects.toThrow(WORKER_UNAVAILABLE_ERROR)
  })
})
