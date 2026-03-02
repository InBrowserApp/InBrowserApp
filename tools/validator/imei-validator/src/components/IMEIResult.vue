<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <NTag :type="validationResult.isValid ? 'success' : 'error'" size="small">
          {{ validationResult.isValid ? t('valid') : t('invalid') }}
        </NTag>
      </NDescriptionsItem>

      <NDescriptionsItem :label="t('reason')">
        <NText depth="3">{{ reasonText }}</NText>
      </NDescriptionsItem>

      <NDescriptionsItem :label="t('normalized')">
        <NText code>{{ validationResult.normalized || '-' }}</NText>
      </NDescriptionsItem>

      <NDescriptionsItem :label="t('expectedCheckDigit')">
        <NText depth="3">{{ validationResult.expectedCheckDigit ?? '-' }}</NText>
      </NDescriptionsItem>

      <NDescriptionsItem :label="t('actualCheckDigit')">
        <NText depth="3">{{ validationResult.checkDigit ?? '-' }}</NText>
      </NDescriptionsItem>
    </NDescriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { IMEIValidationResult } from '../data/imei'

const props = defineProps<{
  validationResult: IMEIValidationResult
}>()

const { t } = useI18n()

const reasonText = computed(() => {
  if (props.validationResult.reason === 'valid') {
    return t('valid')
  }

  if (props.validationResult.reason === 'invalid-length') {
    return t('invalidLength')
  }

  if (props.validationResult.reason === 'invalid-format') {
    return t('invalidFormat')
  }

  if (props.validationResult.reason === 'invalid-checksum') {
    return t('invalidChecksum')
  }

  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh-CN": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh-TW": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh-HK": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "es": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "fr": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "de": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "it": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ja": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ko": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ru": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "pt": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ar": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "hi": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "tr": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "nl": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "sv": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "pl": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "vi": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "th": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "id": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "he": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ms": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "no": {
    "result": "Validation Result",
    "status": "Status",
    "reason": "Reason",
    "normalized": "Normalized IMEI",
    "expectedCheckDigit": "Expected Check Digit",
    "actualCheckDigit": "Actual Check Digit",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  }
}
</i18n>
