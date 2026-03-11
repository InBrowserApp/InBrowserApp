<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

    <n-flex vertical :size="16">
      <n-image v-if="previewUrl" :src="previewUrl" :alt="t('previewAlt')" width="240" />

      <n-grid cols="1 s:2" responsive="screen" :x-gap="16" :y-gap="16">
        <n-statistic :label="t('originalSize')" :value="formattedOriginalSize" />
        <n-statistic :label="t('outputSize')" :value="formattedOutputSize" />
        <n-statistic
          :label="t('cropPixels')"
          :value="`${result.cropWidth} × ${result.cropHeight}`"
        />
        <n-statistic
          :label="t('exportPixels')"
          :value="`${result.outputWidth} × ${result.outputHeight}`"
        />
      </n-grid>

      <n-button
        tag="a"
        type="primary"
        :href="previewUrl ?? undefined"
        :download="result.outputName"
        :disabled="!previewUrl"
      >
        <template #icon>
          <n-icon><ArrowDownload24Regular /></n-icon>
        </template>
        {{ t('download') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import { NButton, NFlex, NGrid, NIcon, NImage, NStatistic } from 'naive-ui'
import ArrowDownload24Regular from '@vicons/fluent/ArrowDownload24Regular'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { CropResult } from '../types'

const props = defineProps<{
  originalFile: File
  result: CropResult
}>()

const { t } = useI18n({ useScope: 'local' })

const previewUrl = useObjectUrl(computed(() => props.result.blob))
const formattedOriginalSize = computed(() => filesize(props.originalFile.size) as string)
const formattedOutputSize = computed(() => filesize(props.result.blob.size) as string)
</script>

<i18n lang="json">
{
  "en": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "zh": {
    "title": "裁剪结果",
    "previewAlt": "裁剪后图片预览",
    "originalSize": "原始大小",
    "outputSize": "导出大小",
    "cropPixels": "裁剪像素",
    "exportPixels": "导出像素",
    "download": "下载裁剪后的图片"
  },
  "zh-CN": {
    "title": "裁剪结果",
    "previewAlt": "裁剪后图片预览",
    "originalSize": "原始大小",
    "outputSize": "导出大小",
    "cropPixels": "裁剪像素",
    "exportPixels": "导出像素",
    "download": "下载裁剪后的图片"
  },
  "zh-TW": {
    "title": "裁切結果",
    "previewAlt": "裁切後圖片預覽",
    "originalSize": "原始大小",
    "outputSize": "輸出大小",
    "cropPixels": "裁切像素",
    "exportPixels": "匯出像素",
    "download": "下載裁切後圖片"
  },
  "zh-HK": {
    "title": "裁切結果",
    "previewAlt": "裁切後圖片預覽",
    "originalSize": "原始大小",
    "outputSize": "輸出大小",
    "cropPixels": "裁切像素",
    "exportPixels": "匯出像素",
    "download": "下載裁切後圖片"
  },
  "es": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "fr": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "de": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "it": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "ja": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "ko": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "ru": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "pt": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "ar": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "hi": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "tr": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "nl": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "sv": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "pl": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "vi": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "th": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "id": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "he": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "ms": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  },
  "no": {
    "title": "Crop result",
    "previewAlt": "Cropped image preview",
    "originalSize": "Original size",
    "outputSize": "Output size",
    "cropPixels": "Crop pixels",
    "exportPixels": "Export pixels",
    "download": "Download cropped image"
  }
}
</i18n>
