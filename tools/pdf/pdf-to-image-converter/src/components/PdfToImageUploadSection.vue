<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="8">
      <PDFUpload @upload-file="emit('upload-file', $event)" />
      <n-text depth="3">{{ t('localNote') }}</n-text>
      <n-text v-if="isLoadingDocument" depth="3">{{ t('loadingDocument') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  isLoadingDocument: boolean
}>()

const emit = defineEmits<{
  (event: 'upload-file', file: File): void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "zh": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "zh-CN": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "zh-TW": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "zh-HK": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "es": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "fr": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "de": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "it": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "ja": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "ko": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "ru": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "pt": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "ar": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "hi": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "tr": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "nl": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "sv": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "pl": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "vi": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "th": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "id": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "he": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "ms": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  },
  "no": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages..."
  }
}
</i18n>
