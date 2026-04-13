type CodePointFormat =
  | "es6"
  | "hex-literal"
  | "html-dec"
  | "html-hex"
  | "js"
  | "python-u"
  | "unicode"

type ByteFormat = "url" | "utf8-hex"

type EscapeFormat = ByteFormat | CodePointFormat

type EscapeFormatDescriptor = Readonly<{
  value: EscapeFormat
  label: string
  example: string
}>

const ESCAPE_FORMATS: readonly EscapeFormatDescriptor[] = [
  { value: "js", label: "\\uXXXX", example: "\\u4F60\\u597D" },
  { value: "es6", label: "\\u{XXXXX}", example: "\\u{4F60}\\u{597D}" },
  { value: "html-hex", label: "&#xXXXX;", example: "&#x4F60;&#x597D;" },
  { value: "html-dec", label: "&#DDDD;", example: "&#20320;&#22909;" },
  { value: "unicode", label: "U+XXXX", example: "U+4F60 U+597D" },
  { value: "utf8-hex", label: "\\xXX", example: "\\xE4\\xBD\\xA0" },
  { value: "url", label: "%XX", example: "%E4%BD%A0" },
  { value: "python-u", label: "\\UXXXXXXXX", example: "\\U00004F60" },
  { value: "hex-literal", label: "0xXXXX", example: "0x4F60 0x597D" },
] as const

function toHex(codePoint: number, padLength = 4): string {
  return codePoint.toString(16).toUpperCase().padStart(padLength, "0")
}

function encodeToUtf8Bytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text))
}

function escapeCodePoint(codePoint: number, format: CodePointFormat): string {
  switch (format) {
    case "js":
      if (codePoint <= 0xffff) {
        return `\\u${toHex(codePoint)}`
      }
      // Surrogate pair for supplementary characters
      const high = Math.floor((codePoint - 0x10000) / 0x400) + 0xd800
      const low = ((codePoint - 0x10000) % 0x400) + 0xdc00
      return `\\u${toHex(high)}\\u${toHex(low)}`
    case "es6":
      return `\\u{${toHex(codePoint, codePoint > 0xffff ? 5 : 4)}}`
    case "html-hex":
      return `&#x${toHex(codePoint, codePoint > 0xffff ? 5 : 4)};`
    case "html-dec":
      return `&#${codePoint};`
    case "unicode":
      return `U+${toHex(codePoint, codePoint > 0xffff ? 5 : 4)}`
    case "python-u":
      return `\\U${toHex(codePoint, 8)}`
    case "hex-literal":
      return `0x${toHex(codePoint, codePoint > 0xffff ? 5 : 4)}`
  }
}

function isByteFormat(format: EscapeFormat): format is ByteFormat {
  return format === "utf8-hex" || format === "url"
}

function escapeCharToUtf8(char: string, format: ByteFormat): string {
  const bytes = encodeToUtf8Bytes(char)
  const prefix = format === "utf8-hex" ? "\\x" : "%"
  return bytes.map((b) => `${prefix}${toHex(b, 2)}`).join("")
}

function isAsciiPrintable(codePoint: number): boolean {
  return codePoint >= 0x20 && codePoint <= 0x7e
}

function escapeUnicode(text: string, format: EscapeFormat): string {
  let result = ""

  for (const char of text) {
    const codePoint = char.codePointAt(0)!

    if (isAsciiPrintable(codePoint)) {
      result += char
    } else if (isByteFormat(format)) {
      result += escapeCharToUtf8(char, format)
    } else {
      result += escapeCodePoint(codePoint, format)
    }
  }

  return result
}

function escapeAllUnicode(text: string, format: EscapeFormat): string {
  let result = ""

  for (const char of text) {
    if (isByteFormat(format)) {
      result += escapeCharToUtf8(char, format)
    } else {
      result += escapeCodePoint(char.codePointAt(0)!, format)
    }
  }

  return result
}

// --- Unescape ---

