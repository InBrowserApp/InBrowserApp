import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { makeDOHQueryMock } = vi.hoisted(() => ({
  makeDOHQueryMock: vi.fn(),
}))

vi.mock('@utils/dns', () => ({
  BUILTIN_DOH_SERVERS: {
    serverA: { url: 'https://doh-a.example/dns-query' },
    serverB: { url: 'https://doh-b.example/dns-query' },
  },
  makeDOHQuery: makeDOHQueryMock,
}))

import { getDomainIPs } from './index'

describe('getDomainIPs', () => {
  beforeEach(() => {
    makeDOHQueryMock.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('collects A and AAAA answers from the first available server', async () => {
    makeDOHQueryMock
      .mockResolvedValueOnce({
        Answer: [
          { type: 1, data: '93.184.216.34' },
          { type: 5, data: 'ignore-me' },
        ],
      })
      .mockResolvedValueOnce({
        Answer: [{ type: 28, data: '2606:2800:220:1:248:1893:25c8:1946' }],
      })

    const ips = await getDomainIPs('example.com')

    expect(ips).toEqual(['93.184.216.34', '2606:2800:220:1:248:1893:25c8:1946'])
    expect(makeDOHQueryMock).toHaveBeenNthCalledWith(1, 'https://doh-a.example/dns-query', {
      name: 'example.com',
      type: 'A',
    })
    expect(makeDOHQueryMock).toHaveBeenNthCalledWith(2, 'https://doh-a.example/dns-query', {
      name: 'example.com',
      type: 'AAAA',
    })
  })

  it('returns an empty list when responses have no answers', async () => {
    makeDOHQueryMock.mockResolvedValueOnce({}).mockResolvedValueOnce({})

    const ips = await getDomainIPs('empty.test')

    expect(ips).toEqual([])
  })

  it('falls back to the next server when the current one fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    makeDOHQueryMock
      .mockRejectedValueOnce(new Error('serverA down'))
      .mockRejectedValueOnce(new Error('serverA down'))
      .mockResolvedValueOnce({
        Answer: [{ type: 1, data: '203.0.113.10' }],
      })
      .mockResolvedValueOnce({
        Answer: [{ type: 28, data: '2001:db8::10' }],
      })

    const ips = await getDomainIPs('fallback.test')

    expect(ips).toEqual(['203.0.113.10', '2001:db8::10'])
    expect(errorSpy).toHaveBeenCalled()
  })

  it('throws when all servers fail', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    makeDOHQueryMock.mockRejectedValue(new Error('unavailable'))

    await expect(getDomainIPs('nope.invalid')).rejects.toThrow('Failed to get domain IP.')
    expect(errorSpy).toHaveBeenCalled()
  })
})
