import { describe, it, expect } from 'vitest'
import { escapeUnicode, escapeAllUnicode, unescapeUnicode, type EscapeFormat } from './utils'

describe('escapeUnicode', () => {
  describe('js format (\\uXXXX)', () => {
    it('escapes non-ASCII characters', () => {
      expect(escapeUnicode('你好', 'js')).toBe('\\u4F60\\u597D')
      expect(escapeUnicode('café', 'js')).toBe('caf\\u00E9')
      expect(escapeUnicode('Hello 世界', 'js')).toBe('Hello \\u4E16\\u754C')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'js')).toBe('Hello World')
      expect(escapeUnicode('abc123', 'js')).toBe('abc123')
      expect(escapeUnicode('!@#$%^&*()', 'js')).toBe('!@#$%^&*()')
    })

    it('escapes control characters and non-printable ASCII', () => {
      expect(escapeUnicode('\n', 'js')).toBe('\\u000A')
      expect(escapeUnicode('\t', 'js')).toBe('\\u0009')
      expect(escapeUnicode('\r', 'js')).toBe('\\u000D')
    })

    it('handles surrogate pairs for supplementary characters', () => {
      expect(escapeUnicode('😀', 'js')).toBe('\\uD83D\\uDE00')
      expect(escapeUnicode('𝕳', 'js')).toBe('\\uD835\\uDD73')
    })

    it('handles empty string', () => {
      expect(escapeUnicode('', 'js')).toBe('')
    })
  })

  describe('es6 format (\\u{XXXXX})', () => {
    it('escapes non-ASCII characters', () => {
      expect(escapeUnicode('你好', 'es6')).toBe('\\u{4F60}\\u{597D}')
      expect(escapeUnicode('café', 'es6')).toBe('caf\\u{00E9}')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'es6')).toBe('Hello World')
    })

    it('handles supplementary characters without surrogate pairs', () => {
      expect(escapeUnicode('😀', 'es6')).toBe('\\u{1F600}')
      expect(escapeUnicode('𝕳', 'es6')).toBe('\\u{1D573}')
    })
  })

  describe('html-hex format (&#xXXXX;)', () => {
    it('escapes non-ASCII characters', () => {
      expect(escapeUnicode('你好', 'html-hex')).toBe('&#x4F60;&#x597D;')
      expect(escapeUnicode('café', 'html-hex')).toBe('caf&#x00E9;')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'html-hex')).toBe('Hello World')
    })

    it('handles supplementary characters', () => {
      expect(escapeUnicode('😀', 'html-hex')).toBe('&#x1F600;')
    })
  })

  describe('html-dec format (&#DDDD;)', () => {
    it('escapes non-ASCII characters', () => {
      expect(escapeUnicode('你好', 'html-dec')).toBe('&#20320;&#22909;')
      expect(escapeUnicode('café', 'html-dec')).toBe('caf&#233;')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'html-dec')).toBe('Hello World')
    })

    it('handles supplementary characters', () => {
      expect(escapeUnicode('😀', 'html-dec')).toBe('&#128512;')
    })
  })

  describe('unicode format (U+XXXX)', () => {
    it('escapes non-ASCII characters', () => {
      expect(escapeUnicode('你好', 'unicode')).toBe('U+4F60U+597D')
      expect(escapeUnicode('café', 'unicode')).toBe('cafU+00E9')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'unicode')).toBe('Hello World')
    })

    it('handles supplementary characters', () => {
      expect(escapeUnicode('😀', 'unicode')).toBe('U+1F600')
    })
  })

  describe('utf8-hex format (\\xXX)', () => {
    it('escapes non-ASCII characters as UTF-8 bytes', () => {
      expect(escapeUnicode('你好', 'utf8-hex')).toBe('\\xE4\\xBD\\xA0\\xE5\\xA5\\xBD')
      expect(escapeUnicode('café', 'utf8-hex')).toBe('caf\\xC3\\xA9')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'utf8-hex')).toBe('Hello World')
    })

    it('handles supplementary characters', () => {
      expect(escapeUnicode('😀', 'utf8-hex')).toBe('\\xF0\\x9F\\x98\\x80')
    })

    it('escapes control characters', () => {
      expect(escapeUnicode('\n', 'utf8-hex')).toBe('\\x0A')
      expect(escapeUnicode('\t', 'utf8-hex')).toBe('\\x09')
    })
  })

  describe('url format (%XX)', () => {
    it('escapes non-ASCII characters as URL encoding', () => {
      expect(escapeUnicode('你好', 'url')).toBe('%E4%BD%A0%E5%A5%BD')
      expect(escapeUnicode('café', 'url')).toBe('caf%C3%A9')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'url')).toBe('Hello World')
    })

    it('handles supplementary characters', () => {
      expect(escapeUnicode('😀', 'url')).toBe('%F0%9F%98%80')
    })

    it('escapes control characters', () => {
      expect(escapeUnicode('\n', 'url')).toBe('%0A')
      expect(escapeUnicode('\t', 'url')).toBe('%09')
    })
  })

  describe('python-u format (\\UXXXXXXXX)', () => {
    it('escapes non-ASCII characters', () => {
      expect(escapeUnicode('你好', 'python-u')).toBe('\\U00004F60\\U0000597D')
      expect(escapeUnicode('café', 'python-u')).toBe('caf\\U000000E9')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'python-u')).toBe('Hello World')
    })

    it('handles supplementary characters', () => {
      expect(escapeUnicode('😀', 'python-u')).toBe('\\U0001F600')
    })
  })

  describe('hex-literal format (0xXXXX)', () => {
    it('escapes non-ASCII characters', () => {
      expect(escapeUnicode('你好', 'hex-literal')).toBe('0x4F600x597D')
      expect(escapeUnicode('café', 'hex-literal')).toBe('caf0x00E9')
    })

    it('preserves ASCII printable characters', () => {
      expect(escapeUnicode('Hello World', 'hex-literal')).toBe('Hello World')
    })

    it('handles supplementary characters', () => {
      expect(escapeUnicode('😀', 'hex-literal')).toBe('0x1F600')
    })
  })
})

