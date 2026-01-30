<template>
  <n-skeleton v-if="data === undefined" text style="width: 10em" />
  <n-tag v-if="data === null" :bordered="false" size="small" type="error">{{ t('unknown') }}</n-tag>
</template>

<script setup lang="ts">
import { NSkeleton, NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  data: unknown
}>()
</script>

<i18n lang="json">
{
  "en": {
    "unknown": "Unknown"
  },
  "zh": {
    "unknown": "未知"
  },
  "zh-CN": {
    "unknown": "未知"
  },
  "zh-TW": {
    "unknown": "未知"
  },
  "zh-HK": {
    "unknown": "未知"
  },
  "es": {
    "unknown": "Desconocido"
  },
  "fr": {
    "unknown": "Inconnu"
  },
  "de": {
    "unknown": "Unbekannt"
  },
  "it": {
    "unknown": "Sconosciuto"
  },
  "ja": {
    "unknown": "不明"
  },
  "ko": {
    "unknown": "알 수 없음"
  },
  "ru": {
    "unknown": "Неизвестно"
  },
  "pt": {
    "unknown": "Desconhecido"
  },
  "ar": {
    "unknown": "غير معروف"
  },
  "hi": {
    "unknown": "अज्ञात"
  },
  "tr": {
    "unknown": "Bilinmiyor"
  },
  "nl": {
    "unknown": "Onbekend"
  },
  "sv": {
    "unknown": "Okänd"
  },
  "pl": {
    "unknown": "Nieznany"
  },
  "vi": {
    "unknown": "Không rõ"
  },
  "th": {
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "unknown": "Tidak diketahui"
  },
  "he": {
    "unknown": "לא ידוע"
  },
  "ms": {
    "unknown": "Tidak diketahui"
  },
  "no": {
    "unknown": "Ukjent"
  }
}
</i18n>
