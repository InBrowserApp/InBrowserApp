import { describe, expect, it } from 'vitest'
import {
  formatXmlString,
  getXmlErrorContext,
  getXmlIndentation,
  getXmlLineSeparator,
  validateXml,
} from './xml'

describe('xml utilities', () => {
  it('returns indentation tokens and line separators', () => {
    expect(getXmlIndentation('2-spaces')).toBe('  ')
    expect(getXmlIndentation('4-spaces')).toBe('    ')
    expect(getXmlIndentation('tab')).toBe('\t')
    expect(getXmlLineSeparator('lf')).toBe('\n')
    expect(getXmlLineSeparator('crlf')).toBe('\r\n')
  })

  it('validates well-formed xml', () => {
    expect(validateXml('<root><item>Hello</item></root>')).toEqual({ valid: true })
  })

  it('returns detailed validation errors for malformed xml', () => {
    expect(validateXml('<root><item></root>')).toEqual({
      valid: false,
      code: 'InvalidTag',
      message:
        "Expected closing tag 'item' (opened in line 1, col 7) instead of closing tag 'root'.",
      line: 1,
      column: 13,
    })
  })

  it('builds an error context snippet with a caret marker', () => {
    expect(getXmlErrorContext('<root>\n  <item>\n</root>', 2, 5)).toBe(
      ['1 | <root>', '2 |   <item>', '  |     ^', '3 | </root>'].join('\n'),
    )
  })

  it('formats xml with requested options', () => {
    const formatted = formatXmlString('<?xml version="1.0"?><root><empty></empty></root>', {
      collapseContent: true,
      forceSelfClosingEmptyTag: true,
      indentation: '4-spaces',
      lineEnding: 'crlf',
      mode: 'formatted',
    })

    expect(formatted).toBe('<?xml version="1.0"?>\r\n<root>\r\n    <empty/>\r\n</root>')
  })

  it('minifies xml output', () => {
    const minified = formatXmlString('<root>\n  <item>Hello</item>\n</root>', {
      collapseContent: true,
      forceSelfClosingEmptyTag: false,
      indentation: '2-spaces',
      lineEnding: 'lf',
      mode: 'minified',
    })

    expect(minified).toBe('<root><item>Hello</item></root>')
  })
})
