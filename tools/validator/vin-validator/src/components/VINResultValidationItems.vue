<template>
  <NDescriptions :column="1" bordered label-placement="left">
    <NDescriptionsItem :label="t('checkDigit')">
      <NTag :type="checkDigitStatus.type" size="small">{{ checkDigitStatus.label }}</NTag>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('expectedCheckDigit')">
      <NText depth="3">{{ expectedDisplay }}</NText>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('actualCheckDigit')">
      <NText depth="3">{{ actualDisplay }}</NText>
    </NDescriptionsItem>
    <NDescriptionsItem :label="t('normalized')">
      <NFlex align="center" :size="8">
        <NText code>{{ normalizedDisplay }}</NText>
        <CopyToClipboardButton
          v-if="validationResult.normalized"
          :content="validationResult.normalized"
          size="small"
        />
      </NFlex>
    </NDescriptionsItem>
  </NDescriptions>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { VINValidationResult } from '../data/vin'

const props = defineProps<{
  validationResult: VINValidationResult
}>()

const { t } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

type TagStatus = {
  label: string
  type: TagType
}

const checkDigitStatus = computed<TagStatus>(() => {
  if (!props.validationResult.expectedCheckDigit) {
    return { label: t('notAvailable'), type: 'default' }
  }
  return props.validationResult.isCheckDigitValid
    ? { label: t('pass'), type: 'success' }
    : { label: t('fail'), type: 'error' }
})

const expectedDisplay = computed(
  () => props.validationResult.expectedCheckDigit ?? t('notAvailable'),
)
const actualDisplay = computed(() => props.validationResult.actualCheckDigit ?? t('notAvailable'))
const normalizedDisplay = computed(() => props.validationResult.normalized || t('notAvailable'))
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "zh": {
    "checkDigit": "校验位",
    "expectedCheckDigit": "期望",
    "actualCheckDigit": "实际",
    "normalized": "标准化 VIN",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "checkDigit": "校验位",
    "expectedCheckDigit": "期望",
    "actualCheckDigit": "实际",
    "normalized": "标准化 VIN",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "checkDigit": "檢查碼",
    "expectedCheckDigit": "預期",
    "actualCheckDigit": "實際",
    "normalized": "標準化 VIN",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "checkDigit": "校驗位",
    "expectedCheckDigit": "期望",
    "actualCheckDigit": "實際",
    "normalized": "標準化 VIN",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用"
  },
  "es": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "fr": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "de": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "it": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "ja": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "ko": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "ru": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "pt": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "ar": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "hi": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "tr": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "nl": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "sv": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "pl": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "vi": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "th": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "id": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "he": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "ms": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  },
  "no": {
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available"
  }
}
</i18n>
