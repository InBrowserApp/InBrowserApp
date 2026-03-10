<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <div class="upload-section">
      <n-upload
        accept="image/*"
        multiple
        :show-file-list="false"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <ImageMultiple24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ t('dragHint') }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">{{ t('uploadSubHint') }}</n-p>
        </n-upload-dragger>
      </n-upload>
      <n-text depth="3">
        {{ isAddingFile ? t('readingFile') : t('localOnlyNote') }}
      </n-text>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UploadFileInfo } from 'naive-ui'
import { NIcon, NP, NText, NUpload, NUploadDragger, useMessage } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ImageMultiple24Regular from '@vicons/fluent/ImageMultiple24Regular'

defineProps<{
  isAddingFile: boolean
}>()

const emit = defineEmits<{
  (event: 'add-file', file: File): void
}>()

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()

function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const selectedFile = data.file.file

  if (!selectedFile) {
    return false
  }

  if (!isProbablyImageFile(selectedFile)) {
    message.error(t('onlyImages'))
    return false
  }

  emit('add-file', selectedFile)
  return false
}

function handlePaste(event: ClipboardEvent) {
  const clipboardFiles = Array.from(event.clipboardData?.files ?? [])

  if (!clipboardFiles.length) {
    return
  }

  const imageFiles = clipboardFiles.filter(isProbablyImageFile)

  if (!imageFiles.length) {
    message.error(t('onlyImages'))
    return
  }

  for (const file of imageFiles) {
    emit('add-file', file)
  }
}

onMounted(() => {
  window.addEventListener('paste', handlePaste)
})

onBeforeUnmount(() => {
  window.removeEventListener('paste', handlePaste)
})

function isProbablyImageFile(file: File) {
  return (
    file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp|gif|avif|heic|heif)$/i.test(file.name)
  )
}
</script>

<style scoped>
.upload-section {
  display: grid;
  gap: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "zh": {
    "uploadTitle": "上传图片",
    "dragHint": "点击或拖拽添加图片",
    "uploadSubHint": "也支持从剪贴板直接粘贴图片",
    "localOnlyNote": "在浏览器本地处理，不会上传文件。",
    "readingFile": "正在读取图片文件...",
    "onlyImages": "仅允许图片文件"
  },
  "zh-CN": {
    "uploadTitle": "上传图片",
    "dragHint": "点击或拖拽添加图片",
    "uploadSubHint": "也支持从剪贴板直接粘贴图片",
    "localOnlyNote": "在浏览器本地处理，不会上传文件。",
    "readingFile": "正在读取图片文件...",
    "onlyImages": "仅允许图片文件"
  },
  "zh-TW": {
    "uploadTitle": "上傳圖片",
    "dragHint": "點擊或拖曳新增圖片",
    "uploadSubHint": "也支援從剪貼簿直接貼上圖片",
    "localOnlyNote": "在瀏覽器本機處理，不會上傳檔案。",
    "readingFile": "正在讀取圖片檔案...",
    "onlyImages": "僅允許圖片檔案"
  },
  "zh-HK": {
    "uploadTitle": "上傳圖片",
    "dragHint": "點擊或拖曳新增圖片",
    "uploadSubHint": "也支援從剪貼簿直接貼上圖片",
    "localOnlyNote": "在瀏覽器本機處理，不會上傳檔案。",
    "readingFile": "正在讀取圖片檔案...",
    "onlyImages": "僅允許圖片檔案"
  },
  "es": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "fr": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "de": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "it": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "ja": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "ko": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "ru": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "pt": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "ar": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "hi": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "tr": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "nl": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "sv": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "pl": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "vi": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "th": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "id": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "he": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "ms": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  },
  "no": {
    "uploadTitle": "Upload images",
    "dragHint": "Click or drag to add images",
    "uploadSubHint": "You can also paste images from your clipboard",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "readingFile": "Reading image files...",
    "onlyImages": "Only image files are allowed"
  }
}
</i18n>
