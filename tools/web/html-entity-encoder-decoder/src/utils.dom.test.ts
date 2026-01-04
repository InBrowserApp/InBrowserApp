import { describe, it, expect } from 'vitest'
import { encodeHtmlEntities, decodeHtmlEntities } from './utils'

describe('encodeHtmlEntities', () => {
  describe('named format', () => {
    it('encodes basic HTML characters with named entities', () => {
      expect(encodeHtmlEntities('<div>', 'named', 'minimal')).toBe('&lt;div&gt;')
      expect(encodeHtmlEntities('&', 'named', 'minimal')).toBe('&amp;')
      expect(encodeHtmlEntities('"test"', 'named', 'minimal')).toBe('&quot;test&quot;')
      expect(encodeHtmlEntities("it's", 'named', 'minimal')).toBe('it&apos;s')
    })

    it('preserves regular text with minimal range', () => {
      expect(encodeHtmlEntities('Hello World', 'named', 'minimal')).toBe('Hello World')
      expect(encodeHtmlEntities('123', 'named', 'minimal')).toBe('123')
    })

    it('encodes non-ASCII with non-ascii range', () => {
      expect(encodeHtmlEntities('Hello 中文', 'named', 'non-ascii')).toBe('Hello &#20013;&#25991;')
      expect(encodeHtmlEntities('café', 'named', 'non-ascii')).toBe('caf&#233;')
    })

    it('uses named entities for common symbols', () => {
      expect(encodeHtmlEntities('©', 'named', 'non-ascii')).toBe('&copy;')
      expect(encodeHtmlEntities('®', 'named', 'non-ascii')).toBe('&reg;')
      expect(encodeHtmlEntities('™', 'named', 'non-ascii')).toBe('&trade;')
      expect(encodeHtmlEntities('€', 'named', 'non-ascii')).toBe('&euro;')
    })
  })

  describe('decimal format', () => {
    it('encodes with decimal entities', () => {
      expect(encodeHtmlEntities('<', 'decimal', 'minimal')).toBe('&#60;')
      expect(encodeHtmlEntities('>', 'decimal', 'minimal')).toBe('&#62;')
      expect(encodeHtmlEntities('&', 'decimal', 'minimal')).toBe('&#38;')
    })

    it('encodes Unicode characters', () => {
      expect(encodeHtmlEntities('中', 'decimal', 'non-ascii')).toBe('&#20013;')
      expect(encodeHtmlEntities('日本語', 'decimal', 'non-ascii')).toBe('&#26085;&#26412;&#35486;')
    })
  })

  describe('hex format', () => {
    it('encodes with hexadecimal entities', () => {
      expect(encodeHtmlEntities('<', 'hex', 'minimal')).toBe('&#x3C;')
      expect(encodeHtmlEntities('>', 'hex', 'minimal')).toBe('&#x3E;')
      expect(encodeHtmlEntities('&', 'hex', 'minimal')).toBe('&#x26;')
    })

    it('encodes Unicode characters in hex', () => {
      expect(encodeHtmlEntities('中', 'hex', 'non-ascii')).toBe('&#x4E2D;')
    })
  })

  describe('all-special range', () => {
    it('encodes all non-alphanumeric characters', () => {
      expect(encodeHtmlEntities('Hello!', 'named', 'all-special')).toBe('Hello&#33;')
      expect(encodeHtmlEntities('a@b.c', 'decimal', 'all-special')).toBe('a&#64;b&#46;c')
    })

    it('preserves alphanumeric and space', () => {
      expect(encodeHtmlEntities('Hello World 123', 'named', 'all-special')).toBe('Hello World 123')
    })
  })

  it('handles empty string', () => {
    expect(encodeHtmlEntities('', 'named', 'minimal')).toBe('')
  })
})

