import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { analyzeRegex } from "../core/regex-tester-replacer"
import {
  analyzeRegexInWorker,
  REGEX_ANALYSIS_FAILED_ERROR,
  REGEX_ANALYSIS_TIMEOUT_ERROR,
  REGEX_ANALYSIS_TIMEOUT_MS,
} from "./regex-analysis-worker"

import type {
  RegexAnalysisWorkerRequest,
  RegexAnalysisWorkerResponse,
} from "./regex-analysis-worker"

type WorkerListener = (event: MessageEvent<RegexAnalysisWorkerResponse>) => void
type WorkerErrorListener = (event: ErrorEvent) => void

class MockWorker {
  static instances: MockWorker[] = []

  private readonly messageListeners = new Set<WorkerListener>()
  private readonly errorListeners = new Set<WorkerErrorListener>()

  terminated = false

  constructor(_url: URL, _options: WorkerOptions) {
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

  postMessage(_request: RegexAnalysisWorkerRequest) {}

  terminate() {
    this.terminated = true
  }

  emitMessage(data: RegexAnalysisWorkerResponse) {
    for (const listener of this.messageListeners) {
      listener({ data } as MessageEvent<RegexAnalysisWorkerResponse>)
    }
  }

  emitError(message: string) {
    for (const listener of this.errorListeners) {
      listener({ message, error: new Error(message) } as ErrorEvent)
    }
  }
}

const request: RegexAnalysisWorkerRequest = {
  sourceText: "Order #123-ABC",
  pattern: "#(\\d+)-([A-Z]+)",
  flags: ["g"],
  replacement: "ID:$1 Code:$2",
  matchLimit: 200,
  previewLimit: 5000,
}

beforeEach(() => {
  MockWorker.instances = []
  vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe("analyzeRegexInWorker", () => {
  it("resolves the worker result and terminates its worker", async () => {
    const controller = new AbortController()
    const analysis = analyzeRegex(
      request.sourceText,
      request.pattern,
      request.flags,
      request.replacement,
      { matchLimit: request.matchLimit, previewLimit: request.previewLimit }
    )
    const promise = analyzeRegexInWorker(request, controller.signal)
    const worker = MockWorker.instances[0]!

    worker.emitMessage({ ok: true, analysis })

    await expect(promise).resolves.toEqual(analysis)
    expect(worker.terminated).toBe(true)
  })

  it("terminates the worker and rejects when analysis times out", async () => {
    vi.useFakeTimers()
    const promise = analyzeRegexInWorker(request, new AbortController().signal)
    const worker = MockWorker.instances[0]!
    const result = promise.catch((error: unknown) => error)

    await vi.advanceTimersByTimeAsync(REGEX_ANALYSIS_TIMEOUT_MS)

    expect(await result).toMatchObject({
      message: REGEX_ANALYSIS_TIMEOUT_ERROR,
    })
    expect(worker.terminated).toBe(true)
  })

  it("terminates the worker when its request is aborted", async () => {
    const controller = new AbortController()
    const promise = analyzeRegexInWorker(request, controller.signal)
    const worker = MockWorker.instances[0]!
    const result = promise.catch((error: unknown) => error)

    controller.abort()

    expect(await result).toMatchObject({ name: "AbortError" })
    expect(worker.terminated).toBe(true)
    worker.emitMessage({ ok: false })
  })

  it("rejects worker failures and terminates the worker", async () => {
    const promise = analyzeRegexInWorker(request, new AbortController().signal)
    const worker = MockWorker.instances[0]!
    const result = promise.catch((error: unknown) => error)

    worker.emitMessage({ ok: false })

    expect(await result).toMatchObject({ message: REGEX_ANALYSIS_FAILED_ERROR })
    expect(worker.terminated).toBe(true)
  })

  it("terminates the worker when it emits an error", async () => {
    const promise = analyzeRegexInWorker(request, new AbortController().signal)
    const worker = MockWorker.instances[0]!
    const result = promise.catch((error: unknown) => error)

    worker.emitError("Worker crashed")

    expect(await result).toMatchObject({ message: "Worker crashed" })
    expect(worker.terminated).toBe(true)
  })
})
