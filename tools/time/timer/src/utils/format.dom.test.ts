import { describe, expect, it } from 'vitest'
import { formatCountdown } from './format'

describe('formatCountdown', () => {
  it('formats milliseconds as a countdown clock', () => {
    expect(formatCountdown(0)).toBe('00:00:00.00')
    expect(formatCountdown(-5)).toBe('00:00:00.00')
    expect(formatCountdown(1234)).toBe('00:00:01.23')
    expect(formatCountdown(62_345)).toBe('00:01:02.34')
    expect(formatCountdown(3_726_789)).toBe('01:02:06.78')
    expect(formatCountdown(100 * 3_600_000)).toBe('100:00:00.00')
  })
})
