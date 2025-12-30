export type EscapeFormat =
  | 'js'
  | 'es6'
  | 'html-hex'
  | 'html-dec'
  | 'unicode'
  | 'utf8-hex'
  | 'url'
  | 'python-u'
  | 'hex-literal'

export const escapeFormats: { value: EscapeFormat; label: string; example: string }[] = [
  { value: 'js', label: '\\uXXXX', example: '\\u4F60\\u597D' },
  { value: 'es6', label: '\\u{XXXXX}', example: '\\u{4F60}\\u{597D}' },
  { value: 'html-hex', label: '&#xXXXX;', example: '&#x4F60;&#x597D;' },
  { value: 'html-dec', label: '&#DDDD;', example: '&#20320;&#22909;' },
  { value: 'unicode', label: 'U+XXXX', example: 'U+4F60 U+597D' },
  { value: 'utf8-hex', label: '\\xXX', example: '\\xE4\\xBD\\xA0' },
  { value: 'url', label: '%XX', example: '%E4%BD%A0' },
  { value: 'python-u', label: '\\UXXXXXXXX', example: '\\U00004F60' },
  { value: 'hex-literal', label: '0xXXXX', example: '0x4F60 0x597D' },
]

function toHex(codePoint: number, padLength: number = 4): string {
  return codePoint.toString(16).toUpperCase().padStart(padLength, '0')
}

// Encode a string to UTF-8 bytes
function encodeToUtf8Bytes(text: string): number[] {
  const encoder = new TextEncoder()
  return Array.from(encoder.encode(text))
}

function escapeCodePoint(codePoint: number, format: EscapeFormat): string {
  switch (format) {
    case 'js':
      // For BMP characters, use \uXXXX
      // For supplementary characters, use surrogate pairs
      if (codePoint <= 0xffff) {
        return `\\u${toHex(codePoint)}`
      } else {
        // Convert to surrogate pair
        const highSurrogate = Math.floor((codePoint - 0x10000) / 0x400) + 0xd800
        const lowSurrogate = ((codePoint - 0x10000) % 0x400) + 0xdc00
        return `\\u${toHex(highSurrogate)}\\u${toHex(lowSurrogate)}`
      }
    case 'es6':
      return `\\u{${toHex(codePoint, codePoint > 0xffff ? 5 : 4)}}`
    case 'html-hex':
      return `&#x${toHex(codePoint, codePoint > 0xffff ? 5 : 4)};`
    case 'html-dec':
      return `&#${codePoint};`
    case 'unicode':
      return `U+${toHex(codePoint, codePoint > 0xffff ? 5 : 4)}`
    case 'python-u':
      return `\\U${toHex(codePoint, 8)}`
    case 'hex-literal':
      return `0x${toHex(codePoint, codePoint > 0xffff ? 5 : 4)}`
    // These are handled specially in escapeUnicode since they work on bytes
    case 'utf8-hex':
    case 'url':
      return '' // Will be handled by escapeUnicode
  }
}

// Escape a single character to UTF-8 byte format
function escapeCharToUtf8(char: string, format: 'utf8-hex' | 'url'): string {
  const bytes = encodeToUtf8Bytes(char)
  if (format === 'utf8-hex') {
    return bytes.map((b) => `\\x${b.toString(16).toUpperCase().padStart(2, '0')}`).join('')
  } else {
    return bytes.map((b) => `%${b.toString(16).toUpperCase().padStart(2, '0')}`).join('')
  }
}

export function escapeUnicode(text: string, format: EscapeFormat): string {
  let result = ''

  // Handle byte-based formats specially
  if (format === 'utf8-hex' || format === 'url') {
    for (const char of text) {
      const codePoint = char.codePointAt(0)!
      // Keep ASCII printable characters as-is
      if (codePoint >= 0x20 && codePoint <= 0x7e) {
        result += char
      } else {
        result += escapeCharToUtf8(char, format)
      }
    }
    return result
  }

  // Handle code point-based formats
  for (const char of text) {
    const codePoint = char.codePointAt(0)!
    // Keep ASCII printable characters as-is (except for certain formats)
    if (codePoint >= 0x20 && codePoint <= 0x7e) {
      result += char
    } else {
      result += escapeCodePoint(codePoint, format)
    }
  }
  return result
}

export function escapeAllUnicode(text: string, format: EscapeFormat): string {
  let result = ''

  // Handle byte-based formats specially
  if (format === 'utf8-hex' || format === 'url') {
    for (const char of text) {
      result += escapeCharToUtf8(char, format)
    }
    return result
  }

  for (const char of text) {
    const codePoint = char.codePointAt(0)!
    result += escapeCodePoint(codePoint, format)
  }
  return result
}