describe('escapeAllUnicode', () => {
  describe('js format', () => {
    it('escapes all characters including ASCII', () => {
      expect(escapeAllUnicode('Hello', 'js')).toBe('\\u0048\\u0065\\u006C\\u006C\\u006F')
      expect(escapeAllUnicode('abc', 'js')).toBe('\\u0061\\u0062\\u0063')
    })

    it('escapes non-ASCII characters', () => {
      expect(escapeAllUnicode('你好', 'js')).toBe('\\u4F60\\u597D')
    })

    it('handles surrogate pairs', () => {
      expect(escapeAllUnicode('😀', 'js')).toBe('\\uD83D\\uDE00')
    })

    it('handles empty string', () => {
      expect(escapeAllUnicode('', 'js')).toBe('')
    })
  })

  describe('es6 format', () => {
    it('escapes all characters including ASCII', () => {
      expect(escapeAllUnicode('Hi', 'es6')).toBe('\\u{0048}\\u{0069}')
    })

    it('handles supplementary characters', () => {
      expect(escapeAllUnicode('😀', 'es6')).toBe('\\u{1F600}')
    })
  })

  describe('html-hex format', () => {
    it('escapes all characters including ASCII', () => {
      expect(escapeAllUnicode('Hi', 'html-hex')).toBe('&#x0048;&#x0069;')
    })
  })

  describe('html-dec format', () => {
    it('escapes all characters including ASCII', () => {
      expect(escapeAllUnicode('Hi', 'html-dec')).toBe('&#72;&#105;')
    })
  })

  describe('unicode format', () => {
    it('escapes all characters including ASCII', () => {
      expect(escapeAllUnicode('Hi', 'unicode')).toBe('U+0048U+0069')
    })
  })

  describe('utf8-hex format', () => {
    it('escapes all characters as UTF-8 bytes', () => {
      expect(escapeAllUnicode('Hi', 'utf8-hex')).toBe('\\x48\\x69')
      expect(escapeAllUnicode('你', 'utf8-hex')).toBe('\\xE4\\xBD\\xA0')
    })
  })

  describe('url format', () => {
    it('escapes all characters as URL encoding', () => {
      expect(escapeAllUnicode('Hi', 'url')).toBe('%48%69')
      expect(escapeAllUnicode('你', 'url')).toBe('%E4%BD%A0')
    })
  })

  describe('python-u format', () => {
    it('escapes all characters', () => {
      expect(escapeAllUnicode('Hi', 'python-u')).toBe('\\U00000048\\U00000069')
    })
  })

  describe('hex-literal format', () => {
    it('escapes all characters', () => {
      expect(escapeAllUnicode('Hi', 'hex-literal')).toBe('0x00480x0069')
    })
  })
})

