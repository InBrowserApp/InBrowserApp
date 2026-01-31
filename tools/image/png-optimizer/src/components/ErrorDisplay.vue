<template>
  <ToolSection v-if="error">
    <n-alert type="error" :title="t('error')">
      {{ error }}
    </n-alert>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import { NAlert } from 'naive-ui'

// Props
defineProps<{
  error: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "error": "Error"
  },
  "zh": {
    "error": "错误"
  },
  "zh-CN": {
    "error": "错误"
  },
  "zh-TW": {
    "error": "錯誤"
  },
  "zh-HK": {
    "error": "錯誤"
  },
  "es": {
    "error": "Error"
  },
  "fr": {
    "error": "Erreur"
  },
  "de": {
    "error": "Fehler"
  },
  "it": {
    "error": "Errore"
  },
  "ja": {
    "error": "エラー"
  },
  "ko": {
    "error": "오류"
  },
  "ru": {
    "error": "Ошибка"
  },
  "pt": {
    "error": "Erro"
  },
  "ar": {
    "error": "خطأ"
  },
  "hi": {
    "error": "त्रुटि"
  },
  "tr": {
    "error": "Hata"
  },
  "nl": {
    "error": "Fout"
  },
  "sv": {
    "error": "Fel"
  },
  "pl": {
    "error": "Błąd"
  },
  "vi": {
    "error": "Lỗi"
  },
  "th": {
    "error": "ข้อผิดพลาด"
  },
  "id": {
    "error": "Error"
  },
  "he": {
    "error": "שגיאה"
  },
  "ms": {
    "error": "Ralat"
  },
  "no": {
    "error": "Feil"
  }
}
</i18n>
