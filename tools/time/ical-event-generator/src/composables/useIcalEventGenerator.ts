import { computed, ref, watch } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { buildTimeZoneOptions } from '../utils/timeZoneOptions'
import {
  formatInTimeZone,
  formatOffsetLabel,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateInput,
  parseDateTimeInput,
  toUtcTimestamp,
} from '../utils/timeZone'
import {
  addLocalDays,
  generateUid,
  startOfLocalDay,
  toDateParts,
  toLocalParts,
} from '../utils/icalEventHelpers'
import {
  buildIcsCalendar,
  buildRrule,
  formatIcsDate,
  formatIcsDateTime,
  formatUtcDateTime,
  formatTrigger,
  type IcsDateValue,
  type IcsEvent,
  type ReminderUnit,
} from '../utils/ics'

type OutputMode = 'utc' | 'tzid'
type Frequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
type EndMode = 'never' | 'count' | 'until'

type ReminderForm = {
  amount: number
  unit: ReminderUnit
  description: string
}

export function useIcalEventGenerator() {
  const timeZoneOptions = buildTimeZoneOptions(Date.now())
  const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const defaultTimeZone = isTimeZoneSupported(resolvedTimeZone) ? resolvedTimeZone : 'UTC'

  const title = useStorage('tools:ical-event-generator:title', 'New Event')
  const location = useStorage('tools:ical-event-generator:location', '')
  const description = useStorage('tools:ical-event-generator:description', '')
  const url = useStorage('tools:ical-event-generator:url', '')
  const uid = useStorage('tools:ical-event-generator:uid', generateUid())

  const isAllDay = useStorage('tools:ical-event-generator:all-day', false)
  const timeZone = useStorage('tools:ical-event-generator:time-zone', defaultTimeZone)
  const outputMode = useStorage<OutputMode>('tools:ical-event-generator:output-mode', 'utc')

  const defaultRangeStart = Date.now()
  const dateRange = useStorage<[number, number] | null>('tools:ical-event-generator:date-range', [
    defaultRangeStart,
    defaultRangeStart + 60 * 60 * 1000,
  ])

  const recurrenceFrequency = useStorage<Frequency>(
    'tools:ical-event-generator:recurrence-frequency',
    'none',
  )
  const recurrenceInterval = useStorage<number>('tools:ical-event-generator:recurrence-interval', 1)
  const recurrenceWeekdays = useStorage<string[]>(
    'tools:ical-event-generator:recurrence-weekdays',
    ['MO'],
  )
  const recurrenceMonthDay = useStorage<number>(
    'tools:ical-event-generator:recurrence-month-day',
    new Date().getDate(),
  )
  const recurrenceMonth = useStorage<number>(
    'tools:ical-event-generator:recurrence-month',
    new Date().getMonth() + 1,
  )
  const recurrenceEndMode = useStorage<EndMode>(
    'tools:ical-event-generator:recurrence-end-mode',
    'never',
  )
  const recurrenceCount = useStorage<number>('tools:ical-event-generator:recurrence-count', 10)
  const recurrenceUntilInput = useStorage('tools:ical-event-generator:recurrence-until', '')

  const remindersEnabled = useStorage('tools:ical-event-generator:reminders-enabled', false)
  const reminders = useStorage<ReminderForm[]>('tools:ical-event-generator:reminders', [
    { amount: 15, unit: 'minutes', description: '' },
  ])
  const reminderDefault = ref('Reminder')

  if (!isTimeZoneSupported(timeZone.value)) {
    timeZone.value = defaultTimeZone
  }

  const rangeStart = computed(() => (dateRange.value ? dateRange.value[0] : null))
  const rangeEnd = computed(() => (dateRange.value ? dateRange.value[1] : null))

  const startParts = computed(() => {
    if (rangeStart.value === null) return null
    return toLocalParts(rangeStart.value)
  })

  const endParts = computed(() => {
    if (rangeEnd.value === null) return null
    return toLocalParts(rangeEnd.value)
  })

  const startDateParts = computed(() => (startParts.value ? toDateParts(startParts.value) : null))
  const endDateParts = computed(() => (endParts.value ? toDateParts(endParts.value) : null))

  const startTimestamp = computed(() => {
    if (!startParts.value) return null
    const parts = isAllDay.value ? toDateParts(startParts.value) : startParts.value
    return toUtcTimestamp(parts, timeZone.value)
  })

  const endTimestamp = computed(() => {
    if (!endParts.value) return null
    const parts = isAllDay.value ? toDateParts(endParts.value) : endParts.value
    return toUtcTimestamp(parts, timeZone.value)
  })

  const rangeErrorKey = computed(() => {
    if (!dateRange.value) return ''
    if (!startParts.value || !endParts.value) return 'invalid-date-time'

    if (isAllDay.value) {
      if (!startDateParts.value || !endDateParts.value) return 'invalid-date'
      const startDate = Date.UTC(
        startDateParts.value.year,
        startDateParts.value.month - 1,
        startDateParts.value.day,
      )
      const endDate = Date.UTC(
        endDateParts.value.year,
        endDateParts.value.month - 1,
        endDateParts.value.day,
      )
      return endDate <= startDate ? 'end-before-start' : ''
    }

    if (rangeStart.value !== null && rangeEnd.value !== null) {
      return rangeEnd.value <= rangeStart.value ? 'end-before-start' : ''
    }

    return ''
  })

  const offsetLabel = computed(() => {
    if (!isTimeZoneSupported(timeZone.value)) return ''
    const reference = startTimestamp.value ?? Date.now()
    return formatOffsetLabel(getTimeZoneOffsetMs(reference, timeZone.value))
  })

  watch(
    isAllDay,
    (allDay) => {
      const range = dateRange.value
      if (!range || range.length < 2) return
      const [start, end] = range
      if (start === null || end === null) return

      if (allDay) {
        const normalizedStart = startOfLocalDay(start)
        let normalizedEnd = startOfLocalDay(end)
        if (normalizedEnd <= normalizedStart) {
          normalizedEnd = addLocalDays(normalizedStart, 1)
        }
        dateRange.value = [normalizedStart, normalizedEnd]
        return
      }

      if (end <= start) {
        dateRange.value = [start, start + 60 * 60 * 1000]
      }
    },
    { immediate: true },
  )

  const recurrenceUntilParts = computed(() => {
    if (recurrenceEndMode.value !== 'until') return null
    if (!recurrenceUntilInput.value.trim()) return null
    return isAllDay.value
      ? parseDateInput(recurrenceUntilInput.value)
      : parseDateTimeInput(recurrenceUntilInput.value)
  })

  const recurrenceUntilStatus = computed(() => {
    if (recurrenceEndMode.value !== 'until') return undefined
    if (!recurrenceUntilInput.value.trim()) return 'error'
    return recurrenceUntilParts.value ? 'success' : 'error'
  })

  const recurrenceUntilErrorKey = computed(() => {
    if (recurrenceEndMode.value !== 'until') return ''
    if (!recurrenceUntilInput.value.trim()) {
      return isAllDay.value ? 'invalid-date' : 'invalid-date-time'
    }
    if (recurrenceUntilParts.value) return ''
    return isAllDay.value ? 'invalid-date' : 'invalid-date-time'
  })

  const recurrenceUntilValue = computed(() => {
    if (!recurrenceUntilParts.value) return ''
    if (isAllDay.value) {
      return formatIcsDate(recurrenceUntilParts.value)
    }
    const untilUtc = toUtcTimestamp(recurrenceUntilParts.value, timeZone.value)
    return formatUtcDateTime(untilUtc)
  })

  const rruleValue = computed(() => {
    if (recurrenceFrequency.value === 'none') return ''

    const interval = Math.max(1, Math.round(recurrenceInterval.value || 1))
    const monthDay = Math.min(31, Math.max(1, Math.round(recurrenceMonthDay.value || 1)))
    const month = Math.min(12, Math.max(1, Math.round(recurrenceMonth.value || 1)))

    const rule: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
      interval?: number
      byDay?: string[]
      byMonthDay?: number
      byMonth?: number
      count?: number
      until?: string
    } = {
      frequency: recurrenceFrequency.value.toUpperCase() as
        | 'DAILY'
        | 'WEEKLY'
        | 'MONTHLY'
        | 'YEARLY',
      interval,
    }

    if (recurrenceFrequency.value === 'weekly' && recurrenceWeekdays.value.length) {
      rule.byDay = recurrenceWeekdays.value
    }

    if (recurrenceFrequency.value === 'monthly') {
      rule.byMonthDay = monthDay
    }

    if (recurrenceFrequency.value === 'yearly') {
      rule.byMonth = month
      rule.byMonthDay = monthDay
    }

    if (recurrenceEndMode.value === 'count') {
      const count = Math.max(1, Math.round(recurrenceCount.value || 1))
      rule.count = count
    }

    if (recurrenceEndMode.value === 'until') {
      if (!recurrenceUntilValue.value) return ''
      rule.until = recurrenceUntilValue.value
    }

    return buildRrule(rule)
  })

  const alarmEntries = computed(() => {
    if (!remindersEnabled.value) return []

    return reminders.value
      .map((reminder) => {
        const trigger = formatTrigger(reminder.amount, reminder.unit)
        if (!trigger) return null
        const message = reminder.description.trim() || reminderDefault.value || 'Reminder'
        return { trigger, description: message }
      })
      .filter(Boolean) as Array<{ trigger: string; description: string }>
  })

  const dtstartValue = computed<IcsDateValue | null>(() => {
    if (!startParts.value) return null
    if (isAllDay.value) {
      return { type: 'date', value: formatIcsDate(startParts.value) }
    }
    if (!startTimestamp.value) return null
    if (outputMode.value === 'tzid') {
      const localParts = parseDateTimeInput(formatInTimeZone(startTimestamp.value, timeZone.value))
      if (!localParts) return null
      return { type: 'date-time', value: formatIcsDateTime(localParts), tzid: timeZone.value }
    }
    return { type: 'date-time', value: formatUtcDateTime(startTimestamp.value) }
  })

  const dtendValue = computed<IcsDateValue | null>(() => {
    if (isAllDay.value) {
      if (!endDateParts.value) return null
      return { type: 'date', value: formatIcsDate(endDateParts.value) }
    }
    if (!endTimestamp.value) return null
    if (outputMode.value === 'tzid') {
      const localParts = parseDateTimeInput(formatInTimeZone(endTimestamp.value, timeZone.value))
      if (!localParts) return null
      return { type: 'date-time', value: formatIcsDateTime(localParts), tzid: timeZone.value }
    }
    return { type: 'date-time', value: formatUtcDateTime(endTimestamp.value) }
  })

  const outputErrorKey = computed(() => {
    if (!dateRange.value) return ''
    if (rangeErrorKey.value) return rangeErrorKey.value
    if (recurrenceUntilErrorKey.value) return recurrenceUntilErrorKey.value
    return ''
  })

  const icsContent = computed(() => {
    const dtstart = dtstartValue.value
    if (!dtstart || outputErrorKey.value) return ''

    const event: IcsEvent = {
      uid: uid.value,
      dtstamp: formatUtcDateTime(Date.now()),
      summary: title.value.trim() || undefined,
      description: description.value.trim() || undefined,
      location: location.value.trim() || undefined,
      url: url.value.trim() || undefined,
      dtstart,
      dtend: dtendValue.value ?? undefined,
      rrule: rruleValue.value || undefined,
      alarms: alarmEntries.value.length ? alarmEntries.value : undefined,
    }

    const calendarTimeZone =
      !isAllDay.value && outputMode.value === 'tzid' ? timeZone.value : undefined

    return buildIcsCalendar(event, {
      timeZone: calendarTimeZone,
    })
  })

  const icsBlob = computed(() =>
    icsContent.value ? new Blob([icsContent.value], { type: 'text/calendar;charset=utf-8' }) : null,
  )
  const icsUrl = useObjectUrl(icsBlob)
  const icsHref = computed(() => icsUrl.value || undefined)

  function regenerateUid() {
    uid.value = generateUid()
  }

  return {
    timeZoneOptions,
    title,
    location,
    description,
    url,
    uid,
    regenerateUid,
    isAllDay,
    timeZone,
    outputMode,
    dateRange,
    offsetLabel,
    rangeErrorKey,
    recurrenceFrequency,
    recurrenceInterval,
    recurrenceWeekdays,
    recurrenceMonthDay,
    recurrenceMonth,
    recurrenceEndMode,
    recurrenceCount,
    recurrenceUntilInput,
    recurrenceUntilStatus,
    recurrenceUntilErrorKey,
    remindersEnabled,
    reminders,
    reminderDefault,
    icsContent,
    icsHref,
    outputErrorKey,
  }
}
