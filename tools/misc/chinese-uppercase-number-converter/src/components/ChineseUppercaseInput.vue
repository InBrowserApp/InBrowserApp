<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <NFormItem :show-label="false" :feedback="feedback" :validation-status="validationStatus">
      <NInput
        :value="internalValue"
        :placeholder="t('placeholder')"
        :status="inputStatus"
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
import { parseUppercaseInput } from '../data/conversion'

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

const parseResult = computed(() => parseUppercaseInput(internalValue.value))

const validationStatus = computed(() => {
  if (parseResult.value.isEmpty) return undefined
  return parseResult.value.isValid ? 'success' : 'error'
})

const inputStatus = computed(() => validationStatus.value)

const feedback = computed(() => {
  const result = parseResult.value
  if (result.isEmpty) return undefined
  if (result.isValid) return t('valid')
  if (result.error === 'invalidCharacters') return t('invalidCharacters')
  if (result.error === 'invalidFormat') return t('invalidFormat')
  if (result.error === 'outOfRange') return t('outOfRange')
  return t('invalidFormat')
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
    emit('update:value', internalValue.value.trim())
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "zh": {
    "title": "中文大写",
    "placeholder": "输入中文金额大写",
    "valid": "中文大写有效",
    "invalidCharacters": "只能输入中文大写数字与单位。",
    "invalidFormat": "中文大写格式不正确。",
    "outOfRange": "数值超出最大范围。"
  },
  "zh-CN": {
    "title": "中文大写",
    "placeholder": "输入中文金额大写",
    "valid": "中文大写有效",
    "invalidCharacters": "只能输入中文大写数字与单位。",
    "invalidFormat": "中文大写格式不正确。",
    "outOfRange": "数值超出最大范围。"
  },
  "zh-TW": {
    "title": "中文大寫",
    "placeholder": "輸入中文金額大寫",
    "valid": "中文大寫有效",
    "invalidCharacters": "只能輸入中文大寫數字與單位。",
    "invalidFormat": "中文大寫格式不正確。",
    "outOfRange": "數值超出最大範圍。"
  },
  "zh-HK": {
    "title": "中文大寫",
    "placeholder": "輸入中文金額大寫",
    "valid": "中文大寫有效",
    "invalidCharacters": "只能輸入中文大寫數字與單位。",
    "invalidFormat": "中文大寫格式不正確。",
    "outOfRange": "數值超出最大範圍。"
  },
  "es": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "fr": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "de": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "it": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ja": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ko": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ru": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "pt": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ar": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "hi": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "tr": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "nl": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "sv": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "pl": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "vi": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "th": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "id": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "he": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "ms": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  },
  "no": {
    "title": "Chinese Uppercase",
    "placeholder": "Enter Chinese uppercase amount",
    "valid": "Valid uppercase",
    "invalidCharacters": "Only Chinese uppercase digits and units are allowed.",
    "invalidFormat": "Invalid uppercase format.",
    "outOfRange": "Value exceeds the maximum range."
  }
}
</i18n>
