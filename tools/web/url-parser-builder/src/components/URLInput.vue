<template>
  <n-input
    v-model:value="url"
    style="width: 100%"
    :placeholder="t('url-placeholder')"
    :autosize="{ minRows: 3, maxRows: 6 }"
    :status="urlStatus"
  />
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { NInput } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const modelUrl = defineModel<string>('url', { required: true })
const url = ref(modelUrl.value)
const { t } = useI18n()

const urlStatus = computed(() => {
  if (!url.value.trim()) return undefined
  try {
    new URL(url.value)
    return 'success'
  } catch {
    return 'error'
  }
})

watch(modelUrl, (newURL) => {
  url.value = newURL
})

// Watch for URL changes and parse them
watch(
  url,
  (newURL) => {
    try {
      new URL(newURL)
      modelUrl.value = newURL
    } catch {
      console.error('Invalid URL', newURL)
    }
  },
  { immediate: true },
)
</script>

<i18n lang="json">
{
  "en": {
    "url-placeholder": "Enter a complete URL to parse..."
  },
  "zh": {
    "url-placeholder": "输入完整的 URL 进行解析..."
  },
  "zh-CN": {
    "url-placeholder": "输入完整的 URL 进行解析..."
  },
  "zh-TW": {
    "url-placeholder": "輸入完整的 URL 進行解析..."
  },
  "zh-HK": {
    "url-placeholder": "輸入完整的 URL 進行解析..."
  },
  "es": {
    "url-placeholder": "Introduce una URL completa para analizar..."
  },
  "fr": {
    "url-placeholder": "Entrez une URL complète à analyser..."
  },
  "de": {
    "url-placeholder": "Geben Sie eine vollständige URL zum Analysieren ein..."
  },
  "it": {
    "url-placeholder": "Inserisci un URL completo da analizzare..."
  },
  "ja": {
    "url-placeholder": "解析する完全なURLを入力..."
  },
  "ko": {
    "url-placeholder": "파싱할 완전한 URL을 입력하세요..."
  },
  "ru": {
    "url-placeholder": "Введите полный URL для анализа..."
  },
  "pt": {
    "url-placeholder": "Digite uma URL completa para analisar..."
  },
  "ar": {
    "url-placeholder": "أدخل رابط URL كامل للتحليل..."
  },
  "hi": {
    "url-placeholder": "विश्लेषण के लिए पूरा URL दर्ज करें..."
  },
  "tr": {
    "url-placeholder": "Analiz edilecek tam URL'yi girin..."
  },
  "nl": {
    "url-placeholder": "Voer een volledige URL in om te parseren..."
  },
  "sv": {
    "url-placeholder": "Ange en komplett URL att analysera..."
  },
  "pl": {
    "url-placeholder": "Wprowadź kompletny URL do analizy..."
  },
  "vi": {
    "url-placeholder": "Nhập URL đầy đủ để phân tích..."
  },
  "th": {
    "url-placeholder": "ป้อน URL ที่สมบูรณ์เพื่อวิเคราะห์..."
  },
  "id": {
    "url-placeholder": "Masukkan URL lengkap untuk dianalisis..."
  },
  "he": {
    "url-placeholder": "הזן URL מלא לניתוח..."
  },
  "ms": {
    "url-placeholder": "Masukkan URL lengkap untuk dianalisis..."
  },
  "no": {
    "url-placeholder": "Skriv inn en fullstendig URL for analyse..."
  }
}
</i18n>
