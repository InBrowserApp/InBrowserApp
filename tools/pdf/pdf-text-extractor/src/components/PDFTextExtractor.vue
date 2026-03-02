<template>
  <ToolSection>
    <PDFUpload @upload-file="handlePDFUpload" />
  </ToolSection>

  <ToolSection>
    <n-alert type="info" :show-icon="false">{{ t('ocr_notice') }}</n-alert>
  </ToolSection>

  <ToolSection v-if="isExtracting">
    <n-spin size="small">
      <n-text>{{ t('extracting') }}</n-text>
    </n-spin>
  </ToolSection>

  <ToolSection v-else-if="errorMessage">
    <n-alert type="error">{{ errorMessage }}</n-alert>
  </ToolSection>

  <ToolSection v-if="result">
    <ToolSectionHeader>
      <n-flex align="center" justify="space-between">
        <span>{{ t('result') }}</span>
        <n-flex align="center" :size="8">
          <CopyToClipboardButton v-if="hasText" :content="result.text" size="small" />
          <n-button
            v-if="hasText"
            tag="a"
            size="small"
            tertiary
            :href="downloadUrl ?? undefined"
            :download="downloadFilename"
          >
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('download_txt') }}
          </n-button>
        </n-flex>
      </n-flex>
    </ToolSectionHeader>

    <n-grid :cols="3" :x-gap="12">
      <n-gi>
        <n-statistic :label="t('pages')" :value="result.pageCount" />
      </n-gi>
      <n-gi>
        <n-statistic :label="t('empty_pages')" :value="result.emptyTextPages" />
      </n-gi>
      <n-gi>
        <n-statistic :label="t('scanned_pages')" :value="result.likelyScannedPages" />
      </n-gi>
    </n-grid>

    <n-alert v-if="result.likelyScannedPages > 0" type="warning" style="margin-top: 12px">
      {{ t('scanned_warning') }}
    </n-alert>

    <n-input
      v-if="hasText"
      readonly
      type="textarea"
      style="margin-top: 12px"
      :value="result.text"
      :autosize="{ minRows: 10, maxRows: 24 }"
    />
    <n-text v-else depth="3" style="margin-top: 12px; display: block">
      {{ t('no_text') }}
    </n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NFlex,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NSpin,
  NStatistic,
  NText,
  useMessage,
} from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { extractPdfText } from '../utils/extract-pdf-text'
import type { PdfTextExtractionResult } from '../utils/extract-pdf-text'

const { t } = useI18n()
const message = useMessage()

const isExtracting = ref(false)
const errorMessage = ref('')
const uploadedFilename = ref('')
const result = ref<PdfTextExtractionResult | null>(null)

const hasText = computed(() => Boolean(result.value?.text.trim()))
const textBlob = computed(() => {
  if (!hasText.value || !result.value) return null
  return new Blob([result.value.text], { type: 'text/plain;charset=utf-8' })
})
const downloadUrl = useObjectUrl(textBlob)
const downloadFilename = computed(() => {
  const baseName = uploadedFilename.value.replace(/\.pdf$/i, '').trim()
  return `${baseName || 'extracted-text'}.txt`
})

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.name === 'PasswordException') {
    return t('password_error')
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return 'Failed to extract text from PDF.'
}

const handlePDFUpload = async (file: File) => {
  isExtracting.value = true
  errorMessage.value = ''
  result.value = null
  uploadedFilename.value = file.name

  try {
    result.value = await extractPdfText(file)

    if (result.value.text.trim()) {
      message.success('Text extraction completed.')
    } else {
      message.warning('Extraction completed, but no text was found.')
    }
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
    message.error(errorMessage.value)
  } finally {
    isExtracting.value = false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "zh": {
    "ocr_notice": "此工具仅提取可选中文本。扫描版 PDF 或纯图片页面需要 OCR。",
    "extracting": "正在提取文本...",
    "result": "提取结果",
    "download_txt": "下载 TXT",
    "pages": "总页数",
    "empty_pages": "空文本页",
    "scanned_pages": "疑似扫描页",
    "scanned_warning": "部分页面看起来是扫描/图片页面，可能需要 OCR 才能提取文本。",
    "no_text": "未找到可提取文本。",
    "password_error": "此提取器暂不支持受密码保护的 PDF。"
  },
  "zh-CN": {
    "ocr_notice": "此工具仅提取可选中文本。扫描版 PDF 或纯图片页面需要 OCR。",
    "extracting": "正在提取文本...",
    "result": "提取结果",
    "download_txt": "下载 TXT",
    "pages": "总页数",
    "empty_pages": "空文本页",
    "scanned_pages": "疑似扫描页",
    "scanned_warning": "部分页面看起来是扫描/图片页面，可能需要 OCR 才能提取文本。",
    "no_text": "未找到可提取文本。",
    "password_error": "此提取器暂不支持受密码保护的 PDF。"
  },
  "zh-TW": {
    "ocr_notice": "此工具僅提取可選取文字。掃描版 PDF 或純圖片頁面需要 OCR。",
    "extracting": "正在提取文字...",
    "result": "提取結果",
    "download_txt": "下載 TXT",
    "pages": "總頁數",
    "empty_pages": "空文字頁",
    "scanned_pages": "疑似掃描頁",
    "scanned_warning": "部分頁面看起來是掃描/圖片頁面，可能需要 OCR 才能提取文字。",
    "no_text": "未找到可提取文字。",
    "password_error": "此提取器暫不支援受密碼保護的 PDF。"
  },
  "zh-HK": {
    "ocr_notice": "此工具僅提取可選取文字。掃描版 PDF 或純圖片頁面需要 OCR。",
    "extracting": "正在提取文字...",
    "result": "提取結果",
    "download_txt": "下載 TXT",
    "pages": "總頁數",
    "empty_pages": "空文字頁",
    "scanned_pages": "疑似掃描頁",
    "scanned_warning": "部分頁面看起來是掃描/圖片頁面，可能需要 OCR 才能提取文字。",
    "no_text": "未找到可提取文字。",
    "password_error": "此提取器暫不支援受密碼保護的 PDF。"
  },
  "es": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "fr": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "de": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "it": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "ja": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "ko": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "ru": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "pt": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "ar": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "hi": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "tr": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "nl": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "sv": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "pl": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "vi": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "th": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "id": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "he": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "ms": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  },
  "no": {
    "ocr_notice": "This tool extracts selectable text only. Scanned PDFs or image-only pages require OCR.",
    "extracting": "Extracting text...",
    "result": "Extracted Text",
    "download_txt": "Download TXT",
    "pages": "Pages",
    "empty_pages": "Empty text pages",
    "scanned_pages": "Likely scanned pages",
    "scanned_warning": "Some pages look like scanned/image pages and may need OCR to get text.",
    "no_text": "No extractable text was found.",
    "password_error": "Password-protected PDF is not supported in this extractor."
  }
}
</i18n>
