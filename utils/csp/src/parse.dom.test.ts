import { describe, expect, it } from 'vitest'
import { parseContentSecurityPolicy } from './parse'

describe('parseContentSecurityPolicy', () => {
  it('parses a policy value into directives and tokens', () => {
    const result = parseContentSecurityPolicy(
      "default-src 'self'; img-src data: https://cdn.example.com",
    )

    expect(result.inputKind).toBe('policy')
    expect(result.policy.directives).toEqual([
      {
        name: 'default-src',
        tokens: [{ type: 'keyword', value: "'self'" }],
      },
      {
        name: 'img-src',
        tokens: [
          { type: 'scheme', value: 'data:' },
          { type: 'host', value: 'https://cdn.example.com' },
        ],
      },
    ])
  })

  it('parses header input and keeps report-only mode', () => {
    const result = parseContentSecurityPolicy(
      "Content-Security-Policy-Report-Only: default-src 'self'; report-uri https://example.com/report",
    )

    expect(result.inputKind).toBe('header')
    expect(result.delivery).toBe('header')
    expect(result.mode).toBe('report-only')
    expect(result.policy.directives[0]?.name).toBe('default-src')
  })

  it('parses meta input by reading the content attribute', () => {
    const result = parseContentSecurityPolicy(
      '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; img-src data:">',
    )

    expect(result.inputKind).toBe('meta')
    expect(result.delivery).toBe('meta')
    expect(result.policy.directives[1]?.name).toBe('img-src')
  })

  it('merges duplicate directives and records a warning', () => {
    const result = parseContentSecurityPolicy('img-src data:; img-src https:')

    expect(result.policy.directives).toEqual([
      {
        name: 'img-src',
        tokens: [
          { type: 'scheme', value: 'data:' },
          { type: 'scheme', value: 'https:' },
        ],
      },
    ])
    expect(result.diagnostics[0]?.code).toBe('parse.duplicate-directive')
  })

  it('reports invalid meta input', () => {
    const result = parseContentSecurityPolicy('<meta name="viewport" content="width=device-width">')

    expect(result.policy.directives).toEqual([])
    expect(result.diagnostics[0]?.code).toBe('parse.invalid-meta-format')
  })

  it('returns an empty policy for blank input', () => {
    const result = parseContentSecurityPolicy('   ')

    expect(result.policy.directives).toEqual([])
    expect(result.diagnostics).toEqual([])
  })
})
