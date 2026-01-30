<template>
  <ToolSectionHeader>{{ t('recurrence') }}</ToolSectionHeader>
  <ToolSection>
    <IcalEventRecurrenceFrequencySection
      v-model:recurrence-frequency="recurrenceFrequencyModel"
      v-model:recurrence-interval="recurrenceIntervalModel"
    />
    <IcalEventRecurrencePatternSection
      v-model:recurrence-frequency="recurrenceFrequencyModel"
      v-model:recurrence-weekdays="recurrenceWeekdaysModel"
      v-model:recurrence-month-day="recurrenceMonthDayModel"
      v-model:recurrence-month="recurrenceMonthModel"
    />
    <IcalEventRecurrenceEndsSection
      v-model:recurrence-frequency="recurrenceFrequencyModel"
      v-model:recurrence-end-mode="recurrenceEndModeModel"
      v-model:recurrence-count="recurrenceCountModel"
      v-model:recurrence-until-input="recurrenceUntilInputModel"
      :recurrence-until-status="recurrenceUntilStatus"
      :recurrence-until-error-key="recurrenceUntilErrorKey"
      :is-all-day="isAllDay"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import IcalEventRecurrenceEndsSection from './IcalEventRecurrenceEndsSection.vue'
import IcalEventRecurrenceFrequencySection from './IcalEventRecurrenceFrequencySection.vue'
import IcalEventRecurrencePatternSection from './IcalEventRecurrencePatternSection.vue'

type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
type RecurrenceEndMode = 'never' | 'count' | 'until'
type RecurrenceErrorKey = 'invalid-date-time' | 'invalid-date'

const props = defineProps<{
  recurrenceFrequency: RecurrenceFrequency
  recurrenceInterval: number
  recurrenceWeekdays: string[]
  recurrenceMonthDay: number
  recurrenceMonth: number
  recurrenceEndMode: RecurrenceEndMode
  recurrenceCount: number
  recurrenceUntilInput: string
  recurrenceUntilStatus?: 'error' | 'success'
  recurrenceUntilErrorKey?: RecurrenceErrorKey
  isAllDay: boolean
}>()

const emit = defineEmits<{
  (event: 'update:recurrenceFrequency', value: RecurrenceFrequency): void
  (event: 'update:recurrenceInterval', value: number): void
  (event: 'update:recurrenceWeekdays', value: string[]): void
  (event: 'update:recurrenceMonthDay', value: number): void
  (event: 'update:recurrenceMonth', value: number): void
  (event: 'update:recurrenceEndMode', value: RecurrenceEndMode): void
  (event: 'update:recurrenceCount', value: number): void
  (event: 'update:recurrenceUntilInput', value: string): void
}>()

const { t } = useI18n()

const recurrenceFrequencyModel = computed({
  get: () => props.recurrenceFrequency,
  set: (value) => emit('update:recurrenceFrequency', value),
})

const recurrenceIntervalModel = computed({
  get: () => props.recurrenceInterval,
  set: (value) => emit('update:recurrenceInterval', value ?? 1),
})

const recurrenceWeekdaysModel = computed({
  get: () => props.recurrenceWeekdays,
  set: (value) => emit('update:recurrenceWeekdays', value),
})

const recurrenceMonthDayModel = computed({
  get: () => props.recurrenceMonthDay,
  set: (value) => emit('update:recurrenceMonthDay', value ?? 1),
})

const recurrenceMonthModel = computed({
  get: () => props.recurrenceMonth,
  set: (value) => emit('update:recurrenceMonth', value ?? 1),
})

const recurrenceEndModeModel = computed({
  get: () => props.recurrenceEndMode,
  set: (value) => emit('update:recurrenceEndMode', value),
})

const recurrenceCountModel = computed({
  get: () => props.recurrenceCount,
  set: (value) => emit('update:recurrenceCount', value ?? 1),
})

const recurrenceUntilInputModel = computed({
  get: () => props.recurrenceUntilInput,
  set: (value) => emit('update:recurrenceUntilInput', value),
})
</script>

<i18n lang="json">
{
  "en": {
    "recurrence": "Recurrence"
  },
  "zh": {
    "recurrence": "重复"
  },
  "zh-CN": {
    "recurrence": "重复"
  },
  "zh-TW": {
    "recurrence": "重複"
  },
  "zh-HK": {
    "recurrence": "重複"
  },
  "es": {
    "recurrence": "Recurrencia"
  },
  "fr": {
    "recurrence": "Récurrence"
  },
  "de": {
    "recurrence": "Wiederholung"
  },
  "it": {
    "recurrence": "Ricorrenza"
  },
  "ja": {
    "recurrence": "繰り返し"
  },
  "ko": {
    "recurrence": "반복"
  },
  "ru": {
    "recurrence": "Повторение"
  },
  "pt": {
    "recurrence": "Recorrência"
  },
  "ar": {
    "recurrence": "التكرار"
  },
  "hi": {
    "recurrence": "पुनरावृत्ति"
  },
  "tr": {
    "recurrence": "Yineleme"
  },
  "nl": {
    "recurrence": "Herhaling"
  },
  "sv": {
    "recurrence": "Upprepning"
  },
  "pl": {
    "recurrence": "Cykliczność"
  },
  "vi": {
    "recurrence": "Lặp lại"
  },
  "th": {
    "recurrence": "การทำซ้ำ"
  },
  "id": {
    "recurrence": "Pengulangan"
  },
  "he": {
    "recurrence": "חזרתיות"
  },
  "ms": {
    "recurrence": "Ulangan"
  },
  "no": {
    "recurrence": "Gjentakelse"
  }
}
</i18n>
