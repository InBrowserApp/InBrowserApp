const allowedFlags = ['g', 'i', 'm', 's', 'u', 'y'] as const

export type RegexMatch = {
  index: number
  end: number
  match: string
  groups: string[]
  namedGroups: Record<string, string>
}

export type MatchCollection = {
  matches: RegexMatch[]
  truncated: boolean
}

export type HighlightSegment = {
  text: string
  isMatch: boolean
  matchIndex: number | null
}

export type HighlightResult = {
  previewText: string
  segments: HighlightSegment[]
  truncated: boolean
}

export function normalizeFlags(flags: string[]): string {
  const activeFlags = new Set(flags)
  return allowedFlags.filter((flag) => activeFlags.has(flag)).join('')
}

export function compileRegex(
  pattern: string,
  flags: string,
): { regex: RegExp | null; error: string | null } {
  try {
    return { regex: new RegExp(pattern, flags), error: null }
  } catch (error) {
    return {
      regex: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export function collectMatches(text: string, regex: RegExp, limit: number): MatchCollection {
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

export function replaceText(text: string, regex: RegExp, replacement: string): string {
  return text.replace(regex, replacement)
}

export function buildHighlightSegments(
  text: string,
  matches: RegexMatch[],
  maxLength: number,
): HighlightResult {
  const previewText = text.slice(0, maxLength)
  const truncated = text.length > maxLength
  const segments: HighlightSegment[] = []
  let cursor = 0

  matches.forEach((match, matchIndex) => {
    if (!match.match.length) return
    if (match.index >= maxLength) return

    const start = Math.max(match.index, cursor)
    const end = Math.min(match.end, maxLength)

    if (end <= cursor) return
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
      matchIndex,
    })

    cursor = end
  })

  if (cursor < previewText.length) {
    segments.push({ text: previewText.slice(cursor), isMatch: false, matchIndex: null })
  }

  return { previewText, segments, truncated }
}

function toRegexMatch(result: RegExpExecArray): RegexMatch {
  const matchText = result[0] ?? ''
  const index = result.index ?? 0
  return {
    index,
    end: index + matchText.length,
    match: matchText,
    groups: result.slice(1),
    namedGroups: result.groups ? { ...result.groups } : {},
  }
}
