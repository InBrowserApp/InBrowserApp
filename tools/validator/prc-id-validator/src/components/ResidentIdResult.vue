<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <ResidentIdRegionItems :validation-result="validationResult" />
      <ResidentIdIdentityItems :validation-result="validationResult" />
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ResidentIdValidationResult } from '../data/residentId'
import ResidentIdIdentityItems from './ResidentIdIdentityItems.vue'
import ResidentIdRegionItems from './ResidentIdRegionItems.vue'

defineProps<{
  validationResult: ResidentIdValidationResult
}>()

const { t } = useI18n()
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
    "result": "Resultado de validación"
  },
  "fr": {
    "result": "Résultat de validation"
  },
  "de": {
    "result": "Validierungsergebnis"
  },
  "it": {
    "result": "Risultato di validazione"
  },
  "ja": {
    "result": "検証結果"
  },
  "ko": {
    "result": "검증 결과"
  },
  "ru": {
    "result": "Результат проверки"
  },
  "pt": {
    "result": "Resultado da validação"
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
    "result": "Wynik walidacji"
  },
  "vi": {
    "result": "Kết quả xác thực"
  },
  "th": {
    "result": "ผลการตรวจสอบ"
  },
  "id": {
    "result": "Hasil validasi"
  },
  "he": {
    "result": "תוצאת אימות"
  },
  "ms": {
    "result": "Hasil pengesahan"
  },
  "no": {
    "result": "Valideringsresultat"
  }
}
</i18n>
