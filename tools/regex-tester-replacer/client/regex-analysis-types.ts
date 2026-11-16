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

export type { RegexAnalysisWorkerRequest, RegexAnalysisWorkerResponse }
