type TextDiffCompareOptions = Readonly<{
  ignoreCase: boolean
  ignoreWhitespace: boolean
}>

type DiffTokenKind = "equal" | "add" | "remove"
type DiffRowKind = "equal" | "add" | "remove" | "replace"

type DiffToken = Readonly<{
  kind: DiffTokenKind
  value: string
}>

type DiffSide = Readonly<{
  lineNumber: number | null
  text: string
  tokens: readonly DiffToken[]
}>

type DiffRow = Readonly<{
  kind: DiffRowKind
  original: DiffSide
  modified: DiffSide
}>

type DiffStats = Readonly<{
  originalLineCount: number
  modifiedLineCount: number
  unchanged: number
  changed: number
  added: number
  removed: number
}>

type TextDiffResult = Readonly<{
  rows: readonly DiffRow[]
  stats: DiffStats
  unifiedText: string
}>

function splitIntoLines(text: string) {
  const normalized = text.replace(/\r\n?/gu, "\n")

  if (normalized.length === 0) {
    return [] as string[]
  }

  return normalized.split("\n")
}

function normalizeLine(line: string, options: TextDiffCompareOptions) {
  let next = line

  if (options.ignoreWhitespace) {
    next = next.replace(/\s+/gu, "")
  }

  if (options.ignoreCase) {
    next = next.toLocaleLowerCase()
  }

  return next
}

function createTokens(
  value: string,
  kind: DiffTokenKind
): readonly DiffToken[] {
  return value.length === 0 ? [] : [{ kind, value }]
}

function createSide(
  lineNumber: number | null,
  text: string,
  tokens: readonly DiffToken[]
): DiffSide {
  return {
    lineNumber,
    text,
    tokens,
  }
}

export { createSide, createTokens, normalizeLine, splitIntoLines }
export type {
  DiffRow,
  DiffRowKind,
  DiffSide,
  DiffStats,
  DiffToken,
  DiffTokenKind,
  TextDiffCompareOptions,
  TextDiffResult,
}
