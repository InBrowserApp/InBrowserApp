<template>
  <div>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="16" :y-gap="16" class="stats-grid">
      <n-statistic :label="t('cropPixels')" :value="`${cropWidth} × ${cropHeight}`" />
      <n-statistic :label="t('exportPixels')" :value="`${resolvedWidth} × ${resolvedHeight}`" />
    </n-grid>

    <n-button
      type="primary"
      :disabled="!canCrop || isProcessing"
      :loading="isProcessing"
      class="crop-button"
      @click="$emit('crop')"
    >
      <template #icon>
        <n-icon><Crop24Regular /></n-icon>
      </template>
      {{ isProcessing ? t('cropping') : t('cropImage') }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton, NGrid, NIcon, NStatistic } from 'naive-ui'
import Crop24Regular from '@vicons/fluent/Crop24Regular'
import { useI18n } from 'vue-i18n'

defineProps<{
  cropWidth: number
  cropHeight: number
  resolvedWidth: number
  resolvedHeight: number
  canCrop: boolean
  isProcessing: boolean
}>()

defineEmits<{ crop: [] }>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.stats-grid {
  margin-top: 16px;
}

.crop-button {
  width: 100%;
  margin-top: 16px;
}
</style>

<i18n lang="json">
{
  "en": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "zh": {
    "cropPixels": "裁剪像素",
    "exportPixels": "导出像素",
    "cropImage": "裁剪图片",
    "cropping": "正在裁剪图片..."
  },
  "zh-CN": {
    "cropPixels": "裁剪像素",
    "exportPixels": "导出像素",
    "cropImage": "裁剪图片",
    "cropping": "正在裁剪图片..."
  },
  "zh-TW": {
    "cropPixels": "裁切像素",
    "exportPixels": "匯出像素",
    "cropImage": "裁切圖片",
    "cropping": "正在裁切圖片..."
  },
  "zh-HK": {
    "cropPixels": "裁切像素",
    "exportPixels": "匯出像素",
    "cropImage": "裁切圖片",
    "cropping": "正在裁切圖片..."
  },
  "es": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "fr": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "de": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "it": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "ja": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "ko": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "ru": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "pt": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "ar": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "hi": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "tr": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "nl": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "sv": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "pl": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "vi": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "th": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "id": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "he": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "ms": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  },
  "no": {
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "cropImage": "Crop image",
    "cropping": "Cropping image..."
  }
}
</i18n>
