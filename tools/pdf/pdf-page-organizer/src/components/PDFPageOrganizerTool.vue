<template>
  <PDFOrganizerUploadSection
    ref="uploadSectionRef"
    :file-error-code="fileErrorCode"
    :file-name="file?.name ?? ''"
    :page-count="originalPageCount"
    @upload="handleUploadAndScroll"
    @clear="clearFile"
  />

  <template v-if="file">
    <PDFOrganizerToolbar
      ref="toolbarSectionRef"
      :page-count="pages.length"
      :selected-count="selectedCount"
      :has-changes="hasChanges"
      :can-undo="canUndo"
      :can-redo="canRedo"
      :is-generating="isGenerating"
      :can-export="canExport"
      :has-result="hasResult"
      :thumbnail-size="thumbnailSize"
      :download-url="downloadUrl ?? undefined"
      :result-filename="resultFilename"
      :generate-error-code="generateErrorCode"
      @undo="undoChanges"
      @redo="redoChanges"
      @select-all="selectAllPages"
      @clear-selection="clearSelection"
      @rotate-left="rotateSelectedPages(-90)"
      @rotate-right="rotateSelectedPages(90)"
      @delete-selection="deleteSelectedPages"
      @reset="resetChanges"
      @jump-to-page="handleJumpToPage"
      @set-thumbnail-size="thumbnailSize = $event"
      @export="handleExport"
    />

    <PDFOrganizerGrid
      ref="pageGridRef"
      :pages="pages"
      :selected-page-set="selectedPageSet"
      :is-loading-document="isLoadingDocument"
      :is-rendering-thumbnails="isRenderingThumbnails"
      :thumbnail-size="thumbnailSize"
      @reorder="reorderPages"
      @toggle-page="togglePageSelection"
      @move-up="movePage($event, -1)"
      @move-down="movePage($event, 1)"
      @rotate-left="rotatePage($event, -90)"
      @rotate-right="rotatePage($event, 90)"
      @delete-page="deletePage"
      @open-preview="handleOpenPreview"
    />
  </template>

  <PDFOrganizerPreviewModal
    :visible="previewPageId !== null"
    :page="previewDisplayPage"
    :image-url="previewImageUrl"
    :rotation="previewRotation"
    :is-loading="isPreviewLoading"
    :can-prev="canPreviewPrevious"
    :can-next="canPreviewNext"
    @close="closePreview"
    @prev="handlePreviewByOffset(-1)"
    @next="handlePreviewByOffset(1)"
  />
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import PDFOrganizerGrid from './PDFOrganizerGrid.vue'
import PDFOrganizerPreviewModal from './PDFOrganizerPreviewModal.vue'
import PDFOrganizerToolbar from './PDFOrganizerToolbar.vue'
import PDFOrganizerUploadSection from './PDFOrganizerUploadSection.vue'
import { usePdfPageOrganizer } from './usePdfPageOrganizer'
import { PDF_ERROR } from '../pdf-errors'
import type { ThumbnailSize } from './pageOrganizerState'

type ScrollableSection = {
  scrollIntoView: () => void
}

type PageGrid = {
  scrollToPage: (pageId: string) => boolean
}

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()
const uploadSectionRef = ref<ScrollableSection | null>(null)
const toolbarSectionRef = ref<ScrollableSection | null>(null)
const pageGridRef = ref<PageGrid | null>(null)
const thumbnailSize = ref<ThumbnailSize>('comfortable')

const {
  file,
  pages,
  originalPageCount,
  selectedCount,
  selectedPageSet,
  previewPageId,
  previewImageUrl,
  previewRotation,
  previewDisplayPage,
  canPreviewPrevious,
  canPreviewNext,
  isLoadingDocument,
  isRenderingThumbnails,
  isPreviewLoading,
  isGenerating,
  fileErrorCode,
  generateErrorCode,
  hasChanges,
  hasResult,
  canUndo,
  canRedo,
  canExport,
  resultFilename,
  downloadUrl,
  handleUpload,
  reorderPages,
  movePage,
  rotatePage,
  rotateSelectedPages,
  deletePage,
  deleteSelectedPages,
  togglePageSelection,
  selectAllPages,
  clearSelection,
  resetChanges,
  undoChanges,
  redoChanges,
  openPreview,
  previewByOffset,
  closePreview,
  exportPdf,
  clearFile,
} = usePdfPageOrganizer()

const errorMessages: Record<string, string> = {
  [PDF_ERROR.Encrypted]: t('fileEncrypted'),
  [PDF_ERROR.Invalid]: t('fileInvalid'),
  [PDF_ERROR.PreviewFailed]: t('previewFailed'),
  [PDF_ERROR.ExportFailed]: t('exportFailed'),
  [PDF_ERROR.WorkerUnsupported]: t('workerUnsupported'),
}

