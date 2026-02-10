import { afterEach, describe, expect, it, vi } from 'vitest'
import { getIPInfo as getGoogleIPInfo, default as googleDoh } from './google-doh'
import { getIPInfo as getCloudflareIPInfo, default as cloudflareDoh } from './cloudflare-doh'

const providers = [
  {
    providerName: 'google-doh',
    provider: getGoogleIPInfo,
    baseUrl: 'https://dns.google/resolve',
    exported: googleDoh,
  },
  {
    providerName: 'cloudflare-doh',
    provider: getCloudflareIPInfo,
    baseUrl: 'https://cloudflare-dns.com/dns-query',
    exported: cloudflareDoh,
  },
] as const

describe('doh ip info providers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(providers)(
    'resolves hostname from $providerName response',
    async ({ provider, baseUrl, exported, providerName }) => {
      const fetchMock = vi.fn(async () => ({
        ok: true,
        json: async () => ({
          Answer: [{ data: 'host.example.com' }],
        }),
      }))
      vi.stubGlobal('fetch', fetchMock)

      const result = await provider('8.8.8.8')

      expect(result).toEqual({ hostname: 'host.example.com' })
      expect(fetchMock).toHaveBeenCalledTimes(1)

      const calls = fetchMock.mock.calls as unknown as Array<[string, RequestInit | undefined]>
      const [requestUrl, requestInit] = calls[0] ?? []

      expect(requestUrl).toContain(baseUrl)
      expect(requestUrl).toContain('type=PTR')
      expect(requestUrl).toContain('8.8.8.8.in-addr.arpa')
      expect(requestInit).toEqual({
        method: 'GET',
        headers: {
          Accept: 'application/dns-json',
        },
      })
      expect(exported.name).toBe(providerName)
      expect(exported.getIPInfo).toBe(provider)
    },
  )

  it.each(providers)('throws on non-OK status for $providerName', async ({ provider }) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 502,
      })),
    )

    await expect(provider('1.1.1.1')).rejects.toThrow('HTTP error: 502')
  })

  it.each(providers)(
    'throws when response answer is invalid for $providerName',
    async ({ provider }) => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => ({
          ok: true,
          json: async () => ({
            Answer: [{ data: 123 }],
          }),
        })),
      )

      await expect(provider('1.0.0.1')).rejects.toThrow('Invalid response')
    },
  )
})
