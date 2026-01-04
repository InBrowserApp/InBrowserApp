export type EntityFormat = 'named' | 'decimal' | 'hex'
export type EncodeRange = 'minimal' | 'non-ascii' | 'all-special'

// Named HTML entities mapping (char -> entity name without & and ;)
const CHAR_TO_NAMED_ENTITY: Record<string, string> = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": 'apos',
  '\u00A0': 'nbsp',
  '\u00A9': 'copy',
  '\u00AE': 'reg',
  '\u2122': 'trade',
  '\u20AC': 'euro',
  '\u00A3': 'pound',
  '\u00A5': 'yen',
  '\u00A2': 'cent',
  '\u00B0': 'deg',
  '\u00B1': 'plusmn',
  '\u00D7': 'times',
  '\u00F7': 'divide',
  '\u2260': 'ne',
  '\u2264': 'le',
  '\u2265': 'ge',
  '\u221E': 'infin',
  '\u2190': 'larr',
  '\u2192': 'rarr',
  '\u2191': 'uarr',
  '\u2193': 'darr',
  '\u2194': 'harr',
  '\u2022': 'bull',
  '\u2026': 'hellip',
  '\u2013': 'ndash',
  '\u2014': 'mdash',
  '\u2018': 'lsquo',
  '\u2019': 'rsquo',
  '\u201C': 'ldquo',
  '\u201D': 'rdquo',
}

// Reverse mapping for decoding (entity name -> char)
const NAMED_ENTITY_TO_CHAR: Record<string, string> = {}
for (const [char, name] of Object.entries(CHAR_TO_NAMED_ENTITY)) {
  NAMED_ENTITY_TO_CHAR[name] = char
}

// Characters that must be encoded for HTML safety
const MINIMAL_ENCODE_CHARS = new Set(['&', '<', '>', '"', "'"])

function shouldEncode(char: string, range: EncodeRange): boolean {
  const code = char.charCodeAt(0)

  switch (range) {
    case 'minimal':
      return MINIMAL_ENCODE_CHARS.has(char)
    case 'non-ascii':
      return MINIMAL_ENCODE_CHARS.has(char) || code > 127
    case 'all-special':
      // Encode everything except alphanumeric and space
      return !(
        (code >= 48 && code <= 57) || // 0-9
        (code >= 65 && code <= 90) || // A-Z
        (code >= 97 && code <= 122) || // a-z
        code === 32 // space
      )
  }
}

function encodeChar(char: string, format: EntityFormat): string {
  const code = char.charCodeAt(0)

  switch (format) {
    case 'named':
      // Use named entity if available, otherwise fall back to decimal
      const namedEntity = CHAR_TO_NAMED_ENTITY[char]
      if (namedEntity) {
        return `&${namedEntity};`
      }
      return `&#${code};`
    case 'decimal':
      return `&#${code};`
    case 'hex':
      return `&#x${code.toString(16).toUpperCase()};`
  }
}

export function encodeHtmlEntities(text: string, format: EntityFormat, range: EncodeRange): string {
  let result = ''
  for (const char of text) {
    if (shouldEncode(char, range)) {
      result += encodeChar(char, format)
    } else {
      result += char
    }
  }
  return result
}

export function decodeHtmlEntities(text: string): string {
  // First, decode named entities
  let result = text.replace(/&([a-zA-Z]+);/g, (match, name) => {
    const char = NAMED_ENTITY_TO_CHAR[name.toLowerCase()]
    return char !== undefined ? char : match
  })

  // Decode decimal entities (&#123;)
  result = result.replace(/&#(\d+);/g, (match, code) => {
    const num = parseInt(code, 10)
    if (num >= 0 && num <= 0x10ffff) {
      return String.fromCodePoint(num)
    }
    return match
  })

  // Decode hexadecimal entities (&#x1A2B;)
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, code) => {
    const num = parseInt(code, 16)
    if (num >= 0 && num <= 0x10ffff) {
      return String.fromCodePoint(num)
    }
    return match
  })

  return result
}
