import { describe, expect, it } from 'vitest'
import { serializeContentSecurityPolicy, serializePolicyValue } from './serialize'
import type { CSPPolicy } from './types'

const policy: CSPPolicy = {
  directives: [
    { name: 'default-src', tokens: [{ type: 'keyword', value: "'self'" }] },
    { name: 'img-src', tokens: [{ type: 'scheme', value: 'data:' }] },
  ],
}

describe('serializePolicyValue', () => {
  it('joins directives into a policy value', () => {
    expect(serializePolicyValue(policy)).toBe("default-src 'self'; img-src data:")
  })
})

describe('serializeContentSecurityPolicy', () => {
  it('serializes to a header', () => {
    expect(
      serializeContentSecurityPolicy(policy, {
        format: 'header',
      }),
    ).toBe("Content-Security-Policy: default-src 'self'; img-src data:")
  })

  it('serializes to a report-only header', () => {
    expect(
      serializeContentSecurityPolicy(policy, {
        format: 'header',
        mode: 'report-only',
      }),
    ).toBe("Content-Security-Policy-Report-Only: default-src 'self'; img-src data:")
  })

  it('serializes to a meta tag', () => {
    expect(
      serializeContentSecurityPolicy(policy, {
        format: 'meta',
      }),
    ).toBe(
      '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; img-src data:">',
    )
  })

  it('returns an empty string for an empty policy', () => {
    expect(
      serializeContentSecurityPolicy(
        {
          directives: [],
        },
        { format: 'policy' },
      ),
    ).toBe('')
  })
})
