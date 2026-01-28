<template>
  <BusinessDaysRulesSection
    v-model:weekday-mode="weekdayMode"
    v-model:weekday-selection="weekdaySelection"
    v-model:holiday-list="holidayList"
    :has-working-days="hasWorkingDays"
    :holiday-invalid-count="holidayInvalidCount"
    :holiday-status="holidayStatus"
  />
  <BusinessDaysCountSection
    v-model:start-date="startDate"
    v-model:end-date="endDate"
    v-model:include-endpoints="includeEndpoints"
    :business-days-label="businessDaysLabel"
    :total-days-label="totalDaysLabel"
    :weekend-days-label="weekendDaysLabel"
    :holiday-days-label="holidayDaysLabel"
    :is-range-reversed="isRangeReversed"
  />
  <BusinessDaysOffsetSection
    v-model:base-date="baseDate"
    v-model:day-offset="dayOffset"
    v-model:include-start="includeStart"
    :has-working-days="hasWorkingDays"
    :add-date-label="addDateLabel"
    :subtract-date-label="subtractDateLabel"
  />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import BusinessDaysCountSection from './BusinessDaysCountSection.vue'
import BusinessDaysOffsetSection from './BusinessDaysOffsetSection.vue'
import BusinessDaysRulesSection from './BusinessDaysRulesSection.vue'
import {
  addBusinessDays,
  addDays,
  countBusinessDays,
  normalizeWeekdayList,
  parseHolidayList,
  startOfLocalDay,
  toISODate,
  weekdayOrder,
} from '../utils/businessDays'

const today = startOfLocalDay(new Date())
const defaultStart = today.getTime()
const defaultEnd = addDays(today, 14).getTime()

const startDate = useStorage<number | null>(
  'tools:business-days-calculator:start-date',
  defaultStart,
)
const endDate = useStorage<number | null>('tools:business-days-calculator:end-date', defaultEnd)
const baseDate = useStorage<number | null>('tools:business-days-calculator:base-date', defaultStart)
const dayOffset = useStorage<number | null>('tools:business-days-calculator:day-offset', 5)
const includeEndpoints = useStorage<boolean>(
  'tools:business-days-calculator:include-endpoints',
  true,
)
const includeStart = useStorage<boolean>('tools:business-days-calculator:include-start-add', false)

const weekdayMode = useStorage<'weekend' | 'working'>(
  'tools:business-days-calculator:weekday-mode',
  'weekend',
)
const weekendDays = useStorage<number[]>('tools:business-days-calculator:weekend-days', [0, 6])
const holidayList = useStorage<string>('tools:business-days-calculator:holidays', '')

const normalizedWeekendDays = computed(() => normalizeWeekdayList(weekendDays.value))

watch(
  normalizedWeekendDays,
  (value) => {
    if (!isSameArray(value, weekendDays.value)) {
      weekendDays.value = value
    }
  },
  { immediate: true },
)

const weekdaySelection = computed({
  get() {
    if (weekdayMode.value === 'weekend') {
      return normalizedWeekendDays.value
    }
    return weekdayOrder.filter((day) => !normalizedWeekendDays.value.includes(day))
  },
  set(values: Array<number>) {
    const normalized = normalizeWeekdayList(values)
    if (weekdayMode.value === 'weekend') {
      weekendDays.value = normalized
    } else {
      weekendDays.value = weekdayOrder.filter((day) => !normalized.includes(day))
    }
  },
})

const weekendSet = computed(() => new Set(normalizedWeekendDays.value))
const hasWorkingDays = computed(() => weekendSet.value.size < 7)

const holidayParse = computed(() => parseHolidayList(holidayList.value))
const holidayInvalidCount = computed(() => holidayParse.value.invalid.length)
const holidayStatus = computed(() => {
  if (!holidayList.value.trim()) return undefined
  return holidayInvalidCount.value ? 'error' : 'success'
})

const startDateValue = computed(() => (startDate.value === null ? null : new Date(startDate.value)))
const endDateValue = computed(() => (endDate.value === null ? null : new Date(endDate.value)))

const countResult = computed(() => {
  if (!startDateValue.value || !endDateValue.value) return null
  return countBusinessDays(startDateValue.value, endDateValue.value, {
    weekendDays: weekendSet.value,
    holidays: holidayParse.value.dates,
    includeEndpoints: includeEndpoints.value,
  })
})

const isRangeReversed = computed(() => Boolean(countResult.value?.isReversed))

const businessDaysLabel = computed(() =>
  countResult.value ? String(countResult.value.businessDays) : '',
)
const totalDaysLabel = computed(() =>
  countResult.value ? String(countResult.value.totalDays) : '',
)
const weekendDaysLabel = computed(() =>
  countResult.value ? String(countResult.value.weekendDays) : '',
)
const holidayDaysLabel = computed(() =>
  countResult.value ? String(countResult.value.holidayDays) : '',
)

const offsetValue = computed(() => {
  if (typeof dayOffset.value !== 'number' || Number.isNaN(dayOffset.value)) return 0
  return Math.max(0, Math.floor(dayOffset.value))
})

const baseDateValue = computed(() => (baseDate.value === null ? null : new Date(baseDate.value)))

const addDate = computed(() => {
  if (!baseDateValue.value || !hasWorkingDays.value) return null
  return addBusinessDays(baseDateValue.value, offsetValue.value, {
    weekendDays: weekendSet.value,
    holidays: holidayParse.value.dates,
    includeStart: includeStart.value,
  })
})

const subtractDate = computed(() => {
  if (!baseDateValue.value || !hasWorkingDays.value) return null
  return addBusinessDays(baseDateValue.value, -offsetValue.value, {
    weekendDays: weekendSet.value,
    holidays: holidayParse.value.dates,
    includeStart: includeStart.value,
  })
})

const addDateLabel = computed(() => (addDate.value ? toISODate(addDate.value) : ''))
const subtractDateLabel = computed(() => (subtractDate.value ? toISODate(subtractDate.value) : ''))

function isSameArray(left: number[], right: number[]): boolean {
  if (left.length !== right.length) return false
  return left.every((value, index) => value === right[index])
}
</script>
