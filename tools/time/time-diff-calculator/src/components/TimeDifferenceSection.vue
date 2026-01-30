<template>
  <TimeDifferenceInputs
    v-model:start-input="startInput"
    v-model:end-input="endInput"
    v-model:start-time-zone="startTimeZone"
    v-model:end-time-zone="endTimeZone"
    :start-status="startStatus"
    :end-status="endStatus"
    :start-error="startError"
    :end-error="endError"
    :start-offset-label="startOffsetLabel"
    :end-offset-label="endOffsetLabel"
    :time-zone-options="timeZoneOptions"
    @set-now="setNow"
  />
  <TimeDifferenceSwapSection @swap="swapValues" />
  <TimeDifferenceResults
    :signed-duration-label="signedDurationLabel"
    :absolute-duration-label="absoluteDurationLabel"
    :iso-duration="isoDuration"
    :total-milliseconds="totalMilliseconds"
    :total-seconds="totalSeconds"
    :total-minutes="totalMinutes"
    :total-hours="totalHours"
    :total-days="totalDays"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import TimeDifferenceInputs from './TimeDifferenceInputs.vue'
import TimeDifferenceResults from './TimeDifferenceResults.vue'
import TimeDifferenceSwapSection from './TimeDifferenceSwapSection.vue'
import { buildTimeZoneOptions } from '../utils/timeZoneOptions'
import {
  formatInTimeZone,
  formatOffsetLabel,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
} from '../utils/timeZone'
import {
  formatDurationLabel,
  formatFraction,
  formatIsoDuration,
  millisecondsToDurationParts,
} from '../utils/duration'

const timeZoneOptions = buildTimeZoneOptions(Date.now())

const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const defaultTimeZone = isTimeZoneSupported(resolvedTimeZone) ? resolvedTimeZone : 'UTC'

const nowTimestamp = Date.now()
const defaultStart = formatInTimeZone(nowTimestamp, defaultTimeZone)
const defaultEnd = formatInTimeZone(nowTimestamp + 60 * 60 * 1000, defaultTimeZone)

const startTimeZone = useStorage('tools:time-diff-calculator:start-timezone', defaultTimeZone)
const endTimeZone = useStorage('tools:time-diff-calculator:end-timezone', defaultTimeZone)
const startInput = useStorage('tools:time-diff-calculator:start-input', defaultStart)
const endInput = useStorage('tools:time-diff-calculator:end-input', defaultEnd)

if (!isTimeZoneSupported(startTimeZone.value)) {
  startTimeZone.value = defaultTimeZone
}

if (!isTimeZoneSupported(endTimeZone.value)) {
  endTimeZone.value = defaultTimeZone
}

const startParts = computed(() => parseDateTimeInput(startInput.value))
const endParts = computed(() => parseDateTimeInput(endInput.value))

const startStatus = computed(() => {
  if (!startInput.value.trim()) return undefined
  return startParts.value ? 'success' : 'error'
})

const endStatus = computed(() => {
  if (!endInput.value.trim()) return undefined
  return endParts.value ? 'success' : 'error'
})

const startError = computed(() => Boolean(startInput.value.trim()) && !startParts.value)
const endError = computed(() => Boolean(endInput.value.trim()) && !endParts.value)

const startTimestamp = computed(() => {
  if (!startParts.value || !isTimeZoneSupported(startTimeZone.value)) return null
  return toUtcTimestamp(startParts.value, startTimeZone.value)
})

const endTimestamp = computed(() => {
  if (!endParts.value || !isTimeZoneSupported(endTimeZone.value)) return null
  return toUtcTimestamp(endParts.value, endTimeZone.value)
})

const startOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(startTimeZone.value)) return ''
  const reference = startTimestamp.value ?? Date.now()
  return formatOffsetLabel(getTimeZoneOffsetMs(reference, startTimeZone.value))
})

const endOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(endTimeZone.value)) return ''
  const reference = endTimestamp.value ?? Date.now()
  return formatOffsetLabel(getTimeZoneOffsetMs(reference, endTimeZone.value))
})

const diffMilliseconds = computed(() => {
  if (startTimestamp.value === null || endTimestamp.value === null) return null
  return endTimestamp.value - startTimestamp.value
})

const absoluteDiff = computed(() => {
  if (diffMilliseconds.value === null) return null
  return Math.abs(diffMilliseconds.value)
})

const diffParts = computed(() => {
  if (absoluteDiff.value === null) return null
  return millisecondsToDurationParts(absoluteDiff.value)
})

const signedDurationLabel = computed(() => {
  if (!diffParts.value || diffMilliseconds.value === null) return ''
  const label = formatDurationLabel(diffParts.value)
  return diffMilliseconds.value < 0 ? `-${label}` : label
})

const absoluteDurationLabel = computed(() => {
  if (!diffParts.value) return ''
  return formatDurationLabel(diffParts.value)
})

const isoDuration = computed(() => {
  if (!diffParts.value || diffMilliseconds.value === null) return ''
  return formatIsoDuration(diffParts.value, diffMilliseconds.value < 0 ? -1 : 1)
})

const totalMilliseconds = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return String(diffMilliseconds.value)
})

const totalSeconds = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return formatFraction(diffMilliseconds.value / 1000, 3)
})

const totalMinutes = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return formatFraction(diffMilliseconds.value / 60000, 6)
})

const totalHours = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return formatFraction(diffMilliseconds.value / 3600000, 6)
})

const totalDays = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return formatFraction(diffMilliseconds.value / 86400000, 6)
})

function setNow(target: 'start' | 'end') {
  const now = Date.now()
  if (target === 'start') {
    startInput.value = formatInTimeZone(now, startTimeZone.value)
    return
  }
  endInput.value = formatInTimeZone(now, endTimeZone.value)
}

function swapValues() {
  const nextStartTimeZone = endTimeZone.value
  const nextEndTimeZone = startTimeZone.value
  const nextStartInput = endInput.value
  const nextEndInput = startInput.value

  startTimeZone.value = nextStartTimeZone
  endTimeZone.value = nextEndTimeZone
  startInput.value = nextStartInput
  endInput.value = nextEndInput
}
</script>
