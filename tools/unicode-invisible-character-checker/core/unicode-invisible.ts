import {
  INVISIBLE_BY_CODE,
  INVISIBLE_CATEGORIES,
  type InvisibleCategory,
  type InvisibleDefinition,
} from "./invisible-definitions"

type InvisibleMatch = Readonly<{
  index: number
  line: number
  column: number
  code: string
  name: string
  category: InvisibleCategory
  token: string
}>

type ScanResult = Readonly<{
  matches: readonly InvisibleMatch[]
  cleanedText: string
  annotatedText: string
  counts: Readonly<Record<InvisibleCategory, number>>
}>

function createEmptyCounts(): Record<InvisibleCategory, number> {
  return {
    "zero-width": 0,
    "bidi-control": 0,
    "space-like": 0,
    format: 0,
  }
}

function formatCodePoint(code: number) {
  return `U+${code.toString(16).toUpperCase().padStart(4, "0")}`
}

function buildToken(entry: InvisibleDefinition) {
  return `[[${entry.short}]]`
}

function scanInvisibleCharacters(
  text: string,
  enabledCategories: ReadonlySet<InvisibleCategory> = new Set(
    INVISIBLE_CATEGORIES
  )
): ScanResult {
  const matches: InvisibleMatch[] = []
  const cleanedParts: string[] = []
  const annotatedParts: string[] = []
  const counts = createEmptyCounts()

  let line = 1
  let column = 1
  let index = 0
  let previousWasCarriageReturn = false

  for (const char of Array.from(text)) {
    const code = char.codePointAt(0)!
    const entry = INVISIBLE_BY_CODE.get(code)
    const isEnabled = entry ? enabledCategories.has(entry.category) : false

    if (entry && isEnabled) {
      const token = buildToken(entry)

      matches.push({
        index: index + 1,
        line,
        column,
        code: formatCodePoint(code),
        name: entry.name,
        category: entry.category,
        token,
      })
      counts[entry.category] += 1
      annotatedParts.push(token)
    } else {
      cleanedParts.push(char)
      annotatedParts.push(char)
    }

    if (char === "\n") {
      if (!previousWasCarriageReturn) {
        line += 1
      }
      column = 1
      previousWasCarriageReturn = false
    } else if (char === "\r") {
      line += 1
      column = 1
      previousWasCarriageReturn = true
    } else {
      column += 1
      previousWasCarriageReturn = false
    }

    index += 1
  }

  return {
    matches,
    cleanedText: cleanedParts.join(""),
    annotatedText: annotatedParts.join(""),
    counts,
  }
}

export type { InvisibleCategory, InvisibleMatch, ScanResult }
export { INVISIBLE_CATEGORIES, scanInvisibleCharacters }
