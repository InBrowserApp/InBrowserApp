<template>
  <ToolSectionHeader>{{ t('date-time') }}</ToolSectionHeader>
  <ToolSection>
    <IcalEventDateTimeSettingsSection
      v-model:is-all-day="isAllDayModel"
      v-model:time-zone="timeZoneModel"
      v-model:output-mode="outputModeModel"
      :time-zone-options="timeZoneOptions"
      :offset-label="offsetLabel"
    />
    <IcalEventDateTimeRangeSection
      v-model:date-range="dateRangeModel"
      :is-all-day="isAllDayModel"
      :range-error-key="rangeErrorKey"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import IcalEventDateTimeRangeSection from './IcalEventDateTimeRangeSection.vue'
import IcalEventDateTimeSettingsSection from './IcalEventDateTimeSettingsSection.vue'

type RangeErrorKey = 'invalid-date-time' | 'invalid-date' | 'end-before-start'

const props = defineProps<{
  isAllDay: boolean
  timeZone: string
  timeZoneOptions: Array<{ label: string; value: string }>
  outputMode: 'utc' | 'tzid'
  dateRange: [number, number] | null
  offsetLabel?: string
  rangeErrorKey?: RangeErrorKey
}>()

const emit = defineEmits<{
  (event: 'update:isAllDay', value: boolean): void
  (event: 'update:timeZone', value: string): void
  (event: 'update:outputMode', value: 'utc' | 'tzid'): void
  (event: 'update:dateRange', value: [number, number] | null): void
}>()

const { t } = useI18n()

const isAllDayModel = computed({
  get: () => props.isAllDay,
  set: (value) => emit('update:isAllDay', value),
})

const timeZoneModel = computed({
  get: () => props.timeZone,
  set: (value) => emit('update:timeZone', value),
})

const outputModeModel = computed({
  get: () => props.outputMode,
  set: (value) => emit('update:outputMode', value),
})

const dateRangeModel = computed({
  get: () => props.dateRange,
  set: (value) => emit('update:dateRange', value),
})

const { timeZoneOptions, offsetLabel, rangeErrorKey } = props
</script>

<i18n lang="json">
{
  "en": {
    "date-time": "Date & time"
  },
  "zh": {
    "date-time": "日期与时间"
  },
  "zh-CN": {
    "date-time": "日期与时间"
  },
  "zh-TW": {
    "date-time": "日期與時間"
  },
  "zh-HK": {
    "date-time": "日期與時間"
  },
  "es": {
    "date-time": "Fecha y hora"
  },
  "fr": {
    "date-time": "Date et heure"
  },
  "de": {
    "date-time": "Datum und Uhrzeit"
  },
  "it": {
    "date-time": "Data e ora"
  },
  "ja": {
    "date-time": "日付と時刻"
  },
  "ko": {
    "date-time": "날짜 및 시간"
  },
  "ru": {
    "date-time": "Дата и время"
  },
  "pt": {
    "date-time": "Data e hora"
  },
  "ar": {
    "date-time": "التاريخ والوقت"
  },
  "hi": {
    "date-time": "तिथि और समय"
  },
  "tr": {
    "date-time": "Tarih ve saat"
  },
  "nl": {
    "date-time": "Datum en tijd"
  },
  "sv": {
    "date-time": "Datum och tid"
  },
  "pl": {
    "date-time": "Data i czas"
  },
  "vi": {
    "date-time": "Ngày và giờ"
  },
  "th": {
    "date-time": "วันที่และเวลา"
  },
  "id": {
    "date-time": "Tanggal dan waktu"
  },
  "he": {
    "date-time": "תאריך ושעה"
  },
  "ms": {
    "date-time": "Tarikh dan masa"
  },
  "no": {
    "date-time": "Dato og tid"
  }
}
</i18n>
