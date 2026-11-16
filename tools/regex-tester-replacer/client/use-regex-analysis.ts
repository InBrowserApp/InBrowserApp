import { useEffect, useState } from "react"

import {
  analyzeRegexInWorker,
  REGEX_ANALYSIS_TIMEOUT_ERROR,
} from "./regex-analysis-worker"

import type { RegexAnalysis, RegexFlag } from "../core/regex-tester-replacer"
import type { RegexTesterReplacerMessages } from "../types"

type UseRegexAnalysisOptions = Readonly<{
  sourceText: string
  pattern: string
  flags: readonly RegexFlag[]
  replacement: string
  matchLimit: number
  previewLimit: number
  messages: RegexTesterReplacerMessages
}>

type AnalysisState =
  | Readonly<{ status: "pending" }>
  | Readonly<{ status: "ready"; analysis: RegexAnalysis }>
  | Readonly<{ status: "error"; message: string }>

const EMPTY_ANALYSIS: RegexAnalysis = {
  error: null,
  matches: [],
  matchesTruncated: false,
  normalizedFlags: "",
  preview: {
    previewText: "",
    segments: [],
    truncated: false,
  },
  replacementOutput: "",
  summary: {
    groupCount: 0,
    matchCount: 0,
    zeroLengthCount: 0,
  },
}

function useRegexAnalysis({
  sourceText,
  pattern,
  flags,
  replacement,
  matchLimit,
  previewLimit,
  messages,
}: UseRegexAnalysisOptions) {
  const [state, setState] = useState<AnalysisState>({ status: "pending" })

  useEffect(() => {
    if (!sourceText || !pattern.trim()) {
      setState({ status: "ready", analysis: EMPTY_ANALYSIS })
      return
    }

    const controller = new AbortController()

    setState({ status: "pending" })
    analyzeRegexInWorker(
      { sourceText, pattern, flags, replacement, matchLimit, previewLimit },
      controller.signal
    )
      .then((analysis) => {
        if (!controller.signal.aborted) {
          setState({ status: "ready", analysis })
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        const message =
          error instanceof Error &&
          error.message === REGEX_ANALYSIS_TIMEOUT_ERROR
            ? messages.analysisTimeoutLabel
            : messages.analysisFailedLabel

        setState({ status: "error", message })
      })

    return () => controller.abort()
  }, [
    flags,
    matchLimit,
    messages,
    pattern,
    previewLimit,
    replacement,
    sourceText,
  ])

  return {
    analysis: state.status === "ready" ? state.analysis : EMPTY_ANALYSIS,
    analysisErrorMessage: state.status === "error" ? state.message : null,
    isAnalyzing: state.status === "pending",
  } as const
}

export { useRegexAnalysis }
