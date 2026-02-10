<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
      <n-gi>
        <ImageResizeInput v-model:file="imageFile" :dimensions="sourceDimensions" />
      </n-gi>

      <n-gi>
        <ResizeOptionsPanel
          v-model:options="options"
          :source-dimensions="sourceDimensions"
          :algorithms="algorithmOptions"
          :formats="formatOptions"
          :is-processing="isProcessing"
          :has-image="Boolean(imageFile)"
          @resize="runResize"
        />

        <ResizeResultPanel
          v-if="imageFile && result && downloadUrl"
          :original-file="imageFile"
          :result="result"
          :download-url="downloadUrl"
        />
      </n-gi>
    </n-grid>

    <AlgorithmGuideSection />

    <ToolSection v-if="error">
      <n-alert type="warning" :title="t('errorTitle')" :show-icon="false">
        {{ error }}
      </n-alert>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NAlert, NGi, NGrid, useMessage } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import {
  AlgorithmGuideSection,
  ImageResizeInput,
  ResizeOptionsPanel,
  ResizeResultPanel,
} from './components'
import type { ImageDimensions, ResizeAlgorithm, ResizeOptions, ResizeResult } from './types'
import { imageResizeAlgorithms, resizeImage } from './utils/resize-image'

const message = useMessage()
const { t } = useI18n({ useScope: 'local' })

const imageFile = ref<File | null>(null)
const sourceDimensions = ref<ImageDimensions | null>(null)
const isProcessing = ref(false)
const error = ref('')
const result = ref<ResizeResult | null>(null)

const options = ref<ResizeOptions>({
  width: 1280,
  height: 720,
  keepAspectRatio: true,
  allowUpscale: true,
  algorithm: 'browser-high',
  outputFormat: 'original',
  quality: 92,
})

const resultBlob = computed(() => result.value?.blob ?? null)
const downloadUrl = useObjectUrl(resultBlob)

watch(imageFile, async (file) => {
  result.value = null
  error.value = ''
  sourceDimensions.value = null

  if (!file) return

  try {
    const dimensions = await readImageDimensions(file)
    sourceDimensions.value = dimensions

    options.value = {
      ...options.value,
      width: dimensions.width,
      height: dimensions.height,
      allowUpscale: true,
    }
  } catch {
    error.value = t('invalidImageText')
  }
})

const algorithmOptions = computed<SelectOption[]>(() => {
  const labelMap: Record<ResizeAlgorithm, string> = {
    'browser-high': 'Browser high quality',
    bicubic: 'Bicubic interpolation',
    bilinear: 'Bilinear interpolation',
    lanczos3: 'Lanczos filter (radius 3)',
    nearest: 'Nearest neighbor',
  }

  return imageResizeAlgorithms.map((item) => ({
    value: item.value,
    label: labelMap[item.value],
  }))
})

const formatOptions = computed<SelectOption[]>(() => [
  { value: 'original', label: 'Keep original' },
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
])

async function runResize() {
  if (!imageFile.value) return

  isProcessing.value = true
  error.value = ''

  try {
    result.value = await resizeImage(imageFile.value, {
      ...options.value,
      allowUpscale: true,
    })
    message.success(t('resizeSuccessText'))
  } catch (reason) {
    result.value = null
    error.value = resolveErrorMessage(reason)
    message.error(error.value)
  } finally {
    isProcessing.value = false
  }
}

function resolveErrorMessage(reason: unknown) {
  if (reason instanceof Error) {
    if (reason.message === 'INVALID_IMAGE') return t('invalidImageText')
  }
  return t('resizeFailedText')
}

async function readImageDimensions(file: File): Promise<ImageDimensions> {
  if ('createImageBitmap' in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)
      const dimensions = {
        width: Math.max(1, bitmap.width),
        height: Math.max(1, bitmap.height),
      }
      bitmap.close?.()
      return dimensions
    } catch {
      // fallback to HTMLImageElement
    }
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('INVALID_IMAGE'))
      element.src = objectUrl
    })

    return {
      width: Math.max(1, image.naturalWidth || image.width || 1),
      height: Math.max(1, image.naturalHeight || image.height || 1),
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "zh": {
    "errorTitle": "调整错误",
    "invalidImageText": "读取图片文件失败，请选择其他图片。",
    "resizeSuccessText": "图片调整成功。",
    "resizeFailedText": "图片调整失败，请尝试其他设置或文件。"
  },
  "zh-CN": {
    "errorTitle": "调整错误",
    "invalidImageText": "读取图片文件失败，请选择其他图片。",
    "resizeSuccessText": "图片调整成功。",
    "resizeFailedText": "图片调整失败，请尝试其他设置或文件。"
  },
  "zh-TW": {
    "errorTitle": "調整錯誤",
    "invalidImageText": "讀取圖片檔案失敗，請選擇其他圖片。",
    "resizeSuccessText": "圖片調整成功。",
    "resizeFailedText": "圖片調整失敗，請嘗試其他設定或檔案。"
  },
  "zh-HK": {
    "errorTitle": "調整錯誤",
    "invalidImageText": "讀取圖片檔案失敗，請選擇其他圖片。",
    "resizeSuccessText": "圖片調整成功。",
    "resizeFailedText": "圖片調整失敗，請嘗試其他設定或檔案。"
  },
  "es": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "fr": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "de": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "it": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "ja": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "ko": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "ru": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "pt": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "ar": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "hi": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "tr": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "nl": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "sv": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "pl": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "vi": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "th": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "id": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "he": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "ms": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  },
  "no": {
    "errorTitle": "Resize error",
    "invalidImageText": "Failed to read this image file. Please choose another image.",
    "resizeSuccessText": "Image resized successfully.",
    "resizeFailedText": "Image resize failed. Please try another setting or file."
  }
}
</i18n>
