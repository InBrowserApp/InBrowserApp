<template>
  <n-alert v-if="errorMessage" type="error" :title="t('parseErrorTitle')">
    {{ errorMessage }}
  </n-alert>

  <n-alert v-if="warnings.length" type="warning" :title="t('warningsTitle')">
    <n-space vertical :size="4">
      <div v-for="warning in warnings" :key="warning">{{ warning }}</div>
    </n-space>
  </n-alert>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NSpace } from 'naive-ui'

defineProps<{
  errorMessage?: string
  warnings: string[]
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "parseErrorTitle": "Parsing Error",
    "warningsTitle": "Warnings"
  },
  "zh": {
    "parseErrorTitle": "解析错误",
    "warningsTitle": "警告"
  },
  "zh-CN": {
    "parseErrorTitle": "解析错误",
    "warningsTitle": "警告"
  },
  "zh-TW": {
    "parseErrorTitle": "解析錯誤",
    "warningsTitle": "警告"
  },
  "zh-HK": {
    "parseErrorTitle": "解析錯誤",
    "warningsTitle": "警告"
  },
  "es": {
    "parseErrorTitle": "Error de análisis",
    "warningsTitle": "Advertencias"
  },
  "fr": {
    "parseErrorTitle": "Erreur d'analyse",
    "warningsTitle": "Avertissements"
  },
  "de": {
    "parseErrorTitle": "Analysefehler",
    "warningsTitle": "Warnungen"
  },
  "it": {
    "parseErrorTitle": "Errore di analisi",
    "warningsTitle": "Avvisi"
  },
  "ja": {
    "parseErrorTitle": "解析エラー",
    "warningsTitle": "警告"
  },
  "ko": {
    "parseErrorTitle": "분석 오류",
    "warningsTitle": "경고"
  },
  "ru": {
    "parseErrorTitle": "Ошибка разбора",
    "warningsTitle": "Предупреждения"
  },
  "pt": {
    "parseErrorTitle": "Erro de análise",
    "warningsTitle": "Avisos"
  },
  "ar": {
    "parseErrorTitle": "خطأ في التحليل",
    "warningsTitle": "تحذيرات"
  },
  "hi": {
    "parseErrorTitle": "पार्सिंग त्रुटि",
    "warningsTitle": "चेतावनियाँ"
  },
  "tr": {
    "parseErrorTitle": "Ayrıştırma Hatası",
    "warningsTitle": "Uyarılar"
  },
  "nl": {
    "parseErrorTitle": "Parseerfout",
    "warningsTitle": "Waarschuwingen"
  },
  "sv": {
    "parseErrorTitle": "Tolkningsfel",
    "warningsTitle": "Varningar"
  },
  "pl": {
    "parseErrorTitle": "Błąd analizy",
    "warningsTitle": "Ostrzeżenia"
  },
  "vi": {
    "parseErrorTitle": "Lỗi phân tích",
    "warningsTitle": "Cảnh báo"
  },
  "th": {
    "parseErrorTitle": "ข้อผิดพลาดในการวิเคราะห์",
    "warningsTitle": "คำเตือน"
  },
  "id": {
    "parseErrorTitle": "Kesalahan analisis",
    "warningsTitle": "Peringatan"
  },
  "he": {
    "parseErrorTitle": "שגיאת ניתוח",
    "warningsTitle": "אזהרות"
  },
  "ms": {
    "parseErrorTitle": "Ralat analisis",
    "warningsTitle": "Amaran"
  },
  "no": {
    "parseErrorTitle": "Analysefeil",
    "warningsTitle": "Advarsler"
  }
}
</i18n>
