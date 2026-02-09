import { describe, expect, it } from 'vitest'
import { ipv6AddressToMacAddress } from './ipv6-address-to-mac-address'

describe('ipv6AddressToMacAddress edge cases', () => {
  it('returns empty string for malformed IPv6 separators and oversized hextet groups', () => {
    expect(ipv6AddressToMacAddress('fe80::1::1')).toBe('')
    expect(ipv6AddressToMacAddress('1:2:3:4:5:6:7:8::9')).toBe('')
  })

  it('handles embedded IPv4 endings and rejects invalid IPv4 octets', () => {
    expect(ipv6AddressToMacAddress('::ffff:192.0.2.128')).toBe('')
    expect(ipv6AddressToMacAddress('::ffff:999.0.2.128')).toBe('')
  })

  it('returns empty string when parsing throws', () => {
    expect(ipv6AddressToMacAddress(null as unknown as string)).toBe('')
  })
})
