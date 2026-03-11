<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
      <n-gi>
        <ImageCropUpload
          v-model:file="imageFile"
          :width="source?.width ?? null"
          :height="source?.height ?? null"
        />

        <CropWorkspace
          v-if="source && cropRect"
          :source="source"
          :crop-rect="cropRect"
          :ratio="activeRatio"
          @update:crop-rect="updateCropRect"
        />
      </n-gi>

      <n-gi>
        <CropPresetBar
          v-if="source && cropRect"
          v-model:preset-id="presetId"
          :options="presetOptions"
        />

        <CropSettingsPanel
          v-if="source && cropRect && cropPixels"
          v-model:export-options="exportOptions"
          :crop-width="cropPixels.width"
          :crop-height="cropPixels.height"
          :source-mime-type="source.mimeType"
          :source-has-alpha="source.hasAlpha"
          :is-processing="isProcessing"
          :can-crop="Boolean(source && cropRect)"
          @crop="runCrop"
        />

        <CropResultPanel v-if="imageFile && result" :original-file="imageFile" :result="result" />
      </n-gi>
    </n-grid>

    <ToolSection v-if="error">
      <n-alert type="warning" :title="t('errorTitle')" :show-icon="false">
        {{ error }}
      </n-alert>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NAlert, NGi, NGrid, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import type { CropPresetID, CropRect, CropResult, ExportOptions, ImageSource } from './types'
import {
  CropPresetBar,
  CropResultPanel,
  CropSettingsPanel,
  CropWorkspace,
  ImageCropUpload,
} from './components'
import { cropPresets } from './utils/crop-presets'
import {
  clampCropRect,
  createInitialCropRect,
  normalizedRectToPixels,
  setCropRatioKeepingCenter,
} from './utils/crop-math'
import { cropImage } from './utils/crop-image'
import { loadImageSource } from './utils/load-image'

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()

const imageFile = ref<File | null>(null)
const source = ref<ImageSource | null>(null)
const cropRect = ref<CropRect | null>(null)
const presetId = ref<CropPresetID>('free')
const exportOptions = ref<ExportOptions>(createDefaultExportOptions())
const isProcessing = ref(false)
const result = ref<CropResult | null>(null)
const error = ref('')

const activeRatio = computed(
  () => cropPresets.find((preset) => preset.id === presetId.value)?.ratio ?? null,
)

const presetOptions = computed(() => {
  return cropPresets.map((preset) => ({
    id: preset.id,
    label: preset.id === 'free' ? t('free') : preset.id,
  }))
})

const cropPixels = computed(() => {
  if (!source.value || !cropRect.value) return null
  return normalizedRectToPixels(cropRect.value, source.value)
})

let loadToken = 0

watch(imageFile, async (file) => {
  const token = ++loadToken
  source.value = null
  cropRect.value = null
  result.value = null
  error.value = ''
  presetId.value = 'free'
  exportOptions.value = createDefaultExportOptions()

  if (!file) return

  try {
    const loaded = await loadImageSource(file)
    if (token !== loadToken) return

    source.value = loaded
    cropRect.value = createInitialCropRect(loaded, null)
  } catch (reason) {
    if (token !== loadToken) return
    error.value = resolveErrorMessage(reason)
  }
})

watch(presetId, (nextPreset, previousPreset) => {
  if (!source.value || !cropRect.value || nextPreset === previousPreset) return

  cropRect.value = setCropRatioKeepingCenter(cropRect.value, source.value, activeRatio.value)
  result.value = null
})

watch(
  [cropRect, exportOptions],
  () => {
    result.value = null
    error.value = ''
  },
  { deep: true },
)

function updateCropRect(nextRect: CropRect) {
  if (!source.value) return
  cropRect.value = clampCropRect(nextRect, source.value, activeRatio.value)
}

async function runCrop() {
  if (!source.value || !cropRect.value) return

  isProcessing.value = true
  error.value = ''

  try {
    result.value = await cropImage(source.value, cropRect.value, exportOptions.value)
    message.success(t('cropSuccess'))
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
    if (reason.message === 'INVALID_IMAGE') return t('invalidImage')
    if (reason.message === 'OUTPUT_TOO_LARGE') return t('outputTooLarge')
    if (reason.message === 'CANVAS_UNAVAILABLE') return t('canvasUnavailable')
  }

  return t('cropFailed')
}

function createDefaultExportOptions(): ExportOptions {
  return {
    format: 'original',
    quality: 92,
    background: '#ffffff',
    targetWidth: null,
    targetHeight: null,
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "zh": {
    "free": "自由",
    "errorTitle": "裁剪错误",
    "cropSuccess": "图片裁剪成功。",
    "invalidImage": "读取图片失败，请选择其他图片。",
    "outputTooLarge": "当前导出尺寸对浏览器来说过大，请减小裁剪区域或输出尺寸后重试。",
    "canvasUnavailable": "当前浏览器不支持 Canvas。",
    "cropFailed": "裁剪图片失败，请重试。"
  },
  "zh-CN": {
    "free": "自由",
    "errorTitle": "裁剪错误",
    "cropSuccess": "图片裁剪成功。",
    "invalidImage": "读取图片失败，请选择其他图片。",
    "outputTooLarge": "当前导出尺寸对浏览器来说过大，请减小裁剪区域或输出尺寸后重试。",
    "canvasUnavailable": "当前浏览器不支持 Canvas。",
    "cropFailed": "裁剪图片失败，请重试。"
  },
  "zh-TW": {
    "free": "自由",
    "errorTitle": "裁切錯誤",
    "cropSuccess": "圖片裁切成功。",
    "invalidImage": "讀取圖片失敗，請選擇其他圖片。",
    "outputTooLarge": "目前輸出尺寸對瀏覽器來說過大，請縮小裁切區域或輸出尺寸後再試。",
    "canvasUnavailable": "目前瀏覽器不支援 Canvas。",
    "cropFailed": "裁切圖片失敗，請重試。"
  },
  "zh-HK": {
    "free": "自由",
    "errorTitle": "裁切錯誤",
    "cropSuccess": "圖片裁切成功。",
    "invalidImage": "讀取圖片失敗，請選擇其他圖片。",
    "outputTooLarge": "目前輸出尺寸對瀏覽器來說過大，請縮小裁切區域或輸出尺寸後再試。",
    "canvasUnavailable": "目前瀏覽器不支援 Canvas。",
    "cropFailed": "裁切圖片失敗，請重試。"
  },
  "es": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "fr": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "de": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "it": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "ja": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "ko": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "ru": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "pt": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "ar": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "hi": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "tr": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "nl": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "sv": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "pl": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "vi": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "th": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "id": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "he": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "ms": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  },
  "no": {
    "free": "Free",
    "errorTitle": "Crop Error",
    "cropSuccess": "Image cropped successfully.",
    "invalidImage": "Failed to read this image file. Please choose another image.",
    "outputTooLarge": "This export is too large for the browser. Reduce the crop size or output size and try again.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "cropFailed": "Failed to crop the image. Please try again."
  }
}
</i18n>
