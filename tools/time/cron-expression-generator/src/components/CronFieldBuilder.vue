<template>
  <n-card size="small">
    <template #header>
      <CronFieldHeader :field-name="fieldName" />
    </template>

    <n-flex vertical :size="12">
      <CronFieldModeSelector v-model:mode="mode" />

      <template v-if="mode === 'every'">
        <CronFieldEveryDescription :field-name="fieldName" />
      </template>

      <template v-else-if="mode === 'interval'">
        <CronFieldIntervalControl
          v-model:interval-value="intervalValue"
          :field-config="fieldConfig"
        />
      </template>

      <template v-else-if="mode === 'specific'">
        <CronFieldOptionsMonth
          v-if="isMonth"
          v-model:specific-values="specificValues"
          v-model:range-start="rangeStart"
          v-model:range-end="rangeEnd"
          :field-config="fieldConfig"
          mode="specific"
        />
        <CronFieldOptionsWeekday
          v-else-if="isWeekday"
          v-model:specific-values="specificValues"
          v-model:range-start="rangeStart"
          v-model:range-end="rangeEnd"
          :field-config="fieldConfig"
          mode="specific"
        />
        <CronFieldOptionsNumeric
          v-else
          v-model:specific-values="specificValues"
          v-model:range-start="rangeStart"
          v-model:range-end="rangeEnd"
          :field-config="fieldConfig"
          mode="specific"
        />
      </template>

      <template v-else-if="mode === 'range'">
        <CronFieldOptionsMonth
          v-if="isMonth"
          v-model:specific-values="specificValues"
          v-model:range-start="rangeStart"
          v-model:range-end="rangeEnd"
          :field-config="fieldConfig"
          mode="range"
        />
        <CronFieldOptionsWeekday
          v-else-if="isWeekday"
          v-model:specific-values="specificValues"
          v-model:range-start="rangeStart"
          v-model:range-end="rangeEnd"
          :field-config="fieldConfig"
          mode="range"
        />
        <CronFieldOptionsNumeric
          v-else
          v-model:specific-values="specificValues"
          v-model:range-start="rangeStart"
          v-model:range-end="rangeEnd"
          :field-config="fieldConfig"
          mode="range"
        />
      </template>
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { NCard, NFlex } from 'naive-ui'
import CronFieldEveryDescription from './CronFieldEveryDescription.vue'
import CronFieldHeader from './CronFieldHeader.vue'
import CronFieldIntervalControl from './CronFieldIntervalControl.vue'
import CronFieldModeSelector from './CronFieldModeSelector.vue'
import CronFieldOptionsMonth from './CronFieldOptionsMonth.vue'
import CronFieldOptionsNumeric from './CronFieldOptionsNumeric.vue'
import CronFieldOptionsWeekday from './CronFieldOptionsWeekday.vue'

type FieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'

type Mode = 'every' | 'interval' | 'specific' | 'range'

type FieldUnit = 'minutes' | 'hours' | 'days' | 'months' | 'daysOfWeek'

interface FieldConfig {
  min: number
  max: number
  unit: FieldUnit
  gridCols: number
}

const props = defineProps<{
  fieldName: FieldName
}>()

const modelValue = defineModel<string>({ required: true })

const FIELD_CONFIGS: Record<FieldName, FieldConfig> = {
  minute: { min: 0, max: 59, unit: 'minutes', gridCols: 10 },
  hour: { min: 0, max: 23, unit: 'hours', gridCols: 8 },
  dayOfMonth: { min: 1, max: 31, unit: 'days', gridCols: 8 },
  month: { min: 1, max: 12, unit: 'months', gridCols: 6 },
  dayOfWeek: { min: 0, max: 6, unit: 'daysOfWeek', gridCols: 7 },
}

const fieldConfig = computed(() => FIELD_CONFIGS[props.fieldName])

const isMonth = computed(() => props.fieldName === 'month')
const isWeekday = computed(() => props.fieldName === 'dayOfWeek')

// Internal state
const mode = ref<Mode>('every')
const intervalValue = ref(5)
const specificValues = ref<number[]>([])
const rangeStart = ref(fieldConfig.value.min)
const rangeEnd = ref(fieldConfig.value.max)

// Parse initial value
function parseValue(value: string) {
  if (value === '*') {
    mode.value = 'every'
  } else if (value.startsWith('*/')) {
    mode.value = 'interval'
    intervalValue.value = parseInt(value.slice(2)) || 5
  } else if (value.includes('-')) {
    mode.value = 'range'
    const [start, end] = value.split('-').map(Number)
    rangeStart.value = start ?? fieldConfig.value.min
    rangeEnd.value = end ?? fieldConfig.value.max
  } else if (value.includes(',') || /^\d+$/.test(value)) {
    mode.value = 'specific'
    specificValues.value = value
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n))
  }
}

// Generate cron field value
const generatedValue = computed(() => {
  switch (mode.value) {
    case 'every':
      return '*'
    case 'interval':
      return `*/${intervalValue.value}`
    case 'specific':
      if (specificValues.value.length === 0) {
        return '*'
      }
      return [...specificValues.value].sort((a, b) => a - b).join(',')
    case 'range':
      return `${rangeStart.value}-${rangeEnd.value}`
    default:
      return '*'
  }
})

// Initialize from prop
parseValue(modelValue.value)

// Watch for external changes
watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue !== undefined && newValue !== generatedValue.value) {
      parseValue(newValue)
    }
  },
)

// Emit changes
watch(generatedValue, (newValue) => {
  modelValue.value = newValue
})
</script>
