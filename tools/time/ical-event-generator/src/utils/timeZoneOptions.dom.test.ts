import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildTimeZoneOptions } from './timeZoneOptions'
import * as timeZone from './timeZone'

describe('buildTimeZoneOptions', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds options with labels and values', () => {
    const options = buildTimeZoneOptions(0)
    expect(options.length).toBeGreaterThan(0)
    expect(options[0]).toHaveProperty('label')
    expect(options[0]).toHaveProperty('value')
  })

  it('falls back to plain labels when offsets fail', () => {
    vi.spyOn(timeZone, 'getSupportedTimeZones').mockReturnValue(['UTC'])
    vi.spyOn(timeZone, 'getTimeZoneOffsetMs').mockImplementation(() => {
      throw new Error('offset failure')
    })

    const options = buildTimeZoneOptions(0)
    expect(options).toEqual([{ label: 'UTC', value: 'UTC' }])
  })
})
