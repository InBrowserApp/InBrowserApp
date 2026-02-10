import { describe, expect, it } from 'vitest'
import * as info from './info'

describe('ical event generator info', () => {
  it('exposes core tool metadata', () => {
    expect(info.toolID).toBe('ical-event-generator')
    expect(info.path).toBe('/tools/ical-event-generator')
    expect(info.tags).toContain('ical')
    expect(info.features).toContain('offline')
    expect(info.meta.en.name).toBe('iCal Event Generator')
  })
})
