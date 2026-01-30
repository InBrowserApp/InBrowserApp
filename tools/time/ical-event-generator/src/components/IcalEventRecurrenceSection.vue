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
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import IcalEventRecurrenceEndsSection from './IcalEventRecurrenceEndsSection.vue'
import IcalEventRecurrenceFrequencySection from './IcalEventRecurrenceFrequencySection.vue'
import IcalEventRecurrencePatternSection from './IcalEventRecurrencePatternSection.vue'

type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
type RecurrenceEndMode = 'never' | 'count' | 'until'
type RecurrenceErrorKey = 'invalid-date-time' | 'invalid-date'

defineProps<{
  recurrenceUntilStatus?: 'error' | 'success'
  recurrenceUntilErrorKey?: RecurrenceErrorKey
  isAllDay: boolean
}>()

const recurrenceFrequencyModel = defineModel<RecurrenceFrequency>('recurrenceFrequency', {
  required: true,
})
const recurrenceIntervalModel = defineModel<number>('recurrenceInterval', { required: true })
const recurrenceWeekdaysModel = defineModel<string[]>('recurrenceWeekdays', { required: true })
const recurrenceMonthDayModel = defineModel<number>('recurrenceMonthDay', { required: true })
const recurrenceMonthModel = defineModel<number>('recurrenceMonth', { required: true })
const recurrenceEndModeModel = defineModel<RecurrenceEndMode>('recurrenceEndMode', {
  required: true,
})
const recurrenceCountModel = defineModel<number>('recurrenceCount', { required: true })
const recurrenceUntilInputModel = defineModel<string>('recurrenceUntilInput', { required: true })

const { t } = useI18n()
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
