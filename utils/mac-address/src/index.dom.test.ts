import { describe, it, expect } from 'vitest'
import { isValidMacAddress } from './valid'
import { parseMACAddressToNumber, parseMACAddressToArrayBuffer } from './parse'
import { ipv6AddressToMacAddress } from './ipv6-address-to-mac-address'
import { macAddressToIPv6LinkLocalAddress } from './mac-address-to-ipv6-link-local-address'
import { randomMACAddress } from './random'

describe('isValidMacAddress', () => {
  it('should accept valid MAC addresses with colons', () => {
    expect(isValidMacAddress('00:11:22:33:44:55')).toBe(true)
    expect(isValidMacAddress('AA:BB:CC:DD:EE:FF')).toBe(true)
    expect(isValidMacAddress('aa:bb:cc:dd:ee:ff')).toBe(true)
  })

  it('should accept valid MAC addresses with dashes', () => {
    expect(isValidMacAddress('00-11-22-33-44-55')).toBe(true)
    expect(isValidMacAddress('AA-BB-CC-DD-EE-FF')).toBe(true)
  })

  it('should reject invalid MAC addresses', () => {
    expect(isValidMacAddress('')).toBe(false)
    expect(isValidMacAddress('00:11:22:33:44')).toBe(false) // too short
    expect(isValidMacAddress('00:11:22:33:44:55:66')).toBe(false) // too long
    expect(isValidMacAddress('00:11:22:33:44:GG')).toBe(false) // invalid hex
    expect(isValidMacAddress('001122334455')).toBe(false) // no separator
    expect(isValidMacAddress('00.11.22.33.44.55')).toBe(false) // wrong separator
  })
})

describe('parseMACAddressToNumber', () => {
  it('should parse MAC with colons', () => {
    expect(parseMACAddressToNumber('00:11:22:33:44:55')).toEqual([0, 17, 34, 51, 68, 85])
  })

  it('should parse MAC with dashes', () => {
    expect(parseMACAddressToNumber('00-11-22-33-44-55')).toEqual([0, 17, 34, 51, 68, 85])
  })

  it('should parse MAC without separators', () => {
    expect(parseMACAddressToNumber('001122334455')).toEqual([0, 17, 34, 51, 68, 85])
  })

  it('should handle uppercase hex', () => {
    expect(parseMACAddressToNumber('AA:BB:CC:DD:EE:FF')).toEqual([170, 187, 204, 221, 238, 255])
  })

  it('should handle mixed case', () => {
    expect(parseMACAddressToNumber('Aa:Bb:Cc:Dd:Ee:Ff')).toEqual([170, 187, 204, 221, 238, 255])
  })
})

describe('parseMACAddressToArrayBuffer', () => {
  it('should return ArrayBuffer with correct bytes', () => {
    const buffer = parseMACAddressToArrayBuffer('00:11:22:33:44:55')
    const view = new Uint8Array(buffer)

    expect(buffer.byteLength).toBe(6)
    expect(Array.from(view)).toEqual([0, 17, 34, 51, 68, 85])
  })
})

describe('ipv6AddressToMacAddress', () => {
  it('should extract MAC from IPv6 link-local address', () => {
    // fe80::0211:22ff:fe33:4455 -> 00:11:22:33:44:55
    expect(ipv6AddressToMacAddress('fe80::0211:22ff:fe33:4455')).toBe('00:11:22:33:44:55')
  })

  it('should handle full IPv6 format', () => {
    expect(ipv6AddressToMacAddress('fe80:0000:0000:0000:0211:22ff:fe33:4455')).toBe(
      '00:11:22:33:44:55',
    )
  })

  it('should return empty string for non-EUI-64 addresses', () => {
    // Address without ff:fe marker
    expect(ipv6AddressToMacAddress('fe80::1')).toBe('')
    expect(ipv6AddressToMacAddress('2001:db8::1')).toBe('')
  })

  it('should return empty string for invalid IPv6', () => {
    expect(ipv6AddressToMacAddress('')).toBe('')
    expect(ipv6AddressToMacAddress('invalid')).toBe('')
  })

  it('should handle zone index', () => {
    expect(ipv6AddressToMacAddress('fe80::0211:22ff:fe33:4455%eth0')).toBe('00:11:22:33:44:55')
  })
})

describe('macAddressToIPv6LinkLocalAddress', () => {
  it('should convert MAC to IPv6 link-local address', () => {
    const result = macAddressToIPv6LinkLocalAddress('00:11:22:33:44:55')
    expect(result).toContain('fe80::')
  })

  it('should handle different MAC formats', () => {
    const result1 = macAddressToIPv6LinkLocalAddress('00:11:22:33:44:55')
    const result2 = macAddressToIPv6LinkLocalAddress('00-11-22-33-44-55')
    expect(result1).toBe(result2)
  })

  it('should throw error for invalid MAC', () => {
    expect(() => macAddressToIPv6LinkLocalAddress('')).toThrow('Invalid MAC address format')
    expect(() => macAddressToIPv6LinkLocalAddress('invalid')).toThrow('Invalid MAC address format')
    expect(() => macAddressToIPv6LinkLocalAddress('00:11:22')).toThrow('Invalid MAC address format')
  })
})

describe('randomMACAddress', () => {
  it('should generate valid MAC address format', () => {
    const mac = randomMACAddress()
    expect(isValidMacAddress(mac)).toBe(true)
  })

  it('should generate locally administered unicast address', () => {
    const mac = randomMACAddress()
    const firstByte = parseInt(mac.split(':')[0]!, 16)

    // Check locally administered bit (bit 1) is set
    expect((firstByte & 0x02) !== 0).toBe(true)
    // Check unicast bit (bit 0) is not set
    expect((firstByte & 0x01) === 0).toBe(true)
  })

  it('should generate different addresses each time', () => {
    const mac1 = randomMACAddress()
    const mac2 = randomMACAddress()
    // Very unlikely to be the same
    expect(mac1).not.toBe(mac2)
  })

  it('should return uppercase MAC address', () => {
    const mac = randomMACAddress()
    expect(mac).toBe(mac.toUpperCase())
  })
})

describe('round-trip conversion', () => {
  it('should round-trip MAC <-> IPv6 link-local', () => {
    const originalMac = '02:11:22:33:44:55' // Locally administered
    const ipv6 = macAddressToIPv6LinkLocalAddress(originalMac)
    const recoveredMac = ipv6AddressToMacAddress(ipv6)

    expect(recoveredMac.toLowerCase()).toBe(originalMac.toLowerCase())
  })
})
