<template>
  <section ref="sectionRef">
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <n-upload
          accept=".pdf,application/pdf"
          :show-file-list="false"
          @before-upload="handleBeforeUpload"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <DocumentPdf24Regular />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">{{ t('dragHint') }}</n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">{{ t('localOnly') }}</n-p>
          </n-upload-dragger>
        </n-upload>

        <n-alert v-if="fileErrorMessage" type="error" :title="fileErrorMessage" />

        <n-flex v-if="fileName" justify="space-between" align="center" wrap>
          <n-text>{{ t('loadedFile', { name: fileName, count: pageCount }) }}</n-text>
          <n-button quaternary type="warning" @click="emit('clear')">
            <template #icon>
              <n-icon :component="DismissSquare20Regular" />
            </template>
            {{ t('clearFile') }}
          </n-button>
        </n-flex>
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NFlex,
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useMessage,
  type UploadFileInfo,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import DismissSquare20Regular from '@vicons/fluent/DismissSquare20Regular'
import DocumentPdf24Regular from '@vicons/fluent/DocumentPdf24Regular'
import { PDF_ERROR } from '../pdf-errors'
import { isPdfFile } from '../inspect-pdf'

const props = defineProps<{
  fileErrorCode: string
  fileName: string
  pageCount: number
}>()

const emit = defineEmits<{
  (event: 'upload', file: File): void
  (event: 'clear'): void
}>()

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()
const sectionRef = ref<HTMLElement | null>(null)

const fileErrorMessage = computed(() => {
  if (!props.fileErrorCode) {
    return ''
  }

  if (props.fileErrorCode === PDF_ERROR.Encrypted) {
    return t('fileEncrypted')
  }

  if (props.fileErrorCode === PDF_ERROR.Invalid) {
    return t('fileInvalid')
  }

  return t('fileLoadFailed')
})

const handleBeforeUpload = ({ file }: { file: UploadFileInfo }) => {
  const selectedFile = file.file
  if (!selectedFile) {
    return false
  }

  if (!isPdfFile(selectedFile)) {
    message.error(t('onlyPdf'))
    return false
  }

  emit('upload', selectedFile)
  return false
}

defineExpose({
  scrollIntoView: () => sectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
})
</script>

<i18n lang="json">
{
  "en": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "zh": {
    "title": "上传 PDF",
    "dragHint": "点击或拖拽添加 PDF 文件",
    "localOnly": "文件仅在浏览器本地处理。",
    "onlyPdf": "仅允许 PDF 文件。",
    "fileEncrypted": "检测到加密 PDF，请先移除权限密码。",
    "fileInvalid": "读取 PDF 文件失败，请上传有效的 PDF。",
    "fileLoadFailed": "加载 PDF 文件失败。",
    "loadedFile": "已加载：{name}（{count} 页）",
    "clearFile": "清除文件"
  },
  "zh-CN": {
    "title": "上传 PDF",
    "dragHint": "点击或拖拽添加 PDF 文件",
    "localOnly": "文件仅在浏览器本地处理。",
    "onlyPdf": "仅允许 PDF 文件。",
    "fileEncrypted": "检测到加密 PDF，请先移除权限密码。",
    "fileInvalid": "读取 PDF 文件失败，请上传有效的 PDF。",
    "fileLoadFailed": "加载 PDF 文件失败。",
    "loadedFile": "已加载：{name}（{count} 页）",
    "clearFile": "清除文件"
  },
  "zh-TW": {
    "title": "上傳 PDF",
    "dragHint": "點擊或拖曳新增 PDF 檔案",
    "localOnly": "檔案僅在瀏覽器本機處理。",
    "onlyPdf": "僅允許 PDF 檔案。",
    "fileEncrypted": "偵測到加密 PDF，請先移除權限密碼。",
    "fileInvalid": "讀取 PDF 檔案失敗，請上傳有效的 PDF。",
    "fileLoadFailed": "載入 PDF 檔案失敗。",
    "loadedFile": "已載入：{name}（{count} 頁）",
    "clearFile": "清除檔案"
  },
  "zh-HK": {
    "title": "上傳 PDF",
    "dragHint": "點擊或拖曳新增 PDF 檔案",
    "localOnly": "檔案僅在瀏覽器本機處理。",
    "onlyPdf": "僅允許 PDF 檔案。",
    "fileEncrypted": "偵測到加密 PDF，請先移除權限密碼。",
    "fileInvalid": "讀取 PDF 檔案失敗，請上傳有效的 PDF。",
    "fileLoadFailed": "載入 PDF 檔案失敗。",
    "loadedFile": "已載入：{name}（{count} 頁）",
    "clearFile": "清除檔案"
  },
  "es": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "fr": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "de": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "it": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "ja": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "ko": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "ru": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "pt": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "ar": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "hi": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "tr": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "nl": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "sv": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "pl": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "vi": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "th": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "id": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "he": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "ms": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  },
  "no": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed.",
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "fileLoadFailed": "Failed to load PDF file.",
    "loadedFile": "Loaded: {name} ({count} pages)",
    "clearFile": "Clear file"
  }
}
</i18n>
