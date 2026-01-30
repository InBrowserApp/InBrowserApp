<template>
  <div>
    <TimestampInputSection
      v-model:timestamp="timestampInput"
      :is-valid="isValidTimestamp"
      @set-now="setNow"
    />
    <TimestampUnitSection
      v-model:unit="unit"
      :show-detected="unit === 'auto' && isValidTimestamp"
      :detected-unit="detectedUnit"
      :digit-count="digitCount"
    />
    <TimestampDateSection
      v-model:date="datePickerValue"
      :is-valid="isValidTimestamp"
      :local-date-string="localDateString"
    />
    <TimestampDetailsSection
      v-if="isValidTimestamp"
      :iso-string="isoString"
      :utc-string="utcString"
      :date-value="datePickerValue"
      :now="now"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useNow } from '@vueuse/core'
import TimestampInputSection from './TimestampInputSection.vue'
import TimestampUnitSection from './TimestampUnitSection.vue'
import TimestampDateSection from './TimestampDateSection.vue'
import TimestampDetailsSection from './TimestampDetailsSection.vue'

type TimestampUnit = 'auto' | 'seconds' | 'milliseconds' | 'nanoseconds'

// State
const timestampInput = ref<string>(String(Date.now()))
const unit = ref<TimestampUnit>('auto')

// Detect unit based on digit count
function detectUnit(timestamp: number): 'seconds' | 'milliseconds' | 'nanoseconds' {
  const len = String(Math.abs(Math.floor(timestamp))).length
  if (len <= 10) return 'seconds'
  if (len <= 13) return 'milliseconds'
  return 'nanoseconds'
}

// Convert to milliseconds (Date uses milliseconds)
function toMilliseconds(ts: number, tsUnit: 'seconds' | 'milliseconds' | 'nanoseconds'): number {
  switch (tsUnit) {
    case 'seconds':
      return ts * 1000
    case 'milliseconds':
      return ts
    case 'nanoseconds':
      return Math.floor(ts / 1_000_000)
  }
}

// Convert from milliseconds to target unit
function fromMilliseconds(ms: number, tsUnit: 'seconds' | 'milliseconds' | 'nanoseconds'): number {
  switch (tsUnit) {
    case 'seconds':
      return Math.floor(ms / 1000)
    case 'milliseconds':
      return ms
    case 'nanoseconds':
      return ms * 1_000_000
  }
}

// Computed properties
const isValidTimestamp = computed(() => {
  const value = timestampInput.value.trim()
  if (value === '') return false
  const num = Number(value)
  return !isNaN(num) && isFinite(num)
})

const timestampNumber = computed(() => Number(timestampInput.value))

const digitCount = computed(() => {
  if (!isValidTimestamp.value) return 0
  return String(Math.abs(Math.floor(timestampNumber.value))).length
})

const detectedUnit = computed(() => {
  if (!isValidTimestamp.value) return 'milliseconds'
  return detectUnit(timestampNumber.value)
})

const effectiveUnit = computed(() => {
  return unit.value === 'auto' ? detectedUnit.value : unit.value
})

const dateObject = computed(() => {
  if (!isValidTimestamp.value) return null
  const ms = toMilliseconds(timestampNumber.value, effectiveUnit.value)
  return new Date(ms)
})

const datePickerValue = computed({
  get: () => {
    if (!dateObject.value) return null
    return dateObject.value.getTime()
  },
  set: (value: number | null) => {
    if (value === null) return
    const newTimestamp = fromMilliseconds(value, effectiveUnit.value)
    timestampInput.value = String(newTimestamp)
  },
})

const localDateString = computed(() => {
  if (!dateObject.value) return ''
  return dateObject.value.toLocaleString()
})

const isoString = computed(() => {
  if (!dateObject.value) return ''
  return dateObject.value.toISOString()
})

const utcString = computed(() => {
  if (!dateObject.value) return ''
  return dateObject.value.toUTCString()
})

// Reactive current time for relative display
const now = useNow({ interval: 1000 })

// Methods
function setNow() {
  const now = Date.now()
  timestampInput.value = String(fromMilliseconds(now, effectiveUnit.value))
}

// Watch for unit changes - recalculate timestamp when switching units
watch(unit, (newUnit, oldUnit) => {
  if (!isValidTimestamp.value) return
  if (newUnit === 'auto' || oldUnit === 'auto') return

  // Convert current timestamp to milliseconds using old unit, then to new unit
  const ms = toMilliseconds(
    timestampNumber.value,
    oldUnit as 'seconds' | 'milliseconds' | 'nanoseconds',
  )
  const newTimestamp = fromMilliseconds(ms, newUnit as 'seconds' | 'milliseconds' | 'nanoseconds')
  timestampInput.value = String(newTimestamp)
})
</script>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
