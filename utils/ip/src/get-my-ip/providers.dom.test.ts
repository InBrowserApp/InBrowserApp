import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMyIPv4 as getIPSBv4, getMyIPv6 as getIPSBv6, default as ipsbProvider } from './ip.sb'
import {
  getMyIPv4 as getIPIFYv4,
  getMyIPv6 as getIPIFYv6,
  default as ipifyProvider,
} from './ipify.org'
import {
  getMyIPv4 as getGeoIPv4,
  getMyIPv6 as getGeoIPv6,
  default as geoProvider,
} from './geojs.io'
import {
  getMyIPUniversal,
  getMyIPv4 as getCloudflareIPv4,
  getMyIPv6 as getCloudflareIPv6,
  default as cloudflareProvider,
} from './cloudflare'

function mockJSONResponse(payload: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      json: async () => payload,
    })),
  )
}

describe('get-my-ip providers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('validates ip.sb ipv4 and ipv6 responses', async () => {
    mockJSONResponse({ ip: '203.0.113.1' })
    await expect(getIPSBv4()).resolves.toBe('203.0.113.1')

    mockJSONResponse({ ip: '2001:db8::1' })
    await expect(getIPSBv6()).resolves.toBe('2001:db8::1')

    mockJSONResponse({ ip: 'invalid-ip' })
    await expect(getIPSBv4()).rejects.toThrow('Invalid IPv4: invalid-ip')

    expect(ipsbProvider.name).toBe('ip.sb')
    expect(ipsbProvider.ipv4).toBe(getIPSBv4)
    expect(ipsbProvider.ipv6).toBe(getIPSBv6)
  })

  it('validates ipify ipv4 and ipv6 responses', async () => {
    mockJSONResponse({ ip: '198.51.100.5' })
    await expect(getIPIFYv4()).resolves.toBe('198.51.100.5')

    mockJSONResponse({ ip: '2001:db8::5' })
    await expect(getIPIFYv6()).resolves.toBe('2001:db8::5')

    mockJSONResponse({ ip: 'bad-ip' })
    await expect(getIPIFYv6()).rejects.toThrow('Invalid IPv4: bad-ip')

    expect(ipifyProvider.name).toBe('ipify')
    expect(ipifyProvider.ipv4).toBe(getIPIFYv4)
    expect(ipifyProvider.ipv6).toBe(getIPIFYv6)
  })

  it('validates geojs ipv4 and ipv6 responses', async () => {
    mockJSONResponse({ ip: '192.0.2.99' })
    await expect(getGeoIPv4()).resolves.toBe('192.0.2.99')

    mockJSONResponse({ ip: '2001:db8::99' })
    await expect(getGeoIPv6()).resolves.toBe('2001:db8::99')

    mockJSONResponse({ ip: 'broken' })
    await expect(getGeoIPv4()).rejects.toThrow('Invalid IPv4: broken')

    expect(geoProvider.name).toBe('GeoJS')
    expect(geoProvider.ipv4).toBe(getGeoIPv4)
    expect(geoProvider.ipv6).toBe(getGeoIPv6)
  })

  it('parses cloudflare trace responses for universal/ipv4/ipv6', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        text: async () => 'fl=20f15\nip=203.0.113.42\nts=1',
      })),
    )

    await expect(getMyIPUniversal()).resolves.toBe('203.0.113.42')
    await expect(getCloudflareIPv4()).resolves.toBe('203.0.113.42')

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        text: async () => 'fl=20f15\nip=2001:db8::42\nts=1',
      })),
    )

    await expect(getCloudflareIPv6()).resolves.toBe('2001:db8::42')

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        text: async () => 'fl=20f15\nip=not-an-ip\nts=1',
      })),
    )

    await expect(getMyIPUniversal()).rejects.toThrow('Invalid IP: not-an-ip')
    expect(cloudflareProvider.name).toBe('Cloudflare')
    expect(cloudflareProvider.ipv4).toBe(getCloudflareIPv4)
    expect(cloudflareProvider.ipv6).toBe(getCloudflareIPv6)
  })
})
