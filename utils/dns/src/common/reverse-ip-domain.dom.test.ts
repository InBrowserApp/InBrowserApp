import { describe, it, expect } from 'vitest'
import { ReverseIPDomain } from './reverse-ip-domain'

describe('ReverseIPDomain', () => {
  describe('IPv4', () => {
    it('should convert IPv4 address to reverse DNS domain', () => {
      expect(ReverseIPDomain('192.168.1.1')).toBe('1.1.168.192.in-addr.arpa')
    })

    it('should handle different IPv4 addresses', () => {
      expect(ReverseIPDomain('8.8.8.8')).toBe('8.8.8.8.in-addr.arpa')
      expect(ReverseIPDomain('10.0.0.1')).toBe('1.0.0.10.in-addr.arpa')
      expect(ReverseIPDomain('172.16.0.1')).toBe('1.0.16.172.in-addr.arpa')
    })

    it('should handle edge case IPs', () => {
      expect(ReverseIPDomain('0.0.0.0')).toBe('0.0.0.0.in-addr.arpa')
      expect(ReverseIPDomain('255.255.255.255')).toBe('255.255.255.255.in-addr.arpa')
    })
  })

  describe('IPv6', () => {
    it('should convert full IPv6 address to reverse DNS domain', () => {
      const result = ReverseIPDomain('2001:0db8:0000:0000:0000:0000:0000:0001')
      expect(result).toBe(
        '1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa',
      )
    })

    it('should handle shortened IPv6 with ::', () => {
      const result = ReverseIPDomain('2001:db8::1')
      expect(result).toBe(
        '1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa',
      )
    })

    it('should handle loopback address', () => {
      const result = ReverseIPDomain('::1')
      expect(result).toBe(
        '1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa',
      )
    })

    it('should handle link-local address', () => {
      // fe80::1 = fe80:0000:0000:0000:0000:0000:0000:0001
      // Full hex: fe80000000000000000000000000001
      // Reversed by nibble: 1000000000000000000000000000008ef
      const result = ReverseIPDomain('fe80::1')
      expect(result).toBe(
        '1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.e.f.ip6.arpa',
      )
    })

    it('should pad IPv6 segments correctly', () => {
      // Each segment should be padded to 4 hex digits
      const result = ReverseIPDomain('1:2:3:4:5:6:7:8')
      expect(result).toContain('ip6.arpa')
      // 32 hex digits + 'ip6' + 'arpa' = 34 parts when split by '.'
      expect(result.split('.').length).toBe(34)
    })
  })
})
