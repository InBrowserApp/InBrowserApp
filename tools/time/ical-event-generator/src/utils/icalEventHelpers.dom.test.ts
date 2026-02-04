import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateUid } from './icalEventHelpers'

describe('generateUid', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('uses crypto.randomUUID when available', () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'uuid' })

    expect(generateUid()).toBe('uuid@inbrowser.app')
  })

  it('falls back to random and timestamp when crypto is unavailable', () => {
    vi.stubGlobal('crypto', undefined)
    vi.spyOn(Math, 'random').mockReturnValue(0.123456)
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000)

    const uid = generateUid()
    expect(uid).toContain('-1700000000000@inbrowser.app')
    expect(uid.endsWith('@inbrowser.app')).toBe(true)
  })
})