describe('decodeHtmlEntities', () => {
  describe('named entities', () => {
    it('decodes common named entities', () => {
      expect(decodeHtmlEntities('&lt;')).toBe('<')
      expect(decodeHtmlEntities('&gt;')).toBe('>')
      expect(decodeHtmlEntities('&amp;')).toBe('&')
      expect(decodeHtmlEntities('&quot;')).toBe('"')
      expect(decodeHtmlEntities('&apos;')).toBe("'")
    })

    it('decodes symbol entities', () => {
      expect(decodeHtmlEntities('&copy;')).toBe('©')
      expect(decodeHtmlEntities('&reg;')).toBe('®')
      expect(decodeHtmlEntities('&trade;')).toBe('™')
      expect(decodeHtmlEntities('&euro;')).toBe('€')
      expect(decodeHtmlEntities('&nbsp;')).toBe('\u00A0')
    })

    it('preserves unknown named entities', () => {
      expect(decodeHtmlEntities('&unknown;')).toBe('&unknown;')
    })
  })

  describe('decimal entities', () => {
    it('decodes decimal entities', () => {
      expect(decodeHtmlEntities('&#60;')).toBe('<')
      expect(decodeHtmlEntities('&#62;')).toBe('>')
      expect(decodeHtmlEntities('&#38;')).toBe('&')
    })

    it('decodes Unicode decimal entities', () => {
      expect(decodeHtmlEntities('&#20013;')).toBe('中')
      expect(decodeHtmlEntities('&#128512;')).toBe('😀')
    })
  })

  describe('hexadecimal entities', () => {
    it('decodes hex entities (lowercase)', () => {
      expect(decodeHtmlEntities('&#x3c;')).toBe('<')
      expect(decodeHtmlEntities('&#x3e;')).toBe('>')
    })

    it('decodes hex entities (uppercase)', () => {
      expect(decodeHtmlEntities('&#x3C;')).toBe('<')
      expect(decodeHtmlEntities('&#x3E;')).toBe('>')
    })

    it('decodes Unicode hex entities', () => {
      expect(decodeHtmlEntities('&#x4E2D;')).toBe('中')
      expect(decodeHtmlEntities('&#x1F600;')).toBe('😀')
    })
  })

  describe('mixed content', () => {
    it('decodes mixed entity types', () => {
      expect(decodeHtmlEntities('&lt;div&gt;&#60;span&#x3E;')).toBe('<div><span>')
    })

    it('preserves regular text', () => {
      expect(decodeHtmlEntities('Hello World')).toBe('Hello World')
    })

    it('handles complex HTML', () => {
      expect(decodeHtmlEntities('&lt;div class=&quot;test&quot;&gt;')).toBe('<div class="test">')
    })
  })

  it('handles empty string', () => {
    expect(decodeHtmlEntities('')).toBe('')
  })
})

describe('round-trip encoding/decoding', () => {
  it('decode(encode(text)) returns original for minimal', () => {
    const testCases = ['<div>', 'Hello & World', '"quotes"', "it's ok"]
    for (const text of testCases) {
      expect(decodeHtmlEntities(encodeHtmlEntities(text, 'named', 'minimal'))).toBe(text)
      expect(decodeHtmlEntities(encodeHtmlEntities(text, 'decimal', 'minimal'))).toBe(text)
      expect(decodeHtmlEntities(encodeHtmlEntities(text, 'hex', 'minimal'))).toBe(text)
    }
  })

  it('decode(encode(text)) returns original for non-ascii', () => {
    const testCases = ['Hello 中文', '日本語テスト', 'Café © 2024']
    for (const text of testCases) {
      expect(decodeHtmlEntities(encodeHtmlEntities(text, 'named', 'non-ascii'))).toBe(text)
      expect(decodeHtmlEntities(encodeHtmlEntities(text, 'decimal', 'non-ascii'))).toBe(text)
      expect(decodeHtmlEntities(encodeHtmlEntities(text, 'hex', 'non-ascii'))).toBe(text)
    }
  })
})
