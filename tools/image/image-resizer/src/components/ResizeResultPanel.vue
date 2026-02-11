<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

    <n-grid cols="1 700:3" :x-gap="16" :y-gap="16">
      <n-grid-item>
        <n-statistic :label="t('originalSize')">
          {{ formattedOriginalSize }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="t('resizedSize')">
          {{ formattedResizedSize }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="t('sizeChange')"> {{ sizeChangePercent }}% </n-statistic>
      </n-grid-item>
    </n-grid>

    <n-grid cols="1 700:2" :x-gap="16" :y-gap="16" style="margin-top: 12px">
      <n-grid-item>
        <n-statistic :label="t('originalDimensions')">
          {{ originalDimensionLabel }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="t('resizedDimensions')">
          {{ resizedDimensionLabel }}
        </n-statistic>
      </n-grid-item>
    </n-grid>

    <n-flex style="margin-top: 16px">
      <n-button
        tag="a"
        type="primary"
        :href="downloadUrl"
        :download="result.outputName"
        style="width: 100%"
      >
        <template #icon>
          <n-icon><ArrowDownload16Regular /></n-icon>
        </template>
        {{ t('downloadImage') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize } from 'filesize'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NGrid, NGridItem, NIcon, NStatistic } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ResizeResult } from '../types'

interface Props {
  originalFile: File
  result: ResizeResult
  downloadUrl: string
}

const props = defineProps<Props>()
const { t } = useI18n({ useScope: 'local' })

const formattedOriginalSize = computed(() => filesize(props.originalFile.size) as string)
const formattedResizedSize = computed(() => filesize(props.result.blob.size) as string)

const sizeChangePercent = computed(() => {
  if (props.originalFile.size <= 0) return '0'
  const change =
    ((props.result.blob.size - props.originalFile.size) / props.originalFile.size) * 100
  return change.toFixed(1)
})

const originalDimensionLabel = computed(
  () => props.result.originalWidth + ' × ' + props.result.originalHeight,
)
const resizedDimensionLabel = computed(
  () => props.result.outputWidth + ' × ' + props.result.outputHeight,
)
</script>

<i18n lang="json">
{
  "en": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "zh": {
    "title": "调整结果",
    "originalSize": "原始大小",
    "resizedSize": "调整后大小",
    "sizeChange": "体积变化",
    "originalDimensions": "原始尺寸",
    "resizedDimensions": "调整后尺寸",
    "downloadImage": "下载调整后的图片"
  },
  "zh-CN": {
    "title": "调整结果",
    "originalSize": "原始大小",
    "resizedSize": "调整后大小",
    "sizeChange": "体积变化",
    "originalDimensions": "原始尺寸",
    "resizedDimensions": "调整后尺寸",
    "downloadImage": "下载调整后的图片"
  },
  "zh-TW": {
    "title": "調整結果",
    "originalSize": "原始大小",
    "resizedSize": "調整後大小",
    "sizeChange": "體積變化",
    "originalDimensions": "原始尺寸",
    "resizedDimensions": "調整後尺寸",
    "downloadImage": "下載調整後的圖片"
  },
  "zh-HK": {
    "title": "調整結果",
    "originalSize": "原始大小",
    "resizedSize": "調整後大小",
    "sizeChange": "體積變化",
    "originalDimensions": "原始尺寸",
    "resizedDimensions": "調整後尺寸",
    "downloadImage": "下載調整後的圖片"
  },
  "es": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "fr": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "de": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "it": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "ja": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "ko": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "ru": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "pt": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "ar": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "hi": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "tr": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "nl": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "sv": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "pl": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "vi": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "th": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "id": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "he": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "ms": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "no": {
    "title": "Resize result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  }
}
</i18n>
