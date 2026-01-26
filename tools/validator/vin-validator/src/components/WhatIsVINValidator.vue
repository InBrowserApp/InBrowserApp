<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <NText tag="p">{{ t('description') }}</NText>

    <NH3>{{ t('structureTitle') }}</NH3>
    <NOl>
      <NLi>{{ t('structureItem1') }}</NLi>
      <NLi>{{ t('structureItem2') }}</NLi>
      <NLi>{{ t('structureItem3') }}</NLi>
    </NOl>

    <NH3>{{ t('checkDigitTitle') }}</NH3>
    <NText tag="p">{{ t('checkDigitDescription') }}</NText>
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
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "zh": {
    "title": "什么是 VIN？",
    "description": "VIN（车辆识别码）是用于唯一识别车辆的 17 位字符编码。",
    "structureTitle": "包含内容",
    "structureItem1": "由字母和数字组成的 17 位字符（不使用 I、O、Q）。",
    "structureItem2": "第 9 位是校验位。",
    "structureItem3": "不同区段对应制造商、车型属性与序列号。",
    "checkDigitTitle": "校验位",
    "checkDigitDescription": "校验位由其余 16 位按权重计算得出，结果为 10 时用 X 表示。",
    "note": "本工具仅验证格式和校验位规则，不验证车辆是否真实存在。"
  },
  "zh-CN": {
    "title": "什么是 VIN？",
    "description": "VIN（车辆识别码）是用于唯一识别车辆的 17 位字符编码。",
    "structureTitle": "包含内容",
    "structureItem1": "由字母和数字组成的 17 位字符（不使用 I、O、Q）。",
    "structureItem2": "第 9 位是校验位。",
    "structureItem3": "不同区段对应制造商、车型属性与序列号。",
    "checkDigitTitle": "校验位",
    "checkDigitDescription": "校验位由其余 16 位按权重计算得出，结果为 10 时用 X 表示。",
    "note": "本工具仅验证格式和校验位规则，不验证车辆是否真实存在。"
  },
  "zh-TW": {
    "title": "什麼是 VIN？",
    "description": "VIN（車輛識別碼）是用來唯一識別車輛的 17 碼字元。",
    "structureTitle": "包含內容",
    "structureItem1": "由字母與數字組成的 17 碼（不使用 I、O、Q）。",
    "structureItem2": "第 9 碼為檢查碼。",
    "structureItem3": "各區段對應製造商、車輛屬性與序號。",
    "checkDigitTitle": "檢查碼",
    "checkDigitDescription": "檢查碼由其餘 16 碼依權重計算，結果為 10 時以 X 表示。",
    "note": "本工具僅驗證格式與檢查碼規則，不驗證車輛是否真實存在。"
  },
  "zh-HK": {
    "title": "甚麼是 VIN？",
    "description": "VIN（車輛識別碼）是用來唯一識別車輛的 17 碼字元。",
    "structureTitle": "包含內容",
    "structureItem1": "由字母及數字組成的 17 碼（不使用 I、O、Q）。",
    "structureItem2": "第 9 碼為校驗位。",
    "structureItem3": "不同區段對應製造商、車輛屬性與序號。",
    "checkDigitTitle": "校驗位",
    "checkDigitDescription": "校驗位由其餘 16 碼依權重計算，結果為 10 時以 X 表示。",
    "note": "本工具只驗證格式及校驗位規則，不驗證車輛是否真實存在。"
  },
  "es": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "fr": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "de": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "it": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "ja": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "ko": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "ru": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "pt": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "ar": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "hi": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "tr": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "nl": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "sv": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "pl": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "vi": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "th": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "id": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "he": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "ms": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  },
  "no": {
    "title": "What is a VIN?",
    "description": "A Vehicle Identification Number (VIN) is a 17-character code that uniquely identifies a vehicle.",
    "structureTitle": "What it includes",
    "structureItem1": "17 characters made of letters and digits (I, O, Q are not used).",
    "structureItem2": "The 9th character is a check digit.",
    "structureItem3": "Sections identify the manufacturer, vehicle attributes, and serial number.",
    "checkDigitTitle": "Check digit",
    "checkDigitDescription": "The check digit is computed from the other 16 characters using weighted values; 10 is represented by X.",
    "note": "This tool validates format and check digit rules only. It does not verify real-world registration."
  }
}
</i18n>
