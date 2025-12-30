import { describe, it, expect } from 'vitest'
import { textToMorse, morseToText, isValidMorse, CHAR_TO_MORSE, MORSE_TO_CHAR } from './morse'

describe('CHAR_TO_MORSE and MORSE_TO_CHAR mappings', () => {
  it('has all letters A-Z', () => {
    for (let i = 65; i <= 90; i++) {
      const char = String.fromCharCode(i)
      expect(CHAR_TO_MORSE[char]).toBeDefined()
    }
  })

  it('has all digits 0-9', () => {
    for (let i = 0; i <= 9; i++) {
      expect(CHAR_TO_MORSE[String(i)]).toBeDefined()
    }
  })

  it('has reverse mapping that matches', () => {
    for (const [char, morse] of Object.entries(CHAR_TO_MORSE)) {
      expect(MORSE_TO_CHAR[morse]).toBe(char)
    }
  })
})

describe('textToMorse', () => {
  it('converts single letters', () => {
    expect(textToMorse('A')).toBe('.-')
    expect(textToMorse('E')).toBe('.')
    expect(textToMorse('T')).toBe('-')
    expect(textToMorse('S')).toBe('...')
    expect(textToMorse('O')).toBe('---')
  })

  it('converts words with spaces between letters', () => {
    expect(textToMorse('SOS')).toBe('... --- ...')
    expect(textToMorse('HELLO')).toBe('.... . .-.. .-.. ---')
  })

  it('converts multiple words with / separator', () => {
    expect(textToMorse('HELLO WORLD')).toBe('.... . .-.. .-.. --- / .-- --- .-. .-.. -..')
    expect(textToMorse('A B')).toBe('.- / -...')
  })

  it('handles lowercase input', () => {
    expect(textToMorse('hello')).toBe('.... . .-.. .-.. ---')
    expect(textToMorse('Hello World')).toBe('.... . .-.. .-.. --- / .-- --- .-. .-.. -..')
  })

  it('converts numbers', () => {
    expect(textToMorse('123')).toBe('.---- ..--- ...--')
    expect(textToMorse('0')).toBe('-----')
    expect(textToMorse('2024')).toBe('..--- ----- ..--- ....-')
  })

  it('converts punctuation', () => {
    expect(textToMorse('.')).toBe('.-.-.-')
    expect(textToMorse(',')).toBe('--..--')
    expect(textToMorse('?')).toBe('..--..')
    expect(textToMorse('!')).toBe('-.-.--')
  })

  it('handles mixed content', () => {
    expect(textToMorse('SOS!')).toBe('... --- ... -.-.--')
    expect(textToMorse('HELLO, WORLD!')).toBe('.... . .-.. .-.. --- --..-- / .-- --- .-. .-.. -.. -.-.--')
  })

  it('ignores unsupported characters', () => {
    expect(textToMorse('A#B')).toBe('.- -...')
    expect(textToMorse('HELLO~WORLD')).toBe('.... . .-.. .-.. --- .-- --- .-. .-.. -..')
  })

  it('handles empty string', () => {
    expect(textToMorse('')).toBe('')
  })
})

describe('morseToText', () => {
  it('converts single morse codes', () => {
    expect(morseToText('.-')).toBe('A')
    expect(morseToText('.')).toBe('E')
    expect(morseToText('-')).toBe('T')
    expect(morseToText('...')).toBe('S')
    expect(morseToText('---')).toBe('O')
  })

  it('converts morse codes with space separation', () => {
    expect(morseToText('... --- ...')).toBe('SOS')
    expect(morseToText('.... . .-.. .-.. ---')).toBe('HELLO')
  })

  it('converts multiple words with / separator', () => {
    expect(morseToText('.... . .-.. .-.. --- / .-- --- .-. .-.. -..')).toBe('HELLO WORLD')
    expect(morseToText('.- / -...')).toBe('A B')
  })

  it('handles multiple spaces as word separator', () => {
    expect(morseToText('.-   -...')).toBe('A B')
    expect(morseToText('... --- ...   ... --- ...')).toBe('SOS SOS')
  })

  it('converts numbers', () => {
    expect(morseToText('.---- ..--- ...--')).toBe('123')
    expect(morseToText('-----')).toBe('0')
  })

  it('converts punctuation', () => {
    expect(morseToText('.-.-.-')).toBe('.')
    expect(morseToText('--..--')).toBe(',')
    expect(morseToText('..--..')).toBe('?')
  })

  it('handles leading/trailing whitespace', () => {
    expect(morseToText('  ... --- ...  ')).toBe('SOS')
    expect(morseToText('\n.- -...\n')).toBe('AB')
  })

  it('handles empty string', () => {
    expect(morseToText('')).toBe('')
    expect(morseToText('   ')).toBe('')
  })

  it('ignores invalid morse codes', () => {
    expect(morseToText('.- .------- -...')).toBe('AB')
  })
})

describe('isValidMorse', () => {
  it('returns true for valid single morse codes', () => {
    expect(isValidMorse('.-')).toBe(true)
    expect(isValidMorse('.')).toBe(true)
    expect(isValidMorse('-')).toBe(true)
    expect(isValidMorse('...')).toBe(true)
    expect(isValidMorse('---')).toBe(true)
  })

  it('returns true for valid morse sequences', () => {
    expect(isValidMorse('... --- ...')).toBe(true)
    expect(isValidMorse('.... . .-.. .-.. ---')).toBe(true)
    expect(isValidMorse('.... . .-.. .-.. --- / .-- --- .-. .-.. -..')).toBe(true)
  })

  it('returns true for empty or whitespace only', () => {
    expect(isValidMorse('')).toBe(true)
    expect(isValidMorse('   ')).toBe(true)
  })

  it('returns false for invalid morse codes', () => {
    expect(isValidMorse('.-.-.-.-.-')).toBe(false)
    expect(isValidMorse('........')).toBe(false)
    expect(isValidMorse('------')).toBe(false)
  })

  it('returns false for non-morse characters', () => {
    expect(isValidMorse('abc')).toBe(false)
    expect(isValidMorse('123')).toBe(false)
    expect(isValidMorse('.- abc -...')).toBe(false)
  })

  it('validates mixed valid morse codes', () => {
    expect(isValidMorse('.---- ..--- ...--')).toBe(true)
    expect(isValidMorse('.-.-.- --..--')).toBe(true)
  })
})

describe('round-trip conversion', () => {
  it('text -> morse -> text preserves content', () => {
    const testCases = ['HELLO', 'WORLD', 'SOS', 'HELLO WORLD', '123', 'A B C']
    for (const text of testCases) {
      expect(morseToText(textToMorse(text))).toBe(text)
    }
  })

  it('morse -> text -> morse preserves content', () => {
    const testCases = [
      '... --- ...',
      '.... . .-.. .-.. ---',
      '.... . .-.. .-.. --- / .-- --- .-. .-.. -..',
      '.---- ..--- ...--',
    ]
    for (const morse of testCases) {
      expect(textToMorse(morseToText(morse))).toBe(morse)
    }
  })
})
