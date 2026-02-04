import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref, type Ref } from 'vue'
import { useIcalEventGenerator } from './useIcalEventGenerator'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', async () => {
  const { computed, ref } = await import('vue')

  return {
    useStorage: (key: string, initialValue: unknown) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key) as Ref<unknown>
    },
    useObjectUrl: (source: Ref<Blob | null>) => computed(() => (source.value ? 'blob:mock' : '')),
  }
})

vi.mock('../utils/icalEventHelpers', async () => {
  const actual = await vi.importActual<typeof import('../utils/icalEventHelpers')>(
    '../utils/icalEventHelpers',
  )
  return {
    ...actual,
    generateUid: () => 'generated@example.com',
  }
})

const setStorage = (values: Record<string, unknown>) => {
  Object.entries(values).forEach(([key, value]) => {
    storage.set(key, ref(value))
  })
}

describe('useIcalEventGenerator', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('builds TZID output with recurrence and reminders', () => {
    setStorage({
      'tools:ical-event-generator:title': 'Team Sync',
      'tools:ical-event-generator:location': 'Room 1',
      'tools:ical-event-generator:description': 'Line1',
      'tools:ical-event-generator:url': 'https://example.com',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'tzid',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 2, 11, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'weekly',
      'tools:ical-event-generator:recurrence-interval': 2,
      'tools:ical-event-generator:recurrence-weekdays': ['MO', 'WE'],
      'tools:ical-event-generator:recurrence-end-mode': 'count',
      'tools:ical-event-generator:recurrence-count': 3,
      'tools:ical-event-generator:recurrence-month-day': 5,
      'tools:ical-event-generator:recurrence-month': 1,
      'tools:ical-event-generator:recurrence-until': '',
      'tools:ical-event-generator:reminders-enabled': true,
      'tools:ical-event-generator:reminders': [{ amount: 30, unit: 'minutes', description: '' }],
    })

    const state = useIcalEventGenerator()

    expect(state.icsContent.value).toContain('BEGIN:VCALENDAR')
    expect(state.icsContent.value).toContain('RRULE:FREQ=WEEKLY')
    expect(state.icsContent.value).toContain('BYDAY=MO,WE')
    expect(state.icsContent.value).toContain('COUNT=3')
    expect(state.icsContent.value).toContain('TRIGGER:-PT30M')
    expect(state.icsContent.value).toContain('DESCRIPTION:Reminder')
    expect(state.icsContent.value).toContain('X-WR-TIMEZONE:UTC')
    expect(state.icsContent.value).toContain('DTSTART;TZID=UTC')
    expect(state.icsHref.value).toBe('blob:mock')
  })

  it('normalizes all-day ranges and generates date-only output', async () => {
    const start = new Date(2024, 0, 2, 10, 0, 0).getTime()

    setStorage({
      'tools:ical-event-generator:title': 'All Day',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': true,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'utc',
      'tools:ical-event-generator:date-range': [start, start],
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': false,
    })

    const state = useIcalEventGenerator()
    await nextTick()

    const normalizedRange = state.dateRange.value
    expect(normalizedRange).toBeTruthy()
    if (!normalizedRange) {
      throw new Error('Expected date range to be defined')
    }
    expect(normalizedRange[1]).toBeGreaterThan(normalizedRange[0])

    expect(state.icsContent.value).toContain('DTSTART;VALUE=DATE:')
    expect(state.icsContent.value).toContain('DTEND;VALUE=DATE:')

    state.regenerateUid()
    expect(state.uid.value).toBe('generated@example.com')
  })

  it('reports invalid recurrence until input', () => {
    setStorage({
      'tools:ical-event-generator:title': 'Invalid',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'utc',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 2, 11, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'daily',
      'tools:ical-event-generator:recurrence-end-mode': 'until',
      'tools:ical-event-generator:recurrence-until': '',
      'tools:ical-event-generator:reminders-enabled': false,
    })

    const state = useIcalEventGenerator()

    expect(state.recurrenceUntilStatus.value).toBe('error')
    expect(state.recurrenceUntilErrorKey.value).toBe('invalid-date-time')
    expect(state.outputErrorKey.value).toBe('invalid-date-time')
    expect(state.icsContent.value).toBe('')
  })
})
