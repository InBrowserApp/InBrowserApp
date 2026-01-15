import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import IcalEventGenerator from './IcalEventGenerator.vue'

const mountComponent = () =>
  mount(IcalEventGenerator, {
    global: {
      stubs: {
        QRCodePreview: true,
        QRCodeDownloadButtons: true,
        CopyToClipboardButton: true,
      },
    },
  })

const seedStorage = (overrides: Record<string, string> = {}) => {
  const defaults: Record<string, string> = {
    'tools:ical-event-generator:title': 'Team Sync',
    'tools:ical-event-generator:location': 'Room 1',
    'tools:ical-event-generator:description': 'Line1\nLine2',
    'tools:ical-event-generator:url': 'https://example.com',
    'tools:ical-event-generator:uid': 'uid@example.com',
    'tools:ical-event-generator:all-day': 'false',
    'tools:ical-event-generator:time-zone': 'UTC',
    'tools:ical-event-generator:output-mode': 'utc',
    'tools:ical-event-generator:start-input': '2024-01-02 10:00:00',
    'tools:ical-event-generator:end-input': '',
    'tools:ical-event-generator:recurrence-frequency': 'weekly',
    'tools:ical-event-generator:recurrence-interval': '1',
    'tools:ical-event-generator:recurrence-weekdays': JSON.stringify(['MO', 'WE']),
    'tools:ical-event-generator:recurrence-month-day': '2',
    'tools:ical-event-generator:recurrence-month': '1',
    'tools:ical-event-generator:recurrence-end-mode': 'count',
    'tools:ical-event-generator:recurrence-count': '3',
    'tools:ical-event-generator:recurrence-until': '',
    'tools:ical-event-generator:reminders-enabled': 'true',
    'tools:ical-event-generator:reminders': JSON.stringify([
      { amount: 30, unit: 'minutes', description: '' },
    ]),
  }

  Object.entries({ ...defaults, ...overrides }).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })
}

const getOutputText = (wrapper: ReturnType<typeof mountComponent>) => {
  const textareas = wrapper.findAll('textarea')
  const output = textareas.find((node) => (node.element as HTMLTextAreaElement).readOnly)
  if (!output) {
    throw new Error('Output textarea not found')
  }
  return (output.element as HTMLTextAreaElement).value
}

describe('IcalEventGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  it('generates UTC output with recurrence and reminders', async () => {
    seedStorage()
    const wrapper = mountComponent()
    await flushPromises()

    const output = getOutputText(wrapper)
    expect(output).toContain('BEGIN:VCALENDAR')
    expect(output).toContain('SUMMARY:Team Sync')
    expect(output).toContain('DTSTART:20240102T100000Z')
    expect(output).toContain('RRULE:FREQ=WEEKLY;BYDAY=MO,WE;COUNT=3')
    expect(output).toContain('TRIGGER:-PT30M')
    expect(output).toContain('DESCRIPTION:Reminder')
  })

  it('generates all-day events with exclusive end dates', async () => {
    seedStorage({
      'tools:ical-event-generator:all-day': 'true',
      'tools:ical-event-generator:start-input': '2024-05-01',
      'tools:ical-event-generator:end-input': '',
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': 'false',
    })

    const wrapper = mountComponent()
    await flushPromises()

    const output = getOutputText(wrapper)
    expect(output).toContain('DTSTART;VALUE=DATE:20240501')
    expect(output).toContain('DTEND;VALUE=DATE:20240502')
    expect(output).not.toContain('TZID=')
  })

  it('uses TZID output when selected', async () => {
    seedStorage({
      'tools:ical-event-generator:time-zone': 'Asia/Tokyo',
      'tools:ical-event-generator:output-mode': 'tzid',
      'tools:ical-event-generator:start-input': '2024-01-02 10:00:00',
      'tools:ical-event-generator:end-input': '2024-01-02 11:00:00',
      'tools:ical-event-generator:recurrence-frequency': 'none',
      'tools:ical-event-generator:reminders-enabled': 'false',
    })

    const wrapper = mountComponent()
    await flushPromises()

    const output = getOutputText(wrapper)
    expect(output).toContain('X-WR-TIMEZONE:Asia/Tokyo')
    expect(output).toContain('DTSTART;TZID=Asia/Tokyo:20240102T100000')
  })
})
