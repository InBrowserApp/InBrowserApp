<template>
  <div>
    <ToolSectionHeader>{{ t('date-time') }}</ToolSectionHeader>
    <ToolSection>
      <n-date-picker
        v-model:value="dateValue"
        type="datetime"
        :disabled="!isValid"
        style="width: 100%"
      />
    </ToolSection>
    <ToolSection>
      <CopyToClipboardButton :content="localDateString" />
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { NDatePicker } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dateValue = defineModel<number | null>('date', { required: true })

defineProps<{ isValid: boolean; localDateString: string }>()
</script>

<i18n lang="json">
{
  "en": {
    "date-time": "Date & Time"
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
    "date-time": "Fecha y Hora"
  },
  "fr": {
    "date-time": "Date et Heure"
  },
  "de": {
    "date-time": "Datum und Uhrzeit"
  },
  "it": {
    "date-time": "Data e Ora"
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
    "date-time": "Data e Hora"
  },
  "ar": {
    "date-time": "التاريخ والوقت"
  },
  "hi": {
    "date-time": "तिथि और समय"
  },
  "tr": {
    "date-time": "Tarih ve Saat"
  },
  "nl": {
    "date-time": "Datum en Tijd"
  },
  "sv": {
    "date-time": "Datum och Tid"
  },
  "pl": {
    "date-time": "Data i Czas"
  },
  "vi": {
    "date-time": "Ngày và Giờ"
  },
  "th": {
    "date-time": "วันที่และเวลา"
  },
  "id": {
    "date-time": "Tanggal dan Waktu"
  },
  "he": {
    "date-time": "תאריך ושעה"
  },
  "ms": {
    "date-time": "Tarikh dan Masa"
  },
  "no": {
    "date-time": "Dato og Tid"
  }
}
</i18n>
