export type DotenvParserMode = 'compatible' | 'strict'
export type DotenvDuplicateStrategy = 'last-wins' | 'first-wins'
export type DotenvQuoteStyle = 'none' | 'single' | 'double'
export type DotenvDiagnosticSeverity = 'error' | 'warning'
export type DotenvDiagnosticCode =
  | 'missing_equals'
  | 'invalid_key'
  | 'unclosed_quote'
  | 'unexpected_content'
  | 'unexpected_whitespace'
  | 'unsupported_export'
  | 'blank_key'
  | 'empty_export'
  | 'duplicate_key'

export interface DotenvDiagnostic {
  line: number
  code: DotenvDiagnosticCode
  severity: DotenvDiagnosticSeverity
  message: string
  key?: string
}

export interface DotenvEntry {
  line: number
  key: string
  value: string
  quote: DotenvQuoteStyle
  export: boolean
  inlineComment: string | null
  duplicated: boolean
  active: boolean
}

export type DotenvLine =
  | { type: 'empty'; line: number; raw: string }
  | { type: 'comment'; line: number; raw: string; comment: string }
  | ({ type: 'entry'; raw: string } & DotenvEntry)
  | {
      type: 'invalid'
      line: number
      raw: string
      code: Exclude<DotenvDiagnosticCode, 'duplicate_key'>
      message: string
    }

export interface DotenvStats {
  entryCount: number
  resolvedCount: number
  duplicateCount: number
  invalidLineCount: number
  commentCount: number
  emptyLineCount: number
}

export interface ParseDotenvOptions {
  mode?: DotenvParserMode
  duplicateStrategy?: DotenvDuplicateStrategy
}

export interface ParseDotenvResult {
  lines: DotenvLine[]
  entries: DotenvEntry[]
  diagnostics: DotenvDiagnostic[]
  object: Record<string, string>
  stats: DotenvStats
}

export interface SerializeDotenvOptions {
  maskValues?: boolean
}
