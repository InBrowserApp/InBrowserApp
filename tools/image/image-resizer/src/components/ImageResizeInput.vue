<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>

    <template v-if="!file">
      <n-upload accept="image/*" @before-upload="handleBeforeUpload">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <Image24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ t('dropHint') }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ t('supportedFormatsHint') }}
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </template>

    <template v-else>
      <n-flex vertical :size="16">
        <n-flex align="center" :size="16">
          <n-image :src="previewUrl || ''" :alt="t('previewAlt')" width="160" />
          <n-flex vertical :size="4">
            <n-text strong>{{ file.name }}</n-text>
            <n-text depth="3">{{ filesize(file.size) }}</n-text>
            <n-text depth="3">{{ dimensionsText }}</n-text>
            <n-button size="small" @click="clearFile">
              <template #icon>
                <n-icon><Delete20Regular /></n-icon>
              </template>
              {{ t('removeFile') }}
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
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { filesize } from 'filesize'
import Image24Regular from '@vicons/fluent/Image24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import type { UploadFileInfo } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageDimensions } from '../types'

interface Props {
  dimensions: ImageDimensions | null
}

const props = defineProps<Props>()
const file = defineModel<File | null>('file', { required: true })

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()
const previewUrl = useObjectUrl(file)

const dimensionsText = computed(() => {
  const width = Math.max(1, props.dimensions?.width ?? 1)
  const height = Math.max(1, props.dimensions?.height ?? 1)
  return t('dimensions') + ': ' + width + ' × ' + height
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

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "zh": {
    "uploadTitle": "上传图片",
    "dropHint": "点击或拖拽上传图片",
    "supportedFormatsHint": "支持 PNG、JPEG、WebP 和大多数浏览器支持的图片格式",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的图片文件",
    "previewAlt": "已选图片预览",
    "dimensions": "尺寸"
  },
  "zh-CN": {
    "uploadTitle": "上传图片",
    "dropHint": "点击或拖拽上传图片",
    "supportedFormatsHint": "支持 PNG、JPEG、WebP 和大多数浏览器支持的图片格式",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的图片文件",
    "previewAlt": "已选图片预览",
    "dimensions": "尺寸"
  },
  "zh-TW": {
    "uploadTitle": "上傳圖片",
    "dropHint": "點擊或拖曳上傳圖片",
    "supportedFormatsHint": "支援 PNG、JPEG、WebP 與大多數瀏覽器支援的圖片格式",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的圖片檔案",
    "previewAlt": "已選圖片預覽",
    "dimensions": "尺寸"
  },
  "zh-HK": {
    "uploadTitle": "上傳圖片",
    "dropHint": "點擊或拖曳上傳圖片",
    "supportedFormatsHint": "支援 PNG、JPEG、WebP 與大多數瀏覽器支援的圖片格式",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的圖片檔案",
    "previewAlt": "已選圖片預覽",
    "dimensions": "尺寸"
  },
  "es": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "fr": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "de": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "it": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "ja": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "ko": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "ru": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "pt": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "ar": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "hi": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "tr": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "nl": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "sv": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "pl": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "vi": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "th": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "id": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "he": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "ms": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  },
  "no": {
    "uploadTitle": "Upload image",
    "dropHint": "Click or drag to upload image",
    "supportedFormatsHint": "Supports PNG, JPEG, WebP and most browser image formats",
    "removeFile": "Remove file",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file",
    "previewAlt": "Selected image preview",
    "dimensions": "Dimensions"
  }
}
</i18n>
