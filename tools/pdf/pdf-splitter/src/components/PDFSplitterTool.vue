<template>
  <PDFSplitUploadSection @upload="handleUpload" />

  <n-alert
    v-if="fileErrorMessage"
    type="error"
    :title="fileErrorMessage"
    style="margin-bottom: 16px"
  />

  <template v-if="file">
    <PDFSplitSelectionSection
      :page-count="pageCount"
      :selected-count="selectedCount"
      :range-input="rangeInput"
      :output-mode="outputMode"
      :multiple-mode="multipleMode"
      @update:range-input="handleRangeInputChange($event)"
      @update:output-mode="setOutputMode($event)"
      @update:multiple-mode="setMultipleMode($event)"
      @select-all="selectAll"
      @select-odd="selectOddPages"
      @select-even="selectEvenPages"
      @clear-selection="clearSelectedPages"
    />

    <PDFSplitPreviewSection
      :items="items"
      :selected-page-set="selectedPageSet"
      :is-loading-document="isLoadingDocument"
      :is-rendering-thumbnails="isRenderingThumbnails"
      @toggle-page="handleTogglePage"
      @open-preview="handleOpenPreview"
    />

    <PDFSplitActionsSection
      :is-generating="isGenerating"
      :can-generate="canGenerate"
      :range-error-message="rangeErrorMessage"
      :generate-error-message="generateErrorMessage"
      :has-result="hasResult"
      :download-url="downloadUrl"
      :result-filename="resultFilename"
      :result-file-count="resultFileCount"
      @generate="handleGenerate"
    />
  </template>

  <n-modal :show="previewPage !== null" @update:show="handlePreviewVisible">
    <n-card
      style="width: min(980px, 94vw)"
      :title="previewModalTitle"
      closable
      @close="closePreview"
    >
      <n-spin :show="isPreviewLoading">
        <div class="preview-modal-content">
          <img
            v-if="previewImageUrl"
            :src="previewImageUrl"
            :alt="previewModalTitle"
            :class="{ 'preview-modal-image--loading': isPreviewLoading && !previewBlobURL }"
          />
        </div>
      </n-spin>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert, NCard, NModal, NSpin, useMessage } from 'naive-ui'
import { PAGE_RANGE_ERROR } from '../utils/parse-page-ranges'
import { PDF_ERROR } from '../pdf-errors'
import { usePdfSplitter } from './usePdfSplitter'
import PDFSplitUploadSection from './PDFSplitUploadSection.vue'
import PDFSplitSelectionSection from './PDFSplitSelectionSection.vue'
import PDFSplitPreviewSection from './PDFSplitPreviewSection.vue'
import PDFSplitActionsSection from './PDFSplitActionsSection.vue'

const message = useMessage()

const {
  file,
  pageCount,
  rangeInput,
  outputMode,
  multipleMode,
  isLoadingDocument,
  isRenderingThumbnails,
  isGenerating,
  isPreviewLoading,
  fileErrorCode,
  rangeErrorCode,
  generateErrorCode,
  previewPage,
  previewBlobURL,
  selectedCount,
  selectedPageSet,
  items,
  resultFilename,
  resultFileCount,
  hasResult,
  downloadUrl,
  canGenerate,
  handleUpload,
  handleRangeInputChange,
  togglePageSelection,
  setOutputMode,
  setMultipleMode,
  selectAll,
  selectOddPages,
  selectEvenPages,
  clearSelectedPages,
  openPreview,
  closePreview,
  generate,
} = usePdfSplitter()

const rangeErrorMessage = computed(() => {
  if (!rangeErrorCode.value) {
    return ''
  }

  if (rangeErrorCode.value === PAGE_RANGE_ERROR.Empty) {
    return 'Please enter page ranges first.'
  }

  if (rangeErrorCode.value === PAGE_RANGE_ERROR.OutOfBounds) {
    return 'Range contains pages outside the current PDF page count.'
  }

  if (rangeErrorCode.value === PAGE_RANGE_ERROR.DescendingRange) {
    return 'Range start cannot be greater than range end.'
  }

  if (rangeErrorCode.value === PAGE_RANGE_ERROR.DuplicatePage) {
    return 'Each page can only appear once in the range expression.'
  }

  return 'Page range expression is invalid.'
})

const fileErrorMessage = computed(() => {
  if (!fileErrorCode.value) {
    return ''
  }

  if (fileErrorCode.value === PDF_ERROR.Encrypted) {
    return 'Encrypted PDF detected. Please remove the owner password first.'
  }

  if (fileErrorCode.value === PDF_ERROR.Invalid) {
    return 'Failed to read PDF file. Please upload a valid PDF.'
  }

  return 'Failed to load PDF file.'
})

const generateErrorMessage = computed(() => {
  if (!generateErrorCode.value) {
    return ''
  }

  if (generateErrorCode.value === PDF_ERROR.WorkerUnsupported) {
    return 'Your browser does not support Web Worker.'
  }

  return 'Failed to generate result file(s).'
})

const previewModalTitle = computed(() => `Page ${previewPage.value ?? ''} Preview`)
const previewFallbackUrl = computed(() => {
  if (previewPage.value === null) {
    return null
  }

  const target = items.value.find((item) => item.page === previewPage.value)
  return target?.thumbnailUrl ?? null
})
const previewImageUrl = computed(() => previewBlobURL.value || previewFallbackUrl.value)

const handleTogglePage = (page: number, event: MouseEvent): void => {
  togglePageSelection(page, event.shiftKey)
}

const handleGenerate = async (): Promise<void> => {
  const result = await generate()

  if (result.success) {
    if (resultFileCount.value <= 1) {
      message.success('PDF generated successfully.')
    } else {
      message.success(`${resultFileCount.value} PDF files are ready in ZIP.`)
    }

    return
  }

  if (result.errorCode) {
    message.error(generateErrorMessage.value || rangeErrorMessage.value || 'Generation failed.')
  }
}

const handleOpenPreview = (page: number): void => {
  void openPreview(page)
}

const handlePreviewVisible = (visible: boolean): void => {
  if (!visible) {
    closePreview()
  }
}
</script>

<style scoped>
.preview-modal-content {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-modal-content img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 8px;
  transition: filter 0.15s ease;
}

.preview-modal-image--loading {
  filter: blur(1px);
}
</style>
