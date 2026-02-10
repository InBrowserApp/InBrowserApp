import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { AirplaneModeError, useAirplaneModeStore } from './index'

const STORAGE_KEY = 'inbrowser.app:settings:airplane-mode'

describe('useAirplaneModeStore', () => {
  let originalFetch: typeof window.fetch

  beforeEach(() => {
    originalFetch = window.fetch
    localStorage.removeItem(STORAGE_KEY)
    setActivePinia(createPinia())
  })

  afterEach(() => {
    window.fetch = originalFetch
    localStorage.removeItem(STORAGE_KEY)
  })

  it('passes through requests when airplane mode is disabled', async () => {
    const fetchMock = vi.fn(async () => new Response('ok'))
    window.fetch = fetchMock

    const store = useAirplaneModeStore()
    const response = await window.fetch('https://example.com/data')

    expect(store.isAirplaneMode).toBe(false)
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/data', undefined)
    expect(await response.text()).toBe('ok')
  })

  it('blocks cross-origin requests when airplane mode is enabled', async () => {
    const fetchMock = vi.fn(async () => new Response('ok'))
    window.fetch = fetchMock

    const store = useAirplaneModeStore()
    store.enableAirplaneMode()

    await expect(window.fetch('https://example.com/data')).rejects.toBeInstanceOf(AirplaneModeError)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('allows same-origin requests in airplane mode', async () => {
    const fetchMock = vi.fn(async () => new Response('ok'))
    window.fetch = fetchMock

    const store = useAirplaneModeStore()
    store.enableAirplaneMode()

    const sameOriginUrl = new URL('/api/check', window.location.origin).toString()
    await window.fetch(sameOriginUrl)

    expect(fetchMock).toHaveBeenCalledWith(sameOriginUrl, undefined)
  })

  it('toggles and disables airplane mode state', () => {
    window.fetch = vi.fn(async () => new Response('ok'))

    const store = useAirplaneModeStore()
    store.toggleAirplaneMode()
    expect(store.isAirplaneMode).toBe(true)

    store.disableAirplaneMode()
    expect(store.isAirplaneMode).toBe(false)
  })
})

describe('AirplaneModeError', () => {
  it('sets the error name and message', () => {
    const error = new AirplaneModeError('blocked')

    expect(error.name).toBe('AirplaneModeError')
    expect(error.message).toBe('blocked')
  })
})
