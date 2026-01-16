import { describe, it, expect } from 'vitest'
import {
  escapeIcsText,
  foldLine,
  buildDateLine,
  formatIcsDate,
  formatIcsDateTime,
  formatUtcDateTime,
  buildRrule,
  formatTrigger,
  buildIcsCalendar,
} from './ics'

describe('escapeIcsText', () => {
  it('escapes special characters and newlines', () => {
    expect(escapeIcsText('Hello, world; \\test\nLine')).toBe('Hello\\, world\\; \\\\test\\nLine')
  })
})

describe('foldLine', () => {
  it('folds long lines with a space prefix', () => {
    const line = '1234567890ABCDEFGHIJ'
    expect(foldLine(line, 10)).toBe('1234567890\r\n ABCDEFGHI\r\n J')
  })
})

describe('buildDateLine', () => {
  it('builds date lines with value types and tzid', () => {
    expect(buildDateLine('DTSTART', { type: 'date', value: '20240102' })).toBe(
      'DTSTART;VALUE=DATE:20240102',
    )
    expect(
      buildDateLine('DTSTART', { type: 'date-time', value: '20240102T030405', tzid: 'UTC' }),
    ).toBe('DTSTART;TZID=UTC:20240102T030405')
  })
})

describe('formatters', () => {
  it('formats date and date-time values', () => {
    expect(formatIcsDate({ year: 2024, month: 1, day: 2 })).toBe('20240102')
    expect(
      formatIcsDateTime({
        year: 2024,
        month: 1,
        day: 2,
        hour: 3,
        minute: 4,
        second: 5,
      }),
    ).toBe('20240102T030405')
  })

  it('formats UTC timestamps', () => {
    expect(formatUtcDateTime(Date.UTC(2024, 0, 2, 3, 4, 5))).toBe('20240102T030405Z')
  })
})

describe('buildRrule', () => {
  it('builds recurrence rules', () => {
    expect(
      buildRrule({
        frequency: 'WEEKLY',
        interval: 2,
        byDay: ['MO', 'WE'],
        count: 5,
      }),
    ).toBe('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE;COUNT=5')
  })
})

describe('formatTrigger', () => {
  it('formats alarm triggers', () => {
    expect(formatTrigger(15, 'minutes')).toBe('-PT15M')
    expect(formatTrigger(2, 'hours')).toBe('-PT2H')
    expect(formatTrigger(3, 'days')).toBe('-P3D')
    expect(formatTrigger(1, 'weeks')).toBe('-P1W')
  })
})

describe('buildIcsCalendar', () => {
  it('builds a full calendar payload', () => {
    const content = buildIcsCalendar(
      {
        uid: 'uid@example.com',
        dtstamp: '20240102T030405Z',
        summary: 'Team Sync',
        description: 'Line1\nLine2',
        location: 'Room 1',
        url: 'https://example.com',
        dtstart: { type: 'date-time', value: '20240102T030405Z' },
        dtend: { type: 'date-time', value: '20240102T040405Z' },
        rrule: 'FREQ=DAILY;COUNT=2',
        alarms: [{ trigger: '-PT15M', description: 'Reminder' }],
      },
      { timeZone: 'UTC' },
    )

    expect(content).toContain('BEGIN:VCALENDAR')
    expect(content).toContain('UID:uid@example.com')
    expect(content).toContain('DTSTART:20240102T030405Z')
    expect(content).toContain('DTEND:20240102T040405Z')
    expect(content).toContain('RRULE:FREQ=DAILY;COUNT=2')
    expect(content).toContain('DESCRIPTION:Line1\\nLine2')
    expect(content).toContain('BEGIN:VALARM')
    expect(content).toContain('TRIGGER:-PT15M')
    expect(content).toContain('X-WR-TIMEZONE:UTC')
  })
})