describe('unescapeUnicode', () => {
  describe('js format decoding', () => {
    it('decodes \\uXXXX escapes', () => {
      expect(unescapeUnicode('\\u4F60\\u597D')).toBe('你好')
      expect(unescapeUnicode('caf\\u00E9')).toBe('café')
      expect(unescapeUnicode('Hello \\u4E16\\u754C')).toBe('Hello 世界')
    })

    it('decodes surrogate pairs', () => {
      expect(unescapeUnicode('\\uD83D\\uDE00')).toBe('😀')
      expect(unescapeUnicode('\\uD835\\uDD73')).toBe('𝕳')
    })

    it('keeps high surrogates when the next escape is not a low surrogate', () => {
      expect(unescapeUnicode('\\uD83D\\u0041')).toBe('\ud83dA')
    })

    it('preserves regular text', () => {
      expect(unescapeUnicode('Hello World')).toBe('Hello World')
    })

    it('handles mixed escaped and unescaped text', () => {
      expect(unescapeUnicode('Hello \\u4E16\\u754C World')).toBe('Hello 世界 World')
    })
  })

  describe('es6 format decoding', () => {
    it('decodes \\u{XXXXX} escapes', () => {
      expect(unescapeUnicode('\\u{4F60}\\u{597D}')).toBe('你好')
      expect(unescapeUnicode('caf\\u{E9}')).toBe('café')
    })

    it('decodes supplementary characters', () => {
      expect(unescapeUnicode('\\u{1F600}')).toBe('😀')
      expect(unescapeUnicode('\\u{1D573}')).toBe('𝕳')
    })
  })

  describe('html-hex format decoding', () => {
    it('decodes &#xXXXX; escapes', () => {
      expect(unescapeUnicode('&#x4F60;&#x597D;')).toBe('你好')
      expect(unescapeUnicode('caf&#xE9;')).toBe('café')
    })

    it('handles case insensitive hex', () => {
      expect(unescapeUnicode('&#x4f60;&#X597D;')).toBe('你好')
    })

    it('decodes supplementary characters', () => {
      expect(unescapeUnicode('&#x1F600;')).toBe('😀')
    })
  })

  describe('html-dec format decoding', () => {
    it('decodes &#DDDD; escapes', () => {
      expect(unescapeUnicode('&#20320;&#22909;')).toBe('你好')
      expect(unescapeUnicode('caf&#233;')).toBe('café')
    })

    it('decodes supplementary characters', () => {
      expect(unescapeUnicode('&#128512;')).toBe('😀')
    })
  })

  describe('unicode notation decoding', () => {
    it('decodes U+XXXX notation', () => {
      // Spaces are preserved as literal spaces, not consumed as separators
      expect(unescapeUnicode('U+4F60 U+597D')).toBe('你 好')
      expect(unescapeUnicode('U+4F60U+597D')).toBe('你好')
      expect(unescapeUnicode('cafU+00E9')).toBe('café')
    })

    it('handles case insensitive', () => {
      expect(unescapeUnicode('u+4f60 u+597d')).toBe('你 好')
      expect(unescapeUnicode('u+4f60u+597d')).toBe('你好')
    })

    it('decodes supplementary characters', () => {
      expect(unescapeUnicode('U+1F600')).toBe('😀')
    })
  })

  describe('utf8-hex format decoding', () => {
    it('decodes \\xXX byte sequences', () => {
      expect(unescapeUnicode('\\xE4\\xBD\\xA0\\xE5\\xA5\\xBD')).toBe('你好')
      expect(unescapeUnicode('caf\\xC3\\xA9')).toBe('café')
    })

    it('decodes supplementary characters', () => {
      expect(unescapeUnicode('\\xF0\\x9F\\x98\\x80')).toBe('😀')
    })

    it('handles mixed escaped and unescaped', () => {
      expect(unescapeUnicode('Hello \\xE4\\xB8\\x96')).toBe('Hello 世')
    })
  })

  describe('url format decoding', () => {
    it('decodes %XX byte sequences', () => {
      expect(unescapeUnicode('%E4%BD%A0%E5%A5%BD')).toBe('你好')
      expect(unescapeUnicode('caf%C3%A9')).toBe('café')
    })

    it('decodes supplementary characters', () => {
      expect(unescapeUnicode('%F0%9F%98%80')).toBe('😀')
    })

    it('handles mixed escaped and unescaped', () => {
      expect(unescapeUnicode('Hello%20World')).toBe('Hello World')
    })
  })

  describe('python-u format decoding', () => {
    it('decodes \\UXXXXXXXX escapes', () => {
      expect(unescapeUnicode('\\U00004F60\\U0000597D')).toBe('你好')
      expect(unescapeUnicode('caf\\U000000E9')).toBe('café')
    })

    it('decodes supplementary characters', () => {
      expect(unescapeUnicode('\\U0001F600')).toBe('😀')
    })
  })

  describe('hex-literal format decoding', () => {
    it('decodes 0xXXXX literals', () => {
      // Spaces are preserved as literal spaces, not consumed as separators
      expect(unescapeUnicode('0x4F60 0x597D')).toBe('你 好')
      expect(unescapeUnicode('caf0x00E9')).toBe('café')
      // Note: Consecutive hex literals without spaces are ambiguous
      // (e.g., '0x4F600x597D' could be parsed as one long hex or two separate)
    })

    it('handles case insensitive hex digits', () => {
      // The 'x' must be lowercase, but hex digits can be upper or lowercase
      expect(unescapeUnicode('0x4f60 0x597D')).toBe('你 好')
      expect(unescapeUnicode('0x4F60 0x597d')).toBe('你 好')
    })

    it('decodes supplementary characters', () => {
      expect(unescapeUnicode('0x1F600')).toBe('😀')
    })
  })

  describe('mixed format decoding', () => {
    it('decodes multiple formats in same string', () => {
      const mixed = '\\u4F60 &#x597D; &#20320; U+597D'
      expect(unescapeUnicode(mixed)).toBe('你 好 你 好')
    })

    it('handles complex mixed content', () => {
      const mixed = 'Hello \\u4E16\\u754C &#x0021; %E4%BD%A0'
      expect(unescapeUnicode(mixed)).toBe('Hello 世界 ! 你')
    })
  })

  describe('edge cases', () => {
    it('handles empty string', () => {
      expect(unescapeUnicode('')).toBe('')
    })

    it('preserves invalid escape sequences', () => {
      expect(unescapeUnicode('\\uGGGG')).toBe('\\uGGGG')
      expect(unescapeUnicode('&#xGGGG;')).toBe('&#xGGGG;')
    })

    it('handles incomplete UTF-8 byte sequences gracefully', () => {
      expect(unescapeUnicode('\\u4F')).toBe('\\u4F')
      // Incomplete UTF-8 sequences are decoded with replacement character
      const result = unescapeUnicode('%E4%BD')
      expect(result.length).toBeGreaterThan(0)
    })

    it('rejects code points beyond valid Unicode range', () => {
      expect(unescapeUnicode('\\u{110000}')).toBe('\\u{110000}')
      expect(unescapeUnicode('&#x110000;')).toBe('&#x110000;')
      expect(unescapeUnicode('&#1114112;')).toBe('&#1114112;')
      expect(unescapeUnicode('U+110000')).toBe('U+110000')
      expect(unescapeUnicode('\\U00110000')).toBe('\\U00110000')
      expect(unescapeUnicode('0x110000')).toBe('0x110000')
    })
  })
})

