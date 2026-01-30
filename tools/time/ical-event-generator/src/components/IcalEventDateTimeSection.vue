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
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import IcalEventDateTimeRangeSection from './IcalEventDateTimeRangeSection.vue'
import IcalEventDateTimeSettingsSection from './IcalEventDateTimeSettingsSection.vue'

type RangeErrorKey = 'invalid-date-time' | 'invalid-date' | 'end-before-start'

const { timeZoneOptions, offsetLabel, rangeErrorKey } = withDefaults(
  defineProps<{
    timeZoneOptions: Array<{ label: string; value: string }>
    offsetLabel?: string
    rangeErrorKey?: RangeErrorKey
  }>(),
  {
    offsetLabel: '',
    rangeErrorKey: undefined,
  },
)

const isAllDayModel = defineModel<boolean>('isAllDay', { required: true })
const timeZoneModel = defineModel<string>('timeZone', { required: true })
const outputModeModel = defineModel<'utc' | 'tzid'>('outputMode', { required: true })
const dateRangeModel = defineModel<[number, number] | null>('dateRange', { required: true })

const { t } = useI18n()
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