// Regex patterns for different escape formats
const patterns = {
  // \uXXXX (JavaScript) - including surrogate pairs
  js: /\\u([0-9A-Fa-f]{4})/g,
  // \u{XXXXX} (ES6)
  es6: /\\u\{([0-9A-Fa-f]{1,6})\}/g,
  // &#xXXXX; (HTML hex)
  htmlHex: /&#x([0-9A-Fa-f]{1,6});/gi,
  // &#DDDD; (HTML decimal)
  htmlDec: /&#(\d{1,7});/g,
  // U+XXXX (Unicode notation)
  unicode: /U\+([0-9A-Fa-f]{4,6})/gi,
  // \xXX (UTF-8 hex bytes)
  utf8Hex: /\\x([0-9A-Fa-f]{2})/gi,
  // %XX (URL encoding)
  url: /%([0-9A-Fa-f]{2})/gi,
  // \UXXXXXXXX (Python 8-digit)
  pythonU: /\\U([0-9A-Fa-f]{8})/g,
  // 0xXXXX (Hex literal)
  hexLiteral: /0x([0-9A-Fa-f]{4,6})/gi,
}

function decodeJsEscapes(text: string): string {
  // First pass: decode surrogate pairs and regular \uXXXX
  let result = ''
  const regex = /\\u([0-9A-Fa-f]{4})/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    result += text.slice(lastIndex, match.index)
    const codeUnit = parseInt(match[1]!, 16)

    // Check if this is a high surrogate and next is a low surrogate
    const nextMatch = /^\\u([0-9A-Fa-f]{4})/.exec(text.slice(regex.lastIndex))
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff && nextMatch) {
      const nextCodeUnit = parseInt(nextMatch[1]!, 16)
      if (nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff) {
        // Valid surrogate pair
        const codePoint = (codeUnit - 0xd800) * 0x400 + (nextCodeUnit - 0xdc00) + 0x10000
        result += String.fromCodePoint(codePoint)
        regex.lastIndex += 6 // Skip the low surrogate
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

function decodeEs6Escapes(text: string): string {
  return text.replace(patterns.es6, (match, hex) => {
    const codePoint = parseInt(hex, 16)
    if (codePoint > 0x10ffff) return match
    return String.fromCodePoint(codePoint)
  })
}

function decodeHtmlHexEscapes(text: string): string {
  return text.replace(patterns.htmlHex, (match, hex) => {
    const codePoint = parseInt(hex, 16)
    if (codePoint > 0x10ffff) return match
    return String.fromCodePoint(codePoint)
  })
}

function decodeHtmlDecEscapes(text: string): string {
  return text.replace(patterns.htmlDec, (match, dec) => {
    const codePoint = parseInt(dec, 10)
    if (codePoint > 0x10ffff) return match
    return String.fromCodePoint(codePoint)
  })
}

function decodeUnicodeNotation(text: string): string {
  return text.replace(patterns.unicode, (match, hex) => {
    const codePoint = parseInt(hex, 16)
    if (codePoint > 0x10ffff) return match
    return String.fromCodePoint(codePoint)
  })
}

function decodePythonUEscapes(text: string): string {
  return text.replace(patterns.pythonU, (match, hex) => {
    const codePoint = parseInt(hex, 16)
    if (codePoint > 0x10ffff) return match
    return String.fromCodePoint(codePoint)
  })
}

function decodeHexLiteralEscapes(text: string): string {
  return text.replace(patterns.hexLiteral, (match, hex) => {
    const codePoint = parseInt(hex, 16)
    if (codePoint > 0x10ffff) return match
    return String.fromCodePoint(codePoint)
  })
}

// Decode UTF-8 byte sequences (\xXX or %XX format)
function decodeUtf8ByteSequence(text: string, _pattern: RegExp, prefix: string): string {
  // Find all byte escape sequences and group consecutive ones
  const decoder = new TextDecoder('utf-8', { fatal: false })
  let result = ''
  let i = 0

  while (i < text.length) {
    // Try to match a byte sequence
    const remaining = text.slice(i)
    const match = remaining.match(new RegExp(`^((?:${prefix}[0-9A-Fa-f]{2})+)`, 'i'))

    if (match && match[1]) {
      // Extract all bytes from the sequence
      const byteStr = match[1]
      const bytes: number[] = []
      const bytePattern = new RegExp(`${prefix}([0-9A-Fa-f]{2})`, 'gi')
      let byteMatch

      while ((byteMatch = bytePattern.exec(byteStr)) !== null) {
        bytes.push(parseInt(byteMatch[1]!, 16))
      }

      // Decode bytes as UTF-8
      const decoded = decoder.decode(new Uint8Array(bytes))
      result += decoded
      i += byteStr.length
    } else {
      result += text[i]
      i++
    }
  }

  return result
}

function decodeUtf8HexEscapes(text: string): string {
  return decodeUtf8ByteSequence(text, patterns.utf8Hex, '\\\\x')
}

function decodeUrlEscapes(text: string): string {
  return decodeUtf8ByteSequence(text, patterns.url, '%')
}

export function unescapeUnicode(text: string): string {
  // Apply all decoders in sequence
  let result = text
  // Decode code-point based escapes first
  result = decodeJsEscapes(result)
  result = decodeEs6Escapes(result)
  result = decodeHtmlHexEscapes(result)
  result = decodeHtmlDecEscapes(result)
  result = decodeUnicodeNotation(result)
  result = decodePythonUEscapes(result)
  result = decodeHexLiteralEscapes(result)
  // Decode byte-based escapes
  result = decodeUtf8HexEscapes(result)
  result = decodeUrlEscapes(result)
  return result
}
