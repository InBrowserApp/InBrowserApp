<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>
    <NDescriptions :column="1" bordered label-placement="left">
      <NDescriptionsItem :label="t('status')">
        <NTag :type="validationResult.isValid ? 'success' : 'error'" size="small">
          {{ validationResult.isValid ? t('valid') : t('invalid') }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('length')">
        <NText depth="3">{{ lengthDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('lengthStatus')">
        <NTag :type="lengthStatus.type" size="small">{{ lengthStatus.label }}</NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('characters')">
        <NText depth="3">{{ charactersDisplay }}</NText>
      </NDescriptionsItem>
      <NDescriptionsItem :label="t('charactersStatus')">
        <NTag :type="charactersStatus.type" size="small">{{ charactersStatus.label }}</NTag>
      </NDescriptionsItem>
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
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { VINValidationResult } from '../data/vin'

const { t } = useI18n()

type TagType = 'success' | 'error' | 'default' | 'warning' | 'primary' | 'info'

type TagStatus = {
  label: string
  type: TagType
}

const props = defineProps<{
  validationResult: VINValidationResult
}>()

const hasInput = computed(() => props.validationResult.normalized.length > 0)

const lengthDisplay = computed(() => {
  if (!hasInput.value) return t('notAvailable')
  return t('lengthValue', { current: props.validationResult.normalized.length })
})

const lengthStatus = computed<TagStatus>(() => {
  if (!hasInput.value) return { label: t('notAvailable'), type: 'default' }
  return props.validationResult.isLengthValid
    ? { label: t('pass'), type: 'success' }
    : { label: t('fail'), type: 'error' }
})

const charactersDisplay = computed(() =>
  hasInput.value ? t('charactersValue') : t('notAvailable'),
)

const charactersStatus = computed<TagStatus>(() => {
  if (!hasInput.value) return { label: t('notAvailable'), type: 'default' }
  return props.validationResult.isCharacterValid
    ? { label: t('pass'), type: 'success' }
    : { label: t('fail'), type: 'error' }
})

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

<i18n lang="json">
{
  "en": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "zh": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "length": "长度",
    "lengthStatus": "长度检查",
    "characters": "字符",
    "charactersStatus": "字符检查",
    "checkDigit": "校验位",
    "expectedCheckDigit": "期望",
    "actualCheckDigit": "实际",
    "normalized": "标准化 VIN",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H、J-N、P、R-Z、0-9"
  },
  "zh-CN": {
    "result": "验证结果",
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "length": "长度",
    "lengthStatus": "长度检查",
    "characters": "字符",
    "charactersStatus": "字符检查",
    "checkDigit": "校验位",
    "expectedCheckDigit": "期望",
    "actualCheckDigit": "实际",
    "normalized": "标准化 VIN",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H、J-N、P、R-Z、0-9"
  },
  "zh-TW": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "length": "長度",
    "lengthStatus": "長度檢查",
    "characters": "字元",
    "charactersStatus": "字元檢查",
    "checkDigit": "檢查碼",
    "expectedCheckDigit": "預期",
    "actualCheckDigit": "實際",
    "normalized": "標準化 VIN",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H、J-N、P、R-Z、0-9"
  },
  "zh-HK": {
    "result": "驗證結果",
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "length": "長度",
    "lengthStatus": "長度檢查",
    "characters": "字元",
    "charactersStatus": "字元檢查",
    "checkDigit": "校驗位",
    "expectedCheckDigit": "期望",
    "actualCheckDigit": "實際",
    "normalized": "標準化 VIN",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H、J-N、P、R-Z、0-9"
  },
  "es": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "fr": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "de": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "it": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ja": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ko": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ru": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "pt": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ar": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "hi": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "tr": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "nl": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "sv": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "pl": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "vi": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "th": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "id": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "he": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ms": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "no": {
    "result": "Validation Result",
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "checkDigit": "Check digit",
    "expectedCheckDigit": "Expected",
    "actualCheckDigit": "Actual",
    "normalized": "Normalized VIN",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  }
}
</i18n>
