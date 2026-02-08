import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref, type Ref } from 'vue'
import { useIcalEventGenerator } from './useIcalEventGenerator'
import * as timeZoneUtils from '../utils/timeZone'

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
    vi.restoreAllMocks()
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

  it('falls back to UTC and handles unsupported offset labels', () => {
    setStorage({
      'tools:ical-event-generator:title': 'Fallback',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
      'tools:ical-event-generator:time-zone': 'Invalid/Zone',
      'tools:ical-event-generator:output-mode': 'utc',
      'tools:ical-event-generator:date-range': null,
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': false,
    })

    const state = useIcalEventGenerator()

    const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const expectedTimeZone = timeZoneUtils.isTimeZoneSupported(resolvedTimeZone)
      ? resolvedTimeZone
      : 'UTC'

    expect(state.timeZone.value).toBe(expectedTimeZone)
    expect(state.rangeErrorKey.value).toBe('')
    expect(state.outputErrorKey.value).toBe('')
    expect(state.icsContent.value).toBe('')
    expect(state.offsetLabel.value.startsWith('UTC')).toBe(true)

    state.timeZone.value = 'Invalid/Zone'
    expect(state.offsetLabel.value).toBe('')
  })

  it('handles watcher guards and invalid date range branches', async () => {
    const start = Date.UTC(2024, 0, 2, 10, 0, 0)

    setStorage({
      'tools:ical-event-generator:title': 'Guard',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
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
    expect(normalizedRange[1]).toBe(start + 60 * 60 * 1000)

    state.dateRange.value = [] as unknown as [number, number]
    state.isAllDay.value = true
    await nextTick()

    state.dateRange.value = [null, start] as unknown as [number, number]
    state.isAllDay.value = false
    await nextTick()

    state.dateRange.value = [start, null] as unknown as [number, number]
    expect(state.rangeErrorKey.value).toBe('invalid-date-time')
    expect(state.outputErrorKey.value).toBe('invalid-date-time')
    expect(state.icsContent.value).toBe('')
  })

  it('builds monthly and yearly recurrence rules with until values', () => {
    setStorage({
      'tools:ical-event-generator:title': 'Rules',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': true,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'utc',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 3, 10, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'monthly',
      'tools:ical-event-generator:recurrence-interval': 1,
      'tools:ical-event-generator:recurrence-month-day': 5,
      'tools:ical-event-generator:recurrence-month': 2,
      'tools:ical-event-generator:recurrence-end-mode': 'until',
      'tools:ical-event-generator:recurrence-until': '2024-02-01',
      'tools:ical-event-generator:reminders-enabled': false,
    })

    const state = useIcalEventGenerator()

    expect(state.recurrenceUntilStatus.value).toBe('success')
    expect(state.recurrenceUntilErrorKey.value).toBe('')
    expect(state.icsContent.value).toContain('RRULE:FREQ=MONTHLY')
    expect(state.icsContent.value).toContain('BYMONTHDAY=5')
    expect(state.icsContent.value).toContain('UNTIL=20240201')

    state.recurrenceFrequency.value = 'yearly'

    expect(state.icsContent.value).toContain('RRULE:FREQ=YEARLY')
    expect(state.icsContent.value).toContain('BYMONTH=2')
    expect(state.icsContent.value).toContain('BYMONTHDAY=5')

    state.recurrenceEndMode.value = 'never'
    expect(state.recurrenceUntilStatus.value).toBeUndefined()
    expect(state.recurrenceUntilErrorKey.value).toBe('')

    state.recurrenceEndMode.value = 'until'
    state.isAllDay.value = false
    state.recurrenceUntilInput.value = 'not a date time'

    expect(state.recurrenceUntilStatus.value).toBe('error')
    expect(state.recurrenceUntilErrorKey.value).toBe('invalid-date-time')
    expect(state.outputErrorKey.value).toBe('invalid-date-time')
    expect(state.icsContent.value).toBe('')

    state.recurrenceUntilInput.value = '2024-02-01 13:45:00'
    expect(state.recurrenceUntilStatus.value).toBe('success')
    expect(state.recurrenceUntilErrorKey.value).toBe('')
    expect(state.icsContent.value).toContain('UNTIL=')
  })

  it('drops reminders with invalid trigger values', () => {
    setStorage({
      'tools:ical-event-generator:title': 'Reminders',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'utc',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 2, 11, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': true,
      'tools:ical-event-generator:reminders': [{ amount: 0, unit: 'minutes', description: '' }],
    })

    const state = useIcalEventGenerator()

    expect(state.icsContent.value).not.toContain('BEGIN:VALARM')
  })

  it('uses fallback reminder text when both custom reminder labels are empty', () => {
    setStorage({
      'tools:ical-event-generator:title': 'Fallback reminder',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'utc',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 2, 11, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': true,
      'tools:ical-event-generator:reminders': [{ amount: 5, unit: 'minutes', description: '   ' }],
    })

    const state = useIcalEventGenerator()
    state.reminderDefault.value = ''

    expect(state.icsContent.value).toContain('DESCRIPTION:Reminder')
  })

  it('normalizes zero recurrence values to minimum supported numbers', () => {
    setStorage({
      'tools:ical-event-generator:title': 'Normalize',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': true,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'utc',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 3, 10, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'yearly',
      'tools:ical-event-generator:recurrence-interval': 0,
      'tools:ical-event-generator:recurrence-month-day': 0,
      'tools:ical-event-generator:recurrence-month': 0,
      'tools:ical-event-generator:recurrence-end-mode': 'count',
      'tools:ical-event-generator:recurrence-count': 0,
      'tools:ical-event-generator:reminders-enabled': false,
    })

    const state = useIcalEventGenerator()

    expect(state.icsContent.value).toContain('RRULE:FREQ=YEARLY')
    expect(state.icsContent.value).toContain('BYMONTH=1')
    expect(state.icsContent.value).toContain('BYMONTHDAY=1')
    expect(state.icsContent.value).toContain('COUNT=1')
  })

  it('omits DTEND when the end timestamp resolves to zero', () => {
    let callCount = 0
    const originalToUtcTimestamp = timeZoneUtils.toUtcTimestamp

    vi.spyOn(timeZoneUtils, 'toUtcTimestamp').mockImplementation((...args) => {
      callCount += 1
      if (callCount === 1) {
        return 1
      }
      if (callCount === 2) {
        return 0
      }
      return originalToUtcTimestamp(...args)
    })

    setStorage({
      'tools:ical-event-generator:title': 'Missing end',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'utc',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 2, 11, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': false,
    })

    const state = useIcalEventGenerator()

    expect(state.icsContent.value).toContain('DTSTART:')
    expect(state.icsContent.value).not.toContain('DTEND:')
  })

  it('keeps DTSTART but drops DTEND when TZID end parsing fails', () => {
    const originalParseDateTimeInput = timeZoneUtils.parseDateTimeInput
    let parseCallCount = 0

    vi.spyOn(timeZoneUtils, 'parseDateTimeInput').mockImplementation((value) => {
      parseCallCount += 1
      if (parseCallCount === 2) {
        return null
      }
      return originalParseDateTimeInput(value)
    })

    setStorage({
      'tools:ical-event-generator:title': 'TZID end parse fail',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'tzid',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 2, 11, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': false,
    })

    const state = useIcalEventGenerator()

    expect(state.icsContent.value).toContain('DTSTART;TZID=UTC:')
    expect(state.icsContent.value).not.toContain('DTEND;TZID=UTC:')
  })

  it('returns empty output when TZID local parsing fails', () => {
    vi.spyOn(timeZoneUtils, 'parseDateTimeInput').mockReturnValue(null)

    setStorage({
      'tools:ical-event-generator:title': 'Parse fail',
      'tools:ical-event-generator:uid': 'uid@example.com',
      'tools:ical-event-generator:all-day': false,
      'tools:ical-event-generator:time-zone': 'UTC',
      'tools:ical-event-generator:output-mode': 'tzid',
      'tools:ical-event-generator:date-range': [
        Date.UTC(2024, 0, 2, 10, 0, 0),
        Date.UTC(2024, 0, 2, 11, 0, 0),
      ],
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': false,
    })

    const state = useIcalEventGenerator()

    expect(state.icsContent.value).toBe('')
  })
})
