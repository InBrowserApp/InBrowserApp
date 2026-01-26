<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <NFormItem :show-label="false" :feedback="feedback" :validation-status="validationStatus">
      <NInput
        :value="internalValue"
        :placeholder="t('placeholder')"
        :status="inputStatus"
        inputmode="decimal"
        size="large"
        @update:value="handleUpdate"
      />
    </NFormItem>
    <CopyToClipboardButton :content="internalValue" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NFormItem, NInput } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { parseNumberInput } from '../data/conversion'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  'update:value': [value: string]
}>()

const { t } = useI18n()

const internalValue = ref(props.value)

watch(
  () => props.value,
  (newValue) => {
    if (newValue !== internalValue.value) {
      internalValue.value = newValue
    }
  },
)

const parseResult = computed(() => parseNumberInput(internalValue.value))

const validationStatus = computed(() => {
  if (parseResult.value.isEmpty) return undefined
  return parseResult.value.isValid ? 'success' : 'error'
})

const inputStatus = computed(() => validationStatus.value)

const feedback = computed(() => {
  const result = parseResult.value
  if (result.isEmpty) return undefined
  if (result.isValid) return t('valid')
  if (result.error === 'invalidFormat') return t('invalidFormat')
  if (result.error === 'tooManyDecimals') return t('tooManyDecimals')
  return t('outOfRange')
})

function handleUpdate(value: string) {
  internalValue.value = value
}

watch(parseResult, (result) => {
  if (result.isEmpty) {
    emit('update:value', '')
    return
  }

  if (result.isValid) {
    emit('update:value', result.normalized)
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "zh": {
    "title": "数字",
    "placeholder": "输入数字（如 1234.56）",
    "valid": "数字有效",
    "invalidFormat": "只能输入数字和一个小数点。",
    "tooManyDecimals": "最多保留 2 位小数。",
    "outOfRange": "数值超出最大范围。"
  },
  "zh-CN": {
    "title": "数字",
    "placeholder": "输入数字（如 1234.56）",
    "valid": "数字有效",
    "invalidFormat": "只能输入数字和一个小数点。",
    "tooManyDecimals": "最多保留 2 位小数。",
    "outOfRange": "数值超出最大范围。"
  },
  "zh-TW": {
    "title": "數字",
    "placeholder": "輸入數字（如 1234.56）",
    "valid": "數字有效",
    "invalidFormat": "只能輸入數字與一個小數點。",
    "tooManyDecimals": "最多保留 2 位小數。",
    "outOfRange": "數值超出最大範圍。"
  },
  "zh-HK": {
    "title": "數字",
    "placeholder": "輸入數字（如 1234.56）",
    "valid": "數字有效",
    "invalidFormat": "只能輸入數字與一個小數點。",
    "tooManyDecimals": "最多保留 2 位小數。",
    "outOfRange": "數值超出最大範圍。"
  },
  "es": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "fr": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "de": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "it": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ja": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ko": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ru": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "pt": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ar": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "hi": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "tr": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "nl": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "sv": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "pl": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "vi": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "th": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "id": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "he": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ms": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "no": {
    "title": "Number",
    "placeholder": "Enter number (e.g., 1234.56)",
    "valid": "Valid number",
    "invalidFormat": "Only digits and one decimal point are allowed.",
    "tooManyDecimals": "Use up to 2 decimal places.",
    "outOfRange": "Value exceeds the maximum range."
  }
}
</i18n>
