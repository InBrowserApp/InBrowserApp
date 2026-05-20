import { afterEach, describe, expect, test, vi } from "vitest"

import {
  mergePdfFilesWithWorker,
  terminatePdfMergeWorker,
} from "./pdf-merge-worker"
import { PDF_MERGER_ERROR } from "../core/pdf-merger"

import type { PdfMergeWorkerResponseMessage } from "./pdf-merge-worker"

type WorkerListener = (
  event: MessageEvent<PdfMergeWorkerResponseMessage>
) => void

class MockWorker {
  static instances: MockWorker[] = []

  listeners = new Map<string, Function[]>()
  postedMessages: unknown[] = []
  terminated = false

  constructor() {
    MockWorker.instances.push(this)
  }

  addEventListener(type: string, listener: Function) {
    const listeners = this.listeners.get(type) ?? []
    listeners.push(listener)
    this.listeners.set(type, listeners)
  }

  postMessage(message: unknown) {
    this.postedMessages.push(message)
  }

  terminate() {
    this.terminated = true
  }

  emitMessage(message: PdfMergeWorkerResponseMessage) {
    for (const listener of this.listeners.get("message") ?? []) {
      ;(listener as WorkerListener)({ data: message } as MessageEvent)
    }
  }

  emitError(error: ErrorEvent) {
    for (const listener of this.listeners.get("error") ?? []) {
      ;(listener as (event: ErrorEvent) => void)(error)
    }
  }
}

function createPdfFile(name: string) {
  return new File([new Uint8Array([37, 80, 68, 70])], name, {
    lastModified: 1,
    type: "application/pdf",
  })
}

afterEach(() => {
  terminatePdfMergeWorker()
  MockWorker.instances = []
  vi.unstubAllGlobals()
})

describe("pdf merge worker client", () => {
  test("sends files to the worker and resolves merged output", async () => {
    vi.stubGlobal("Worker", MockWorker)
    const onProgress = vi.fn()
    const promise = mergePdfFilesWithWorker({
      files: [createPdfFile("a.pdf"), createPdfFile("b.pdf")],
      outputName: "packet",
      pageCount: 4,
      onProgress,
    })

    await vi.waitFor(() => {
      expect(MockWorker.instances[0]?.postedMessages).toHaveLength(1)
    })

    const request = MockWorker.instances[0]?.postedMessages[0] as { id: number }
    MockWorker.instances[0]?.emitMessage({
      id: request.id,
      ok: true,
      progress: { completed: 1, total: 2 },
      type: "progress",
    })
    MockWorker.instances[0]?.emitMessage({
      id: request.id,
      ok: true,
      output: new Uint8Array([37, 80, 68, 70]).buffer,
      type: "result",
    })

    await expect(promise).resolves.toMatchObject({
      fileName: "packet.pdf",
      pageCount: 4,
    })
    expect(onProgress).toHaveBeenCalledWith({ completed: 1, total: 2 })
  })

  test("rejects when workers are unavailable or fail", async () => {
    vi.stubGlobal("Worker", undefined)

    await expect(
      mergePdfFilesWithWorker({
        files: [createPdfFile("a.pdf"), createPdfFile("b.pdf")],
        outputName: "merged.pdf",
        pageCount: 2,
      })
    ).rejects.toThrow(PDF_MERGER_ERROR.workerUnavailable)

    vi.stubGlobal("Worker", MockWorker)
    const promise = mergePdfFilesWithWorker({
      files: [createPdfFile("a.pdf"), createPdfFile("b.pdf")],
      outputName: "merged.pdf",
      pageCount: 2,
    })

    await vi.waitFor(() => {
      expect(MockWorker.instances[0]?.postedMessages).toHaveLength(1)
    })

    const request = MockWorker.instances[0]?.postedMessages[0] as { id: number }
    MockWorker.instances[0]?.emitMessage({
      id: request.id,
      message: PDF_MERGER_ERROR.mergeFailed,
      ok: false,
      type: "error",
    })

    await expect(promise).rejects.toThrow(PDF_MERGER_ERROR.mergeFailed)
  })

  test("rejects pending requests when the worker crashes", async () => {
    vi.stubGlobal("Worker", MockWorker)
    const promise = mergePdfFilesWithWorker({
      files: [createPdfFile("a.pdf"), createPdfFile("b.pdf")],
      outputName: "merged.pdf",
      pageCount: 2,
    })

    await vi.waitFor(() => {
      expect(MockWorker.instances[0]?.postedMessages).toHaveLength(1)
    })

    MockWorker.instances[0]?.emitError(
      new ErrorEvent("error", { message: "worker crashed" })
    )

    await expect(promise).rejects.toThrow("worker crashed")
    expect(MockWorker.instances[0]?.terminated).toBe(true)
  })
})
