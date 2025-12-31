import { describe, it, expect } from 'vitest'
import { rot, type RotType } from './utils'

describe('ROT13', () => {
  it('converts uppercase letters', () => {
    expect(rot('HELLO', 'rot13')).toBe('URYYB')
    expect(rot('WORLD', 'rot13')).toBe('JBEYQ')
    expect(rot('ABC', 'rot13')).toBe('NOP')
    expect(rot('XYZ', 'rot13')).toBe('KLM')
  })

  it('converts lowercase letters', () => {
    expect(rot('hello', 'rot13')).toBe('uryyb')
    expect(rot('world', 'rot13')).toBe('jbeyq')
    expect(rot('abc', 'rot13')).toBe('nop')
    expect(rot('xyz', 'rot13')).toBe('klm')
  })

  it('preserves non-letter characters', () => {
    expect(rot('Hello, World!', 'rot13')).toBe('Uryyb, Jbeyq!')
    expect(rot('123', 'rot13')).toBe('123')
    expect(rot('!@#$%', 'rot13')).toBe('!@#$%')
  })

  it('is self-reversing', () => {
    const testCases = ['Hello', 'WORLD', 'Test 123!', 'abc XYZ']
    for (const text of testCases) {
      expect(rot(rot(text, 'rot13'), 'rot13')).toBe(text)
    }
  })

  it('handles empty string', () => {
    expect(rot('', 'rot13')).toBe('')
  })
})

describe('ROT5', () => {
  it('converts digits', () => {
    expect(rot('12345', 'rot5')).toBe('67890')
    expect(rot('67890', 'rot5')).toBe('12345')
    expect(rot('0', 'rot5')).toBe('5')
    expect(rot('9', 'rot5')).toBe('4')
  })

  it('preserves non-digit characters', () => {
    expect(rot('Hello 123', 'rot5')).toBe('Hello 678')
    expect(rot('abc', 'rot5')).toBe('abc')
    expect(rot('!@#', 'rot5')).toBe('!@#')
  })

  it('is self-reversing', () => {
    const testCases = ['12345', '67890', '0123456789']
    for (const text of testCases) {
      expect(rot(rot(text, 'rot5'), 'rot5')).toBe(text)
    }
  })

  it('handles empty string', () => {
    expect(rot('', 'rot5')).toBe('')
  })
})

describe('ROT18', () => {
  it('converts letters with ROT13', () => {
    expect(rot('HELLO', 'rot18')).toBe('URYYB')
    expect(rot('hello', 'rot18')).toBe('uryyb')
  })

  it('converts digits with ROT5', () => {
    expect(rot('12345', 'rot18')).toBe('67890')
  })

  it('converts both letters and digits', () => {
    expect(rot('Hello 12345', 'rot18')).toBe('Uryyb 67890')
    expect(rot('ABC123', 'rot18')).toBe('NOP678')
  })

  it('preserves special characters', () => {
    expect(rot('Hello, World! 123', 'rot18')).toBe('Uryyb, Jbeyq! 678')
  })

  it('is self-reversing', () => {
    const testCases = ['Hello 123', 'ABC 456 XYZ', 'Test!']
    for (const text of testCases) {
      expect(rot(rot(text, 'rot18'), 'rot18')).toBe(text)
    }
  })

  it('handles empty string', () => {
    expect(rot('', 'rot18')).toBe('')
  })
})

describe('ROT47', () => {
  it('converts letters', () => {
    expect(rot('Hello', 'rot47')).toBe('w6==@')
    expect(rot('WORLD', 'rot47')).toBe('(~#{s')
  })

  it('converts digits', () => {
    expect(rot('12345', 'rot47')).toBe('`abcd')
  })

  it('converts special characters', () => {
    expect(rot('!', 'rot47')).toBe('P')
    expect(rot('~', 'rot47')).toBe('O')
  })

  it('preserves space and control characters', () => {
    expect(rot('Hello World', 'rot47')).toBe('w6==@ (@C=5')
    expect(rot('A B', 'rot47')).toBe('p q')
  })

  it('is self-reversing', () => {
    const testCases = ['Hello, World!', 'Test@123', 'abc XYZ 789', '!@#$%^&*()']
    for (const text of testCases) {
      expect(rot(rot(text, 'rot47'), 'rot47')).toBe(text)
    }
  })

  it('handles empty string', () => {
    expect(rot('', 'rot47')).toBe('')
  })
})

describe('round-trip conversions', () => {
  const allTypes: RotType[] = ['rot13', 'rot5', 'rot18', 'rot47']

  it('all ROT types are self-reversing', () => {
    const text = 'Hello, World! 12345'
    for (const type of allTypes) {
      expect(rot(rot(text, type), type)).toBe(text)
    }
  })
})
