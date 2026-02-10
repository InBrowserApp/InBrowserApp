<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
      <n-gi>
        <ImageResizeInput
          v-model:file="imageFile"
          :dimensions="sourceDimensions"
          :labels="inputLabels"
        />
      </n-gi>

      <n-gi>
        <ResizeOptionsPanel
          v-if="imageFile"
          v-model:options="options"
          :source-dimensions="sourceDimensions"
          :algorithms="algorithmOptions"
          :formats="formatOptions"
          :labels="optionLabels"
          :is-processing="isProcessing"
          @resize="runResize"
        />

        <ResizeResultPanel
          v-if="imageFile && result && downloadUrl"
          :original-file="imageFile"
          :result="result"
          :download-url="downloadUrl"
          :labels="resultLabels"
        />
      </n-gi>
    </n-grid>

    <ToolSection>
      <ToolSectionHeader>{{ algorithmHintTitle }}</ToolSectionHeader>
      <n-flex vertical :size="8">
        <n-text depth="3">{{ algorithmHintBrowser }}</n-text>
        <n-text depth="3">{{ algorithmHintBicubic }}</n-text>
        <n-text depth="3">{{ algorithmHintBilinear }}</n-text>
        <n-text depth="3">{{ algorithmHintLanczos3 }}</n-text>
        <n-text depth="3">{{ algorithmHintNearest }}</n-text>
      </n-flex>
    </ToolSection>

    <ToolSection v-if="error">
      <n-alert type="warning" :title="errorTitle" :show-icon="false">
        {{ error }}
      </n-alert>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStorage, useObjectUrl } from '@vueuse/core'
import { NAlert, NFlex, NGi, NGrid, NText, useMessage } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import * as toolInfo from './info'
import { ImageResizeInput, ResizeOptionsPanel, ResizeResultPanel } from './components'
import type { ImageDimensions, ResizeAlgorithm, ResizeOptions, ResizeResult } from './types'
import { imageResizeAlgorithms, resizeImage } from './utils/resize-image'

const message = useMessage()

const imageFile = ref<File | null>(null)
const sourceDimensions = ref<ImageDimensions | null>(null)
const isProcessing = ref(false)
const error = ref('')
const result = ref<ResizeResult | null>(null)

const options = useStorage<ResizeOptions>('tools:image-resizer:options', {
  width: 1280,
  height: 720,
  keepAspectRatio: true,
  allowUpscale: false,
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

    if (options.value.keepAspectRatio) {
      const ratio = dimensions.height / dimensions.width
      options.value = {
        ...options.value,
        height: Math.max(1, Math.round(options.value.width * ratio)),
      }
    }
  } catch {
    error.value = invalidImageText
  }
})

const algorithmOptions = computed<SelectOption[]>(() => {
  const labelMap: Record<ResizeAlgorithm, string> = {
    'browser-high': algorithmLabelBrowserHigh,
    bicubic: algorithmLabelBicubic,
    bilinear: algorithmLabelBilinear,
    lanczos3: algorithmLabelLanczos3,
    nearest: algorithmLabelNearest,
  }

  return imageResizeAlgorithms.map((item) => ({
    value: item.value,
    label: labelMap[item.value],
  }))
})

const formatOptions = computed<SelectOption[]>(() => [
  { value: 'original', label: formatLabelOriginal },
  { value: 'png', label: formatLabelPng },
  { value: 'jpeg', label: formatLabelJpeg },
  { value: 'webp', label: formatLabelWebp },
])

const inputLabels = {
  uploadTitle: 'Upload image',
  dropHint: 'Click or drag to upload image',
  supportedFormatsHint: 'Supports PNG, JPEG, WebP and most browser image formats',
  removeFile: 'Remove file',
  onlyOneFile: 'Only one file can be uploaded',
  invalidFileType: 'Please select a valid image file',
  previewAlt: 'Selected image preview',
  dimensions: 'Dimensions',
}

const optionLabels = {
  title: 'Resize settings',
  width: 'Width',
  height: 'Height',
  keepAspectRatio: 'Keep aspect ratio',
  allowUpscale: 'Allow upscale',
  algorithm: 'Algorithm',
  outputFormat: 'Output format',
  quality: 'Quality',
  resize: 'Resize image',
  resizing: 'Resizing image...',
}

const resultLabels = {
  title: 'Resize result',
  originalSize: 'Original size',
  resizedSize: 'Resized size',
  sizeChange: 'Size change',
  originalDimensions: 'Original dimensions',
  resizedDimensions: 'Resized dimensions',
  downloadImage: 'Download resized image',
}

const errorTitle = 'Resize error'
const invalidImageText = 'Failed to read this image file. Please choose another image.'
const resizeSuccessText = 'Image resized successfully.'
const resizeFailedText = 'Image resize failed. Please try another setting or file.'

const algorithmLabelBrowserHigh = 'Browser high quality'
const algorithmLabelBicubic = 'Bicubic interpolation'
const algorithmLabelBilinear = 'Bilinear interpolation'
const algorithmLabelLanczos3 = 'Lanczos filter (radius 3)'
const algorithmLabelNearest = 'Nearest neighbor'

const formatLabelOriginal = 'Keep original'
const formatLabelPng = 'PNG'
const formatLabelJpeg = 'JPEG'
const formatLabelWebp = 'WebP'

const algorithmHintTitle = 'Algorithm guide'
const algorithmHintBrowser =
  'Browser high quality: best default for photos and general use. Fast and smooth in most browsers.'
const algorithmHintBicubic =
  'Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.'
const algorithmHintBilinear =
  'Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.'
const algorithmHintLanczos3 =
  'Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.'
const algorithmHintNearest =
  'Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites.'

async function runResize() {
  if (!imageFile.value) return

  isProcessing.value = true
  error.value = ''

  try {
    result.value = await resizeImage(imageFile.value, options.value)
    message.success(resizeSuccessText)
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
    if (reason.message === 'INVALID_IMAGE') return invalidImageText
  }
  return resizeFailedText
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
