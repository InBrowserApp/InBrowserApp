<template>
  <NText depth="3">{{ displayValue }}</NText>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  value?: string | number | null
}>()

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return t('notAvailable')
  }
  return `${props.value}`
})
</script>

<i18n lang="json">
{
  "en": {
    "notAvailable": "Not available"
  },
  "zh": {
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "notAvailable": "不可用"
  },
  "es": {
    "notAvailable": "No disponible"
  },
  "fr": {
    "notAvailable": "Non disponible"
  },
  "de": {
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "notAvailable": "利用不可"
  },
  "ko": {
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "notAvailable": "Недоступно"
  },
  "pt": {
    "notAvailable": "Não disponível"
  },
  "ar": {
    "notAvailable": "غير متاح"
  },
  "hi": {
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "notAvailable": "Mevcut değil"
  },
  "nl": {
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "notAvailable": "Inte tillgängligt"
  },
  "pl": {
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "notAvailable": "Không có"
  },
  "th": {
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "notAvailable": "לא זמין"
  },
  "ms": {
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
