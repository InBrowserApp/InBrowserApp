<template>
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
  </NDescriptions>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDescriptions, NDescriptionsItem, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
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
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "zh": {
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "length": "长度",
    "lengthStatus": "长度检查",
    "characters": "字符",
    "charactersStatus": "字符检查",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H、J-N、P、R-Z、0-9"
  },
  "zh-CN": {
    "status": "状态",
    "valid": "有效",
    "invalid": "无效",
    "length": "长度",
    "lengthStatus": "长度检查",
    "characters": "字符",
    "charactersStatus": "字符检查",
    "pass": "通过",
    "fail": "失败",
    "notAvailable": "不可用",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H、J-N、P、R-Z、0-9"
  },
  "zh-TW": {
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "length": "長度",
    "lengthStatus": "長度檢查",
    "characters": "字元",
    "charactersStatus": "字元檢查",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H、J-N、P、R-Z、0-9"
  },
  "zh-HK": {
    "status": "狀態",
    "valid": "有效",
    "invalid": "無效",
    "length": "長度",
    "lengthStatus": "長度檢查",
    "characters": "字元",
    "charactersStatus": "字元檢查",
    "pass": "通過",
    "fail": "失敗",
    "notAvailable": "不可用",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H、J-N、P、R-Z、0-9"
  },
  "es": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "fr": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "de": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "it": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ja": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ko": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ru": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "pt": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ar": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "hi": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "tr": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "nl": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "sv": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "pl": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "vi": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "th": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "id": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "he": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "ms": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  },
  "no": {
    "status": "Status",
    "valid": "Valid",
    "invalid": "Invalid",
    "length": "Length",
    "lengthStatus": "Length Check",
    "characters": "Characters",
    "charactersStatus": "Character Check",
    "pass": "Pass",
    "fail": "Fail",
    "notAvailable": "Not available",
    "lengthValue": "{current} / 17",
    "charactersValue": "A-H, J-N, P, R-Z, 0-9"
  }
}
</i18n>
