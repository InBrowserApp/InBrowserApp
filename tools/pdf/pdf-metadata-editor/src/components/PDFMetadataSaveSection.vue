<template>
  <ToolSectionHeader>{{ title }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-alert v-if="errorMessage" type="error" :title="t('errorTitle')">
        {{ errorMessage }}
      </n-alert>

      <n-alert type="info">
        {{ t('signatureNote') }}
      </n-alert>

      <div v-if="changeSummary.length" class="change-summary">
        <n-text strong>{{ t('modifiedFields') }}</n-text>
        <ul>
          <li v-for="change in changeSummary" :key="change.key">
            {{ fieldLabels[change.key] }}:
            {{ change.action === 'clear' ? t('willClear') : t('willUpdate') }}
          </li>
        </ul>
      </div>

      <n-text v-else depth="3">{{ t('noChanges') }}</n-text>

      <n-flex :size="8">
        <n-button
          type="primary"
          :disabled="!canGenerate"
          :loading="isGenerating"
          @click="$emit('generate')"
        >
          {{ isGenerating ? t('generating') : t('generate') }}
        </n-button>
        <n-button v-if="resultUrl" tag="a" :href="resultUrl" :download="resultFilename">
          {{ t('download') }}
        </n-button>
      </n-flex>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NButton, NFlex, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { MetadataFieldChange } from '../composables/usePdfMetadataEditor'
import type { PdfMetadataFieldKey } from '../utils/pdfMetadata'

defineProps<{
  title: string
  fieldLabels: Record<PdfMetadataFieldKey, string>
  changeSummary: MetadataFieldChange[]
  canGenerate: boolean
  isGenerating: boolean
  resultFilename: string
  resultUrl: string | undefined
  errorMessage: string
}>()

defineEmits<{
  (event: 'generate'): void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "zh": {
    "errorTitle": "错误",
    "signatureNote": "保存元数据会生成一个新的 PDF 文件，并且可能导致数字签名失效。",
    "modifiedFields": "待应用的变更",
    "willUpdate": "更新字段",
    "willClear": "清空字段",
    "noChanges": "至少修改一个字段后才能生成新的 PDF。",
    "generate": "保存元数据并下载",
    "generating": "正在保存元数据...",
    "download": "下载更新后的 PDF"
  },
  "zh-CN": {
    "errorTitle": "错误",
    "signatureNote": "保存元数据会生成一个新的 PDF 文件，并且可能导致数字签名失效。",
    "modifiedFields": "待应用的变更",
    "willUpdate": "更新字段",
    "willClear": "清空字段",
    "noChanges": "至少修改一个字段后才能生成新的 PDF。",
    "generate": "保存元数据并下载",
    "generating": "正在保存元数据...",
    "download": "下载更新后的 PDF"
  },
  "zh-TW": {
    "errorTitle": "錯誤",
    "signatureNote": "儲存中繼資料會產生新的 PDF 檔案，並且可能使數位簽章失效。",
    "modifiedFields": "待套用的變更",
    "willUpdate": "更新欄位",
    "willClear": "清空欄位",
    "noChanges": "至少修改一個欄位後才能產生新的 PDF。",
    "generate": "儲存中繼資料並下載",
    "generating": "正在儲存中繼資料...",
    "download": "下載更新後的 PDF"
  },
  "zh-HK": {
    "errorTitle": "錯誤",
    "signatureNote": "儲存中繼資料會產生新的 PDF 檔案，並且可能使數位簽章失效。",
    "modifiedFields": "待套用的變更",
    "willUpdate": "更新欄位",
    "willClear": "清空欄位",
    "noChanges": "至少修改一個欄位後才能產生新的 PDF。",
    "generate": "儲存中繼資料並下載",
    "generating": "正在儲存中繼資料...",
    "download": "下載更新後的 PDF"
  },
  "es": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "fr": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "de": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "it": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "ja": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "ko": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "ru": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "pt": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "ar": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "hi": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "tr": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "nl": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "sv": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "pl": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "vi": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "th": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "id": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "he": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "ms": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  },
  "no": {
    "errorTitle": "Error",
    "signatureNote": "Saving metadata creates a new PDF file and may invalidate digital signatures.",
    "modifiedFields": "Pending changes",
    "willUpdate": "Update value",
    "willClear": "Clear field",
    "noChanges": "Change at least one field to create a new PDF.",
    "generate": "Save metadata and download",
    "generating": "Saving metadata...",
    "download": "Download updated PDF"
  }
}
</i18n>
