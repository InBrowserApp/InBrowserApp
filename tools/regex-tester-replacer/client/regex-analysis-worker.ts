import type { RegexAnalysis, RegexFlag } from "../core/regex-tester-replacer"

type RegexAnalysisWorkerRequest = Readonly<{
  sourceText: string
  pattern: string
  flags: readonly RegexFlag[]
  replacement: string
  matchLimit: number
  previewLimit: number
}>

type RegexAnalysisWorkerResponse =
  | Readonly<{ ok: true; analysis: RegexAnalysis }>
  | Readonly<{ ok: false }>

const REGEX_ANALYSIS_TIMEOUT_MS = 2000
const REGEX_ANALYSIS_TIMEOUT_ERROR = "REGEX_ANALYSIS_TIMEOUT"
const REGEX_ANALYSIS_FAILED_ERROR = "REGEX_ANALYSIS_FAILED"

function analyzeRegexInWorker(
  request: RegexAnalysisWorkerRequest,
  signal: AbortSignal
): Promise<RegexAnalysis> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Analysis cancelled", "AbortError"))
      return
    }

    const worker = new Worker(
      new URL("../workers/regex-analysis.worker.ts", import.meta.url),
      { type: "module" }
    )
    let active = true
    const timeoutId = setTimeout(() => {
      fail(new Error(REGEX_ANALYSIS_TIMEOUT_ERROR))
    }, REGEX_ANALYSIS_TIMEOUT_MS)

    function cleanup() {
      if (!active) {
        return
      }

      active = false
      clearTimeout(timeoutId)
      signal.removeEventListener("abort", handleAbort)
      worker.removeEventListener("message", handleMessage)
      worker.removeEventListener("error", handleError)
      worker.terminate()
    }

    function fail(error: unknown) {
      cleanup()
      reject(error)
    }

    function handleMessage(event: MessageEvent<RegexAnalysisWorkerResponse>) {
      cleanup()

      if (event.data.ok) {
        resolve(event.data.analysis)
      } else {
        reject(new Error(REGEX_ANALYSIS_FAILED_ERROR))
      }
    }

    function handleError(event: ErrorEvent) {
      fail(
        event.error instanceof Error
          ? event.error
          : new Error(REGEX_ANALYSIS_FAILED_ERROR)
      )
    }

    function handleAbort() {
      fail(new DOMException("Analysis cancelled", "AbortError"))
    }

    signal.addEventListener("abort", handleAbort, { once: true })
    worker.addEventListener("message", handleMessage)
    worker.addEventListener("error", handleError)

    try {
      worker.postMessage(request)
    } catch (error) {
      fail(error)
    }
  })
}

export {
  analyzeRegexInWorker,
  REGEX_ANALYSIS_FAILED_ERROR,
  REGEX_ANALYSIS_TIMEOUT_ERROR,
  REGEX_ANALYSIS_TIMEOUT_MS,
}
export type { RegexAnalysisWorkerRequest, RegexAnalysisWorkerResponse }
