<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="8">
      <PDFUpload @upload-file="handleUpload" />
      <n-text depth="3">{{ t('uploadNote') }}</n-text>
      <n-button v-if="file" quaternary size="small" @click="clearFile">
        {{ t('clearFile') }}
      </n-button>
    </n-flex>
  </ToolSection>

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
    :validation-field-keys="validationFieldKeys"
    :change-summary="changeSummary"
    :can-generate="canGenerate"
    :is-saving="isSaving"
    :result-filename="resultFilename"
    :result-url="resultUrl"
    :error-message="errorMessage"
    @update:field-mode="setFieldMode"
    @update:field-value="setFieldValue"
    @restore-field="restoreField"
    @clear-all="clearAllFields"
    @generate="generate"
  />
</template>

<script setup lang="ts">
import { NAlert, NButton, NFlex, NSpin, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { usePdfMetadataEditor } from '../composables/usePdfMetadataEditor'
import PDFMetadataEditorSections from './PDFMetadataEditorSections.vue'

const { t } = useI18n({ useScope: 'local' })

const {
  file,
  info,
  fields,
  isLoading,
  isSaving,
  errorMessage,
  validationFieldKeys,
  changeSummary,
  canGenerate,
  resultFilename,
  resultUrl,
  handleUpload,
  clearFile,
  setFieldMode,
  setFieldValue,
  restoreField,
  clearAllFields,
  generate,
} = usePdfMetadataEditor()
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "zh": {
    "uploadTitle": "上传 PDF",
    "uploadNote": "在浏览器本地处理，不会上传文件。",
    "clearFile": "清除文件",
    "loading": "正在读取 PDF 元数据...",
    "encryptedTitle": "PDF 已加密",
    "encryptedDescription": "该文件已加密。在解锁之前，无法编辑元数据。",
    "currentTitle": "当前元数据",
    "editTitle": "编辑元数据",
    "saveTitle": "保存并下载"
  },
  "zh-CN": {
    "uploadTitle": "上传 PDF",
    "uploadNote": "在浏览器本地处理，不会上传文件。",
    "clearFile": "清除文件",
    "loading": "正在读取 PDF 元数据...",
    "encryptedTitle": "PDF 已加密",
    "encryptedDescription": "该文件已加密。在解锁之前，无法编辑元数据。",
    "currentTitle": "当前元数据",
    "editTitle": "编辑元数据",
    "saveTitle": "保存并下载"
  },
  "zh-TW": {
    "uploadTitle": "上傳 PDF",
    "uploadNote": "在瀏覽器本機處理，不會上傳檔案。",
    "clearFile": "清除檔案",
    "loading": "正在讀取 PDF 中繼資料...",
    "encryptedTitle": "PDF 已加密",
    "encryptedDescription": "此檔案已加密。在解鎖之前，無法編輯中繼資料。",
    "currentTitle": "目前中繼資料",
    "editTitle": "編輯中繼資料",
    "saveTitle": "儲存並下載"
  },
  "zh-HK": {
    "uploadTitle": "上傳 PDF",
    "uploadNote": "在瀏覽器本機處理，不會上傳檔案。",
    "clearFile": "清除檔案",
    "loading": "正在讀取 PDF 中繼資料...",
    "encryptedTitle": "PDF 已加密",
    "encryptedDescription": "此檔案已加密。在解鎖之前，無法編輯中繼資料。",
    "currentTitle": "目前中繼資料",
    "editTitle": "編輯中繼資料",
    "saveTitle": "儲存並下載"
  },
  "es": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "fr": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "de": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "it": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ja": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ko": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ru": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "pt": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ar": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "hi": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "tr": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "nl": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "sv": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "pl": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "vi": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "th": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "id": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "he": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "ms": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  },
  "no": {
    "uploadTitle": "Upload PDF",
    "uploadNote": "Runs locally in your browser. No uploads.",
    "clearFile": "Clear file",
    "loading": "Reading PDF metadata...",
    "encryptedTitle": "Encrypted PDF",
    "encryptedDescription": "This file is encrypted. Editing metadata is not available until the file is unlocked.",
    "currentTitle": "Current metadata",
    "editTitle": "Edit metadata",
    "saveTitle": "Save and download"
  }
}
</i18n>