const getErrorMessage = (errorCode?: string): string =>
  (errorCode && errorMessages[errorCode]) || t('genericError')

const handleUploadAndScroll = async (nextFile: File): Promise<void> => {
  const result = await handleUpload(nextFile)
  if (!result.success) {
    if (result.errorCode) {
      message.error(getErrorMessage(result.errorCode))
    }
    return
  }

  await nextTick()
  toolbarSectionRef.value?.scrollIntoView()
}

const handleOpenPreview = async (pageId: string): Promise<void> => {
  const result = await openPreview(pageId)
  if (!result.success && result.errorCode) {
    message.error(getErrorMessage(result.errorCode))
  }
}

const handlePreviewByOffset = async (offset: number): Promise<void> => {
  const result = await previewByOffset(offset)
  if (!result.success && result.errorCode) {
    message.error(getErrorMessage(result.errorCode))
  }
}

const handleExport = async (): Promise<void> => {
  const result = await exportPdf()
  if (!result.success) {
    if (result.errorCode) {
      message.error(getErrorMessage(result.errorCode))
    }
    return
  }

  message.success(t('exportReady'))
}

const handleJumpToPage = (pageNumber: number): void => {
  const targetPage = pages.value[pageNumber - 1]
  if (!targetPage) {
    return
  }

  pageGridRef.value?.scrollToPage(targetPage.id)
}

defineExpose({
  scrollIntoView: () => uploadSectionRef.value?.scrollIntoView(),
})
</script>

<i18n lang="json">
{
  "en": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "zh": {
    "fileEncrypted": "检测到加密 PDF，请先移除权限密码。",
    "fileInvalid": "读取 PDF 文件失败，请上传有效的 PDF。",
    "previewFailed": "加载页面预览失败。",
    "exportFailed": "导出整理后的 PDF 失败。",
    "workerUnsupported": "当前浏览器不支持 PDF 导出工作线程。",
    "genericError": "处理 PDF 时发生错误。",
    "exportReady": "整理后的 PDF 已可下载。"
  },
  "zh-CN": {
    "fileEncrypted": "检测到加密 PDF，请先移除权限密码。",
    "fileInvalid": "读取 PDF 文件失败，请上传有效的 PDF。",
    "previewFailed": "加载页面预览失败。",
    "exportFailed": "导出整理后的 PDF 失败。",
    "workerUnsupported": "当前浏览器不支持 PDF 导出工作线程。",
    "genericError": "处理 PDF 时发生错误。",
    "exportReady": "整理后的 PDF 已可下载。"
  },
  "zh-TW": {
    "fileEncrypted": "偵測到加密 PDF，請先移除權限密碼。",
    "fileInvalid": "讀取 PDF 檔案失敗，請上傳有效的 PDF。",
    "previewFailed": "載入頁面預覽失敗。",
    "exportFailed": "匯出整理後的 PDF 失敗。",
    "workerUnsupported": "目前瀏覽器不支援 PDF 匯出工作執行緒。",
    "genericError": "處理 PDF 時發生錯誤。",
    "exportReady": "整理後的 PDF 已可下載。"
  },
  "zh-HK": {
    "fileEncrypted": "偵測到加密 PDF，請先移除權限密碼。",
    "fileInvalid": "讀取 PDF 檔案失敗，請上傳有效的 PDF。",
    "previewFailed": "載入頁面預覽失敗。",
    "exportFailed": "匯出整理後的 PDF 失敗。",
    "workerUnsupported": "目前瀏覽器不支援 PDF 匯出工作執行緒。",
    "genericError": "處理 PDF 時發生錯誤。",
    "exportReady": "整理後的 PDF 已可下載。"
  },
  "es": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "fr": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "de": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "it": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "ja": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "ko": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "ru": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "pt": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "ar": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "hi": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "tr": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "nl": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "sv": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "pl": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "vi": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "th": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "id": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "he": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "ms": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  },
  "no": {
    "fileEncrypted": "Encrypted PDF detected. Please remove the owner password first.",
    "fileInvalid": "Failed to read PDF file. Please upload a valid PDF.",
    "previewFailed": "Failed to load page preview.",
    "exportFailed": "Failed to export organized PDF.",
    "workerUnsupported": "This browser does not support PDF export workers.",
    "genericError": "Something went wrong while processing the PDF.",
    "exportReady": "Your organized PDF is ready to download."
  }
}
</i18n>
