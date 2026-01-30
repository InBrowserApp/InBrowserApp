<template>
  <NTag :type="isRegionValid ? 'success' : 'warning'" size="small">
    {{ isRegionValid ? t('known') : t('unknown') }}
  </NTag>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isRegionValid: boolean
}>()
</script>

<i18n lang="json">
{
  "en": {
    "known": "Known",
    "unknown": "Unknown"
  },
  "zh": {
    "known": "已知",
    "unknown": "未知"
  },
  "zh-CN": {
    "known": "已知",
    "unknown": "未知"
  },
  "zh-TW": {
    "known": "已知",
    "unknown": "未知"
  },
  "zh-HK": {
    "known": "已知",
    "unknown": "未知"
  },
  "es": {
    "known": "Conocido",
    "unknown": "Desconocido"
  },
  "fr": {
    "known": "Connu",
    "unknown": "Inconnu"
  },
  "de": {
    "known": "Bekannt",
    "unknown": "Unbekannt"
  },
  "it": {
    "known": "Conosciuto",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "known": "既知",
    "unknown": "不明"
  },
  "ko": {
    "known": "알려짐",
    "unknown": "알 수 없음"
  },
  "ru": {
    "known": "Известен",
    "unknown": "Неизвестен"
  },
  "pt": {
    "known": "Conhecido",
    "unknown": "Desconhecido"
  },
  "ar": {
    "known": "معروف",
    "unknown": "غير معروف"
  },
  "hi": {
    "known": "ज्ञात",
    "unknown": "अज्ञात"
  },
  "tr": {
    "known": "Bilinen",
    "unknown": "Bilinmeyen"
  },
  "nl": {
    "known": "Bekend",
    "unknown": "Onbekend"
  },
  "sv": {
    "known": "Känd",
    "unknown": "Okänd"
  },
  "pl": {
    "known": "Znany",
    "unknown": "Nieznany"
  },
  "vi": {
    "known": "Đã biết",
    "unknown": "Không xác định"
  },
  "th": {
    "known": "รู้จัก",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "known": "Dikenal",
    "unknown": "Tidak dikenal"
  },
  "he": {
    "known": "ידוע",
    "unknown": "לא ידוע"
  },
  "ms": {
    "known": "Diketahui",
    "unknown": "Tidak diketahui"
  },
  "no": {
    "known": "Kjent",
    "unknown": "Ukjent"
  }
}
</i18n>
