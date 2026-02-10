import { afterEach, describe, expect, it, vi } from 'vitest'
import { getIPInfo as getGeoInfo, default as geojs } from './geojs.io'
import { getIPInfo as getGeoPtrInfo, default as geoPtr } from './geojs.io-ptr'
import { getIPInfo as getIPSBInfo, default as ipsb } from './ip.sb'

describe('basic ip-info providers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('maps geojs response fields to ip info', async () => {
    const fetchMock = vi.fn(async () => ({
      json: async () => ({
        organization_name: 'Example Org',
        latitude: '12.5',
        longitude: '77.25',
        timezone: 'UTC',
        asn: 1337,
      }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await getGeoInfo('1.1.1.1', { cache: 'no-store' })

    expect(fetchMock).toHaveBeenCalledWith('https://get.geojs.io/v1/ip/geo/1.1.1.1.json', {
      cache: 'no-store',
    })
    expect(result).toMatchObject({
      latitude: 12.5,
      longitude: 77.25,
      asn_organization: 'Example Org',
      timezone: 'UTC',
      asn: 1337,
    })
    expect(geojs.name).toBe('geojs.io')
    expect(geojs.getIPInfo).toBe(getGeoInfo)
  })

  it('maps geojs ptr to hostname and throws for failed ptr', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({
          ptr: 'mail.example.com',
        }),
      })),
    )
    await expect(getGeoPtrInfo('8.8.8.8')).resolves.toEqual({ hostname: 'mail.example.com' })

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({
          ptr: 'Failed to get PTR record',
        }),
      })),
    )
    await expect(getGeoPtrInfo('8.8.4.4')).rejects.toThrow('Failed to get PTR record')
    expect(geoPtr.name).toBe('geojs.io-ptr')
    expect(geoPtr.getIPInfo).toBe(getGeoPtrInfo)
  })

  it('returns ip.sb json payload', async () => {
    const payload = {
      country: 'US',
      timezone: 'UTC',
      latitude: 1,
      longitude: 2,
      organization: 'Org',
      isp: 'ISP',
      asn: 1,
      asn_organization: 'AS Org',
      offset: 0,
      continent_code: 'NA',
      country_code: 'US',
      ip: '1.1.1.1',
    }
    const fetchMock = vi.fn(async () => ({
      json: async () => payload,
    }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getIPSBInfo('1.1.1.1')).resolves.toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith('https://api.ip.sb/geoip/1.1.1.1', undefined)
    expect(ipsb.name).toBe('ip.sb')
    expect(ipsb.getIPInfo).toBe(getIPSBInfo)
  })
})
