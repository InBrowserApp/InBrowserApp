<template>
  <ToolSection>
    <n-h3>{{ t('title') }}</n-h3>
    <n-p>{{ t('desc_1') }}</n-p>
    <n-p>{{ t('desc_2') }}</n-p>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NH3, NP } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "zh": {
    "title": "PDF 文本提取说明",
    "desc_1": "此工具会在浏览器中直接提取 PDF 内容流里已有的可选中文本。",
    "desc_2": "如果页面是扫描图片，则需要 OCR。本工具暂未内置 OCR。"
  },
  "zh-CN": {
    "title": "PDF 文本提取说明",
    "desc_1": "此工具会在浏览器中直接提取 PDF 内容流里已有的可选中文本。",
    "desc_2": "如果页面是扫描图片，则需要 OCR。本工具暂未内置 OCR。"
  },
  "zh-TW": {
    "title": "PDF 文字提取說明",
    "desc_1": "此工具會在瀏覽器中直接提取 PDF 內容流裡已有的可選取文字。",
    "desc_2": "如果頁面是掃描圖片，則需要 OCR。本工具暫未內建 OCR。"
  },
  "zh-HK": {
    "title": "PDF 文字提取說明",
    "desc_1": "此工具會在瀏覽器中直接提取 PDF 內容流裡已有的可選取文字。",
    "desc_2": "如果頁面是掃描圖片，則需要 OCR。本工具暫未內建 OCR。"
  },
  "es": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "fr": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "de": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "it": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "ja": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "ko": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "ru": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "pt": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "ar": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "hi": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "tr": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "nl": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "sv": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "pl": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "vi": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "th": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "id": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "he": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "ms": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  },
  "no": {
    "title": "How PDF Text Extraction Works",
    "desc_1": "This tool extracts existing selectable text from PDF content streams directly in your browser.",
    "desc_2": "If a page is scanned as an image, OCR is required. OCR is not built into this tool yet."
  }
}
</i18n>
