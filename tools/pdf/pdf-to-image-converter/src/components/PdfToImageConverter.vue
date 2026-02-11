<template>
  <div class="converter-layout">
    <div class="converter-controls" :class="{ 'has-options': numPages > 0 }">
      <div class="converter-controls-item">
        <PdfToImageUploadSection
          :is-loading-document="isLoadingDocument"
          :uploaded-file-name="uploadedFileName"
          :uploaded-file-size="uploadedFileSize"
          :num-pages="numPages"
          @upload-file="handleUpload"
        />
      </div>

      <div v-if="numPages > 0" class="converter-controls-item">
        <PdfToImageOptionsSection
          :format="format"
          :dpi="dpi"
          :quality="quality"
          :num-pages="numPages"
          :has-current-image="Boolean(currentPageImage)"
          :is-rendering="isRendering"
          :is-exporting="isExporting"
          :export-progress="exportProgress"
          :current-download-url="currentImageURL"
          :current-download-name="currentDownloadName"
          :zip-download-url="zipDownloadURL"
          :zip-download-name="zipDownloadName"
          @update:format="setFormat"
          @update:dpi="setDpi"
          @update:quality="setQuality"
          @export-all="exportAllPages"
        />
      </div>
    </div>

    <PdfToImagePreviewSection
      :page="page"
      :num-pages="numPages"
      :page-image="currentPageImage"
      :is-rendering="isRendering"
      :error-message="errorMessage"
      @update:page="page = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePdfToImageConverter } from '../composables/usePdfToImageConverter'
import PdfToImageOptionsSection from './PdfToImageOptionsSection.vue'
import PdfToImagePreviewSection from './PdfToImagePreviewSection.vue'
import PdfToImageUploadSection from './PdfToImageUploadSection.vue'

const { t } = useI18n({ useScope: 'local' })

const {
  page,
  numPages,
  format,
  dpi,
  quality,
  currentPageImage,
  isLoadingDocument,
  isRendering,
  isExporting,
  exportProgress,
  errorMessage,
  uploadedFileName,
  uploadedFileSize,
  currentImageURL,
  currentDownloadName,
  zipDownloadURL,
  zipDownloadName,
  handleUpload,
  setFormat,
  setDpi,
  setQuality,
  exportAllPages,
} = usePdfToImageConverter({
  text: {
    loadFailed: () => t('loadFailed'),
    loadFailedInvalid: () => t('loadFailedInvalid'),
    renderFailed: () => t('renderFailed'),
    renderFailedCanvas: () => t('renderFailedCanvas'),
    exportFailed: () => t('exportFailed'),
    exportFailedCanvas: () => t('exportFailedCanvas'),
    zipReady: ({ count }) => t('zipReady', { count }),
  },
})
</script>

<style scoped>
.converter-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.converter-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.converter-controls-item {
  min-width: 0;
}

@media (min-width: 960px) {
  .converter-controls.has-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "zh": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "zh-CN": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "zh-TW": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "zh-HK": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "es": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "fr": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "de": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "it": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "ja": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "ko": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "ru": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "pt": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "ar": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "hi": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "tr": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "nl": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "sv": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "pl": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "vi": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "th": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "id": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "he": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "ms": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  },
  "no": {
    "loadFailed": "Failed to load PDF file.",
    "loadFailedInvalid": "Invalid PDF file. Please upload a valid PDF.",
    "renderFailed": "Failed to render the selected page.",
    "renderFailedCanvas": "Canvas rendering is unavailable in this browser.",
    "exportFailed": "Failed to export all pages.",
    "exportFailedCanvas": "Failed to generate output image data.",
    "zipReady": "ZIP file is ready with {count} pages."
  }
}
</i18n>
