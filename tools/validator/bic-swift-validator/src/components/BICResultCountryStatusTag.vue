<template>
  <NTag :type="isCountryValid ? 'success' : 'warning'" size="small">
    {{ isCountryValid ? t('supported') : t('unknown') }}
  </NTag>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isCountryValid: boolean
}>()
</script>

<i18n lang="json">
{
  "en": {
    "supported": "Supported",
    "unknown": "Unknown"
  },
  "zh": {
    "supported": "已支持",
    "unknown": "未知"
  },
  "zh-CN": {
    "supported": "已支持",
    "unknown": "未知"
  },
  "zh-TW": {
    "supported": "已支援",
    "unknown": "未知"
  },
  "zh-HK": {
    "supported": "已支援",
    "unknown": "未知"
  },
  "es": {
    "supported": "Compatible",
    "unknown": "Desconocido"
  },
  "fr": {
    "supported": "Pris en charge",
    "unknown": "Inconnu"
  },
  "de": {
    "supported": "Unterstützt",
    "unknown": "Unbekannt"
  },
  "it": {
    "supported": "Supportato",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "supported": "サポート済み",
    "unknown": "不明"
  },
  "ko": {
    "supported": "지원됨",
    "unknown": "알 수 없음"
  },
  "ru": {
    "supported": "Поддерживается",
    "unknown": "Неизвестно"
  },
  "pt": {
    "supported": "Compatível",
    "unknown": "Desconhecido"
  },
  "ar": {
    "supported": "مدعوم",
    "unknown": "غير معروف"
  },
  "hi": {
    "supported": "समर्थित",
    "unknown": "अज्ञात"
  },
  "tr": {
    "supported": "Destekleniyor",
    "unknown": "Bilinmeyen"
  },
  "nl": {
    "supported": "Ondersteund",
    "unknown": "Onbekend"
  },
  "sv": {
    "supported": "Stöds",
    "unknown": "Okänd"
  },
  "pl": {
    "supported": "Obsługiwany",
    "unknown": "Nieznany"
  },
  "vi": {
    "supported": "Được hỗ trợ",
    "unknown": "Không rõ"
  },
  "th": {
    "supported": "รองรับ",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "supported": "Didukung",
    "unknown": "Tidak diketahui"
  },
  "he": {
    "supported": "נתמך",
    "unknown": "לא ידוע"
  },
  "ms": {
    "supported": "Disokong",
    "unknown": "Tidak diketahui"
  },
  "no": {
    "supported": "Støttet",
    "unknown": "Ukjent"
  }
}
</i18n>
