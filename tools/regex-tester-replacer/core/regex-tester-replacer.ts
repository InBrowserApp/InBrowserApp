const REGEX_FLAGS = ["g", "i", "m", "s", "u", "y"] as const

type RegexFlag = (typeof REGEX_FLAGS)[number]
type RegexResultView = "preview" | "matches" | "replace"

type RegexMatch = Readonly<{
  index: number
  end: number
  match: string
  groups: readonly string[]
  namedGroups: Readonly<Record<string, string>>
}>

type RegexMatchCollection = Readonly<{
  matches: readonly RegexMatch[]
  truncated: boolean
}>

type RegexPreviewSegment = Readonly<{
  text: string
  isMatch: boolean
  matchIndex: number | null
}>

type RegexPreview = Readonly<{
  previewText: string
  segments: readonly RegexPreviewSegment[]
  truncated: boolean
}>

type RegexCompileState = Readonly<{
  error: string | null
  normalizedFlags: string
  regex: RegExp | null
}>

type RegexAnalysisSummary = Readonly<{
  groupCount: number
  matchCount: number
  zeroLengthCount: number
}>

type RegexAnalysis = Readonly<{
  error: string | null
  matches: readonly RegexMatch[]
  matchesTruncated: boolean
  normalizedFlags: string
  preview: RegexPreview
  replacementOutput: string
  summary: RegexAnalysisSummary
}>

type RegexAnalysisOptions = Readonly<{
  matchLimit?: number
  previewLimit?: number
}>

function normalizeFlags(flags: readonly string[] | string): string {
  const values = new Set(
    typeof flags === "string" ? flags.split("").filter(Boolean) : flags
  )

  return REGEX_FLAGS.filter((flag) => values.has(flag)).join("")
}

function compileRegex(
  pattern: string,
  flags: readonly string[] | string
): RegexCompileState {
  const normalizedFlags = normalizeFlags(flags)

  if (!pattern.trim()) {
    return {
      error: null,
      normalizedFlags,
      regex: null,
    }
  }

  try {
    return {
      error: null,
      normalizedFlags,
      regex: new RegExp(pattern, normalizedFlags),
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      normalizedFlags,
      regex: null,
    }
  }
}

function collectMatches(
  text: string,
  regex: RegExp,
  limit: number
): RegexMatchCollection {
  const matches: RegexMatch[] = []
  let truncated = false

  regex.lastIndex = 0

  if (!regex.global) {
    const result = regex.exec(text)

    if (result) {
      matches.push(toRegexMatch(result))
    }

    return { matches, truncated }
  }

  let result: RegExpExecArray | null

  while ((result = regex.exec(text)) !== null) {
    matches.push(toRegexMatch(result))

    if (matches.length >= limit) {
      truncated = true
      break
    }

    if (result[0].length === 0) {
      regex.lastIndex += 1
    }
  }

  return { matches, truncated }
}

function buildPreview(
  text: string,
  matches: readonly RegexMatch[],
  maxLength: number
): RegexPreview {
  const previewText = text.slice(0, maxLength)
  const truncated = text.length > maxLength
  const segments: RegexPreviewSegment[] = []
  let cursor = 0

  matches.forEach((match, index) => {
    if (match.match.length === 0 || match.index >= maxLength) {
      return
    }

    const start = Math.max(cursor, match.index)
    const end = Math.min(match.end, maxLength)

    if (end <= cursor) {
      return
    }

    if (start > cursor) {
      segments.push({
        text: previewText.slice(cursor, start),
        isMatch: false,
        matchIndex: null,
      })
    }

    segments.push({
      text: previewText.slice(start, end),
      isMatch: true,
      matchIndex: index,
    })

    cursor = end
  })

  if (cursor < previewText.length) {
    segments.push({
      text: previewText.slice(cursor),
      isMatch: false,
      matchIndex: null,
    })
  }

  return { previewText, segments, truncated }
}

function formatMatchesForExport(matches: readonly RegexMatch[]): string {
  if (matches.length === 0) {
    return ""
  }

  return [
    "match\tstart\tend\ttext\tgroups\tnamedGroups",
    ...matches.map((match, index) =>
      [
        String(index + 1),
        String(match.index),
        String(match.end),
        JSON.stringify(match.match),
        JSON.stringify(match.groups),
        JSON.stringify(match.namedGroups),
      ].join("\t")
    ),
  ].join("\n")
}

function replaceMatches(
  text: string,
  regex: RegExp,
  replacement: string
): string {
  return text.replace(regex, replacement)
}

function analyzeRegex(
  text: string,
  pattern: string,
  flags: readonly string[] | string,
  replacement: string,
  options: RegexAnalysisOptions = {}
): RegexAnalysis {
  const matchLimit = options.matchLimit ?? 200
  const previewLimit = options.previewLimit ?? 5000
  const compileState = compileRegex(pattern, flags)
  const emptyPreview = buildPreview(text, [], previewLimit)

  if (compileState.error || !compileState.regex) {
    return {
      error: compileState.error,
      matches: [],
      matchesTruncated: false,
      normalizedFlags: compileState.normalizedFlags,
      preview: emptyPreview,
      replacementOutput: "",
      summary: {
        groupCount: 0,
        matchCount: 0,
        zeroLengthCount: 0,
      },
    }
  }

  if (!text) {
    return {
      error: null,
      matches: [],
      matchesTruncated: false,
      normalizedFlags: compileState.normalizedFlags,
      preview: emptyPreview,
      replacementOutput: "",
      summary: {
        groupCount: 0,
        matchCount: 0,
        zeroLengthCount: 0,
      },
    }
  }

  const executionRegex = new RegExp(
    compileState.regex.source,
    compileState.regex.flags
  )
  const replacementRegex = new RegExp(
    compileState.regex.source,
    compileState.regex.flags
  )
  const matchCollection = collectMatches(text, executionRegex, matchLimit)
  const groupCount = matchCollection.matches.reduce(
    (total, match) => total + match.groups.length,
    0
  )
  const zeroLengthCount = matchCollection.matches.reduce(
    (total, match) => (match.match.length === 0 ? total + 1 : total),
    0
  )

  return {
    error: null,
    matches: matchCollection.matches,
    matchesTruncated: matchCollection.truncated,
    normalizedFlags: compileState.normalizedFlags,
    preview: buildPreview(text, matchCollection.matches, previewLimit),
    replacementOutput: replaceMatches(text, replacementRegex, replacement),
    summary: {
      groupCount,
      matchCount: matchCollection.matches.length,
      zeroLengthCount,
    },
  }
}

function toRegexMatch(result: RegExpExecArray): RegexMatch {
  /* v8 ignore next -- RegExpExecArray always provides the full match value */
  const match = result[0] ?? ""
  /* v8 ignore next -- RegExpExecArray index is always numeric when returned */
  const index = result.index ?? 0

  return {
    index,
    end: index + match.length,
    match,
    groups: result.slice(1),
    namedGroups: result.groups ? { ...result.groups } : {},
  }
}

export {
  REGEX_FLAGS,
  analyzeRegex,
  buildPreview,
  collectMatches,
  compileRegex,
  formatMatchesForExport,
  normalizeFlags,
  replaceMatches,
}
export type {
  RegexAnalysis,
  RegexAnalysisSummary,
  RegexFlag,
  RegexMatch,
  RegexResultView,
}
