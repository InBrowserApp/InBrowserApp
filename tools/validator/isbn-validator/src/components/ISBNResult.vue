<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <ISBNResultSummary :validation-result="validationResult" />
      <ISBNResultIdentifiers :validation-result="validationResult" />
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ISBNValidationResult } from '../data/isbn'
import ISBNResultIdentifiers from './ISBNResultIdentifiers.vue'
import ISBNResultSummary from './ISBNResultSummary.vue'

const { t } = useI18n()

defineProps<{
  validationResult: ISBNValidationResult
}>()
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result"
  },
  "zh": {
    "result": "验证结果"
  },
  "zh-CN": {
    "result": "验证结果"
  },
  "zh-TW": {
    "result": "驗證結果"
  },
  "zh-HK": {
    "result": "驗證結果"
  },
  "es": {
    "result": "Resultado de Validación"
  },
  "fr": {
    "result": "Résultat de Validation"
  },
  "de": {
    "result": "Validierungsergebnis"
  },
  "it": {
    "result": "Risultato Validazione"
  },
  "ja": {
    "result": "検証結果"
  },
  "ko": {
    "result": "검증 결과"
  },
  "ru": {
    "result": "Результат Проверки"
  },
  "pt": {
    "result": "Resultado da Validação"
  },
  "ar": {
    "result": "نتيجة التحقق"
  },
  "hi": {
    "result": "सत्यापन परिणाम"
  },
  "tr": {
    "result": "Doğrulama Sonucu"
  },
  "nl": {
    "result": "Validatieresultaat"
  },
  "sv": {
    "result": "Valideringsresultat"
  },
  "pl": {
    "result": "Wynik Walidacji"
  },
  "vi": {
    "result": "Kết Quả Xác Thực"
  },
  "th": {
    "result": "ผลการตรวจสอบ"
  },
  "id": {
    "result": "Hasil Validasi"
  },
  "he": {
    "result": "תוצאת אימות"
  },
  "ms": {
    "result": "Keputusan Pengesahan"
  },
  "no": {
    "result": "Valideringsresultat"
  }
}
</i18n>
