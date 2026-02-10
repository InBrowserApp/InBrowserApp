import { describe, expect, it } from 'vitest'
import { ReverseIPDomain } from './reverse-ip-domain'

describe('ReverseIPDomain', () => {
  it('reverses ipv4 to in-addr.arpa format', () => {
    expect(ReverseIPDomain('8.8.4.4')).toBe('4.4.8.8.in-addr.arpa')
  })

  it('reverses compressed ipv6 to ip6.arpa format', () => {
    const result = ReverseIPDomain('2001:db8::1')

    expect(result).toContain('.ip6.arpa')
    expect(result.startsWith('1.0.0.0.')).toBe(true)
    expect(result.endsWith('.8.b.d.0.1.0.0.2.ip6.arpa')).toBe(true)
  })

  it('reverses full ipv6 addresses to ip6.arpa format', () => {
    const result = ReverseIPDomain('2001:0db8:0000:0000:0000:ff00:0042:8329')

    expect(result).toContain('.ip6.arpa')
    expect(result.startsWith('9.2.3.8.')).toBe(true)
    expect(result.includes('.f.f.')).toBe(true)
    expect(result.endsWith('.8.b.d.0.1.0.0.2.ip6.arpa')).toBe(true)
  })
})
