<template>
  <div class="image-to-pdf-converter">
    <ImageToPdfUploadSection
      :is-adding-file="isAddingFile"
      :disabled="isGenerating"
      @add-file="handleAddFile"
    />

    <div class="image-to-pdf-converter__main">
      <div class="image-to-pdf-converter__panel">
        <ImageToPdfQueue
          :items="items"
          :disabled="isGenerating"
          @clear="clearAll"
          @rotate="rotateItem"
          @move-up="moveItemUp"
          @move-down="moveItemDown"
          @reorder="handleReorder"
          @remove="removeItem"
        />
      </div>

      <div class="image-to-pdf-converter__sidebar">
        <div class="image-to-pdf-converter__panel">
          <ImageToPdfPageLayoutSection v-model:options="options" :disabled="isGenerating" />
        </div>
        <div class="image-to-pdf-converter__panel">
          <ImageToPdfGenerateSection
            :can-generate="canGenerate"
            :is-generating="isGenerating"
            :progress="generationProgress"
            :download-url="resultUrl ?? null"
            :download-filename="resultFilename"
            :output-size="resultBlob?.size ?? null"
            :page-count="resultPageCount"
            @generate="handleGenerate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { useImageToPdfConverter } from '../composables/useImageToPdfConverter'
import ImageToPdfGenerateSection from './ImageToPdfGenerateSection.vue'
import ImageToPdfPageLayoutSection from './ImageToPdfPageLayoutSection.vue'
import ImageToPdfQueue from './ImageToPdfQueue.vue'
import ImageToPdfUploadSection from './ImageToPdfUploadSection.vue'

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()

const {
  items,
  options,
  isAddingFile,
  isGenerating,
  generationProgress,
  resultBlob,
  resultFilename,
  resultPageCount,
  resultUrl,
  canGenerate,
  addFile,
  rotateItem,
  removeItem,
  clearAll,
  moveItem,
  moveItemUp,
  moveItemDown,
  generate,
} = useImageToPdfConverter()

async function handleAddFile(file: File) {
  const addResult = await addFile(file)

  if (addResult === 'duplicate') {
    message.warning(t('duplicateFile'))
    return
  }

  if (addResult === 'cancelled') {
    return
  }

  if (addResult === 'invalid-image') {
    message.error(t('invalidImage'))
  }
}

function handleReorder(payload: { oldIndex: number | null; newIndex: number | null }) {
  if (payload.oldIndex === null || payload.newIndex === null) {
    return
  }

  moveItem(payload.oldIndex, payload.newIndex)
}

async function handleGenerate() {
  const result = await generate()

  if (result.success) {
    message.success(t('generateSuccess'))
    return
  }

  if (result.code === 'cancelled') {
    return
  }

  if (result.code === 'invalid-image') {
    message.error(t('invalidImage'))
    return
  }

  if (result.code === 'canvas-unavailable') {
    message.error(t('canvasUnavailable'))
    return
  }

  message.error(t('generateFailed'))
}
</script>

<style scoped>
.image-to-pdf-converter {
  display: grid;
  gap: 20px;
}

.image-to-pdf-converter__main {
  display: grid;
  gap: 20px;
}

.image-to-pdf-converter__sidebar {
  display: grid;
  gap: 20px;
  align-content: start;
}

.image-to-pdf-converter__panel {
  min-width: 0;
}

@media (min-width: 1280px) {
  .image-to-pdf-converter__main {
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
    align-items: start;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "zh": {
    "duplicateFile": "这张图片已经在队列里了。",
    "invalidImage": "无法读取这张图片，请更换文件。",
    "canvasUnavailable": "当前环境无法把图片导出为 PDF。",
    "generateSuccess": "PDF 生成成功。",
    "generateFailed": "PDF 生成失败。"
  },
  "zh-CN": {
    "duplicateFile": "这张图片已经在队列里了。",
    "invalidImage": "无法读取这张图片，请更换文件。",
    "canvasUnavailable": "当前环境无法把图片导出为 PDF。",
    "generateSuccess": "PDF 生成成功。",
    "generateFailed": "PDF 生成失败。"
  },
  "zh-TW": {
    "duplicateFile": "這張圖片已經在佇列中了。",
    "invalidImage": "無法讀取這張圖片，請更換檔案。",
    "canvasUnavailable": "目前環境無法將圖片匯出為 PDF。",
    "generateSuccess": "PDF 產生成功。",
    "generateFailed": "PDF 產生失敗。"
  },
  "zh-HK": {
    "duplicateFile": "這張圖片已經在佇列中了。",
    "invalidImage": "無法讀取這張圖片，請更換檔案。",
    "canvasUnavailable": "目前環境無法將圖片匯出為 PDF。",
    "generateSuccess": "PDF 產生成功。",
    "generateFailed": "PDF 產生失敗。"
  },
  "es": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "fr": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "de": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "it": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "ja": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "ko": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "ru": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "pt": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "ar": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "hi": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "tr": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "nl": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "sv": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "pl": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "vi": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "th": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "id": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "he": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "ms": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  },
  "no": {
    "duplicateFile": "This image is already in the queue.",
    "invalidImage": "Failed to read this image. Please choose another file.",
    "canvasUnavailable": "Your browser cannot export images to PDF in this environment.",
    "generateSuccess": "PDF created successfully.",
    "generateFailed": "Failed to create the PDF."
  }
}
</i18n>