describe('round-trip encoding/decoding', () => {
  const testCases = [
    'Hello World',
    '你好世界',
    'café',
    '日本語',
    'Привет',
    'مرحبا',
    '😀😃😄',
    'Mixed 混合 text 123',
    '!@#$%^&*()',
    '\n\t\r',
  ]

  // Formats that are fully round-trippable
  const roundTrippableFormats: EscapeFormat[] = [
    'js',
    'es6',
    'html-hex',
    'html-dec',
    'utf8-hex',
    'url',
    'python-u',
  ]

  // unicode and hex-literal formats require spaces between consecutive escapes for decoding
  // so they're not round-trippable for arbitrary text

  describe('escapeUnicode round-trip', () => {
    for (const format of roundTrippableFormats) {
      it(`unescape(escape(text, '${format}')) returns original`, () => {
        for (const text of testCases) {
          const escaped = escapeUnicode(text, format)
          const unescaped = unescapeUnicode(escaped)
          expect(unescaped).toBe(text)
        }
      })
    }
  })

  describe('escapeAllUnicode round-trip', () => {
    for (const format of roundTrippableFormats) {
      it(`unescape(escapeAll(text, '${format}')) returns original`, () => {
        for (const text of testCases) {
          const escaped = escapeAllUnicode(text, format)
          const unescaped = unescapeUnicode(escaped)
          expect(unescaped).toBe(text)
        }
      })
    }
  })

  describe('specific format pairs', () => {
    it('js format is reversible', () => {
      const text = 'Hello 世界 😀'
      expect(unescapeUnicode(escapeUnicode(text, 'js'))).toBe(text)
      expect(unescapeUnicode(escapeAllUnicode(text, 'js'))).toBe(text)
    })

    it('utf8-hex format is reversible', () => {
      const text = 'Hello 世界 😀'
      expect(unescapeUnicode(escapeUnicode(text, 'utf8-hex'))).toBe(text)
      expect(unescapeUnicode(escapeAllUnicode(text, 'utf8-hex'))).toBe(text)
    })

    it('html formats are reversible', () => {
      const text = 'Hello 世界 😀'
      expect(unescapeUnicode(escapeUnicode(text, 'html-hex'))).toBe(text)
      expect(unescapeUnicode(escapeUnicode(text, 'html-dec'))).toBe(text)
    })
  })
})

