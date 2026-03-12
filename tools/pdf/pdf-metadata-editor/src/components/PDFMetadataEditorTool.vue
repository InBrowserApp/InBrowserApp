<template>
  <PDFMetadataUploadSection
    :title="t('uploadTitle')"
    :info="info"
    :is-loading="isLoading"
    @upload-file="handleUpload"
    @clear-file="clearFile"
  />

  <ToolSection v-if="isLoading">
    <n-flex align="center" :size="8">
      <n-spin size="small" />
      <n-text>{{ t('loading') }}</n-text>
    </n-flex>
  </ToolSection>

  <ToolSection v-if="info?.document.encrypted">
    <n-alert type="warning" :title="t('encryptedTitle')">
      {{ t('encryptedDescription') }}
    </n-alert>
  </ToolSection>

  <PDFMetadataEditorSections
    v-if="info"
    :current-title="t('currentTitle')"
    :edit-title="t('editTitle')"
    :save-title="t('saveTitle')"
    :info="info"
    :can-edit="!info.document.encrypted"
    :fields="fields"
    :change-summary="changeSummary"
    :can-generate="canGenerate"
    :is-saving="isSaving"
    :result-filename="resultFilename"
    :result-url="resultUrl"
    :error-message="errorMessage"
    @update:text-field="setTextFieldValue"
    @update:date-field="setDateFieldValue"
    @restore-field="restoreField"
    @clear-all="clearAllFields"
    @generate="generate"
  />
</template>

<script setup lang="ts">
import { NAlert, NFlex, NSpin, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import { usePdfMetadataEditor } from '../composables/usePdfMetadataEditor'
import PDFMetadataEditorSections from './PDFMetadataEditorSections.vue'
import PDFMetadataUploadSection from './PDFMetadataUploadSection.vue'

const { t } = useI18n({ useScope: 'local' })

const {
  info,
  fields,
  isLoading,
  isSaving,
  errorMessage,
  changeSummary,
  canGenerate,
  resultFilename,
  resultUrl,
  handleUpload,
  clearFile,
  setTextFieldValue,
  setDateFieldValue,
  restoreField,
  clearAllFields,
  generate,
} = usePdfMetadataEditor()
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "zh": {
    "uploadTitle": "上传 PDF",
    "loading": "正在读取 PDF 元数据...",
    "encryptedTitle": "PDF 已加密",
    "encryptedDescription": "该文件已加密。在解锁之前，无法编辑元数据。",
    "currentTitle": "当前元数据",
    "editTitle": "编辑元数据",
    "saveTitle": "保存并下载"
  },
  "zh-CN": {
    "uploadTitle": "上传 PDF",
    "loading": "正在读取 PDF 元数据...",
    "encryptedTitle": "PDF 已加密",
    "encryptedDescription": "该文件已加密。在解锁之前，无法编辑元数据。",
    "currentTitle": "当前元数据",
    "editTitle": "编辑元数据",
    "saveTitle": "保存并下载"
  },
  "zh-TW": {
    "uploadTitle": "上傳 PDF",
    "loading": "正在讀取 PDF 中繼資料...",
    "encryptedTitle": "PDF 已加密",
    "encryptedDescription": "此檔案已加密。在解鎖之前，無法編輯中繼資料。",
    "currentTitle": "目前中繼資料",
    "editTitle": "編輯中繼資料",
    "saveTitle": "儲存並下載"
  },
  "zh-HK": {
    "uploadTitle": "上傳 PDF",
    "loading": "正在讀取 PDF 中繼資料...",
    "encryptedTitle": "PDF 已加密",
    "encryptedDescription": "此檔案已加密。在解鎖之前，無法編輯中繼資料。",
    "currentTitle": "目前中繼資料",
    "editTitle": "編輯中繼資料",
    "saveTitle": "儲存並下載"
  },
  "es": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "fr": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "de": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "it": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ja": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ko": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ru": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "pt": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ar": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "hi": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "tr": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "nl": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "sv": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "pl": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "vi": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "th": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "id": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "he": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ms": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "no": {
    "uploadTitle": "Upload PDF",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  }
}
</i18n>
