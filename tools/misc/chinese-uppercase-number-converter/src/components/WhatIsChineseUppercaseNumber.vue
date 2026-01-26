<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description1') }}</NText>
    <NText tag="p">{{ t('description2') }}</NText>
    <NH3>{{ t('variantTitle') }}</NH3>
    <NText tag="p">{{ t('variantDescription') }}</NText>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText, NH3 } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "zh": {
    "title": "什么是中文大写数字？",
    "description1": "中文大写用于金额书写，可防止涂改，使用壹贰叁等大写数字与固定单位。",
    "description2": "金额通常包含元/角/分，也可表示负数与两位小数。",
    "variantTitle": "简体与繁体",
    "variantDescription": "简体使用贰/叁/陆/万/亿，繁体使用貳/參/陸/萬/億。"
  },
  "zh-CN": {
    "title": "什么是中文大写数字？",
    "description1": "中文大写用于金额书写，可防止涂改，使用壹贰叁等大写数字与固定单位。",
    "description2": "金额通常包含元/角/分，也可表示负数与两位小数。",
    "variantTitle": "简体与繁体",
    "variantDescription": "简体使用贰/叁/陆/万/亿，繁体使用貳/參/陸/萬/億。"
  },
  "zh-TW": {
    "title": "什麼是中文大寫數字？",
    "description1": "中文大寫用於金額書寫，可防止塗改，使用壹貳參等大寫數字與固定單位。",
    "description2": "金額通常包含元/角/分，也可表示負數與兩位小數。",
    "variantTitle": "簡體與繁體",
    "variantDescription": "簡體使用贰/叁/陆/万/亿，繁體使用貳/參/陸/萬/億。"
  },
  "zh-HK": {
    "title": "甚麼是中文大寫數字？",
    "description1": "中文大寫用於金額書寫，可防止塗改，使用壹貳參等大寫數字與固定單位。",
    "description2": "金額通常包含元/角/分，也可表示負數與兩位小數。",
    "variantTitle": "簡體與繁體",
    "variantDescription": "簡體使用贰/叁/陆/万/亿，繁體使用貳/參/陸/萬/億。"
  },
  "es": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "fr": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "de": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "it": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "ja": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "ko": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "ru": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "pt": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "ar": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "hi": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "tr": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "nl": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "sv": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "pl": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "vi": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "th": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "id": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "he": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "ms": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  },
  "no": {
    "title": "What are Chinese uppercase numbers?",
    "description1": "Chinese uppercase numerals are used in finance to prevent tampering. They use special capital digits like 壹贰叁 and fixed units.",
    "description2": "Amounts are typically written with 元/角/分 and can include negative values and two decimal places.",
    "variantTitle": "Simplified vs Traditional",
    "variantDescription": "Simplified uses 贰/叁/陆/万/亿, while Traditional uses 貳/參/陸/萬/億."
  }
}
</i18n>
