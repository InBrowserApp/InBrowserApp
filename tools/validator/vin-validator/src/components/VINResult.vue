<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <VINResultStructureItems :validation-result="validationResult" />
    <VINResultValidationItems :validation-result="validationResult" />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { VINValidationResult } from '../data/vin'
import VINResultStructureItems from './VINResultStructureItems.vue'
import VINResultValidationItems from './VINResultValidationItems.vue'

defineProps<{
  validationResult: VINValidationResult
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
    "result": "Validation Result"
  },
  "fr": {
    "result": "Validation Result"
  },
  "de": {
    "result": "Validation Result"
  },
  "it": {
    "result": "Validation Result"
  },
  "ja": {
    "result": "Validation Result"
  },
  "ko": {
    "result": "Validation Result"
  },
  "ru": {
    "result": "Validation Result"
  },
  "pt": {
    "result": "Validation Result"
  },
  "ar": {
    "result": "Validation Result"
  },
  "hi": {
    "result": "Validation Result"
  },
  "tr": {
    "result": "Validation Result"
  },
  "nl": {
    "result": "Validation Result"
  },
  "sv": {
    "result": "Validation Result"
  },
  "pl": {
    "result": "Validation Result"
  },
  "vi": {
    "result": "Validation Result"
  },
  "th": {
    "result": "Validation Result"
  },
  "id": {
    "result": "Validation Result"
  },
  "he": {
    "result": "Validation Result"
  },
  "ms": {
    "result": "Validation Result"
  },
  "no": {
    "result": "Validation Result"
  }
}
</i18n>