describe('special characters and edge cases', () => {
  it('handles zero-width characters', () => {
    const zwj = '\u200D' // Zero-width joiner
    const escaped = escapeUnicode(zwj, 'js')
    expect(escaped).toBe('\\u200D')
    expect(unescapeUnicode(escaped)).toBe(zwj)
  })

  it('handles combining characters', () => {
    const text = 'e\u0301' // e with combining acute accent
    const escaped = escapeUnicode(text, 'js')
    expect(escaped).toBe('e\\u0301')
    expect(unescapeUnicode(escaped)).toBe(text)
  })

  it('handles right-to-left marks', () => {
    const rtl = '\u200F' // Right-to-left mark
    const escaped = escapeUnicode(rtl, 'js')
    expect(escaped).toBe('\\u200F')
    expect(unescapeUnicode(escaped)).toBe(rtl)
  })

  it('handles emoji with skin tone modifiers', () => {
    const emoji = '👋🏽' // Waving hand with medium skin tone
    const escaped = escapeUnicode(emoji, 'js')
    expect(unescapeUnicode(escaped)).toBe(emoji)
  })

  it('handles multiple consecutive supplementary characters', () => {
    const emojis = '😀😃😄😁'
    const escaped = escapeUnicode(emojis, 'js')
    expect(unescapeUnicode(escaped)).toBe(emojis)
  })

  it('handles BMP boundary characters', () => {
    const text = '\uFFFF' // Highest BMP character
    const escaped = escapeUnicode(text, 'js')
    expect(escaped).toBe('\\uFFFF')
    expect(unescapeUnicode(escaped)).toBe(text)
  })

  it('handles null character', () => {
    const text = '\u0000'
    const escaped = escapeUnicode(text, 'js')
    expect(escaped).toBe('\\u0000')
    expect(unescapeUnicode(escaped)).toBe(text)
  })
})
