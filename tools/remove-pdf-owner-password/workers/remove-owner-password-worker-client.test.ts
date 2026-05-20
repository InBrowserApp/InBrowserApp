import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { removePdfOwnerPasswordWithWorker } from "./remove-owner-password-worker-client"

import type {
  RemovePdfOwnerPasswordWorkerRequest,
  RemovePdfOwnerPasswordWorkerResponse,
} from "./worker-types"

type WorkerListener = (event: MessageEvent<unknown>) => void
type WorkerErrorListener = (event: ErrorEvent) => void

class MockWorker {
  static instances: MockWorker[] = []

  private readonly errorListeners = new Set<WorkerErrorListener>()
  private readonly messageListeners = new Set<WorkerListener>()

  lastPostedMessage: RemovePdfOwnerPasswordWorkerRequest | null = null
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

  removeEventListener(type: "message", listener: WorkerListener): void
  removeEventListener(type: "error", listener: WorkerErrorListener): void
  removeEventListener(
    type: string,
    listener: WorkerListener | WorkerErrorListener
  ) {
    if (type === "message") {
      this.messageListeners.delete(listener as WorkerListener)
      return
    }

    if (type === "error") {
      this.errorListeners.delete(listener as WorkerErrorListener)
    }
  }

  postMessage(message: RemovePdfOwnerPasswordWorkerRequest) {
    this.lastPostedMessage = message
  }

  terminate() {
    this.terminated = true
  }

  emitMessage(message: RemovePdfOwnerPasswordWorkerResponse) {
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
  MockWorker.instances.length = 0
})

function getLastWorker() {
  const worker = MockWorker.instances.at(-1)

  expect(worker).toBeTruthy()

  return worker!
}

describe("removePdfOwnerPasswordWithWorker", () => {
  test("resolves worker output as a PDF blob", async () => {
    const promise = removePdfOwnerPasswordWithWorker(new Blob(["input"]))
    const worker = getLastWorker()
    const output = new ArrayBuffer(4)

    worker.emitMessage({
      id: worker.lastPostedMessage!.id,
      ok: true,
      output,
    })

    const result = await promise

    expect(result.type).toBe("application/pdf")
    expect((await result.arrayBuffer()).byteLength).toBe(output.byteLength)
    expect(worker.terminated).toBe(true)
  })

  test("rejects worker error responses", async () => {
    const promise = removePdfOwnerPasswordWithWorker(new Blob(["input"]))
    const worker = getLastWorker()

    worker.emitMessage({
      code: "QPDF_DECRYPT_FAILED",
      id: worker.lastPostedMessage!.id,
      ok: false,
    })

    await expect(promise).rejects.toThrow("QPDF_DECRYPT_FAILED")
  })

  test("ignores unrelated responses and handles worker crashes", async () => {
    const promise = removePdfOwnerPasswordWithWorker(new Blob(["input"]))
    const worker = getLastWorker()

    worker.emitMessage({ id: 999, ok: true, output: new ArrayBuffer(1) })
    worker.emitError("worker crashed")

    await expect(promise).rejects.toThrow("worker crashed")
    expect(worker.terminated).toBe(true)
  })

  test("throws when workers are unavailable", () => {
    vi.stubGlobal("Worker", undefined)

    expect(() => removePdfOwnerPasswordWithWorker(new Blob(["input"]))).toThrow(
      "WORKER_UNSUPPORTED"
    )
  })
})
