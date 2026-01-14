import { describe, it, expect, vi } from 'vitest'
import { buildTimeZoneOptions } from './timeZoneOptions'
import { formatOffsetLabel, getSupportedTimeZones, getTimeZoneOffsetMs } from './timeZone'

vi.mock('./timeZone', () => ({
  formatOffsetLabel: vi.fn(() => 'UTC+00:00'),
  getSupportedTimeZones: vi.fn(() => ['UTC', 'Bad/Zone']),
  getTimeZoneOffsetMs: vi.fn((timestamp: number, timeZone: string) => {
    if (timeZone === 'Bad/Zone') {
      throw new Error('bad zone')
    }
    return timestamp
  }),
}))

describe('buildTimeZoneOptions', () => {
  it('builds labels with offsets when available', () => {
    const options = buildTimeZoneOptions(123)
    expect(options).toEqual([
      {
        label: 'UTC (UTC+00:00)',
        value: 'UTC',
      },
      {
        label: 'Bad/Zone',
        value: 'Bad/Zone',
      },
    ])

    expect(formatOffsetLabel).toHaveBeenCalled()
    expect(getSupportedTimeZones).toHaveBeenCalled()
    expect(getTimeZoneOffsetMs).toHaveBeenCalled()
  })
})
