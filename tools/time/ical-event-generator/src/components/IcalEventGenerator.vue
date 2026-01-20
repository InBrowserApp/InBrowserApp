<template>
  <n-grid cols="1 900:2" x-gap="16" y-gap="16">
    <n-gi>
      <ToolSectionHeader>{{ t('event-details') }}</ToolSectionHeader>
      <ToolSection>
        <n-grid cols="1 900:2" x-gap="12" y-gap="12">
          <n-form-item-gi :label="t('title')" :show-feedback="false">
            <n-input v-model:value="title" />
          </n-form-item-gi>
          <n-form-item-gi :label="t('location')" :show-feedback="false">
            <n-input v-model:value="location" />
          </n-form-item-gi>
        </n-grid>

        <n-grid cols="1" y-gap="12" style="margin-top: 12px">
          <n-form-item-gi :label="t('description')" :show-feedback="false">
            <n-input v-model:value="description" type="textarea" :autosize="{ minRows: 3 }" />
          </n-form-item-gi>
        </n-grid>

        <n-grid cols="1 900:2" x-gap="12" y-gap="12" style="margin-top: 12px">
          <n-form-item-gi :label="t('url')" :show-feedback="false">
            <n-input v-model:value="url" />
          </n-form-item-gi>
          <n-form-item-gi :label="t('uid')" :show-feedback="false" content-style="width: 100%">
            <n-flex align="center" :size="8" :wrap="false" style="width: 100%">
              <n-input v-model:value="uid" readonly style="flex: 1; min-width: 0; width: 100%" />
              <n-button tertiary size="small" @click="regenerateUid">
                <template #icon>
                  <n-icon :component="ArrowCounterclockwise16Regular" />
                </template>
                {{ t('new-uid') }}
              </n-button>
            </n-flex>
          </n-form-item-gi>
        </n-grid>
      </ToolSection>

      <ToolSectionHeader>{{ t('date-time') }}</ToolSectionHeader>
      <ToolSection>
        <n-grid cols="1" y-gap="12">
          <n-form-item-gi :label="t('all-day')" :show-feedback="false">
            <n-switch v-model:value="isAllDay" />
          </n-form-item-gi>
        </n-grid>

        <n-grid v-if="!isAllDay" cols="1 900:2" x-gap="12" y-gap="12" style="margin-top: 12px">
          <n-form-item-gi
            :label="t('time-zone')"
            :show-feedback="false"
            content-style="width: 100%"
          >
            <n-flex vertical :size="4" style="width: 100%">
              <n-select
                v-model:value="timeZone"
                :options="timeZoneOptions"
                filterable
                :placeholder="t('timezone-placeholder')"
                style="width: 100%"
              />
              <n-text v-if="offsetLabel" depth="3"> {{ t('offset') }}: {{ offsetLabel }} </n-text>
            </n-flex>
          </n-form-item-gi>
          <n-form-item-gi :label="t('output-mode')" :show-feedback="false">
            <n-radio-group v-model:value="outputMode">
              <n-flex :size="12">
                <n-radio value="utc">{{ t('output-utc') }}</n-radio>
                <n-radio value="tzid">{{ t('output-tzid') }}</n-radio>
              </n-flex>
            </n-radio-group>
          </n-form-item-gi>
        </n-grid>

        <n-grid cols="1" y-gap="12" style="margin-top: 12px">
          <n-form-item-gi :label="`${t('start')} / ${t('end')}`" :show-feedback="!!rangeError">
            <n-date-picker
              v-model:value="dateRange"
              type="datetimerange"
              clearable
              style="width: 100%"
            />
            <template v-if="rangeError" #feedback>
              <n-text type="error">{{ rangeError }}</n-text>
            </template>
          </n-form-item-gi>
        </n-grid>
        <n-text v-if="isAllDay" depth="3" style="margin-top: 4px">
          {{ t('all-day-end-hint') }}
        </n-text>
      </ToolSection>

      <ToolSectionHeader>{{ t('recurrence') }}</ToolSectionHeader>
      <ToolSection>
        <n-grid cols="1 900:2" x-gap="12" y-gap="12">
          <n-form-item-gi :label="t('repeat')" :show-feedback="false">
            <n-select v-model:value="recurrenceFrequency" :options="frequencyOptions" />
          </n-form-item-gi>
          <n-form-item-gi
            v-if="recurrenceFrequency !== 'none'"
            :label="t('interval')"
            :show-feedback="false"
          >
            <n-input-number
              v-model:value="recurrenceInterval"
              :min="1"
              :precision="0"
              style="width: 100%"
            />
          </n-form-item-gi>
        </n-grid>

        <n-form-item-gi
          v-if="recurrenceFrequency === 'weekly'"
          :label="t('weekdays')"
          :show-feedback="false"
        >
          <n-checkbox-group v-model:value="recurrenceWeekdays">
            <n-flex :size="8" wrap>
              <n-checkbox
                v-for="option in weekdayOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </n-checkbox>
            </n-flex>
          </n-checkbox-group>
        </n-form-item-gi>

        <n-grid v-if="recurrenceFrequency === 'monthly'" cols="1 900:2" x-gap="12" y-gap="12">
          <n-form-item-gi :label="t('month-day')" :show-feedback="false">
            <n-input-number
              v-model:value="recurrenceMonthDay"
              :min="1"
              :max="31"
              :precision="0"
              style="width: 100%"
            />
          </n-form-item-gi>
        </n-grid>

        <n-grid v-if="recurrenceFrequency === 'yearly'" cols="1 900:2" x-gap="12" y-gap="12">
          <n-form-item-gi :label="t('month')" :show-feedback="false">
            <n-input-number
              v-model:value="recurrenceMonth"
              :min="1"
              :max="12"
              :precision="0"
              style="width: 100%"
            />
          </n-form-item-gi>
          <n-form-item-gi :label="t('month-day')" :show-feedback="false">
            <n-input-number
              v-model:value="recurrenceMonthDay"
              :min="1"
              :max="31"
              :precision="0"
              style="width: 100%"
            />
          </n-form-item-gi>
        </n-grid>

        <n-grid v-if="recurrenceFrequency !== 'none'" cols="1 900:2" x-gap="12" y-gap="12">
          <n-form-item-gi :label="t('ends')" :show-feedback="false">
            <n-select v-model:value="recurrenceEndMode" :options="endModeOptions" />
          </n-form-item-gi>
          <n-form-item-gi
            v-if="recurrenceEndMode === 'count'"
            :label="t('count')"
            :show-feedback="false"
          >
            <n-input-number
              v-model:value="recurrenceCount"
              :min="1"
              :precision="0"
              style="width: 100%"
            />
          </n-form-item-gi>
          <n-form-item-gi
            v-if="recurrenceEndMode === 'until'"
            :label="t('until')"
            :show-feedback="!!recurrenceUntilError"
          >
            <n-input
              v-model:value="recurrenceUntilInput"
              :placeholder="isAllDay ? t('date-placeholder') : t('until-placeholder')"
              :status="recurrenceUntilStatus"
            />
            <template v-if="recurrenceUntilError" #feedback>
              <n-text type="error">{{ recurrenceUntilError }}</n-text>
            </template>
          </n-form-item-gi>
        </n-grid>
      </ToolSection>

      <ToolSectionHeader>{{ t('reminders') }}</ToolSectionHeader>
      <ToolSection>
        <n-flex align="center" justify="space-between">
          <n-text>{{ t('enable-reminders') }}</n-text>
          <n-switch v-model:value="remindersEnabled" />
        </n-flex>

        <n-flex v-if="remindersEnabled" vertical :size="8" style="margin-top: 12px">
          <div v-for="(reminder, index) in reminders" :key="index" class="reminder-row">
            <n-input-number v-model:value="reminder.amount" :min="1" :precision="0" />
            <n-select v-model:value="reminder.unit" :options="reminderUnitOptions" />
            <n-input v-model:value="reminder.description" :placeholder="t('reminder-message')" />
            <n-button text @click="removeReminder(index)">
              <template #icon>
                <n-icon :component="Delete16Regular" />
              </template>
              {{ t('remove') }}
            </n-button>
          </div>
          <n-button text @click="addReminder">
            <template #icon>
              <n-icon :component="Add16Regular" />
            </template>
            {{ t('add-reminder') }}
          </n-button>
        </n-flex>
      </ToolSection>
    </n-gi>

    <n-gi>
      <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
      <ToolSection>
        <n-flex align="center" justify="space-between" :size="12">
          <n-text depth="3">{{ t('output') }}</n-text>
          <n-flex align="center" :size="8">
            <CopyToClipboardButton v-if="icsContent" :content="icsContent" />
            <n-button text tag="a" :href="icsHref" download="event.ics" :disabled="!icsHref">
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('download-ics') }}
            </n-button>
          </n-flex>
        </n-flex>

        <n-text v-if="outputError" type="error" style="margin-top: 8px">
          {{ outputError }}
        </n-text>
        <n-text v-else-if="!icsContent" depth="3" style="margin-top: 8px">
          {{ t('output-empty') }}
        </n-text>

        <n-card size="small" style="margin-top: 12px">
          <n-input
            :value="icsContent"
            type="textarea"
            readonly
            :autosize="{ minRows: 10, maxRows: 24 }"
          />
        </n-card>
      </ToolSection>

      <ToolSectionHeader>{{ t('qr-code') }}</ToolSectionHeader>
      <ToolSection>
        <n-flex vertical :size="16">
          <QRCodePreview
            :text="icsContent || ' '"
            :error-correction-level="qrOptions.errorCorrectionLevel"
            :width="qrOptions.width"
            :margin="qrOptions.margin"
            :dark="qrOptions.dark"
            :light="qrOptions.light"
          />
          <QRCodeDownloadButtons
            :text="icsContent || ' '"
            :error-correction-level="qrOptions.errorCorrectionLevel"
            :width="qrOptions.width"
            :margin="qrOptions.margin"
            :dark="qrOptions.dark"
            :light="qrOptions.light"
          />
        </n-flex>
      </ToolSection>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import {
  NButton,
  NIcon,
  NInput,
  NInputNumber,
  NDatePicker,
  NSelect,
  NSwitch,
  NRadioGroup,
  NRadio,
  NText,
  NFlex,
  NGrid,
  NGi,
  NFormItemGi,
  NCheckboxGroup,
  NCheckbox,
  NCard,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Add16Regular from '@vicons/fluent/Add16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'
import QRCodePreview from './QRCodePreview.vue'
import QRCodeDownloadButtons from './QRCodeDownloadButtons.vue'
import { buildTimeZoneOptions } from '../utils/timeZoneOptions'
import {
  formatInTimeZone,
  formatOffsetLabel,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateInput,
  parseDateTimeInput,
  toUtcTimestamp,
  type DateTimeParts,
} from '../utils/timeZone'
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

const { t } = useI18n()

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
const recurrenceWeekdays = useStorage<string[]>('tools:ical-event-generator:recurrence-weekdays', [
  'MO',
])
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

if (!isTimeZoneSupported(timeZone.value)) {
  timeZone.value = defaultTimeZone
}

const frequencyOptions = computed(() => [
  { label: t('frequency-none'), value: 'none' },
  { label: t('frequency-daily'), value: 'daily' },
  { label: t('frequency-weekly'), value: 'weekly' },
  { label: t('frequency-monthly'), value: 'monthly' },
  { label: t('frequency-yearly'), value: 'yearly' },
])

const weekdayOptions = computed(() => [
  { label: t('weekday-mon'), value: 'MO' },
  { label: t('weekday-tue'), value: 'TU' },
  { label: t('weekday-wed'), value: 'WE' },
  { label: t('weekday-thu'), value: 'TH' },
  { label: t('weekday-fri'), value: 'FR' },
  { label: t('weekday-sat'), value: 'SA' },
  { label: t('weekday-sun'), value: 'SU' },
])

const endModeOptions = computed(() => [
  { label: t('ends-never'), value: 'never' },
  { label: t('ends-count'), value: 'count' },
  { label: t('ends-until'), value: 'until' },
])

const reminderUnitOptions = computed(() => [
  { label: t('minutes'), value: 'minutes' },
  { label: t('hours'), value: 'hours' },
  { label: t('days'), value: 'days' },
  { label: t('weeks'), value: 'weeks' },
])

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

const rangeError = computed(() => {
  if (!dateRange.value) return ''
  if (!startParts.value || !endParts.value) return t('invalid-date-time')

  if (isAllDay.value) {
    if (!startDateParts.value || !endDateParts.value) return t('invalid-date')
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
    return endDate <= startDate ? t('end-before-start') : ''
  }

  if (rangeStart.value !== null && rangeEnd.value !== null) {
    return rangeEnd.value <= rangeStart.value ? t('end-before-start') : ''
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

const recurrenceUntilError = computed(() => {
  if (recurrenceEndMode.value !== 'until') return ''
  if (!recurrenceUntilInput.value.trim()) {
    return isAllDay.value ? t('invalid-date') : t('invalid-date-time')
  }
  if (recurrenceUntilParts.value) return ''
  return isAllDay.value ? t('invalid-date') : t('invalid-date-time')
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
    frequency: recurrenceFrequency.value.toUpperCase() as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
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
      const message = reminder.description.trim() || t('reminder-default')
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

const outputError = computed(() => {
  if (!dateRange.value) return ''
  if (rangeError.value) return rangeError.value
  if (recurrenceUntilError.value) return recurrenceUntilError.value
  return ''
})

const icsContent = computed(() => {
  const dtstart = dtstartValue.value
  if (!dtstart || outputError.value) return ''

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

const qrOptions = {
  errorCorrectionLevel: 'M' as const,
  width: 240,
  margin: 2,
  dark: '#000000FF',
  light: '#FFFFFFFF',
}

function addReminder() {
  reminders.value.push({ amount: 15, unit: 'minutes', description: '' })
}

function removeReminder(index: number) {
  reminders.value.splice(index, 1)
}

function regenerateUid() {
  uid.value = generateUid()
}

function toLocalParts(timestamp: number): DateTimeParts {
  const date = new Date(timestamp)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds(),
  }
}

function toDateParts(parts: DateTimeParts): DateTimeParts {
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  }
}

function startOfLocalDay(timestamp: number): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function addLocalDays(timestamp: number, days: number): number {
  const date = new Date(timestamp)
  date.setDate(date.getDate() + days)
  return date.getTime()
}

function generateUid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${crypto.randomUUID()}@inbrowser.app`
  }
  const random = Math.random().toString(36).slice(2)
  return `${random}-${Date.now()}@inbrowser.app`
}
</script>

<style scoped>
.reminder-row {
  display: grid;
  grid-template-columns: 120px 160px 1fr auto;
  gap: 8px;
  align-items: center;
}

@media (max-width: 700px) {
  .reminder-row {
    grid-template-columns: 1fr;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "event-details": "Event details",
    "title": "Title",
    "location": "Location",
    "description": "Description",
    "url": "URL",
    "uid": "UID",
    "new-uid": "New UID",
    "date-time": "Date & time",
    "all-day": "All-day event",
    "time-zone": "Time zone",
    "timezone-placeholder": "Select a time zone",
    "offset": "Offset",
    "output-mode": "Output mode",
    "output-utc": "UTC (Z)",
    "output-tzid": "Local time (TZID)",
    "start": "Start",
    "end": "End",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Invalid date/time",
    "invalid-date": "Invalid date",
    "end-before-start": "End must be after start",
    "all-day-end-hint": "All-day end date is exclusive. Use the next day for a one-day event.",
    "recurrence": "Recurrence",
    "repeat": "Repeat",
    "frequency-none": "Does not repeat",
    "frequency-daily": "Daily",
    "frequency-weekly": "Weekly",
    "frequency-monthly": "Monthly",
    "frequency-yearly": "Yearly",
    "interval": "Interval",
    "weekdays": "Weekdays",
    "weekday-sun": "Sun",
    "weekday-mon": "Mon",
    "weekday-tue": "Tue",
    "weekday-wed": "Wed",
    "weekday-thu": "Thu",
    "weekday-fri": "Fri",
    "weekday-sat": "Sat",
    "month-day": "Day of month",
    "month": "Month",
    "ends": "Ends",
    "ends-never": "Never",
    "ends-count": "After count",
    "ends-until": "On date",
    "count": "Count",
    "until": "Until",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Reminders",
    "enable-reminders": "Enable reminders",
    "reminder-message": "Message",
    "reminder-default": "Reminder",
    "add-reminder": "Add reminder",
    "remove": "Remove",
    "minutes": "Minutes",
    "hours": "Hours",
    "days": "Days",
    "weeks": "Weeks",
    "output": "Output",
    "download-ics": "Download .ics",
    "output-empty": "Fill in a valid start time to generate the .ics file.",
    "qr-code": "QR code"
  },
  "zh": {
    "event-details": "事件信息",
    "title": "标题",
    "location": "地点",
    "description": "描述",
    "url": "链接",
    "uid": "UID",
    "new-uid": "生成新 UID",
    "date-time": "日期与时间",
    "all-day": "全天事件",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "offset": "偏移",
    "output-mode": "输出模式",
    "output-utc": "UTC (Z)",
    "output-tzid": "本地时间 (TZID)",
    "start": "开始",
    "end": "结束",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "无效的日期/时间",
    "invalid-date": "无效的日期",
    "end-before-start": "结束时间必须晚于开始时间",
    "all-day-end-hint": "全天事件结束日期为排他日期，单日事件请使用下一天。",
    "recurrence": "重复",
    "repeat": "重复",
    "frequency-none": "不重复",
    "frequency-daily": "每天",
    "frequency-weekly": "每周",
    "frequency-monthly": "每月",
    "frequency-yearly": "每年",
    "interval": "间隔",
    "weekdays": "星期",
    "weekday-sun": "周日",
    "weekday-mon": "周一",
    "weekday-tue": "周二",
    "weekday-wed": "周三",
    "weekday-thu": "周四",
    "weekday-fri": "周五",
    "weekday-sat": "周六",
    "month-day": "每月日期",
    "month": "月份",
    "ends": "结束",
    "ends-never": "永不",
    "ends-count": "按次数",
    "ends-until": "指定日期",
    "count": "次数",
    "until": "直到",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "提醒",
    "enable-reminders": "启用提醒",
    "reminder-message": "提醒内容",
    "reminder-default": "提醒",
    "add-reminder": "添加提醒",
    "remove": "移除",
    "minutes": "分钟",
    "hours": "小时",
    "days": "天",
    "weeks": "周",
    "output": "输出",
    "download-ics": "下载 .ics",
    "output-empty": "填写有效开始时间以生成 .ics 文件。",
    "qr-code": "二维码"
  },
  "zh-CN": {
    "event-details": "事件信息",
    "title": "标题",
    "location": "地点",
    "description": "描述",
    "url": "链接",
    "uid": "UID",
    "new-uid": "生成新 UID",
    "date-time": "日期与时间",
    "all-day": "全天事件",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "offset": "偏移",
    "output-mode": "输出模式",
    "output-utc": "UTC (Z)",
    "output-tzid": "本地时间 (TZID)",
    "start": "开始",
    "end": "结束",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "无效的日期/时间",
    "invalid-date": "无效的日期",
    "end-before-start": "结束时间必须晚于开始时间",
    "all-day-end-hint": "全天事件结束日期为排他日期，单日事件请使用下一天。",
    "recurrence": "重复",
    "repeat": "重复",
    "frequency-none": "不重复",
    "frequency-daily": "每天",
    "frequency-weekly": "每周",
    "frequency-monthly": "每月",
    "frequency-yearly": "每年",
    "interval": "间隔",
    "weekdays": "星期",
    "weekday-sun": "周日",
    "weekday-mon": "周一",
    "weekday-tue": "周二",
    "weekday-wed": "周三",
    "weekday-thu": "周四",
    "weekday-fri": "周五",
    "weekday-sat": "周六",
    "month-day": "每月日期",
    "month": "月份",
    "ends": "结束",
    "ends-never": "永不",
    "ends-count": "按次数",
    "ends-until": "指定日期",
    "count": "次数",
    "until": "直到",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "提醒",
    "enable-reminders": "启用提醒",
    "reminder-message": "提醒内容",
    "reminder-default": "提醒",
    "add-reminder": "添加提醒",
    "remove": "移除",
    "minutes": "分钟",
    "hours": "小时",
    "days": "天",
    "weeks": "周",
    "output": "输出",
    "download-ics": "下载 .ics",
    "output-empty": "填写有效开始时间以生成 .ics 文件。",
    "qr-code": "二维码"
  },
  "zh-TW": {
    "event-details": "事件資訊",
    "title": "標題",
    "location": "地點",
    "description": "描述",
    "url": "連結",
    "uid": "UID",
    "new-uid": "產生新 UID",
    "date-time": "日期與時間",
    "all-day": "全天事件",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "offset": "偏移",
    "output-mode": "輸出模式",
    "output-utc": "UTC (Z)",
    "output-tzid": "本地時間 (TZID)",
    "start": "開始",
    "end": "結束",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "無效的日期/時間",
    "invalid-date": "無效的日期",
    "end-before-start": "結束時間必須晚於開始時間",
    "all-day-end-hint": "全天事件結束日期為排他日期，單日事件請使用下一天。",
    "recurrence": "重複",
    "repeat": "重複",
    "frequency-none": "不重複",
    "frequency-daily": "每天",
    "frequency-weekly": "每週",
    "frequency-monthly": "每月",
    "frequency-yearly": "每年",
    "interval": "間隔",
    "weekdays": "星期",
    "weekday-sun": "週日",
    "weekday-mon": "週一",
    "weekday-tue": "週二",
    "weekday-wed": "週三",
    "weekday-thu": "週四",
    "weekday-fri": "週五",
    "weekday-sat": "週六",
    "month-day": "每月日期",
    "month": "月份",
    "ends": "結束",
    "ends-never": "永不",
    "ends-count": "按次數",
    "ends-until": "指定日期",
    "count": "次數",
    "until": "直到",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "提醒",
    "enable-reminders": "啟用提醒",
    "reminder-message": "提醒內容",
    "reminder-default": "提醒",
    "add-reminder": "新增提醒",
    "remove": "移除",
    "minutes": "分鐘",
    "hours": "小時",
    "days": "天",
    "weeks": "週",
    "output": "輸出",
    "download-ics": "下載 .ics",
    "output-empty": "請輸入有效的開始時間以產生 .ics 檔案。",
    "qr-code": "QR Code"
  },
  "zh-HK": {
    "event-details": "事件資訊",
    "title": "標題",
    "location": "地點",
    "description": "描述",
    "url": "連結",
    "uid": "UID",
    "new-uid": "產生新 UID",
    "date-time": "日期與時間",
    "all-day": "全天事件",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "offset": "偏移",
    "output-mode": "輸出模式",
    "output-utc": "UTC (Z)",
    "output-tzid": "本地時間 (TZID)",
    "start": "開始",
    "end": "結束",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "無效的日期/時間",
    "invalid-date": "無效的日期",
    "end-before-start": "結束時間必須晚於開始時間",
    "all-day-end-hint": "全天事件結束日期為排他日期，單日事件請使用下一天。",
    "recurrence": "重複",
    "repeat": "重複",
    "frequency-none": "不重複",
    "frequency-daily": "每天",
    "frequency-weekly": "每週",
    "frequency-monthly": "每月",
    "frequency-yearly": "每年",
    "interval": "間隔",
    "weekdays": "星期",
    "weekday-sun": "週日",
    "weekday-mon": "週一",
    "weekday-tue": "週二",
    "weekday-wed": "週三",
    "weekday-thu": "週四",
    "weekday-fri": "週五",
    "weekday-sat": "週六",
    "month-day": "每月日期",
    "month": "月份",
    "ends": "結束",
    "ends-never": "永不",
    "ends-count": "按次數",
    "ends-until": "指定日期",
    "count": "次數",
    "until": "直到",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "提醒",
    "enable-reminders": "啟用提醒",
    "reminder-message": "提醒內容",
    "reminder-default": "提醒",
    "add-reminder": "新增提醒",
    "remove": "移除",
    "minutes": "分鐘",
    "hours": "小時",
    "days": "天",
    "weeks": "週",
    "output": "輸出",
    "download-ics": "下載 .ics",
    "output-empty": "請輸入有效的開始時間以產生 .ics 檔案。",
    "qr-code": "QR Code"
  },
  "es": {
    "event-details": "Detalles del evento",
    "title": "Título",
    "location": "Ubicación",
    "description": "Descripción",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nuevo UID",
    "date-time": "Fecha y hora",
    "all-day": "Evento de día completo",
    "time-zone": "Zona horaria",
    "timezone-placeholder": "Selecciona una zona horaria",
    "offset": "Desfase",
    "output-mode": "Modo de salida",
    "output-utc": "UTC (Z)",
    "output-tzid": "Hora local (TZID)",
    "start": "Inicio",
    "end": "Fin",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Fecha/hora inválida",
    "invalid-date": "Fecha inválida",
    "end-before-start": "El fin debe ser posterior al inicio",
    "all-day-end-hint": "La fecha de fin de un evento de día completo es exclusiva. Usa el día siguiente para un evento de un día.",
    "recurrence": "Recurrencia",
    "repeat": "Repetir",
    "frequency-none": "No se repite",
    "frequency-daily": "Diario",
    "frequency-weekly": "Semanal",
    "frequency-monthly": "Mensual",
    "frequency-yearly": "Anual",
    "interval": "Intervalo",
    "weekdays": "Días de la semana",
    "weekday-sun": "Dom",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mié",
    "weekday-thu": "Jue",
    "weekday-fri": "Vie",
    "weekday-sat": "Sáb",
    "month-day": "Día del mes",
    "month": "Mes",
    "ends": "Finaliza",
    "ends-never": "Nunca",
    "ends-count": "Después de un número",
    "ends-until": "En la fecha",
    "count": "Cantidad",
    "until": "Hasta",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Recordatorios",
    "enable-reminders": "Habilitar recordatorios",
    "reminder-message": "Mensaje",
    "reminder-default": "Recordatorio",
    "add-reminder": "Añadir recordatorio",
    "remove": "Eliminar",
    "minutes": "Minutos",
    "hours": "Horas",
    "days": "Días",
    "weeks": "Semanas",
    "output": "Salida",
    "download-ics": "Descargar .ics",
    "output-empty": "Completa una hora de inicio válida para generar el archivo .ics.",
    "qr-code": "Código QR"
  },
  "fr": {
    "event-details": "Détails de l'événement",
    "title": "Titre",
    "location": "Lieu",
    "description": "Description",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nouvel UID",
    "date-time": "Date et heure",
    "all-day": "Événement sur toute la journée",
    "time-zone": "Fuseau horaire",
    "timezone-placeholder": "Sélectionner un fuseau horaire",
    "offset": "Décalage",
    "output-mode": "Mode de sortie",
    "output-utc": "UTC (Z)",
    "output-tzid": "Heure locale (TZID)",
    "start": "Début",
    "end": "Fin",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Date/heure invalide",
    "invalid-date": "Date invalide",
    "end-before-start": "La fin doit être après le début",
    "all-day-end-hint": "La date de fin d'un événement sur toute la journée est exclusive. Utilisez le jour suivant pour un événement d'un jour.",
    "recurrence": "Récurrence",
    "repeat": "Répéter",
    "frequency-none": "Ne se répète pas",
    "frequency-daily": "Quotidien",
    "frequency-weekly": "Hebdomadaire",
    "frequency-monthly": "Mensuel",
    "frequency-yearly": "Annuel",
    "interval": "Intervalle",
    "weekdays": "Jours de la semaine",
    "weekday-sun": "Dim",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mer",
    "weekday-thu": "Jeu",
    "weekday-fri": "Ven",
    "weekday-sat": "Sam",
    "month-day": "Jour du mois",
    "month": "Mois",
    "ends": "Se termine",
    "ends-never": "Jamais",
    "ends-count": "Après un nombre",
    "ends-until": "À la date",
    "count": "Nombre",
    "until": "Jusqu'à",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Rappels",
    "enable-reminders": "Activer les rappels",
    "reminder-message": "Message",
    "reminder-default": "Rappel",
    "add-reminder": "Ajouter un rappel",
    "remove": "Supprimer",
    "minutes": "Minutes",
    "hours": "Heures",
    "days": "Jours",
    "weeks": "Semaines",
    "output": "Sortie",
    "download-ics": "Télécharger .ics",
    "output-empty": "Saisissez une heure de début valide pour générer le fichier .ics.",
    "qr-code": "Code QR"
  },
  "de": {
    "event-details": "Ereignisdetails",
    "title": "Titel",
    "location": "Ort",
    "description": "Beschreibung",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Neue UID",
    "date-time": "Datum und Uhrzeit",
    "all-day": "Ganztägiges Ereignis",
    "time-zone": "Zeitzone",
    "timezone-placeholder": "Zeitzone auswählen",
    "offset": "Offset",
    "output-mode": "Ausgabemodus",
    "output-utc": "UTC (Z)",
    "output-tzid": "Ortszeit (TZID)",
    "start": "Start",
    "end": "Ende",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit",
    "invalid-date": "Ungültiges Datum",
    "end-before-start": "Ende muss nach dem Start liegen",
    "all-day-end-hint": "Das Enddatum ganztägiger Ereignisse ist exklusiv. Verwenden Sie den nächsten Tag für ein eintägiges Ereignis.",
    "recurrence": "Wiederholung",
    "repeat": "Wiederholen",
    "frequency-none": "Keine Wiederholung",
    "frequency-daily": "Täglich",
    "frequency-weekly": "Wöchentlich",
    "frequency-monthly": "Monatlich",
    "frequency-yearly": "Jährlich",
    "interval": "Intervall",
    "weekdays": "Wochentage",
    "weekday-sun": "So",
    "weekday-mon": "Mo",
    "weekday-tue": "Di",
    "weekday-wed": "Mi",
    "weekday-thu": "Do",
    "weekday-fri": "Fr",
    "weekday-sat": "Sa",
    "month-day": "Tag des Monats",
    "month": "Monat",
    "ends": "Endet",
    "ends-never": "Nie",
    "ends-count": "Nach Anzahl",
    "ends-until": "Am Datum",
    "count": "Anzahl",
    "until": "Bis",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Erinnerungen",
    "enable-reminders": "Erinnerungen aktivieren",
    "reminder-message": "Nachricht",
    "reminder-default": "Erinnerung",
    "add-reminder": "Erinnerung hinzufügen",
    "remove": "Entfernen",
    "minutes": "Minuten",
    "hours": "Stunden",
    "days": "Tage",
    "weeks": "Wochen",
    "output": "Ausgabe",
    "download-ics": ".ics herunterladen",
    "output-empty": "Geben Sie eine gültige Startzeit ein, um die .ics-Datei zu erstellen.",
    "qr-code": "QR-Code"
  },
  "it": {
    "event-details": "Dettagli evento",
    "title": "Titolo",
    "location": "Posizione",
    "description": "Descrizione",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nuovo UID",
    "date-time": "Data e ora",
    "all-day": "Evento di un giorno intero",
    "time-zone": "Fuso orario",
    "timezone-placeholder": "Seleziona un fuso orario",
    "offset": "Offset",
    "output-mode": "Modalità di output",
    "output-utc": "UTC (Z)",
    "output-tzid": "Ora locale (TZID)",
    "start": "Inizio",
    "end": "Fine",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Data/ora non valida",
    "invalid-date": "Data non valida",
    "end-before-start": "La fine deve essere successiva all'inizio",
    "all-day-end-hint": "La data di fine di un evento di un giorno intero è esclusiva. Usa il giorno successivo per un evento di un giorno.",
    "recurrence": "Ricorrenza",
    "repeat": "Ripeti",
    "frequency-none": "Nessuna ripetizione",
    "frequency-daily": "Giornaliero",
    "frequency-weekly": "Settimanale",
    "frequency-monthly": "Mensile",
    "frequency-yearly": "Annuale",
    "interval": "Intervallo",
    "weekdays": "Giorni della settimana",
    "weekday-sun": "Dom",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mer",
    "weekday-thu": "Gio",
    "weekday-fri": "Ven",
    "weekday-sat": "Sab",
    "month-day": "Giorno del mese",
    "month": "Mese",
    "ends": "Termina",
    "ends-never": "Mai",
    "ends-count": "Dopo un numero",
    "ends-until": "Alla data",
    "count": "Conteggio",
    "until": "Fino a",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Promemoria",
    "enable-reminders": "Abilita promemoria",
    "reminder-message": "Messaggio",
    "reminder-default": "Promemoria",
    "add-reminder": "Aggiungi promemoria",
    "remove": "Rimuovi",
    "minutes": "Minuti",
    "hours": "Ore",
    "days": "Giorni",
    "weeks": "Settimane",
    "output": "Output",
    "download-ics": "Scarica .ics",
    "output-empty": "Inserisci un'ora di inizio valida per generare il file .ics.",
    "qr-code": "Codice QR"
  },
  "ja": {
    "event-details": "イベント詳細",
    "title": "タイトル",
    "location": "場所",
    "description": "説明",
    "url": "URL",
    "uid": "UID",
    "new-uid": "新しい UID",
    "date-time": "日付と時刻",
    "all-day": "終日イベント",
    "time-zone": "タイムゾーン",
    "timezone-placeholder": "タイムゾーンを選択",
    "offset": "オフセット",
    "output-mode": "出力モード",
    "output-utc": "UTC (Z)",
    "output-tzid": "ローカル時刻 (TZID)",
    "start": "開始",
    "end": "終了",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "無効な日付/時刻",
    "invalid-date": "無効な日付",
    "end-before-start": "終了は開始より後である必要があります",
    "all-day-end-hint": "終日イベントの終了日は排他的です。1日のイベントは翌日を指定してください。",
    "recurrence": "繰り返し",
    "repeat": "繰り返す",
    "frequency-none": "繰り返しなし",
    "frequency-daily": "毎日",
    "frequency-weekly": "毎週",
    "frequency-monthly": "毎月",
    "frequency-yearly": "毎年",
    "interval": "間隔",
    "weekdays": "曜日",
    "weekday-sun": "日",
    "weekday-mon": "月",
    "weekday-tue": "火",
    "weekday-wed": "水",
    "weekday-thu": "木",
    "weekday-fri": "金",
    "weekday-sat": "土",
    "month-day": "日付",
    "month": "月",
    "ends": "終了",
    "ends-never": "なし",
    "ends-count": "回数後",
    "ends-until": "指定日",
    "count": "回数",
    "until": "まで",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "リマインダー",
    "enable-reminders": "リマインダーを有効化",
    "reminder-message": "メッセージ",
    "reminder-default": "リマインダー",
    "add-reminder": "リマインダーを追加",
    "remove": "削除",
    "minutes": "分",
    "hours": "時間",
    "days": "日",
    "weeks": "週",
    "output": "出力",
    "download-ics": ".ics をダウンロード",
    "output-empty": "有効な開始時刻を入力して .ics を生成してください。",
    "qr-code": "QRコード"
  },
  "ko": {
    "event-details": "이벤트 상세",
    "title": "제목",
    "location": "위치",
    "description": "설명",
    "url": "URL",
    "uid": "UID",
    "new-uid": "새 UID",
    "date-time": "날짜 및 시간",
    "all-day": "종일 이벤트",
    "time-zone": "시간대",
    "timezone-placeholder": "시간대 선택",
    "offset": "오프셋",
    "output-mode": "출력 모드",
    "output-utc": "UTC (Z)",
    "output-tzid": "로컬 시간 (TZID)",
    "start": "시작",
    "end": "종료",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "유효하지 않은 날짜/시간",
    "invalid-date": "유효하지 않은 날짜",
    "end-before-start": "종료는 시작 이후여야 합니다",
    "all-day-end-hint": "종일 이벤트의 종료 날짜는 배타적입니다. 하루짜리 이벤트는 다음 날을 사용하세요.",
    "recurrence": "반복",
    "repeat": "반복",
    "frequency-none": "반복 없음",
    "frequency-daily": "매일",
    "frequency-weekly": "매주",
    "frequency-monthly": "매월",
    "frequency-yearly": "매년",
    "interval": "간격",
    "weekdays": "요일",
    "weekday-sun": "일",
    "weekday-mon": "월",
    "weekday-tue": "화",
    "weekday-wed": "수",
    "weekday-thu": "목",
    "weekday-fri": "금",
    "weekday-sat": "토",
    "month-day": "월의 날짜",
    "month": "월",
    "ends": "종료",
    "ends-never": "안 함",
    "ends-count": "횟수 후",
    "ends-until": "날짜 지정",
    "count": "횟수",
    "until": "까지",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "알림",
    "enable-reminders": "알림 사용",
    "reminder-message": "메시지",
    "reminder-default": "알림",
    "add-reminder": "알림 추가",
    "remove": "삭제",
    "minutes": "분",
    "hours": "시간",
    "days": "일",
    "weeks": "주",
    "output": "출력",
    "download-ics": ".ics 다운로드",
    "output-empty": "유효한 시작 시간을 입력해 .ics 파일을 생성하세요.",
    "qr-code": "QR 코드"
  },
  "ru": {
    "event-details": "Детали события",
    "title": "Название",
    "location": "Место",
    "description": "Описание",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Новый UID",
    "date-time": "Дата и время",
    "all-day": "Событие на весь день",
    "time-zone": "Часовой пояс",
    "timezone-placeholder": "Выберите часовой пояс",
    "offset": "Смещение",
    "output-mode": "Режим вывода",
    "output-utc": "UTC (Z)",
    "output-tzid": "Местное время (TZID)",
    "start": "Начало",
    "end": "Конец",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Недопустимая дата/время",
    "invalid-date": "Недопустимая дата",
    "end-before-start": "Окончание должно быть после начала",
    "all-day-end-hint": "Дата окончания события на весь день является исключающей. Для события на один день используйте следующий день.",
    "recurrence": "Повторение",
    "repeat": "Повторять",
    "frequency-none": "Без повторения",
    "frequency-daily": "Ежедневно",
    "frequency-weekly": "Еженедельно",
    "frequency-monthly": "Ежемесячно",
    "frequency-yearly": "Ежегодно",
    "interval": "Интервал",
    "weekdays": "Дни недели",
    "weekday-sun": "Вс",
    "weekday-mon": "Пн",
    "weekday-tue": "Вт",
    "weekday-wed": "Ср",
    "weekday-thu": "Чт",
    "weekday-fri": "Пт",
    "weekday-sat": "Сб",
    "month-day": "День месяца",
    "month": "Месяц",
    "ends": "Окончание",
    "ends-never": "Никогда",
    "ends-count": "После количества",
    "ends-until": "В дату",
    "count": "Количество",
    "until": "До",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Напоминания",
    "enable-reminders": "Включить напоминания",
    "reminder-message": "Сообщение",
    "reminder-default": "Напоминание",
    "add-reminder": "Добавить напоминание",
    "remove": "Удалить",
    "minutes": "Минуты",
    "hours": "Часы",
    "days": "Дни",
    "weeks": "Недели",
    "output": "Вывод",
    "download-ics": "Скачать .ics",
    "output-empty": "Введите корректное время начала для создания файла .ics.",
    "qr-code": "QR-код"
  },
  "pt": {
    "event-details": "Detalhes do evento",
    "title": "Título",
    "location": "Local",
    "description": "Descrição",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Novo UID",
    "date-time": "Data e hora",
    "all-day": "Evento de dia inteiro",
    "time-zone": "Fuso horário",
    "timezone-placeholder": "Selecione um fuso horário",
    "offset": "Offset",
    "output-mode": "Modo de saída",
    "output-utc": "UTC (Z)",
    "output-tzid": "Hora local (TZID)",
    "start": "Início",
    "end": "Fim",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Data/hora inválida",
    "invalid-date": "Data inválida",
    "end-before-start": "O fim deve ser após o início",
    "all-day-end-hint": "A data de término de um evento de dia inteiro é exclusiva. Use o dia seguinte para um evento de um dia.",
    "recurrence": "Recorrência",
    "repeat": "Repetir",
    "frequency-none": "Não se repete",
    "frequency-daily": "Diário",
    "frequency-weekly": "Semanal",
    "frequency-monthly": "Mensal",
    "frequency-yearly": "Anual",
    "interval": "Intervalo",
    "weekdays": "Dias da semana",
    "weekday-sun": "Dom",
    "weekday-mon": "Seg",
    "weekday-tue": "Ter",
    "weekday-wed": "Qua",
    "weekday-thu": "Qui",
    "weekday-fri": "Sex",
    "weekday-sat": "Sáb",
    "month-day": "Dia do mês",
    "month": "Mês",
    "ends": "Termina",
    "ends-never": "Nunca",
    "ends-count": "Após contagem",
    "ends-until": "Na data",
    "count": "Contagem",
    "until": "Até",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Lembretes",
    "enable-reminders": "Ativar lembretes",
    "reminder-message": "Mensagem",
    "reminder-default": "Lembrete",
    "add-reminder": "Adicionar lembrete",
    "remove": "Remover",
    "minutes": "Minutos",
    "hours": "Horas",
    "days": "Dias",
    "weeks": "Semanas",
    "output": "Saída",
    "download-ics": "Baixar .ics",
    "output-empty": "Informe um início válido para gerar o arquivo .ics.",
    "qr-code": "QR Code"
  },
  "ar": {
    "event-details": "تفاصيل الحدث",
    "title": "العنوان",
    "location": "الموقع",
    "description": "الوصف",
    "url": "الرابط",
    "uid": "UID",
    "new-uid": "معرّف UID جديد",
    "date-time": "التاريخ والوقت",
    "all-day": "حدث طوال اليوم",
    "time-zone": "المنطقة الزمنية",
    "timezone-placeholder": "اختر منطقة زمنية",
    "offset": "الإزاحة",
    "output-mode": "وضع الإخراج",
    "output-utc": "UTC (Z)",
    "output-tzid": "الوقت المحلي (TZID)",
    "start": "البداية",
    "end": "النهاية",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "تاريخ/وقت غير صالح",
    "invalid-date": "تاريخ غير صالح",
    "end-before-start": "يجب أن تكون النهاية بعد البداية",
    "all-day-end-hint": "تاريخ نهاية حدث اليوم الكامل حصري. استخدم اليوم التالي لحدث ليوم واحد.",
    "recurrence": "التكرار",
    "repeat": "تكرار",
    "frequency-none": "بدون تكرار",
    "frequency-daily": "يومي",
    "frequency-weekly": "أسبوعي",
    "frequency-monthly": "شهري",
    "frequency-yearly": "سنوي",
    "interval": "الفاصل",
    "weekdays": "أيام الأسبوع",
    "weekday-sun": "الأحد",
    "weekday-mon": "الاثنين",
    "weekday-tue": "الثلاثاء",
    "weekday-wed": "الأربعاء",
    "weekday-thu": "الخميس",
    "weekday-fri": "الجمعة",
    "weekday-sat": "السبت",
    "month-day": "يوم من الشهر",
    "month": "الشهر",
    "ends": "ينتهي",
    "ends-never": "أبدًا",
    "ends-count": "بعد عدد",
    "ends-until": "في تاريخ",
    "count": "العدد",
    "until": "حتى",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "التذكيرات",
    "enable-reminders": "تفعيل التذكيرات",
    "reminder-message": "الرسالة",
    "reminder-default": "تذكير",
    "add-reminder": "إضافة تذكير",
    "remove": "إزالة",
    "minutes": "دقائق",
    "hours": "ساعات",
    "days": "أيام",
    "weeks": "أسابيع",
    "output": "الإخراج",
    "download-ics": "تنزيل .ics",
    "output-empty": "أدخل وقت بدء صالحًا لإنشاء ملف .ics.",
    "qr-code": "رمز QR"
  },
  "hi": {
    "event-details": "इवेंट विवरण",
    "title": "शीर्षक",
    "location": "स्थान",
    "description": "विवरण",
    "url": "URL",
    "uid": "UID",
    "new-uid": "नया UID",
    "date-time": "तिथि और समय",
    "all-day": "पूरे दिन का इवेंट",
    "time-zone": "समय क्षेत्र",
    "timezone-placeholder": "समय क्षेत्र चुनें",
    "offset": "ऑफ़सेट",
    "output-mode": "आउटपुट मोड",
    "output-utc": "UTC (Z)",
    "output-tzid": "स्थानीय समय (TZID)",
    "start": "शुरू",
    "end": "समाप्त",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "अमान्य तिथि/समय",
    "invalid-date": "अमान्य तिथि",
    "end-before-start": "समाप्ति समय शुरू के बाद होना चाहिए",
    "all-day-end-hint": "पूरे दिन के इवेंट की समाप्ति तिथि एक्सक्लूसिव होती है। एक दिन के इवेंट के लिए अगले दिन का उपयोग करें।",
    "recurrence": "पुनरावृत्ति",
    "repeat": "दोहराएँ",
    "frequency-none": "दोहराव नहीं",
    "frequency-daily": "दैनिक",
    "frequency-weekly": "साप्ताहिक",
    "frequency-monthly": "मासिक",
    "frequency-yearly": "वार्षिक",
    "interval": "अंतराल",
    "weekdays": "सप्ताह के दिन",
    "weekday-sun": "रवि",
    "weekday-mon": "सोम",
    "weekday-tue": "मंगल",
    "weekday-wed": "बुध",
    "weekday-thu": "गुरु",
    "weekday-fri": "शुक्र",
    "weekday-sat": "शनि",
    "month-day": "महीने का दिन",
    "month": "महीना",
    "ends": "समाप्त होता है",
    "ends-never": "कभी नहीं",
    "ends-count": "गिनती के बाद",
    "ends-until": "तारीख पर",
    "count": "गिनती",
    "until": "तक",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "रिमाइंडर",
    "enable-reminders": "रिमाइंडर सक्षम करें",
    "reminder-message": "संदेश",
    "reminder-default": "रिमाइंडर",
    "add-reminder": "रिमाइंडर जोड़ें",
    "remove": "हटाएं",
    "minutes": "मिनट",
    "hours": "घंटे",
    "days": "दिन",
    "weeks": "सप्ताह",
    "output": "आउटपुट",
    "download-ics": ".ics डाउनलोड करें",
    "output-empty": "वैध आरंभ समय भरें ताकि .ics फ़ाइल बने।",
    "qr-code": "QR कोड"
  },
  "tr": {
    "event-details": "Etkinlik ayrıntıları",
    "title": "Başlık",
    "location": "Konum",
    "description": "Açıklama",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Yeni UID",
    "date-time": "Tarih ve saat",
    "all-day": "Tüm gün etkinlik",
    "time-zone": "Saat dilimi",
    "timezone-placeholder": "Saat dilimi seçin",
    "offset": "Ofset",
    "output-mode": "Çıktı modu",
    "output-utc": "UTC (Z)",
    "output-tzid": "Yerel saat (TZID)",
    "start": "Başlangıç",
    "end": "Bitiş",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Geçersiz tarih/saat",
    "invalid-date": "Geçersiz tarih",
    "end-before-start": "Bitiş başlangıçtan sonra olmalıdır",
    "all-day-end-hint": "Tüm gün etkinliklerde bitiş tarihi dışlayıcıdır. Bir günlük etkinlik için ertesi günü kullanın.",
    "recurrence": "Yineleme",
    "repeat": "Yinele",
    "frequency-none": "Yineleme yok",
    "frequency-daily": "Günlük",
    "frequency-weekly": "Haftalık",
    "frequency-monthly": "Aylık",
    "frequency-yearly": "Yıllık",
    "interval": "Aralık",
    "weekdays": "Haftanın günleri",
    "weekday-sun": "Paz",
    "weekday-mon": "Pzt",
    "weekday-tue": "Sal",
    "weekday-wed": "Çar",
    "weekday-thu": "Per",
    "weekday-fri": "Cum",
    "weekday-sat": "Cmt",
    "month-day": "Ayın günü",
    "month": "Ay",
    "ends": "Biter",
    "ends-never": "Asla",
    "ends-count": "Sayıdan sonra",
    "ends-until": "Tarihte",
    "count": "Sayı",
    "until": "Kadar",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Hatırlatıcılar",
    "enable-reminders": "Hatırlatıcıları etkinleştir",
    "reminder-message": "Mesaj",
    "reminder-default": "Hatırlatıcı",
    "add-reminder": "Hatırlatıcı ekle",
    "remove": "Kaldır",
    "minutes": "Dakika",
    "hours": "Saat",
    "days": "Gün",
    "weeks": "Hafta",
    "output": "Çıktı",
    "download-ics": ".ics indir",
    "output-empty": "Geçerli bir başlangıç saati girerek .ics dosyasını oluşturun.",
    "qr-code": "QR kod"
  },
  "nl": {
    "event-details": "Evenementdetails",
    "title": "Titel",
    "location": "Locatie",
    "description": "Beschrijving",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nieuwe UID",
    "date-time": "Datum en tijd",
    "all-day": "Hele dag-evenement",
    "time-zone": "Tijdzone",
    "timezone-placeholder": "Selecteer een tijdzone",
    "offset": "Offset",
    "output-mode": "Uitvoermodus",
    "output-utc": "UTC (Z)",
    "output-tzid": "Lokale tijd (TZID)",
    "start": "Start",
    "end": "Einde",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ongeldige datum/tijd",
    "invalid-date": "Ongeldige datum",
    "end-before-start": "Einde moet na het begin liggen",
    "all-day-end-hint": "De einddatum van een hele dag is exclusief. Gebruik de volgende dag voor een eendaags evenement.",
    "recurrence": "Herhaling",
    "repeat": "Herhalen",
    "frequency-none": "Geen herhaling",
    "frequency-daily": "Dagelijks",
    "frequency-weekly": "Wekelijks",
    "frequency-monthly": "Maandelijks",
    "frequency-yearly": "Jaarlijks",
    "interval": "Interval",
    "weekdays": "Weekdagen",
    "weekday-sun": "Zo",
    "weekday-mon": "Ma",
    "weekday-tue": "Di",
    "weekday-wed": "Wo",
    "weekday-thu": "Do",
    "weekday-fri": "Vr",
    "weekday-sat": "Za",
    "month-day": "Dag van de maand",
    "month": "Maand",
    "ends": "Eindigt",
    "ends-never": "Nooit",
    "ends-count": "Na aantal",
    "ends-until": "Op datum",
    "count": "Aantal",
    "until": "Tot",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Herinneringen",
    "enable-reminders": "Herinneringen inschakelen",
    "reminder-message": "Bericht",
    "reminder-default": "Herinnering",
    "add-reminder": "Herinnering toevoegen",
    "remove": "Verwijderen",
    "minutes": "Minuten",
    "hours": "Uren",
    "days": "Dagen",
    "weeks": "Weken",
    "output": "Uitvoer",
    "download-ics": ".ics downloaden",
    "output-empty": "Vul een geldige starttijd in om het .ics-bestand te genereren.",
    "qr-code": "QR-code"
  },
  "sv": {
    "event-details": "Händelsedetaljer",
    "title": "Titel",
    "location": "Plats",
    "description": "Beskrivning",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Ny UID",
    "date-time": "Datum och tid",
    "all-day": "Heldagshändelse",
    "time-zone": "Tidszon",
    "timezone-placeholder": "Välj en tidszon",
    "offset": "Offset",
    "output-mode": "Utdata-läge",
    "output-utc": "UTC (Z)",
    "output-tzid": "Lokal tid (TZID)",
    "start": "Start",
    "end": "Slut",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ogiltigt datum/tid",
    "invalid-date": "Ogiltigt datum",
    "end-before-start": "Slutet måste vara efter start",
    "all-day-end-hint": "Slutdatumet för en heldagshändelse är exklusivt. Använd nästa dag för en endagshändelse.",
    "recurrence": "Upprepning",
    "repeat": "Upprepa",
    "frequency-none": "Ingen upprepning",
    "frequency-daily": "Dagligen",
    "frequency-weekly": "Veckovis",
    "frequency-monthly": "Månadsvis",
    "frequency-yearly": "Årligen",
    "interval": "Intervall",
    "weekdays": "Veckodagar",
    "weekday-sun": "Sön",
    "weekday-mon": "Mån",
    "weekday-tue": "Tis",
    "weekday-wed": "Ons",
    "weekday-thu": "Tor",
    "weekday-fri": "Fre",
    "weekday-sat": "Lör",
    "month-day": "Dag i månaden",
    "month": "Månad",
    "ends": "Slutar",
    "ends-never": "Aldrig",
    "ends-count": "Efter antal",
    "ends-until": "På datum",
    "count": "Antal",
    "until": "Till",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Påminnelser",
    "enable-reminders": "Aktivera påminnelser",
    "reminder-message": "Meddelande",
    "reminder-default": "Påminnelse",
    "add-reminder": "Lägg till påminnelse",
    "remove": "Ta bort",
    "minutes": "Minuter",
    "hours": "Timmar",
    "days": "Dagar",
    "weeks": "Veckor",
    "output": "Utdata",
    "download-ics": "Ladda ner .ics",
    "output-empty": "Fyll i en giltig starttid för att skapa .ics-filen.",
    "qr-code": "QR-kod"
  },
  "pl": {
    "event-details": "Szczegóły wydarzenia",
    "title": "Tytuł",
    "location": "Lokalizacja",
    "description": "Opis",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nowy UID",
    "date-time": "Data i czas",
    "all-day": "Wydarzenie całodniowe",
    "time-zone": "Strefa czasowa",
    "timezone-placeholder": "Wybierz strefę czasową",
    "offset": "Przesunięcie",
    "output-mode": "Tryb wyjścia",
    "output-utc": "UTC (Z)",
    "output-tzid": "Czas lokalny (TZID)",
    "start": "Start",
    "end": "Koniec",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Nieprawidłowa data/godzina",
    "invalid-date": "Nieprawidłowa data",
    "end-before-start": "Koniec musi być po początku",
    "all-day-end-hint": "Data końcowa wydarzenia całodniowego jest wyłączna. Użyj następnego dnia dla wydarzenia jednodniowego.",
    "recurrence": "Cykliczność",
    "repeat": "Powtarzaj",
    "frequency-none": "Brak powtórzeń",
    "frequency-daily": "Codziennie",
    "frequency-weekly": "Co tydzień",
    "frequency-monthly": "Co miesiąc",
    "frequency-yearly": "Co rok",
    "interval": "Interwał",
    "weekdays": "Dni tygodnia",
    "weekday-sun": "Nd",
    "weekday-mon": "Pn",
    "weekday-tue": "Wt",
    "weekday-wed": "Śr",
    "weekday-thu": "Cz",
    "weekday-fri": "Pt",
    "weekday-sat": "Sb",
    "month-day": "Dzień miesiąca",
    "month": "Miesiąc",
    "ends": "Kończy się",
    "ends-never": "Nigdy",
    "ends-count": "Po liczbie",
    "ends-until": "W dniu",
    "count": "Liczba",
    "until": "Do",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Przypomnienia",
    "enable-reminders": "Włącz przypomnienia",
    "reminder-message": "Wiadomość",
    "reminder-default": "Przypomnienie",
    "add-reminder": "Dodaj przypomnienie",
    "remove": "Usuń",
    "minutes": "Minuty",
    "hours": "Godziny",
    "days": "Dni",
    "weeks": "Tygodnie",
    "output": "Wyjście",
    "download-ics": "Pobierz .ics",
    "output-empty": "Wprowadź poprawny czas rozpoczęcia, aby wygenerować plik .ics.",
    "qr-code": "Kod QR"
  },
  "vi": {
    "event-details": "Chi tiết sự kiện",
    "title": "Tiêu đề",
    "location": "Địa điểm",
    "description": "Mô tả",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID mới",
    "date-time": "Ngày và giờ",
    "all-day": "Sự kiện cả ngày",
    "time-zone": "Múi giờ",
    "timezone-placeholder": "Chọn múi giờ",
    "offset": "Độ lệch",
    "output-mode": "Chế độ xuất",
    "output-utc": "UTC (Z)",
    "output-tzid": "Giờ địa phương (TZID)",
    "start": "Bắt đầu",
    "end": "Kết thúc",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ngày/giờ không hợp lệ",
    "invalid-date": "Ngày không hợp lệ",
    "end-before-start": "Kết thúc phải sau khi bắt đầu",
    "all-day-end-hint": "Ngày kết thúc sự kiện cả ngày là độc quyền. Dùng ngày hôm sau cho sự kiện một ngày.",
    "recurrence": "Lặp lại",
    "repeat": "Lặp lại",
    "frequency-none": "Không lặp",
    "frequency-daily": "Hàng ngày",
    "frequency-weekly": "Hàng tuần",
    "frequency-monthly": "Hàng tháng",
    "frequency-yearly": "Hàng năm",
    "interval": "Khoảng",
    "weekdays": "Ngày trong tuần",
    "weekday-sun": "CN",
    "weekday-mon": "T2",
    "weekday-tue": "T3",
    "weekday-wed": "T4",
    "weekday-thu": "T5",
    "weekday-fri": "T6",
    "weekday-sat": "T7",
    "month-day": "Ngày trong tháng",
    "month": "Tháng",
    "ends": "Kết thúc",
    "ends-never": "Không bao giờ",
    "ends-count": "Sau số lần",
    "ends-until": "Vào ngày",
    "count": "Số lần",
    "until": "Đến",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Nhắc nhở",
    "enable-reminders": "Bật nhắc nhở",
    "reminder-message": "Tin nhắn",
    "reminder-default": "Nhắc nhở",
    "add-reminder": "Thêm nhắc nhở",
    "remove": "Xóa",
    "minutes": "Phút",
    "hours": "Giờ",
    "days": "Ngày",
    "weeks": "Tuần",
    "output": "Đầu ra",
    "download-ics": "Tải .ics",
    "output-empty": "Nhập thời gian bắt đầu hợp lệ để tạo tệp .ics.",
    "qr-code": "Mã QR"
  },
  "th": {
    "event-details": "รายละเอียดกิจกรรม",
    "title": "ชื่อเรื่อง",
    "location": "สถานที่",
    "description": "คำอธิบาย",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID ใหม่",
    "date-time": "วันที่และเวลา",
    "all-day": "กิจกรรมทั้งวัน",
    "time-zone": "เขตเวลา",
    "timezone-placeholder": "เลือกเขตเวลา",
    "offset": "ออฟเซ็ต",
    "output-mode": "โหมดเอาต์พุต",
    "output-utc": "UTC (Z)",
    "output-tzid": "เวลาท้องถิ่น (TZID)",
    "start": "เริ่มต้น",
    "end": "สิ้นสุด",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง",
    "invalid-date": "วันที่ไม่ถูกต้อง",
    "end-before-start": "เวลาสิ้นสุดต้องหลังเวลาเริ่มต้น",
    "all-day-end-hint": "วันที่สิ้นสุดของกิจกรรมทั้งวันเป็นแบบไม่รวมวันนั้น ใช้วันถัดไปสำหรับกิจกรรมหนึ่งวัน",
    "recurrence": "การทำซ้ำ",
    "repeat": "ทำซ้ำ",
    "frequency-none": "ไม่ทำซ้ำ",
    "frequency-daily": "รายวัน",
    "frequency-weekly": "รายสัปดาห์",
    "frequency-monthly": "รายเดือน",
    "frequency-yearly": "รายปี",
    "interval": "ช่วงเวลา",
    "weekdays": "วันในสัปดาห์",
    "weekday-sun": "อา",
    "weekday-mon": "จ",
    "weekday-tue": "อ",
    "weekday-wed": "พ",
    "weekday-thu": "พฤ",
    "weekday-fri": "ศ",
    "weekday-sat": "ส",
    "month-day": "วันที่ของเดือน",
    "month": "เดือน",
    "ends": "สิ้นสุด",
    "ends-never": "ไม่สิ้นสุด",
    "ends-count": "หลังจากจำนวนครั้ง",
    "ends-until": "ในวันที่",
    "count": "จำนวน",
    "until": "จนถึง",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "การเตือน",
    "enable-reminders": "เปิดการเตือน",
    "reminder-message": "ข้อความ",
    "reminder-default": "การเตือน",
    "add-reminder": "เพิ่มการเตือน",
    "remove": "ลบ",
    "minutes": "นาที",
    "hours": "ชั่วโมง",
    "days": "วัน",
    "weeks": "สัปดาห์",
    "output": "เอาต์พุต",
    "download-ics": "ดาวน์โหลด .ics",
    "output-empty": "กรอกเวลาเริ่มต้นที่ถูกต้องเพื่อสร้างไฟล์ .ics",
    "qr-code": "คิวอาร์โค้ด"
  },
  "id": {
    "event-details": "Detail acara",
    "title": "Judul",
    "location": "Lokasi",
    "description": "Deskripsi",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID baru",
    "date-time": "Tanggal dan waktu",
    "all-day": "Acara seharian",
    "time-zone": "Zona waktu",
    "timezone-placeholder": "Pilih zona waktu",
    "offset": "Offset",
    "output-mode": "Mode output",
    "output-utc": "UTC (Z)",
    "output-tzid": "Waktu lokal (TZID)",
    "start": "Mulai",
    "end": "Selesai",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Tanggal/waktu tidak valid",
    "invalid-date": "Tanggal tidak valid",
    "end-before-start": "Selesai harus setelah mulai",
    "all-day-end-hint": "Tanggal akhir acara seharian bersifat eksklusif. Gunakan hari berikutnya untuk acara satu hari.",
    "recurrence": "Pengulangan",
    "repeat": "Ulangi",
    "frequency-none": "Tidak berulang",
    "frequency-daily": "Harian",
    "frequency-weekly": "Mingguan",
    "frequency-monthly": "Bulanan",
    "frequency-yearly": "Tahunan",
    "interval": "Interval",
    "weekdays": "Hari dalam minggu",
    "weekday-sun": "Min",
    "weekday-mon": "Sen",
    "weekday-tue": "Sel",
    "weekday-wed": "Rab",
    "weekday-thu": "Kam",
    "weekday-fri": "Jum",
    "weekday-sat": "Sab",
    "month-day": "Hari dalam bulan",
    "month": "Bulan",
    "ends": "Berakhir",
    "ends-never": "Tidak pernah",
    "ends-count": "Setelah jumlah",
    "ends-until": "Pada tanggal",
    "count": "Jumlah",
    "until": "Sampai",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Pengingat",
    "enable-reminders": "Aktifkan pengingat",
    "reminder-message": "Pesan",
    "reminder-default": "Pengingat",
    "add-reminder": "Tambah pengingat",
    "remove": "Hapus",
    "minutes": "Menit",
    "hours": "Jam",
    "days": "Hari",
    "weeks": "Minggu",
    "output": "Output",
    "download-ics": "Unduh .ics",
    "output-empty": "Masukkan waktu mulai yang valid untuk membuat file .ics.",
    "qr-code": "Kode QR"
  },
  "he": {
    "event-details": "פרטי האירוע",
    "title": "כותרת",
    "location": "מיקום",
    "description": "תיאור",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID חדש",
    "date-time": "תאריך ושעה",
    "all-day": "אירוע של יום שלם",
    "time-zone": "אזור זמן",
    "timezone-placeholder": "בחר אזור זמן",
    "offset": "היסט",
    "output-mode": "מצב פלט",
    "output-utc": "UTC (Z)",
    "output-tzid": "שעה מקומית (TZID)",
    "start": "התחלה",
    "end": "סיום",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "תאריך/שעה לא תקינים",
    "invalid-date": "תאריך לא תקין",
    "end-before-start": "הסיום חייב להיות אחרי ההתחלה",
    "all-day-end-hint": "תאריך הסיום של אירוע של יום שלם הוא בלעדי. השתמשו ביום הבא עבור אירוע של יום אחד.",
    "recurrence": "חזרתיות",
    "repeat": "חזור",
    "frequency-none": "ללא חזרה",
    "frequency-daily": "יומי",
    "frequency-weekly": "שבועי",
    "frequency-monthly": "חודשי",
    "frequency-yearly": "שנתי",
    "interval": "מרווח",
    "weekdays": "ימי השבוע",
    "weekday-sun": "א'",
    "weekday-mon": "ב'",
    "weekday-tue": "ג'",
    "weekday-wed": "ד'",
    "weekday-thu": "ה'",
    "weekday-fri": "ו'",
    "weekday-sat": "ש'",
    "month-day": "יום בחודש",
    "month": "חודש",
    "ends": "מסתיים",
    "ends-never": "לעולם לא",
    "ends-count": "לאחר ספירה",
    "ends-until": "בתאריך",
    "count": "ספירה",
    "until": "עד",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "תזכורות",
    "enable-reminders": "הפעל תזכורות",
    "reminder-message": "הודעה",
    "reminder-default": "תזכורת",
    "add-reminder": "הוסף תזכורת",
    "remove": "הסר",
    "minutes": "דקות",
    "hours": "שעות",
    "days": "ימים",
    "weeks": "שבועות",
    "output": "פלט",
    "download-ics": "הורד .ics",
    "output-empty": "הזן זמן התחלה תקין כדי ליצור קובץ .ics.",
    "qr-code": "QR"
  },
  "ms": {
    "event-details": "Butiran acara",
    "title": "Tajuk",
    "location": "Lokasi",
    "description": "Penerangan",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID baharu",
    "date-time": "Tarikh dan masa",
    "all-day": "Acara sepanjang hari",
    "time-zone": "Zon masa",
    "timezone-placeholder": "Pilih zon masa",
    "offset": "Ofset",
    "output-mode": "Mod output",
    "output-utc": "UTC (Z)",
    "output-tzid": "Masa tempatan (TZID)",
    "start": "Mula",
    "end": "Tamat",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Tarikh/masa tidak sah",
    "invalid-date": "Tarikh tidak sah",
    "end-before-start": "Tamat mesti selepas mula",
    "all-day-end-hint": "Tarikh tamat acara sepanjang hari adalah eksklusif. Gunakan hari berikutnya untuk acara satu hari.",
    "recurrence": "Ulangan",
    "repeat": "Ulang",
    "frequency-none": "Tiada ulangan",
    "frequency-daily": "Harian",
    "frequency-weekly": "Mingguan",
    "frequency-monthly": "Bulanan",
    "frequency-yearly": "Tahunan",
    "interval": "Selang",
    "weekdays": "Hari dalam minggu",
    "weekday-sun": "Ahd",
    "weekday-mon": "Isn",
    "weekday-tue": "Sel",
    "weekday-wed": "Rab",
    "weekday-thu": "Kha",
    "weekday-fri": "Jum",
    "weekday-sat": "Sab",
    "month-day": "Hari dalam bulan",
    "month": "Bulan",
    "ends": "Berakhir",
    "ends-never": "Tidak pernah",
    "ends-count": "Selepas kiraan",
    "ends-until": "Pada tarikh",
    "count": "Kiraan",
    "until": "Hingga",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Peringatan",
    "enable-reminders": "Dayakan peringatan",
    "reminder-message": "Mesej",
    "reminder-default": "Peringatan",
    "add-reminder": "Tambah peringatan",
    "remove": "Buang",
    "minutes": "Minit",
    "hours": "Jam",
    "days": "Hari",
    "weeks": "Minggu",
    "output": "Output",
    "download-ics": "Muat turun .ics",
    "output-empty": "Masukkan masa mula yang sah untuk menjana fail .ics.",
    "qr-code": "Kod QR"
  },
  "no": {
    "event-details": "Hendelsesdetaljer",
    "title": "Tittel",
    "location": "Sted",
    "description": "Beskrivelse",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Ny UID",
    "date-time": "Dato og tid",
    "all-day": "Heldagshendelse",
    "time-zone": "Tidssone",
    "timezone-placeholder": "Velg en tidssone",
    "offset": "Offset",
    "output-mode": "Utdatamodus",
    "output-utc": "UTC (Z)",
    "output-tzid": "Lokal tid (TZID)",
    "start": "Start",
    "end": "Slutt",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ugyldig dato/tid",
    "invalid-date": "Ugyldig dato",
    "end-before-start": "Slutt må være etter start",
    "all-day-end-hint": "Sluttdato for heldagshendelser er eksklusiv. Bruk neste dag for en endagshendelse.",
    "recurrence": "Gjentakelse",
    "repeat": "Gjenta",
    "frequency-none": "Ingen gjentakelse",
    "frequency-daily": "Daglig",
    "frequency-weekly": "Ukentlig",
    "frequency-monthly": "Månedlig",
    "frequency-yearly": "Årlig",
    "interval": "Intervall",
    "weekdays": "Ukedager",
    "weekday-sun": "Søn",
    "weekday-mon": "Man",
    "weekday-tue": "Tir",
    "weekday-wed": "Ons",
    "weekday-thu": "Tor",
    "weekday-fri": "Fre",
    "weekday-sat": "Lør",
    "month-day": "Dag i måneden",
    "month": "Måned",
    "ends": "Slutter",
    "ends-never": "Aldri",
    "ends-count": "Etter antall",
    "ends-until": "På dato",
    "count": "Antall",
    "until": "Til",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "reminders": "Påminnelser",
    "enable-reminders": "Aktiver påminnelser",
    "reminder-message": "Melding",
    "reminder-default": "Påminnelse",
    "add-reminder": "Legg til påminnelse",
    "remove": "Fjern",
    "minutes": "Minutter",
    "hours": "Timer",
    "days": "Dager",
    "weeks": "Uker",
    "output": "Utdata",
    "download-ics": "Last ned .ics",
    "output-empty": "Oppgi en gyldig starttid for å generere .ics-filen.",
    "qr-code": "QR-kode"
  }
}
</i18n>
