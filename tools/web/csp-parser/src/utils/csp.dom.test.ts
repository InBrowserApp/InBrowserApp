import { describe, it, expect } from 'vitest'
import {
  parseCsp,
  parseDirective,
  stringifyCsp,
  stringifyDirective,
  textToValues,
  valuesToText,
} from './csp'

describe('csp utils', () => {
  it('returns null for empty directive segments', () => {
    expect(parseDirective('')).toBeNull()
    expect(parseDirective('   ')).toBeNull()
  })

  it('parses directive names and values', () => {
    const directive = parseDirective("SCRIPT-SRC 'self' https://cdn.example.com")
    expect(directive).toEqual({
      name: 'script-src',
      values: ["'self'", 'https://cdn.example.com'],
    })
  })

  it('parses CSP strings into directives', () => {
    const directives = parseCsp("default-src 'self'; img-src https://img.example.com;")
    expect(directives).toHaveLength(2)
    expect(directives[0]).toEqual({ name: 'default-src', values: ["'self'"] })
    expect(directives[1]).toEqual({
      name: 'img-src',
      values: ['https://img.example.com'],
    })
  })

  it('returns an empty array for empty CSP input', () => {
    expect(parseCsp('')).toEqual([])
  })

  it('stringifies directives correctly', () => {
    expect(stringifyDirective({ name: 'upgrade-insecure-requests', values: [] })).toBe(
      'upgrade-insecure-requests',
    )
    expect(
      stringifyDirective({
        name: 'SCRIPT-SRC',
        values: ["'self'", 'https://cdn.example.com'],
      }),
    ).toBe("script-src 'self' https://cdn.example.com")
  })

  it('stringifies CSP arrays with filtering', () => {
    expect(
      stringifyCsp([
        { name: 'default-src', values: ["'self'"] },
        { name: '', values: ['noop'] },
        { name: 'upgrade-insecure-requests', values: [] },
      ]),
    ).toBe("default-src 'self'; upgrade-insecure-requests")
  })

  it('converts between text and value arrays', () => {
    expect(textToValues("'self'   https://cdn.example.com")).toEqual([
      "'self'",
      'https://cdn.example.com',
    ])
    expect(valuesToText(["'self'", 'https://cdn.example.com'])).toBe(
      "'self' https://cdn.example.com",
    )
  })
})
