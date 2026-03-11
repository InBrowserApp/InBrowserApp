import { describe, expect, it } from 'vitest'
import {
  maskDotenvValue,
  normalizeDotenv,
  parseDotenv,
  parseDotenvToJson,
  serializeDotenv,
  toDotenvObject,
} from '.'

describe('@utils/dotenv', () => {
  it('parses comments, entries, and duplicates in compatible mode', () => {
    const result = parseDotenv(
      '# heading\nexport API_KEY = "abc 123" # note\nEMPTY=\nAPI_KEY=override\nVALUE=abc # trailing',
    )

    expect(result.stats.entryCount).toBe(4)
    expect(result.stats.commentCount).toBe(1)
    expect(result.stats.duplicateCount).toBe(1)
    expect(result.entries.map((entry) => [entry.key, entry.active])).toEqual([
      ['API_KEY', false],
      ['EMPTY', true],
      ['API_KEY', true],
      ['VALUE', true],
    ])
    expect(result.entries[0]?.inlineComment).toBe('note')
    expect(result.entries[0]?.value).toBe('abc 123')
    expect(result.object).toEqual({
      API_KEY: 'override',
      EMPTY: '',
      VALUE: 'abc',
    })
    expect(
      result.diagnostics.find((diagnostic) => diagnostic.code === 'duplicate_key')?.severity,
    ).toBe('warning')
  })

  it('supports first-wins duplicate resolution', () => {
    const result = parseDotenv('A=1\nA=2\nA=3', { duplicateStrategy: 'first-wins' })

    expect(result.object).toEqual({ A: '1' })
    expect(result.entries.map((entry) => entry.active)).toEqual([true, false, false])
  })

  it('handles quoted values and escape sequences', () => {
    const result = parseDotenv(
      'DOUBLE="hello\\nworld"\nSINGLE=\'literal # value\'\nHASH=#not-comment',
    )

    expect(result.object).toEqual({
      DOUBLE: 'hello\nworld',
      SINGLE: 'literal # value',
      HASH: '#not-comment',
    })
    expect(result.entries.map((entry) => entry.quote)).toEqual(['double', 'single', 'none'])
  })

  it('reports invalid lines and strict-mode whitespace errors', () => {
    const result = parseDotenv(' BAD=1\nMISSING\nKEY = value\nBROKEN="unterminated', {
      mode: 'strict',
    })

    expect(result.stats.invalidLineCount).toBe(4)
    expect(result.entries).toEqual([])
    expect(result.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      'unexpected_whitespace',
      'missing_equals',
      'unexpected_whitespace',
      'unclosed_quote',
    ])
  })

  it('normalizes, serializes, and masks active entries', () => {
    const result = parseDotenv('A=1\nB="two words"\nA=3')

    expect(normalizeDotenv('A=1\nB="two words"\nA=3')).toBe('B="two words"\nA=3')
    expect(serializeDotenv(result.entries, { maskValues: true })).toBe('B="••••••"\nA=••••••')
    expect(maskDotenvValue('secret')).toBe('••••••')
    expect(maskDotenvValue('')).toBe('')
    expect(toDotenvObject(result.entries, { maskValues: true })).toEqual({
      B: '••••••',
      A: '••••••',
    })
    expect(parseDotenvToJson('A=1\nB=2')).toBe('{\n  "A": "1",\n  "B": "2"\n}')
  })

  it('returns empty results for empty input and trims BOM/CRLF', () => {
    expect(parseDotenv('').stats).toEqual({
      entryCount: 0,
      resolvedCount: 0,
      duplicateCount: 0,
      invalidLineCount: 0,
      commentCount: 0,
      emptyLineCount: 0,
    })

    const result = parseDotenv('\uFEFFA=1\r\nB=2\r\n')
    expect(result.object).toEqual({ A: '1', B: '2' })
    expect(result.stats.emptyLineCount).toBe(1)
  })
})
