import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { analyzeRegex } from "../core/regex-tester-replacer"

import type {
  RegexAnalysisWorkerRequest,
  RegexAnalysisWorkerResponse,
} from "../client/regex-analysis-types"

type WorkerMessageListener = (
  event: MessageEvent<RegexAnalysisWorkerRequest>
) => void

const request: RegexAnalysisWorkerRequest = {
  sourceText: "Order #123-ABC",
  pattern: "#(\\d+)-([A-Z]+)",
  flags: ["g"],
  replacement: "ID:$1 Code:$2",
  matchLimit: 200,
  previewLimit: 5000,
}

const addEventListener = vi.fn()
const postMessage = vi.fn()

beforeEach(() => {
  addEventListener.mockClear()
  postMessage.mockClear()
  vi.stubGlobal("self", { addEventListener, postMessage })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe("regex analysis worker", () => {
  it("posts the analysis result", async () => {
    await import("./regex-analysis.worker")

    const listener = addEventListener.mock.calls[0]![1] as WorkerMessageListener
    listener({ data: request } as MessageEvent<RegexAnalysisWorkerRequest>)

    expect(postMessage).toHaveBeenCalledWith({
      ok: true,
      analysis: analyzeRegex(
        request.sourceText,
        request.pattern,
        request.flags,
        request.replacement,
        {
          matchLimit: request.matchLimit,
          previewLimit: request.previewLimit,
        }
      ),
    } satisfies RegexAnalysisWorkerResponse)
  })

  it("reports unexpected analysis failures", async () => {
    await import("./regex-analysis.worker")

    const listener = addEventListener.mock.calls[0]![1] as WorkerMessageListener
    listener({
      data: { ...request, pattern: undefined as unknown as string },
    } as MessageEvent<RegexAnalysisWorkerRequest>)

    expect(postMessage).toHaveBeenCalledWith({ ok: false })
  })
})
