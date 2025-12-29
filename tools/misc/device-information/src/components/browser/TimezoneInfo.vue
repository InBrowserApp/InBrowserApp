<template>
  <InfoStatistic :label="t('timezone')" :value="timezone" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const timezone = computed(() => {
  const offsetMinutes = -new Date().getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absOffset = Math.abs(offsetMinutes)
  const hours = String(Math.floor(absOffset / 60)).padStart(2, '0')
  const minutes = String(absOffset % 60).padStart(2, '0')
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return `${tz} (UTC${sign}${hours}:${minutes})`
})
</script>

<i18n lang="json">
{
  "en": {
    "timezone": "Timezone"
  },
  "zh": {
    "timezone": "时区"
  },
  "zh-CN": {
    "timezone": "时区"
  },
  "zh-TW": {
    "timezone": "時區"
  },
  "zh-HK": {
    "timezone": "時區"
  },
  "es": {
    "timezone": "Zona Horaria"
  },
  "fr": {
    "timezone": "Fuseau Horaire"
  },
  "de": {
    "timezone": "Zeitzone"
  },
  "it": {
    "timezone": "Fuso Orario"
  },
  "ja": {
    "timezone": "タイムゾーン"
  },
  "ko": {
    "timezone": "시간대"
  },
  "ru": {
    "timezone": "Часовой Пояс"
  },
  "pt": {
    "timezone": "Fuso Horario"
  },
  "ar": {
    "timezone": "المنطقة الزمنية"
  },
  "hi": {
    "timezone": "समय क्षेत्र"
  },
  "tr": {
    "timezone": "Saat Dilimi"
  },
  "nl": {
    "timezone": "Tijdzone"
  },
  "sv": {
    "timezone": "Tidszon"
  },
  "pl": {
    "timezone": "Strefa Czasowa"
  },
  "vi": {
    "timezone": "Mui Gio"
  },
  "th": {
    "timezone": "เขตเวลา"
  },
  "id": {
    "timezone": "Zona Waktu"
  },
  "he": {
    "timezone": "אזור זמן"
  },
  "ms": {
    "timezone": "Zon Waktu"
  },
  "no": {
    "timezone": "Tidssone"
  }
}
</i18n>
