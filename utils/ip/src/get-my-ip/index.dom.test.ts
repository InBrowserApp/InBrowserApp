import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getMyIPv4, getMyIPv6, getMyIPProviders } from './index'

describe('get-my-ip index', () => {
  const originalProviders = [...getMyIPProviders]

  beforeEach(() => {
    getMyIPProviders.splice(0, getMyIPProviders.length, ...originalProviders)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    getMyIPProviders.splice(0, getMyIPProviders.length, ...originalProviders)
  })

  it('resolves first successful provider for ipv4 and aborts pending requests', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort')

    const slow = vi.fn((options?: { signal: AbortSignal }) => {
      return new Promise<string>((resolve, reject) => {
        options?.signal.addEventListener('abort', () => reject(new Error('aborted')))
        setTimeout(() => resolve('198.51.100.200'), 50)
      })
    })
    const fast = vi.fn(async (_options?: { signal: AbortSignal }) => '198.51.100.12')

    getMyIPProviders.splice(
      0,
      getMyIPProviders.length,
      {
        name: 'slow',
        ipv4: slow,
      },
      {
        name: 'fast',
        ipv4: fast,
      },
    )

    await expect(getMyIPv4()).resolves.toBe('198.51.100.12')
    expect(fast).toHaveBeenCalled()
    expect(abortSpy).toHaveBeenCalled()
  })

  it('resolves first successful provider for ipv6', async () => {
    const fail = vi.fn(async (_options?: { signal: AbortSignal }) => {
      throw new Error('failed')
    })
    const success = vi.fn(async (_options?: { signal: AbortSignal }) => '2001:db8::200')

    getMyIPProviders.splice(
      0,
      getMyIPProviders.length,
      {
        name: 'fail',
        ipv6: fail,
      },
      {
        name: 'success',
        ipv6: success,
      },
    )

    await expect(getMyIPv6()).resolves.toBe('2001:db8::200')
    expect(success).toHaveBeenCalled()
  })

  it('throws aggregate errors when no provider is available', async () => {
    getMyIPProviders.splice(0, getMyIPProviders.length, {
      name: 'noop',
    })

    await expect(getMyIPv4()).rejects.toBeInstanceOf(AggregateError)
    await expect(getMyIPv6()).rejects.toBeInstanceOf(AggregateError)
  })
})
