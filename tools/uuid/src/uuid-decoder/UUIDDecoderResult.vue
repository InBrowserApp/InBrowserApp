<template>
  <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
  <ToolSection>
    <DecodeResult :uuid="uuid" />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DecodeResult from './decode/DecodeResult.vue'
import type { UUID } from '@utils/uuid'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  uuid: UUID
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "result": "Result"
  },
  "zh": {
    "result": "结果"
  },
  "zh-CN": {
    "result": "结果"
  },
  "zh-TW": {
    "result": "结果"
  },
  "zh-HK": {
    "result": "结果"
  },
  "es": {
    "result": "Resultado"
  },
  "fr": {
    "result": "Résultat"
  },
  "de": {
    "result": "Ergebnis"
  },
  "it": {
    "result": "Risultato"
  },
  "ja": {
    "result": "結果"
  },
  "ko": {
    "result": "결과"
  },
  "ru": {
    "result": "Результат"
  },
  "pt": {
    "result": "Resultado"
  },
  "ar": {
    "result": "النتيجة"
  },
  "hi": {
    "result": "परिणाम"
  },
  "tr": {
    "result": "Sonuç"
  },
  "nl": {
    "result": "Resultaat"
  },
  "sv": {
    "result": "Resultat"
  },
  "pl": {
    "result": "Wynik"
  },
  "vi": {
    "result": "Kết quả"
  },
  "th": {
    "result": "ผลลัพธ์"
  },
  "id": {
    "result": "Hasil"
  },
  "he": {
    "result": "תוצאה"
  },
  "ms": {
    "result": "Keputusan"
  },
  "no": {
    "result": "Resultat"
  }
}
</i18n>
