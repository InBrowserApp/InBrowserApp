const ENTITY_FORMAT_VALUES = ["named", "decimal", "hex"] as const
const ENCODE_RANGE_VALUES = ["minimal", "non-ascii", "all-special"] as const

type EntityFormat = (typeof ENTITY_FORMAT_VALUES)[number]
type EncodeRange = (typeof ENCODE_RANGE_VALUES)[number]

const CHAR_TO_NAMED_ENTITY: Record<string, string> = {
  "&": "amp",
  "<": "lt",
  ">": "gt",
  '"': "quot",
  "'": "apos",
  "\u00A0": "nbsp",
  "\u00A9": "copy",
  "\u00AE": "reg",
  "\u2122": "trade",
  "\u20AC": "euro",
  "\u00A3": "pound",
  "\u00A5": "yen",
  "\u00A2": "cent",
  "\u00B0": "deg",
  "\u00B1": "plusmn",
  "\u00D7": "times",
  "\u00F7": "divide",
  "\u2260": "ne",
  "\u2264": "le",
  "\u2265": "ge",
  "\u221E": "infin",
  "\u2190": "larr",
  "\u2192": "rarr",
  "\u2191": "uarr",
  "\u2193": "darr",
  "\u2194": "harr",
  "\u2022": "bull",
  "\u2026": "hellip",
  "\u2013": "ndash",
  "\u2014": "mdash",
  "\u2018": "lsquo",
  "\u2019": "rsquo",
  "\u201C": "ldquo",
  "\u201D": "rdquo",
}

const NAMED_ENTITY_TO_CHAR = Object.fromEntries(
  Object.entries(CHAR_TO_NAMED_ENTITY).map(([character, entity]) => [
    entity.toLowerCase(),
    character,
  ])
) as Readonly<Record<string, string>>

const MINIMAL_ENCODE_CHARS = new Set(["&", "<", ">", '"', "'"])

function getCodePoint(character: string) {
  return character.codePointAt(0)!
}

function shouldEncode(character: string, range: EncodeRange) {
  const codePoint = getCodePoint(character)

  switch (range) {
    case "minimal":
      return MINIMAL_ENCODE_CHARS.has(character)
    case "non-ascii":
      return MINIMAL_ENCODE_CHARS.has(character) || codePoint > 127
    case "all-special":
      return !(
        (codePoint >= 48 && codePoint <= 57) ||
        (codePoint >= 65 && codePoint <= 90) ||
        (codePoint >= 97 && codePoint <= 122) ||
        codePoint === 32
      )
  }
}

function encodeCharacter(character: string, format: EntityFormat) {
  const codePoint = getCodePoint(character)

  switch (format) {
    case "named": {
      const namedEntity = CHAR_TO_NAMED_ENTITY[character]

      if (namedEntity) {
        return `&${namedEntity};`
      }

      return `&#${codePoint};`
    }
    case "decimal":
      return `&#${codePoint};`
    case "hex":
      return `&#x${codePoint.toString(16).toUpperCase()};`
  }
}

function encodeHtmlEntities(
  text: string,
  format: EntityFormat,
  range: EncodeRange
) {
  let encoded = ""

  for (const character of text) {
    encoded += shouldEncode(character, range)
      ? encodeCharacter(character, format)
      : character
  }

  return encoded
}

function decodeHtmlEntities(text: string) {
  let decoded = text.replace(/&([a-zA-Z]+);/g, (match, entityName) => {
    const character = NAMED_ENTITY_TO_CHAR[entityName.toLowerCase()]
    return character ?? match
  })

  decoded = decoded.replace(/&#(\d+);/g, (match, codePointText) => {
    const codePoint = Number.parseInt(codePointText, 10)

    if (codePoint >= 0 && codePoint <= 0x10ffff) {
      return String.fromCodePoint(codePoint)
    }

    return match
  })

  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, codePointText) => {
    const codePoint = Number.parseInt(codePointText, 16)

    if (codePoint >= 0 && codePoint <= 0x10ffff) {
      return String.fromCodePoint(codePoint)
    }

    return match
  })

  return decoded
}

function isEntityFormat(value: string): value is EntityFormat {
  return ENTITY_FORMAT_VALUES.includes(value as EntityFormat)
}

function isEncodeRange(value: string): value is EncodeRange {
  return ENCODE_RANGE_VALUES.includes(value as EncodeRange)
}

export { decodeHtmlEntities, encodeHtmlEntities, isEncodeRange, isEntityFormat }
export type { EncodeRange, EntityFormat }
