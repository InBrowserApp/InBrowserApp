import { describe, it, expect } from 'vitest'
import { normalizeEmail, validateEmail } from './email'

describe('normalizeEmail', () => {
  it('trims and lowercases the domain', () => {
    expect(normalizeEmail(' User@Example.COM ')).toBe('User@example.com')
  })

  it('returns the original value when missing @', () => {
    expect(normalizeEmail('not-an-email')).toBe('not-an-email')
  })

  it('returns the original value when missing domain', () => {
    expect(normalizeEmail('user@')).toBe('user@')
  })
})

describe('validateEmail', () => {
  it('accepts a standard email address', () => {
    const result = validateEmail('hello@example.com')
    expect(result.isValid).toBe(true)
    expect(result.normalized).toBe('hello@example.com')
    expect(result.localPart).toBe('hello')
    expect(result.domain).toBe('example.com')
  })

  it('rejects missing or multiple @ symbols', () => {
    expect(validateEmail('hello.example.com').hasSingleAt).toBe(false)
    expect(validateEmail('a@b@c.com').hasSingleAt).toBe(false)
  })

  it('flags local part length overflow', () => {
    const localPart = 'a'.repeat(65)
    const result = validateEmail(`${localPart}@example.com`)
    expect(result.isLocalLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags domain length overflow', () => {
    const domain = 'a'.repeat(254)
    const result = validateEmail(`user@${domain}`)
    expect(result.isDomainLengthValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags invalid local dot placement', () => {
    const result = validateEmail('user..name@example.com')
    expect(result.isLocalDotsValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('flags leading or trailing dots in local part', () => {
    expect(validateEmail('.user@example.com').isLocalDotsValid).toBe(false)
    expect(validateEmail('user.@example.com').isLocalDotsValid).toBe(false)
  })

  it('handles missing domain dot placement', () => {
    const result = validateEmail('user@')
    expect(result.domainLength).toBe(0)
    expect(result.isDomainDotsValid).toBe(false)
  })

  it('flags invalid domain labels and characters', () => {
    const longLabel = 'a'.repeat(64)
    const longLabelResult = validateEmail(`user@${longLabel}.com`)
    expect(longLabelResult.isDomainLabelLengthValid).toBe(false)

    const hyphenResult = validateEmail('user@-example.com')
    expect(hyphenResult.isDomainLabelCharsValid).toBe(false)

    const underscoreResult = validateEmail('user@exa_mple.com')
    expect(underscoreResult.isDomainCharsValid).toBe(false)
  })

  it('flags missing top-level domains', () => {
    const result = validateEmail('user@example')
    expect(result.isTldValid).toBe(false)
    expect(result.isValid).toBe(false)
  })

  it('rejects unicode domains without punycode', () => {
    const result = validateEmail('user@例子.com')
    expect(result.isDomainCharsValid).toBe(false)
    expect(result.isValid).toBe(false)
  })
})