const UNESCAPE_PATTERNS = {
  js: /\\u([0-9A-Fa-f]{4})/g,
  es6: /\\u\{([0-9A-Fa-f]{1,6})\}/g,
  htmlHex: /&#x([0-9A-Fa-f]{1,6});/gi,
  htmlDec: /&#(\d{1,7});/g,
  unicode: /U\+([0-9A-Fa-f]{4,6})/gi,
  pythonU: /\\U([0-9A-Fa-f]{8})/g,
  hexLiteral: /0x([0-9A-Fa-f]{4,6})/gi,
} as const

const MAX_UNICODE = 0x10ffff

function decodeCodePointReplace(
  pattern: RegExp,
  radix: number
): (text: string) => string {
  return (text) =>
    text.replace(pattern, (match, digits) => {
      const codePoint = parseInt(digits, radix)
      return codePoint > MAX_UNICODE ? match : String.fromCodePoint(codePoint)
    })
}

function decodeJsEscapes(text: string): string {
  const regex = /\\u([0-9A-Fa-f]{4})/g
  let result = ""
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    result += text.slice(lastIndex, match.index)
    const codeUnit = parseInt(match[1]!, 16)

    // Check for surrogate pair
    const nextMatch = /^\\u([0-9A-Fa-f]{4})/.exec(text.slice(regex.lastIndex))
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff && nextMatch) {
      const nextCodeUnit = parseInt(nextMatch[1]!, 16)
      if (nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff) {
        const codePoint =
          (codeUnit - 0xd800) * 0x400 + (nextCodeUnit - 0xdc00) + 0x10000
        result += String.fromCodePoint(codePoint)
        regex.lastIndex += 6 // skip the low surrogate
        lastIndex = regex.lastIndex
        continue
      }
    }

    result += String.fromCodePoint(codeUnit)
    lastIndex = regex.lastIndex
  }

  result += text.slice(lastIndex)
  return result
}

function decodeUtf8ByteSequence(text: string, prefix: string): string {
  const decoder = new TextDecoder("utf-8", { fatal: false })
  const escapedPrefix = prefix.replace(/[\\%]/g, "\\$&")
  const groupPattern = new RegExp(`^(?:${escapedPrefix}[0-9A-Fa-f]{2})+`, "i")
  const bytePattern = new RegExp(`${escapedPrefix}([0-9A-Fa-f]{2})`, "gi")

  let result = ""
  let i = 0

  while (i < text.length) {
    const remaining = text.slice(i)
    const match = remaining.match(groupPattern)

    if (match?.[0]) {
      const bytes: number[] = []
      let byteMatch: RegExpExecArray | null
      bytePattern.lastIndex = 0
      while ((byteMatch = bytePattern.exec(match[0])) !== null) {
        bytes.push(parseInt(byteMatch[1]!, 16))
      }
      result += decoder.decode(new Uint8Array(bytes))
      i += match[0].length
    } else {
      result += text[i]
      i++
    }
  }

  return result
}

const decodeEs6 = decodeCodePointReplace(UNESCAPE_PATTERNS.es6, 16)
const decodeHtmlHex = decodeCodePointReplace(UNESCAPE_PATTERNS.htmlHex, 16)
const decodeHtmlDec = decodeCodePointReplace(UNESCAPE_PATTERNS.htmlDec, 10)
const decodeUnicodeNotation = decodeCodePointReplace(
  UNESCAPE_PATTERNS.unicode,
  16
)
const decodePythonU = decodeCodePointReplace(UNESCAPE_PATTERNS.pythonU, 16)
const decodeHexLiteral = decodeCodePointReplace(
  UNESCAPE_PATTERNS.hexLiteral,
  16
)

function unescapeUnicode(text: string): string {
  let result = text
  // Code-point based decoders
  result = decodeJsEscapes(result)
  result = decodeEs6(result)
  result = decodeHtmlHex(result)
  result = decodeHtmlDec(result)
  result = decodeUnicodeNotation(result)
  result = decodePythonU(result)
  result = decodeHexLiteral(result)
  // Byte-based decoders
  result = decodeUtf8ByteSequence(result, "\\x")
  result = decodeUtf8ByteSequence(result, "%")
  return result
}

export { ESCAPE_FORMATS, escapeAllUnicode, escapeUnicode, unescapeUnicode }
export type { EscapeFormat, EscapeFormatDescriptor }
