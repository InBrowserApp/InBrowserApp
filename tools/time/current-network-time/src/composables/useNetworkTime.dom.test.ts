import { beforeEach, describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { useNetworkTime } from './useNetworkTime'

const rafState = { callback: null as null | (() => void) }
const intervalState = { callback: null as null | (() => void) }
const pauseMock = vi.fn()
const resumeMock = vi.fn()

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useTimestamp: () => ref(1000),
    useRafFn: (callback: () => void) => {
      rafState.callback = callback
      return {
        pause: pauseMock,
        resume: resumeMock,
      }
    },
    useIntervalFn: (callback: () => void) => {
      intervalState.callback = callback
      return {
        pause: vi.fn(),
        resume: vi.fn(),
      }
    },
  }
})

describe('useNetworkTime', () => {
  beforeEach(() => {
    rafState.callback = null
    intervalState.callback = null
    pauseMock.mockReset()
    resumeMock.mockReset()
  })

  it('syncs network time and updates the offset', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        text: vi.fn().mockResolvedValue('ts=123.456'),
      }),
    )

    const performanceSpy = vi
      .spyOn(performance, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1200)
      .mockReturnValue(1300)

    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(120000)

    const state = useNetworkTime()
    await flushPromises()

    expect(state.status.value).toBe('synced')
    expect(state.error.value).toBeNull()
    expect(state.roundTripTimeMs.value).toBe(200)
    expect(state.offset.value).toBe(3456)
    expect(state.lastSyncAt.value).toBe(120000)
    expect(resumeMock).toHaveBeenCalled()

    rafState.callback?.()
    expect(state.networkTime.value).toBe(123656)

    performanceSpy.mockRestore()
    dateSpy.mockRestore()
    vi.unstubAllGlobals()
  })

  it('handles parse errors and pauses updates', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        text: vi.fn().mockResolvedValue('no timestamp'),
      }),
    )

    const performanceSpy = vi
      .spyOn(performance, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1100)

    const state = useNetworkTime()
    await flushPromises()

    expect(state.status.value).toBe('synced')
    expect(state.error.value).toContain('Failed to parse Cloudflare trace timestamp')
    expect(pauseMock).toHaveBeenCalled()
    expect(resumeMock).not.toHaveBeenCalled()
    expect(state.offset.value).toBeUndefined()

    performanceSpy.mockRestore()
    vi.unstubAllGlobals()
  })
})
