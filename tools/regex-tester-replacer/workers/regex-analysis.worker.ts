import { analyzeRegex } from "../core/regex-tester-replacer"

import type {
  RegexAnalysisWorkerRequest,
  RegexAnalysisWorkerResponse,
} from "../client/regex-analysis-worker"

self.addEventListener(
  "message",
  (event: MessageEvent<RegexAnalysisWorkerRequest>) => {
    const request = event.data

    try {
      const analysis = analyzeRegex(
        request.sourceText,
        request.pattern,
        request.flags,
        request.replacement,
        {
          matchLimit: request.matchLimit,
          previewLimit: request.previewLimit,
        }
      )

      self.postMessage({
        ok: true,
        analysis,
      } satisfies RegexAnalysisWorkerResponse)
    } catch {
      self.postMessage({ ok: false } satisfies RegexAnalysisWorkerResponse)
    }
  }
)
