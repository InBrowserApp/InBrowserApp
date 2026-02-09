import { afterEach, describe, expect, it } from 'vitest'
import { performance as perfHooksPerformance } from './perf-hooks'

describe('perf-hooks shim', () => {
  const originalPerformance = globalThis.performance

  afterEach(() => {
    Object.defineProperty(globalThis, 'performance', {
      configurable: true,
      value: originalPerformance,
    })
  })

  it('uses global performance.now when available', () => {
    const now = perfHooksPerformance.now()

    expect(typeof now).toBe('number')
  })

  it('falls back to Date.now when performance is unavailable', () => {
    const dateNow = Date.now
    const nowSpy = () => 123456
    Date.now = nowSpy

    Object.defineProperty(globalThis, 'performance', {
      configurable: true,
      value: undefined,
    })

    expect(perfHooksPerformance.now()).toBe(123456)

    Date.now = dateNow
  })
})
