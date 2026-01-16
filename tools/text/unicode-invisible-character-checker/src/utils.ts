export type InvisibleCategory = 'zero-width' | 'bidi-control' | 'space-like' | 'format'

export const INVISIBLE_CATEGORIES = [
  { value: 'zero-width', labelKey: 'category.zero-width' },
  { value: 'bidi-control', labelKey: 'category.bidi-control' },
  { value: 'space-like', labelKey: 'category.space-like' },
  { value: 'format', labelKey: 'category.format' },
] as const

type InvisibleCharDefinition = {
  code: number
  name: string
  short: string
  category: InvisibleCategory
}

const INVISIBLE_CHAR_DEFINITIONS: InvisibleCharDefinition[] = [
  { code: 0x200b, name: 'ZERO WIDTH SPACE', short: 'ZWSP', category: 'zero-width' },
  { code: 0x200c, name: 'ZERO WIDTH NON-JOINER', short: 'ZWNJ', category: 'zero-width' },
  { code: 0x200d, name: 'ZERO WIDTH JOINER', short: 'ZWJ', category: 'zero-width' },
  { code: 0x2060, name: 'WORD JOINER', short: 'WJ', category: 'zero-width' },
  { code: 0xfeff, name: 'ZERO WIDTH NO-BREAK SPACE', short: 'BOM', category: 'zero-width' },
  { code: 0x034f, name: 'COMBINING GRAPHEME JOINER', short: 'CGJ', category: 'zero-width' },
  { code: 0x180e, name: 'MONGOLIAN VOWEL SEPARATOR', short: 'MVS', category: 'zero-width' },

  { code: 0x200e, name: 'LEFT-TO-RIGHT MARK', short: 'LRM', category: 'bidi-control' },
  { code: 0x200f, name: 'RIGHT-TO-LEFT MARK', short: 'RLM', category: 'bidi-control' },
  { code: 0x202a, name: 'LEFT-TO-RIGHT EMBEDDING', short: 'LRE', category: 'bidi-control' },
  { code: 0x202b, name: 'RIGHT-TO-LEFT EMBEDDING', short: 'RLE', category: 'bidi-control' },
  { code: 0x202c, name: 'POP DIRECTIONAL FORMATTING', short: 'PDF', category: 'bidi-control' },
  { code: 0x202d, name: 'LEFT-TO-RIGHT OVERRIDE', short: 'LRO', category: 'bidi-control' },
  { code: 0x202e, name: 'RIGHT-TO-LEFT OVERRIDE', short: 'RLO', category: 'bidi-control' },
  { code: 0x2066, name: 'LEFT-TO-RIGHT ISOLATE', short: 'LRI', category: 'bidi-control' },
  { code: 0x2067, name: 'RIGHT-TO-LEFT ISOLATE', short: 'RLI', category: 'bidi-control' },
  { code: 0x2068, name: 'FIRST STRONG ISOLATE', short: 'FSI', category: 'bidi-control' },
  { code: 0x2069, name: 'POP DIRECTIONAL ISOLATE', short: 'PDI', category: 'bidi-control' },
  { code: 0x061c, name: 'ARABIC LETTER MARK', short: 'ALM', category: 'bidi-control' },

  { code: 0x00a0, name: 'NO-BREAK SPACE', short: 'NBSP', category: 'space-like' },
  { code: 0x1680, name: 'OGHAM SPACE MARK', short: 'OGSP', category: 'space-like' },
  { code: 0x2000, name: 'EN QUAD', short: 'ENQ', category: 'space-like' },
  { code: 0x2001, name: 'EM QUAD', short: 'EMQ', category: 'space-like' },
  { code: 0x2002, name: 'EN SPACE', short: 'ENS', category: 'space-like' },
  { code: 0x2003, name: 'EM SPACE', short: 'EMS', category: 'space-like' },
  { code: 0x2004, name: 'THREE-PER-EM SPACE', short: '3PEM', category: 'space-like' },
  { code: 0x2005, name: 'FOUR-PER-EM SPACE', short: '4PEM', category: 'space-like' },
  { code: 0x2006, name: 'SIX-PER-EM SPACE', short: '6PEM', category: 'space-like' },
  { code: 0x2007, name: 'FIGURE SPACE', short: 'FIGSP', category: 'space-like' },
  { code: 0x2008, name: 'PUNCTUATION SPACE', short: 'PUNCSP', category: 'space-like' },
  { code: 0x2009, name: 'THIN SPACE', short: 'THINSP', category: 'space-like' },
  { code: 0x200a, name: 'HAIR SPACE', short: 'HAIRSP', category: 'space-like' },
  { code: 0x202f, name: 'NARROW NO-BREAK SPACE', short: 'NNBSP', category: 'space-like' },
  { code: 0x205f, name: 'MEDIUM MATHEMATICAL SPACE', short: 'MMSP', category: 'space-like' },
  { code: 0x3000, name: 'IDEOGRAPHIC SPACE', short: 'IDSP', category: 'space-like' },

  { code: 0x00ad, name: 'SOFT HYPHEN', short: 'SHY', category: 'format' },
  { code: 0x2061, name: 'FUNCTION APPLICATION', short: 'FAP', category: 'format' },
  { code: 0x2062, name: 'INVISIBLE TIMES', short: 'IT', category: 'format' },
  { code: 0x2063, name: 'INVISIBLE SEPARATOR', short: 'IS', category: 'format' },
  { code: 0x2064, name: 'INVISIBLE PLUS', short: 'IP', category: 'format' },
]

const INVISIBLE_CHAR_MAP = new Map<number, InvisibleCharDefinition>(
  INVISIBLE_CHAR_DEFINITIONS.map((entry) => [entry.code, entry]),
)

export type InvisibleMatch = {
  index: number
  line: number
  column: number
  code: string
  name: string
  category: InvisibleCategory
  token: string
}

export type ScanResult = {
  matches: InvisibleMatch[]
  cleanedText: string
  annotatedText: string
  counts: Record<InvisibleCategory, number>
}

export function formatCodePoint(code: number): string {
  return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`
}

export function buildToken(entry: InvisibleCharDefinition): string {
  return `[[${entry.short}]]`
}

export function scanInvisibleCharacters(
  text: string,
  enabledCategories: Set<InvisibleCategory> = new Set(
    INVISIBLE_CATEGORIES.map((entry) => entry.value),
  ),
): ScanResult {
  const matches: InvisibleMatch[] = []
  const cleanedParts: string[] = []
  const annotatedParts: string[] = []
  const counts: Record<InvisibleCategory, number> = {
    'zero-width': 0,
    'bidi-control': 0,
    'space-like': 0,
    format: 0,
  }

  let line = 1
  let column = 1
  let index = 0
  let previousWasCarriageReturn = false

  const chars = Array.from(text)
  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i]
    const code = char.codePointAt(0) as number
    const entry = INVISIBLE_CHAR_MAP.get(code)
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
      annotatedParts.push(char)
      cleanedParts.push(char)
    }

    if (char === '\n') {
      if (previousWasCarriageReturn) {
        previousWasCarriageReturn = false
      } else {
        line += 1
      }
      column = 1
    } else if (char === '\r') {
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
    cleanedText: cleanedParts.join(''),
    annotatedText: annotatedParts.join(''),
    counts,
  }
}
