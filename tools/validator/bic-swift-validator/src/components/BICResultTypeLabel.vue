<template>
  <NText depth="3">{{ typeLabel }}</NText>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { BICValidationResult } from '../data/bic'

const props = defineProps<{
  type: BICValidationResult['type']
}>()

const { t } = useI18n()

const typeLabel = computed(() => {
  if (props.type === 'bic-8') return t('bic8')
  if (props.type === 'bic-11') return t('bic11')
  return t('unknown')
})
</script>

<i18n lang="json">
{
  "en": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Unknown"
  },
  "zh": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "未知"
  },
  "zh-CN": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "未知"
  },
  "zh-TW": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "未知"
  },
  "zh-HK": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "未知"
  },
  "es": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Desconocido"
  },
  "fr": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Inconnu"
  },
  "de": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Unbekannt"
  },
  "it": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "不明"
  },
  "ko": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "알 수 없음"
  },
  "ru": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Неизвестно"
  },
  "pt": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Desconhecido"
  },
  "ar": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "غير معروف"
  },
  "hi": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "अज्ञात"
  },
  "tr": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Bilinmeyen"
  },
  "nl": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Onbekend"
  },
  "sv": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Okänd"
  },
  "pl": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Nieznany"
  },
  "vi": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Không rõ"
  },
  "th": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Tidak diketahui"
  },
  "he": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "לא ידוע"
  },
  "ms": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Tidak diketahui"
  },
  "no": {
    "bic8": "BIC-8",
    "bic11": "BIC-11",
    "unknown": "Ukjent"
  }
}
</i18n>
