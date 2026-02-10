import { describe, expect, it } from 'vitest'
import { loadAtIdle } from './load-at-idle'

describe('loadAtIdle', () => {
  it('uses requestIdleCallback when available', async () => {
    const original = window.requestIdleCallback
    let capturedTimeout: number | undefined

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: (callback: IdleRequestCallback, options?: IdleRequestOptions) => {
        capturedTimeout = options?.timeout
        callback({
          didTimeout: false,
          timeRemaining: () => 5,
        } as IdleDeadline)
        return 1
      },
    })

    const loader = async () => 'idle-value'
    await expect(loadAtIdle(loader, { timeout: 320 })).resolves.toBe('idle-value')
    expect(capturedTimeout).toBe(320)

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: original,
    })
  })

  it('falls back to direct loading without requestIdleCallback', async () => {
    const original = window.requestIdleCallback

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: undefined,
    })

    const loader = async () => 'direct-value'
    await expect(loadAtIdle(loader)).resolves.toBe('direct-value')

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: original,
    })
  })
})
