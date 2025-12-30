import { describe, it, expect } from 'vitest'
import {
  validateExpression,
  getNextRunTimes,
  getHumanDescription,
  parseFields,
  CRON_PRESETS,
} from './cron'

describe('validateExpression', () => {
  it('returns valid for standard 5-field cron expressions', () => {
    expect(validateExpression('* * * * *').valid).toBe(true)
    expect(validateExpression('*/5 * * * *').valid).toBe(true)
    expect(validateExpression('0 0 * * *').valid).toBe(true)
    expect(validateExpression('0 9 * * 1-5').valid).toBe(true)
  })

  it('returns valid for expressions with specific values', () => {
    expect(validateExpression('30 4 1,15 * *').valid).toBe(true)
    expect(validateExpression('0 12 1 1 *').valid).toBe(true)
    expect(validateExpression('15 10 * * 1').valid).toBe(true)
  })

  it('returns invalid for empty expressions', () => {
    expect(validateExpression('').valid).toBe(false)
    expect(validateExpression('   ').valid).toBe(false)
  })

  it('returns invalid for malformed expressions', () => {
    expect(validateExpression('invalid').valid).toBe(false)
    // cron-parser v5 accepts partial expressions like '* * *' and fills in defaults
    expect(validateExpression('60 * * * *').valid).toBe(false)
    expect(validateExpression('* 24 * * *').valid).toBe(false)
  })

  it('provides error messages for invalid expressions', () => {
    const result = validateExpression('60 * * * *')
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

describe('getNextRunTimes', () => {
  it('returns correct number of run times', () => {
    const times = getNextRunTimes('* * * * *', 5)
    expect(times).toHaveLength(5)
  })

  it('returns empty array for invalid expressions', () => {
    const times = getNextRunTimes('invalid', 5)
    expect(times).toHaveLength(0)
  })

  it('returns Date objects', () => {
    const times = getNextRunTimes('* * * * *', 1)
    expect(times[0]).toBeInstanceOf(Date)
  })

  it('returns dates in ascending order', () => {
    const times = getNextRunTimes('* * * * *', 5)
    for (let i = 1; i < times.length; i++) {
      expect(times[i]!.getTime()).toBeGreaterThan(times[i - 1]!.getTime())
    }
  })

  it('defaults to 10 run times when count not specified', () => {
    const times = getNextRunTimes('* * * * *')
    expect(times).toHaveLength(10)
  })
})

describe('getHumanDescription', () => {
  it('returns description for every minute', () => {
    const desc = getHumanDescription('* * * * *')
    expect(desc.toLowerCase()).toContain('minute')
  })

  it('returns description for specific interval', () => {
    const desc = getHumanDescription('*/5 * * * *')
    expect(desc).toContain('5')
  })

  it('returns empty string for invalid expressions', () => {
    const desc = getHumanDescription('invalid')
    expect(desc).toBe('')
  })

  it('supports Chinese locale', () => {
    const desc = getHumanDescription('0 0 * * *', 'zh-CN')
    expect(desc).toBeTruthy()
  })

  it('supports Japanese locale', () => {
    const desc = getHumanDescription('0 0 * * *', 'ja')
    expect(desc).toBeTruthy()
  })

  it('falls back to English for unsupported locales', () => {
    const desc = getHumanDescription('0 0 * * *', 'xyz')
    expect(desc).toBeTruthy()
  })
})

describe('parseFields', () => {
  it('parses 5-field expression correctly', () => {
    const fields = parseFields('*/5 * * * *')
    expect(fields).toHaveLength(5)
    expect(fields[0]?.name).toBe('Minute')
    expect(fields[0]?.value).toBe('*/5')
    expect(fields[1]?.name).toBe('Hour')
    expect(fields[2]?.name).toBe('Day of Month')
    expect(fields[3]?.name).toBe('Month')
    expect(fields[4]?.name).toBe('Day of Week')
  })

  it('returns empty array for invalid expressions', () => {
    const fields = parseFields('* *')
    expect(fields).toHaveLength(0)
  })

  it('provides descriptions for wildcard fields', () => {
    const fields = parseFields('* * * * *')
    expect(fields[0]?.description.toLowerCase()).toContain('every')
  })

  it('provides descriptions for interval fields', () => {
    const fields = parseFields('*/15 * * * *')
    expect(fields[0]?.description).toContain('15')
  })

  it('provides descriptions for range fields', () => {
    const fields = parseFields('* * * * 1-5')
    expect(fields[4]?.description.toLowerCase()).toContain('from')
  })

  it('provides descriptions for list fields', () => {
    const fields = parseFields('0 0 1,15 * *')
    expect(fields[2]?.description).toContain('1,15')
  })

  it('handles 6-field cron expressions (ignores first field)', () => {
    const fields = parseFields('0 */5 * * * *')
    expect(fields).toHaveLength(5)
    expect(fields[0]?.value).toBe('*/5')
  })
})

describe('CRON_PRESETS', () => {
  it('contains common presets', () => {
    expect(CRON_PRESETS.length).toBeGreaterThan(0)
  })

  it('all presets have label and value', () => {
    for (const preset of CRON_PRESETS) {
      expect(preset.label).toBeTruthy()
      expect(preset.value).toBeTruthy()
    }
  })

  it('all preset values are valid cron expressions', () => {
    for (const preset of CRON_PRESETS) {
      const result = validateExpression(preset.value)
      expect(result.valid).toBe(true)
    }
  })

  it('includes every minute preset', () => {
    const everyMinute = CRON_PRESETS.find((p) => p.value === '* * * * *')
    expect(everyMinute).toBeTruthy()
  })

  it('includes hourly preset', () => {
    const hourly = CRON_PRESETS.find((p) => p.value === '0 * * * *')
    expect(hourly).toBeTruthy()
  })

  it('includes daily midnight preset', () => {
    const daily = CRON_PRESETS.find((p) => p.value === '0 0 * * *')
    expect(daily).toBeTruthy()
  })
})
