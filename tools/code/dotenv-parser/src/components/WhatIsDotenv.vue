<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DescriptionMarkdown } from '@shared/ui/base'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "zh": {
    "title": "什么是 dotenv 解析器？",
    "description": "dotenv 解析器会读取 `.env` 文件，把每一条赋值语句转换成结构化结果，方便你检查键、值、重复项和损坏的行。它适合用于排查本地配置、检查 CI 变量，或在不上传敏感信息的前提下把 dotenv 转成 JSON。"
  },
  "zh-CN": {
    "title": "什么是 dotenv 解析器？",
    "description": "dotenv 解析器会读取 `.env` 文件，把每一条赋值语句转换成结构化结果，方便你检查键、值、重复项和损坏的行。它适合用于排查本地配置、检查 CI 变量，或在不上传敏感信息的前提下把 dotenv 转成 JSON。"
  },
  "zh-TW": {
    "title": "什麼是 dotenv 解析器？",
    "description": "dotenv 解析器會讀取 `.env` 檔案，把每一條指定語句轉成結構化結果，方便你檢查鍵、值、重複項與損壞的行。它適合用來排查本地設定、檢查 CI 變數，或在不上傳敏感資訊的前提下把 dotenv 轉成 JSON。"
  },
  "zh-HK": {
    "title": "什麼是 dotenv 解析器？",
    "description": "dotenv 解析器會讀取 `.env` 檔案，把每一條指定語句轉成結構化結果，方便你檢查鍵、值、重複項與損壞的行。它適合用來排查本地設定、檢查 CI 變數，或在不上傳敏感資訊的前提下把 dotenv 轉成 JSON。"
  },
  "es": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "fr": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "de": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "it": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "ja": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "ko": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "ru": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "pt": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "ar": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "hi": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "tr": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "nl": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "sv": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "pl": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "vi": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "th": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "id": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "he": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "ms": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  },
  "no": {
    "title": "What is a dotenv parser?",
    "description": "A dotenv parser reads `.env` files and turns each assignment into structured data so you can inspect keys, values, duplicates, and broken lines. It is useful when debugging local configuration, reviewing CI variables, or converting dotenv files to JSON without uploading secrets."
  }
}
</i18n>
