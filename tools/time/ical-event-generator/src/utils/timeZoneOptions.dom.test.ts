import { describe, it, expect } from 'vitest'
import { buildTimeZoneOptions } from './timeZoneOptions'

describe('buildTimeZoneOptions', () => {
  it('builds options with labels and values', () => {
    const options = buildTimeZoneOptions(0)
    expect(options.length).toBeGreaterThan(0)
    expect(options[0]).toHaveProperty('label')
    expect(options[0]).toHaveProperty('value')
  })
})
