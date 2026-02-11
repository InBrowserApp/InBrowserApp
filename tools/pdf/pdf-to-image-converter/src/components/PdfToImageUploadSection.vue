<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <PDFUpload v-if="!uploadedFileName" @upload-file="emit('upload-file', $event)" />
      <n-upload
        v-else
        accept="application/pdf"
        :show-file-list="false"
        @before-upload="beforeUploadNewFile"
      >
        <n-button secondary>{{ t('uploadNewOne') }}</n-button>
      </n-upload>

      <n-text depth="3">{{ t('localNote') }}</n-text>
      <n-text v-if="isLoadingDocument" depth="3">{{ t('loadingDocument') }}</n-text>

      <n-descriptions
        v-if="uploadedFileName"
        bordered
        size="small"
        :column="1"
        label-placement="top"
      >
        <n-descriptions-item :label="t('fileName')">
          <n-text style="word-break: break-all">{{ uploadedFileName }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('fileSize')">
          <n-text>{{ formattedUploadedFileSize }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item v-if="numPages > 0" :label="t('pageCount')">
          <n-text>{{ numPages }}</n-text>
        </n-descriptions-item>
      </n-descriptions>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize } from 'filesize'
import {
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NFlex,
  NText,
  NUpload,
  type UploadFileInfo,
  useMessage,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  isLoadingDocument: boolean
  uploadedFileName: string
  uploadedFileSize: number
  numPages: number
}>()

const emit = defineEmits<{
  (event: 'upload-file', file: File): void
}>()

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()

const formattedUploadedFileSize = computed(() => filesize(props.uploadedFileSize) as string)

function beforeUploadNewFile(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.file.file?.type !== 'application/pdf') {
    message.error(t('errorOnlyPdf'))
    return false
  }

  emit('upload-file', data.file.file)
  return false
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "zh": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "zh-CN": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "zh-TW": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "zh-HK": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "es": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "fr": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "de": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "it": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "ja": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "ko": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "ru": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "pt": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "ar": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "hi": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "tr": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "nl": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "sv": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "pl": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "vi": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "th": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "id": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "he": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "ms": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "no": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  }
}
</i18n>
