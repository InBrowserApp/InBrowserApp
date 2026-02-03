import { describe, expect, it, vi } from 'vitest'

vi.mock('./timeZone', () => ({
  getSupportedTimeZones: () => ['UTC', 'Asia/Tokyo'],
  getTimeZoneOffsetMs: (_timestamp: number, timeZone: string) => {
    if (timeZone === 'UTC') return 0
    throw new Error('offset unavailable')
  },
  formatOffsetLabel: () => 'UTC+00:00',
}))

import { buildTimeZoneOptions } from './timeZoneOptions'

describe('buildTimeZoneOptions', () => {
  it('adds offset labels and falls back when offsets fail', () => {
    const options = buildTimeZoneOptions(0)
    expect(options).toEqual([
      { label: 'UTC (UTC+00:00)', value: 'UTC' },
      { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
    ])
  })
})
