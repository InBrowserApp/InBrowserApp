<template>
  <PDFMetadataSectionHeader :title="title" :icon="DocumentArrowUp20Regular" />
  <ToolSection>
    <n-space vertical :size="12">
      <n-upload
        v-if="!info"
        accept="application/pdf"
        :show-file-list="false"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <n-flex vertical align="center" :size="12" class="upload-empty-state">
            <n-icon :size="44">
              <DocumentPdf24Regular />
            </n-icon>
            <n-text strong>{{ t('emptyTitle') }}</n-text>
            <n-text depth="3" class="upload-description">
              {{ t('emptyDescription') }}
            </n-text>
            <n-text depth="3">{{ t('localNote') }}</n-text>
          </n-flex>
        </n-upload-dragger>
      </n-upload>

      <n-card v-else size="small" embedded>
        <n-flex justify="space-between" align="flex-start" :size="16" wrap>
          <n-flex align="center" :size="12">
            <n-icon :size="32">
              <DocumentPdf24Regular />
            </n-icon>
            <n-flex vertical :size="6">
              <n-text strong>{{ info.file.name }}</n-text>
              <n-flex :size="8" wrap>
                <n-tag v-if="info.document.pageCount !== undefined" size="small">
                  {{ t('pageCountTag', { count: info.document.pageCount }) }}
                </n-tag>
                <n-tag v-if="info.document.version" size="small">
                  {{ t('versionTag', { version: info.document.version }) }}
                </n-tag>
                <n-tag v-if="info.document.encrypted" size="small" type="warning">
                  {{ t('encryptedTag') }}
                </n-tag>
              </n-flex>
              <n-text depth="3">{{ t('localNote') }}</n-text>
            </n-flex>
          </n-flex>

          <n-flex :size="8">
            <n-upload
              accept="application/pdf"
              :show-file-list="false"
              :disabled="isLoading"
              @before-upload="handleBeforeUpload"
            >
              <n-button secondary :disabled="isLoading">
                {{ t('replaceFile') }}
              </n-button>
            </n-upload>
            <n-button quaternary :disabled="isLoading" @click="$emit('clear-file')">
              {{ t('removeFile') }}
            </n-button>
          </n-flex>
        </n-flex>
      </n-card>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { useMessage, type UploadFileInfo } from 'naive-ui'
import {
  NButton,
  NCard,
  NFlex,
  NIcon,
  NSpace,
  NTag,
  NText,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import DocumentArrowUp20Regular from '@vicons/fluent/DocumentArrowUp20Regular'
import DocumentPdf24Regular from '@vicons/fluent/DocumentPdf24Regular'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import type { PdfMetadataInfo } from '../utils/pdfMetadata'
import PDFMetadataSectionHeader from './PDFMetadataSectionHeader.vue'

defineProps<{
  title: string
  info: PdfMetadataInfo | null
  isLoading: boolean
}>()

const emit = defineEmits<{
  (event: 'upload-file', file: File): void
  (event: 'clear-file'): void
}>()

const message = useMessage()
const { t } = useI18n({ useScope: 'local' })

const handleBeforeUpload = async ({ file }: { file: UploadFileInfo }): Promise<boolean> => {
  if (file.file?.type !== 'application/pdf') {
    message.error(t('errorOnlyPdf'))
    return false
  }

  emit('upload-file', file.file)
  return false
}
</script>

<style scoped>
.upload-empty-state {
  padding: 12px 0;
  text-align: center;
}

.upload-description {
  max-width: 28rem;
}
</style>

<i18n lang="json">
{
  "en": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "zh": {
    "emptyTitle": "拖入 PDF 以查看并编辑元数据",
    "emptyDescription": "选择一个 PDF 文件，或将其拖到这里，以加载文档信息和元数据字段。",
    "localNote": "在浏览器本地处理，不会上传文件。",
    "pageCountTag": "{count} 页",
    "versionTag": "PDF {version}",
    "encryptedTag": "已加密",
    "replaceFile": "替换文件",
    "removeFile": "移除文件",
    "errorOnlyPdf": "仅允许 PDF 文件"
  },
  "zh-CN": {
    "emptyTitle": "拖入 PDF 以查看并编辑元数据",
    "emptyDescription": "选择一个 PDF 文件，或将其拖到这里，以加载文档信息和元数据字段。",
    "localNote": "在浏览器本地处理，不会上传文件。",
    "pageCountTag": "{count} 页",
    "versionTag": "PDF {version}",
    "encryptedTag": "已加密",
    "replaceFile": "替换文件",
    "removeFile": "移除文件",
    "errorOnlyPdf": "仅允许 PDF 文件"
  },
  "zh-TW": {
    "emptyTitle": "拖入 PDF 以檢視並編輯中繼資料",
    "emptyDescription": "選擇 PDF 檔案，或拖曳到這裡，以載入文件資訊和中繼資料欄位。",
    "localNote": "在瀏覽器本機處理，不會上傳檔案。",
    "pageCountTag": "{count} 頁",
    "versionTag": "PDF {version}",
    "encryptedTag": "已加密",
    "replaceFile": "替換檔案",
    "removeFile": "移除檔案",
    "errorOnlyPdf": "僅允許 PDF 檔案"
  },
  "zh-HK": {
    "emptyTitle": "拖入 PDF 以檢視並編輯中繼資料",
    "emptyDescription": "選擇 PDF 檔案，或拖曳到這裡，以載入文件資訊和中繼資料欄位。",
    "localNote": "在瀏覽器本機處理，不會上傳檔案。",
    "pageCountTag": "{count} 頁",
    "versionTag": "PDF {version}",
    "encryptedTag": "已加密",
    "replaceFile": "替換檔案",
    "removeFile": "移除檔案",
    "errorOnlyPdf": "僅允許 PDF 檔案"
  },
  "es": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "fr": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "de": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "it": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "ja": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "ko": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "ru": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "pt": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "ar": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "hi": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "tr": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "nl": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "sv": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "pl": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "vi": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "th": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "id": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "he": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "ms": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  },
  "no": {
    "emptyTitle": "Drop a PDF to inspect and edit metadata",
    "emptyDescription": "Choose a PDF file or drag it here to load document details and metadata fields.",
    "localNote": "Runs locally in your browser. No uploads.",
    "pageCountTag": "Pages {count}",
    "versionTag": "PDF {version}",
    "encryptedTag": "Encrypted",
    "replaceFile": "Replace file",
    "removeFile": "Remove file",
    "errorOnlyPdf": "Only PDF files are allowed"
  }
}
</i18n>
