import { afterEach, describe, expect, it, vi } from "vitest"

import {
  formatCodeWithPrettierWorker,
  terminatePrettierWorker,
} from "./prettier-worker-client"
import { createPrettierFormatRequest } from "../core/prettier-languages"

type WorkerListener = (event: MessageEvent<unknown>) => void
type WorkerErrorListener = (event: ErrorEvent) => void

class MockWorker {
  static instances: MockWorker[] = []

  private readonly messageListeners = new Set<WorkerListener>()
  private readonly errorListeners = new Set<WorkerErrorListener>()

  lastPostedMessage: unknown = null
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

  postMessage(message: unknown) {
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
      listener({ message, error: new Error(message) } as ErrorEvent)
    }
  }

  emitUnknownError(message = "") {
    for (const listener of this.errorListeners) {
      listener({ message } as ErrorEvent)
    }
  }
}

vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker)

afterEach(() => {
  terminatePrettierWorker()
  MockWorker.instances.length = 0
})

function getLastWorker() {
  const worker = MockWorker.instances.at(-1)

  expect(worker).toBeTruthy()

  return worker!
}

describe("prettier-worker-client", () => {
  it("resolves successful worker responses", async () => {
    const formatPromise = formatCodeWithPrettierWorker(
      createPrettierFormatRequest("const answer=42", { language: "javascript" })
    )
    const worker = getLastWorker()
    const request = worker.lastPostedMessage as { id: number }

    worker.emitMessage({
      id: request.id,
      ok: true,
      formatted: "const answer = 42;\n",
    })

    await expect(formatPromise).resolves.toBe("const answer = 42;\n")
  })

  it("rejects worker error responses", async () => {
    const formatPromise = formatCodeWithPrettierWorker(
      createPrettierFormatRequest("{", { language: "json" })
    )
    const worker = getLastWorker()
    const request = worker.lastPostedMessage as { id: number }

    worker.emitMessage({
      id: request.id,
      ok: false,
      message: "Unexpected end of JSON input",
    })

    await expect(formatPromise).rejects.toThrow("Unexpected end of JSON input")
  })

  it("reuses the singleton worker and ignores unrelated responses", async () => {
    const firstPromise = formatCodeWithPrettierWorker(
      createPrettierFormatRequest("const a=1", { language: "javascript" })
    )
    const worker = getLastWorker()
    const firstRequest = worker.lastPostedMessage as { id: number }

    const secondPromise = formatCodeWithPrettierWorker(
      createPrettierFormatRequest("const b=2", { language: "javascript" })
    )
    const secondRequest = worker.lastPostedMessage as { id: number }

    expect(MockWorker.instances).toHaveLength(1)

    worker.emitMessage({
      id: 999_999,
      ok: true,
      formatted: "ignored",
    })

    worker.emitMessage({
      id: firstRequest.id,
      ok: true,
      formatted: "const a = 1;\n",
    })
    worker.emitMessage({
      id: secondRequest.id,
      ok: true,
      formatted: "const b = 2;\n",
    })

    await expect(firstPromise).resolves.toBe("const a = 1;\n")
    await expect(secondPromise).resolves.toBe("const b = 2;\n")
  })

  it("tears down the singleton worker on runtime crashes", async () => {
    const formatPromise = formatCodeWithPrettierWorker(
      createPrettierFormatRequest("const a=1", { language: "javascript" })
    )
    const worker = getLastWorker()

    worker.emitError("Worker crashed")

    await expect(formatPromise).rejects.toThrow("Worker crashed")
    expect(worker.terminated).toBe(true)
  })

  it("falls back to the generic error message when the crash has no Error", async () => {
    const formatPromise = formatCodeWithPrettierWorker(
      createPrettierFormatRequest("const a=1", { language: "javascript" })
    )
    const worker = getLastWorker()

    worker.emitUnknownError()

    await expect(formatPromise).rejects.toThrow("Worker crashed")
    expect(worker.terminated).toBe(true)
  })
})
