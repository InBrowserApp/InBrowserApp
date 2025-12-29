<template>
  <InfoStatistic :label="t('browser-name')" :value="browserName" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const browserName = computed(() => {
  const ua = navigator.userAgent
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Edg')) return 'Edge'
  return t('unknown')
})
</script>

<i18n lang="json">
{
  "en": {
    "browser-name": "Browser",
    "unknown": "Unknown"
  },
  "zh": {
    "browser-name": "浏览器",
    "unknown": "未知"
  },
  "zh-CN": {
    "browser-name": "浏览器",
    "unknown": "未知"
  },
  "zh-TW": {
    "browser-name": "瀏覽器",
    "unknown": "未知"
  },
  "zh-HK": {
    "browser-name": "瀏覽器",
    "unknown": "未知"
  },
  "es": {
    "browser-name": "Navegador",
    "unknown": "Desconocido"
  },
  "fr": {
    "browser-name": "Navigateur",
    "unknown": "Inconnu"
  },
  "de": {
    "browser-name": "Browser",
    "unknown": "Unbekannt"
  },
  "it": {
    "browser-name": "Browser",
    "unknown": "Sconosciuto"
  },
  "ja": {
    "browser-name": "ブラウザ",
    "unknown": "不明"
  },
  "ko": {
    "browser-name": "브라우저",
    "unknown": "알 수 없음"
  },
  "ru": {
    "browser-name": "Браузер",
    "unknown": "Неизвестно"
  },
  "pt": {
    "browser-name": "Navegador",
    "unknown": "Desconhecido"
  },
  "ar": {
    "browser-name": "المتصفح",
    "unknown": "غير معروف"
  },
  "hi": {
    "browser-name": "ब्राउज़र",
    "unknown": "अज्ञात"
  },
  "tr": {
    "browser-name": "Tarayici",
    "unknown": "Bilinmiyor"
  },
  "nl": {
    "browser-name": "Browser",
    "unknown": "Onbekend"
  },
  "sv": {
    "browser-name": "Webblasare",
    "unknown": "Okand"
  },
  "pl": {
    "browser-name": "Przegladarka",
    "unknown": "Nieznana"
  },
  "vi": {
    "browser-name": "Trinh Duyet",
    "unknown": "Khong Xac Dinh"
  },
  "th": {
    "browser-name": "เบราว์เซอร์",
    "unknown": "ไม่ทราบ"
  },
  "id": {
    "browser-name": "Browser",
    "unknown": "Tidak Diketahui"
  },
  "he": {
    "browser-name": "דפדפן",
    "unknown": "לא ידוע"
  },
  "ms": {
    "browser-name": "Pelayar",
    "unknown": "Tidak Diketahui"
  },
  "no": {
    "browser-name": "Nettleser",
    "unknown": "Ukjent"
  }
}
</i18n>
