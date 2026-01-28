<template>
  <TimeZoneConverterInputs
    v-model:from-input="fromInput"
    v-model:to-input="toInput"
    v-model:from-time-zone="fromTimeZone"
    v-model:to-time-zone="toTimeZone"
    :from-status="fromStatus"
    :to-status="toStatus"
    :from-error="fromError"
    :to-error="toError"
    :from-offset-label="fromOffsetLabel"
    :to-offset-label="toOffsetLabel"
    :time-zone-options="timeZoneOptions"
    @set-now="setNow"
    @mark-edited="markEdited"
  />
  <TimeZoneConverterSwapSection @swap="swapTimeZones" />
  <TimeZoneConverterDetails
    :iso-string="isoString"
    :utc-string="utcString"
    :unix-milliseconds="unixMilliseconds"
    :unix-seconds="unixSeconds"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import TimeZoneConverterDetails from './TimeZoneConverterDetails.vue'
import TimeZoneConverterInputs from './TimeZoneConverterInputs.vue'
import TimeZoneConverterSwapSection from './TimeZoneConverterSwapSection.vue'
import {
  formatInTimeZone,
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
} from '../utils/timeZone'

const timeZones = getSupportedTimeZones()
const optionReferenceTimestamp = Date.now()
const timeZoneOptions = timeZones.map((timeZone) => {
  try {
    const offsetLabel = formatOffsetLabel(getTimeZoneOffsetMs(optionReferenceTimestamp, timeZone))
    return {
      label: `${timeZone} (${offsetLabel})`,
      value: timeZone,
    }
  } catch {
    return {
      label: timeZone,
      value: timeZone,
    }
  }
})

const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const defaultFromTimeZone = isTimeZoneSupported(resolvedTimeZone) ? resolvedTimeZone : 'UTC'
const defaultToCandidate = defaultFromTimeZone === 'UTC' ? 'America/New_York' : 'UTC'
const defaultToTimeZone = isTimeZoneSupported(defaultToCandidate) ? defaultToCandidate : 'UTC'

const fromTimeZone = useStorage('tools:time-zone-converter:from-timezone', defaultFromTimeZone)
const toTimeZone = useStorage('tools:time-zone-converter:to-timezone', defaultToTimeZone)
const fromInput = useStorage(
  'tools:time-zone-converter:from-input',
  formatInTimeZone(Date.now(), defaultFromTimeZone),
)
const toInput = useStorage(
  'tools:time-zone-converter:to-input',
  formatInTimeZone(Date.now(), defaultToTimeZone),
)

if (!isTimeZoneSupported(fromTimeZone.value)) {
  fromTimeZone.value = defaultFromTimeZone
}

if (!isTimeZoneSupported(toTimeZone.value)) {
  toTimeZone.value = defaultToTimeZone
}

const lastEdited = ref<'from' | 'to'>('from')

const fromParts = computed(() => parseDateTimeInput(fromInput.value))
const toParts = computed(() => parseDateTimeInput(toInput.value))

const fromStatus = computed(() => {
  if (!fromInput.value.trim()) return undefined
  return fromParts.value ? 'success' : 'error'
})

const toStatus = computed(() => {
  if (!toInput.value.trim()) return undefined
  return toParts.value ? 'success' : 'error'
})

const fromError = computed(() => Boolean(fromInput.value.trim()) && !fromParts.value)
const toError = computed(() => Boolean(toInput.value.trim()) && !toParts.value)

const baseTimestamp = computed(() => {
  if (lastEdited.value === 'from') {
    if (!fromParts.value || !isTimeZoneSupported(fromTimeZone.value)) return null
    return toUtcTimestamp(fromParts.value, fromTimeZone.value)
  }

  if (!toParts.value || !isTimeZoneSupported(toTimeZone.value)) return null
  return toUtcTimestamp(toParts.value, toTimeZone.value)
})

const referenceTimestamp = computed(() => baseTimestamp.value ?? Date.now())

const fromOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(fromTimeZone.value)) return ''
  return formatOffsetLabel(getTimeZoneOffsetMs(referenceTimestamp.value, fromTimeZone.value))
})

const toOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(toTimeZone.value)) return ''
  return formatOffsetLabel(getTimeZoneOffsetMs(referenceTimestamp.value, toTimeZone.value))
})

const isoString = computed(() => {
  if (baseTimestamp.value === null) return ''
  return new Date(baseTimestamp.value).toISOString()
})

const utcString = computed(() => {
  if (baseTimestamp.value === null) return ''
  return new Date(baseTimestamp.value).toUTCString()
})

const unixMilliseconds = computed(() => {
  if (baseTimestamp.value === null) return ''
  return String(baseTimestamp.value)
})

const unixSeconds = computed(() => {
  if (baseTimestamp.value === null) return ''
  return String(Math.floor(baseTimestamp.value / 1000))
})

watch(
  [baseTimestamp, fromTimeZone, toTimeZone, lastEdited],
  () => {
    if (baseTimestamp.value === null) return
    if (lastEdited.value === 'from') {
      toInput.value = formatInTimeZone(baseTimestamp.value, toTimeZone.value)
      return
    }
    fromInput.value = formatInTimeZone(baseTimestamp.value, fromTimeZone.value)
  },
  { immediate: true },
)

function markEdited(source: 'from' | 'to') {
  lastEdited.value = source
}

function setNow(source: 'from' | 'to') {
  const now = Date.now()
  if (source === 'from') {
    fromInput.value = formatInTimeZone(now, fromTimeZone.value)
    lastEdited.value = 'from'
    return
  }

  toInput.value = formatInTimeZone(now, toTimeZone.value)
  lastEdited.value = 'to'
}

function swapTimeZones() {
  const nextFromZone = toTimeZone.value
  const nextToZone = fromTimeZone.value
  const nextFromInput = toInput.value
  const nextToInput = fromInput.value

  fromTimeZone.value = nextFromZone
  toTimeZone.value = nextToZone
  fromInput.value = nextFromInput
  toInput.value = nextToInput
  lastEdited.value = 'from'
}
</script>
