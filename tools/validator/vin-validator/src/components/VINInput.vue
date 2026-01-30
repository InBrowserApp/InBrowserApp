<template>
  <NFormItem :label="t('vin')" :feedback="feedbackMessage" :validation-status="validationStatus">
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
import type { VINValidationResult } from '../data/vin'

const props = defineProps<{
  validationResult: VINValidationResult
}>()

const modelValue = defineModel<string>({ required: true })

const { t } = useI18n()

const inputStatus = computed(() => {
  if (modelValue.value.length === 0) return undefined
  return props.validationResult.isValid ? 'success' : 'error'
})

const validationStatus = computed(() => {
  if (modelValue.value.length === 0) return undefined
  return props.validationResult.isValid ? 'success' : 'error'
})

const feedbackMessage = computed(() => {
  if (modelValue.value.length === 0) return undefined
  if (props.validationResult.isValid) return t('valid')
  if (!props.validationResult.isLengthValid) return t('invalidLength')
  if (!props.validationResult.isCharacterValid) return t('invalidCharacters')
  if (!props.validationResult.isCheckDigitValid) return t('invalidChecksum')
  return t('invalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "zh": {
    "vin": "VIN（车辆识别码）",
    "placeholder": "输入 VIN",
    "valid": "VIN 有效",
    "invalid": "VIN 无效",
    "invalidLength": "VIN 必须为 17 位。",
    "invalidCharacters": "VIN 仅可包含 A-H、J-N、P、R-Z 和数字 0-9。",
    "invalidChecksum": "校验位不匹配。"
  },
  "zh-CN": {
    "vin": "VIN（车辆识别码）",
    "placeholder": "输入 VIN",
    "valid": "VIN 有效",
    "invalid": "VIN 无效",
    "invalidLength": "VIN 必须为 17 位。",
    "invalidCharacters": "VIN 仅可包含 A-H、J-N、P、R-Z 和数字 0-9。",
    "invalidChecksum": "校验位不匹配。"
  },
  "zh-TW": {
    "vin": "VIN（車輛識別碼）",
    "placeholder": "輸入 VIN",
    "valid": "VIN 有效",
    "invalid": "VIN 無效",
    "invalidLength": "VIN 必須為 17 碼。",
    "invalidCharacters": "VIN 僅可包含 A-H、J-N、P、R-Z 與數字 0-9。",
    "invalidChecksum": "檢查碼不符合。"
  },
  "zh-HK": {
    "vin": "VIN（車輛識別碼）",
    "placeholder": "輸入 VIN",
    "valid": "VIN 有效",
    "invalid": "VIN 無效",
    "invalidLength": "VIN 必須為 17 碼。",
    "invalidCharacters": "VIN 只可包含 A-H、J-N、P、R-Z 及數字 0-9。",
    "invalidChecksum": "校驗位不匹配。"
  },
  "es": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "fr": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "de": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "it": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "ja": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "ko": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "ru": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "pt": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "ar": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "hi": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "tr": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "nl": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "sv": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "pl": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "vi": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "th": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "id": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "he": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "ms": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  },
  "no": {
    "vin": "VIN (Vehicle Identification Number)",
    "placeholder": "Enter VIN",
    "valid": "Valid VIN",
    "invalid": "Invalid VIN",
    "invalidLength": "VIN must be 17 characters.",
    "invalidCharacters": "VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.",
    "invalidChecksum": "Check digit does not match."
  }
}
</i18n>
