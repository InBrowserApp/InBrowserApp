<template>
  <NFormItem :label="t('imei')" :feedback="feedbackMessage" :validation-status="validationStatus">
    <NInput
      :value="modelValue"
      :placeholder="t('placeholder')"
      :status="inputStatus"
      size="large"
      @update:value="modelValue = $event"
    >
      <template #prefix>
        <NIcon :component="TextNumberFormatIcon" :size="24" />
      </template>
    </NInput>
  </NFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NInput, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import TextNumberFormatIcon from '@vicons/fluent/TextNumberFormat20Regular'
import type { IMEIValidationResult } from '../data/imei'

const props = defineProps<{
  validationResult: IMEIValidationResult
}>()

const modelValue = defineModel<string>({ required: true })

const { t } = useI18n()

const hasInput = computed(() => modelValue.value.length > 0)

const inputStatus = computed(() => {
  if (!hasInput.value) {
    return undefined
  }

  return props.validationResult.isValid ? 'success' : 'error'
})

const validationStatus = computed(() => {
  if (!hasInput.value) {
    return undefined
  }

  return props.validationResult.isValid ? 'success' : 'error'
})

const feedbackMessage = computed(() => {
  if (!hasInput.value) {
    return undefined
  }

  if (props.validationResult.isValid) {
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
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh-CN": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh-TW": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "zh-HK": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "es": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "fr": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "de": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "it": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ja": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ko": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ru": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "pt": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ar": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "hi": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "tr": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "nl": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "sv": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "pl": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "vi": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "th": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "id": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "he": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "ms": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  },
  "no": {
    "imei": "IMEI",
    "placeholder": "Enter a 15-digit IMEI",
    "valid": "Valid IMEI",
    "invalid": "Invalid IMEI",
    "invalidLength": "IMEI must be exactly 15 digits",
    "invalidFormat": "IMEI must contain digits only",
    "invalidChecksum": "Invalid checksum digit"
  }
}
</i18n>
