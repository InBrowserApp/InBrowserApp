<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>

    <template v-if="!file">
      <n-upload
        accept="image/*"
        :default-upload="false"
        :show-file-list="false"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <div class="upload-icon">
            <n-icon size="48" :depth="3">
              <Image24Regular />
            </n-icon>
          </div>
          <n-text class="upload-title">{{ t('dropHint') }}</n-text>
          <n-p depth="3" class="upload-description">
            {{ t('supportedFormatsHint') }}
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </template>

    <template v-else>
      <n-flex vertical :size="16" class="preview-panel">
        <n-flex align="center" :size="16" class="preview-row">
          <n-image
            :src="previewUrl || ''"
            :alt="t('previewAlt')"
            width="160"
            class="preview-image"
          />
          <n-flex vertical :size="4" class="preview-meta">
            <n-text strong>
              <span class="preview-name">{{ file.name }}</span>
            </n-text>
            <n-text depth="3">{{ filesize(file.size) }}</n-text>
            <n-text depth="3">{{ dimensionsText }}</n-text>
            <n-button size="small" class="preview-action" @click="clearFile">
              <template #icon>
                <n-icon><Delete20Regular /></n-icon>
              </template>
              {{ t('removeImage') }}
            </n-button>
          </n-flex>
        </n-flex>
      </n-flex>
    </template>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NButton,
  NFlex,
  NIcon,
  NImage,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useMessage,
} from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { filesize } from 'filesize'
import Image24Regular from '@vicons/fluent/Image24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

interface Props {
  width: number | null
  height: number | null
}

const props = defineProps<Props>()

const file = defineModel<File | null>('file', { required: true })

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()
const previewUrl = useObjectUrl(file)

const dimensionsText = computed(() => {
  if (!file.value) return t('dimensionsUnknown')
  return t('dimensions') + ': ' + `${props.width ?? '?'} × ${props.height ?? '?'}`
})

async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const selectedFile = data.file.file

  if (!selectedFile) return false

  if (data.fileList.length > 1) {
    message.error(t('onlyOneFile'))
    return false
  }

  if (!selectedFile.type.startsWith('image/')) {
    message.error(t('invalidFileType'))
    return false
  }

  file.value = selectedFile
  return false
}

function clearFile() {
  file.value = null
}
</script>

<style scoped>
.upload-icon {
  margin-bottom: 12px;
}

.upload-title {
  font-size: 16px;
}

.upload-description {
  margin: 8px 0 0;
}

.preview-panel,
.preview-row,
.preview-meta {
  min-width: 0;
}

.preview-row {
  width: 100%;
  align-items: flex-start;
}

.preview-image {
  flex: 0 0 auto;
}

.preview-meta {
  flex: 1 1 auto;
}

.preview-name {
  display: block;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.preview-action {
  align-self: flex-start;
}

@media (max-width: 640px) {
  .preview-row {
    flex-wrap: wrap;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "zh": {
    "uploadTitle": "上传图片",
    "dropHint": "点击或拖拽图片到这里上传",
    "supportedFormatsHint": "推荐使用 PNG、JPEG、WebP 以及其他浏览器支持的栅格图片格式。",
    "removeImage": "移除图片",
    "onlyOneFile": "一次只能上传一张图片",
    "invalidFileType": "请选择有效的图片文件",
    "previewAlt": "已上传图片预览",
    "dimensions": "尺寸",
    "dimensionsUnknown": "尺寸：加载中..."
  },
  "zh-CN": {
    "uploadTitle": "上传图片",
    "dropHint": "点击或拖拽图片到这里上传",
    "supportedFormatsHint": "推荐使用 PNG、JPEG、WebP 以及其他浏览器支持的栅格图片格式。",
    "removeImage": "移除图片",
    "onlyOneFile": "一次只能上传一张图片",
    "invalidFileType": "请选择有效的图片文件",
    "previewAlt": "已上传图片预览",
    "dimensions": "尺寸",
    "dimensionsUnknown": "尺寸：加载中..."
  },
  "zh-TW": {
    "uploadTitle": "上傳圖片",
    "dropHint": "點擊或拖曳圖片到這裡上傳",
    "supportedFormatsHint": "建議使用 PNG、JPEG、WebP，以及其他瀏覽器支援的點陣圖片格式。",
    "removeImage": "移除圖片",
    "onlyOneFile": "一次只能上傳一張圖片",
    "invalidFileType": "請選擇有效的圖片檔案",
    "previewAlt": "已上傳圖片預覽",
    "dimensions": "尺寸",
    "dimensionsUnknown": "尺寸：載入中..."
  },
  "zh-HK": {
    "uploadTitle": "上傳圖片",
    "dropHint": "點擊或拖曳圖片到這裡上傳",
    "supportedFormatsHint": "建議使用 PNG、JPEG、WebP，以及其他瀏覽器支援的點陣圖片格式。",
    "removeImage": "移除圖片",
    "onlyOneFile": "一次只能上傳一張圖片",
    "invalidFileType": "請選擇有效的圖片檔案",
    "previewAlt": "已上傳圖片預覽",
    "dimensions": "尺寸",
    "dimensionsUnknown": "尺寸：載入中..."
  },
  "es": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "fr": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "de": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "it": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "ja": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "ko": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "ru": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "pt": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "ar": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "hi": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "tr": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "nl": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "sv": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "pl": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "vi": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "th": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "id": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "he": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "ms": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  },
  "no": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Best with PNG, JPEG, WebP, and other browser-supported raster formats.",
    "removeImage": "Remove image",
    "onlyOneFile": "Only one image can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions",
    "dimensionsUnknown": "Dimensions: loading..."
  }
}
</i18n>
