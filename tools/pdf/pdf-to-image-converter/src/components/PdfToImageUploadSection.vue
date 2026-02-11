<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <PDFUpload @upload-file="emit('upload-file', $event)" />
      <n-text depth="3">{{ t('localNote') }}</n-text>
      <n-text v-if="isLoadingDocument" depth="3">{{ t('loadingDocument') }}</n-text>

      <n-descriptions
        v-if="uploadedFileName"
        bordered
        size="small"
        :column="1"
        label-placement="left"
      >
        <n-descriptions-item :label="t('fileName')">
          <n-text style="word-break: break-all">{{ uploadedFileName }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('fileSize')">
          <n-text>{{ formattedUploadedFileSize }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('fileType')">
          <n-text>{{ uploadedFileType || t('fileInfoUnavailable') }}</n-text>
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
import { NDescriptions, NDescriptionsItem, NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  isLoadingDocument: boolean
  uploadedFileName: string
  uploadedFileSize: number
  uploadedFileType: string
  numPages: number
}>()

const emit = defineEmits<{
  (event: 'upload-file', file: File): void
}>()

const { t } = useI18n({ useScope: 'local' })

const formattedUploadedFileSize = computed(() => filesize(props.uploadedFileSize) as string)
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "zh": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "zh-CN": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "zh-TW": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "zh-HK": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "es": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "fr": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "de": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "it": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "ja": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "ko": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "ru": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "pt": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "ar": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "hi": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "tr": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "nl": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "sv": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "pl": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "vi": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "th": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "id": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "he": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "ms": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  },
  "no": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "pageCount": "Page count",
    "fileInfoUnavailable": "Not available"
  }
}
</i18n>
