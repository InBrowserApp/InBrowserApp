<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description') }}</NText>

    <NH3>{{ t('checksTitle') }}</NH3>
    <NOl>
      <NLi>{{ t('check1') }}</NLi>
      <NLi>{{ t('check2') }}</NLi>
      <NLi>{{ t('check3') }}</NLi>
    </NOl>

    <NText tag="p">{{ t('note') }}</NText>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText, NH3, NOl, NLi } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "zh": {
    "title": "什么是 IMEI？",
    "description": "IMEI（国际移动设备识别码）是分配给移动设备的 15 位标识符。",
    "checksTitle": "该验证器会检查",
    "check1": "长度：IMEI 必须正好为 15 位",
    "check2": "格式：移除空格和连字符后，只允许数字",
    "check3": "校验位：最后一位必须满足 Luhn 算法",
    "note": "该工具仅校验格式和校验位，不会验证黑名单状态、入网激活或设备归属。"
  },
  "zh-CN": {
    "title": "什么是 IMEI？",
    "description": "IMEI（国际移动设备识别码）是分配给移动设备的 15 位标识符。",
    "checksTitle": "该验证器会检查",
    "check1": "长度：IMEI 必须正好为 15 位",
    "check2": "格式：移除空格和连字符后，只允许数字",
    "check3": "校验位：最后一位必须满足 Luhn 算法",
    "note": "该工具仅校验格式和校验位，不会验证黑名单状态、入网激活或设备归属。"
  },
  "zh-TW": {
    "title": "什麼是 IMEI？",
    "description": "IMEI（國際行動設備識別碼）是分配給行動裝置的 15 位識別碼。",
    "checksTitle": "此驗證器會檢查",
    "check1": "長度：IMEI 必須剛好為 15 位",
    "check2": "格式：移除空白與連字號後，只允許數字",
    "check3": "校驗位：最後一位必須符合 Luhn 演算法",
    "note": "此工具僅驗證格式與校驗位，不會驗證黑名單狀態、啟用狀態或裝置歸屬。"
  },
  "zh-HK": {
    "title": "什麼是 IMEI？",
    "description": "IMEI（國際流動設備識別碼）是分配給流動裝置的 15 位識別碼。",
    "checksTitle": "此驗證器會檢查",
    "check1": "長度：IMEI 必須剛好為 15 位",
    "check2": "格式：移除空格和連字號後，只允許數字",
    "check3": "校驗位：最後一位必須符合 Luhn 演算法",
    "note": "此工具只會驗證格式與校驗位，不會驗證黑名單狀態、啟用狀態或裝置歸屬。"
  },
  "es": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "fr": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "de": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "it": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "ja": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "ko": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "ru": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "pt": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "ar": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "hi": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "tr": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "nl": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "sv": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "pl": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "vi": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "th": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "id": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "he": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "ms": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  },
  "no": {
    "title": "What is IMEI?",
    "description": "IMEI (International Mobile Equipment Identity) is a 15-digit identifier assigned to mobile devices.",
    "checksTitle": "What this validator checks",
    "check1": "Length: IMEI must be exactly 15 digits",
    "check2": "Format: only digits are allowed after removing spaces and hyphens",
    "check3": "Checksum: the last digit must satisfy the Luhn algorithm",
    "note": "This tool validates format and checksum only. It does not verify blacklist status, activation, or ownership."
  }
}
</i18n>
