import { afterEach, describe, expect, it, vi } from 'vitest'
import { BUILTIN_DOH_SERVERS } from './servers'
import { makeDOHQuery } from './query'
import * as dohExports from './index'
import * as rootExports from '../index'

const fetchDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'fetch')

function mockFetch(
  responseFactory: () => Promise<Response>,
): ReturnType<typeof vi.fn<typeof fetch>> {
  const fetchMock = vi.fn<typeof fetch>(async () => responseFactory())
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    writable: true,
    value: fetchMock,
  })
  return fetchMock
}

afterEach(() => {
  if (fetchDescriptor) {
    Object.defineProperty(globalThis, 'fetch', fetchDescriptor)
  } else {
    Reflect.deleteProperty(globalThis, 'fetch')
  }
})

describe('makeDOHQuery', () => {
  it('builds the request url and returns parsed JSON', async () => {
    const json = {
      Status: 0,
      TC: false,
      RD: true,
      RA: true,
      AD: false,
      CD: false,
      Question: [{ name: 'example.com', type: 1 }],
    }

    const fetchMock = mockFetch(
      async () =>
        ({
          ok: true,
          json: async () => json,
        }) as unknown as Response,
    )

    const result = await makeDOHQuery('https://dns.google/resolve', {
      name: 'example.com',
      type: 'A',
      cd: true,
      ct: 'application/dns-json',
      do: true,
      edns_client_subnet: '1.2.3.4/24',
    })

    expect(result).toEqual(json)
    expect(fetchMock).toHaveBeenCalledOnce()

    const [requestUrl, options] = fetchMock.mock.calls[0]!
    const params = new URL(String(requestUrl)).searchParams
    expect(params.get('name')).toBe('example.com')
    expect(params.get('type')).toBe('A')
    expect(params.get('cd')).toBe('1')
    expect(params.get('ct')).toBe('application/dns-json')
    expect(params.get('do')).toBe('1')
    expect(params.get('edns_client_subnet')).toBe('1.2.3.4/24')
    expect(options).toEqual({
      method: 'GET',
      headers: {
        Accept: 'application/dns-json',
      },
    })
  })

  it('omits optional params when values are not enabled', async () => {
    const fetchMock = mockFetch(
      async () =>
        ({
          ok: true,
          json: async () => ({
            Status: 0,
            TC: false,
            RD: true,
            RA: true,
            AD: false,
            CD: false,
            Question: [{ name: 'example.com', type: 1 }],
          }),
        }) as unknown as Response,
    )

    await makeDOHQuery('https://cloudflare-dns.com/dns-query', {
      name: 'example.com',
      cd: false,
      do: false,
    })

    const [requestUrl] = fetchMock.mock.calls[0]!
    const params = new URL(String(requestUrl)).searchParams
    expect(params.get('name')).toBe('example.com')
    expect(params.has('type')).toBe(false)
    expect(params.has('cd')).toBe(false)
    expect(params.has('ct')).toBe(false)
    expect(params.has('do')).toBe(false)
    expect(params.has('edns_client_subnet')).toBe(false)
  })

  it('throws on non-ok http response', async () => {
    mockFetch(
      async () =>
        ({
          ok: false,
          status: 503,
        }) as unknown as Response,
    )

    await expect(
      makeDOHQuery('https://dns.google/resolve', { name: 'example.com' }),
    ).rejects.toThrow('HTTP error: 503')
  })
})

describe('dns exports', () => {
  it('exposes built-in server definitions and module re-exports', () => {
    expect(BUILTIN_DOH_SERVERS).toEqual([
      { label: 'Cloudflare', url: 'https://cloudflare-dns.com/dns-query' },
      { label: 'Google', url: 'https://dns.google/resolve' },
      { label: 'AliDNS', url: 'https://dns.alidns.com/resolve' },
    ])

    expect(dohExports.BUILTIN_DOH_SERVERS).toBe(BUILTIN_DOH_SERVERS)
    expect(rootExports.BUILTIN_DOH_SERVERS).toBe(BUILTIN_DOH_SERVERS)
    expect(typeof dohExports.makeDOHQuery).toBe('function')
    expect(typeof rootExports.makeDOHQuery).toBe('function')
  })
})
