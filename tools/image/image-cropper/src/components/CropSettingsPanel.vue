<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('format')" :show-feedback="false">
        <n-select
          :value="exportOptions.format"
          :options="formatOptions"
          :disabled="isProcessing"
          @update:value="updateFormat"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('quality')" :show-feedback="false">
        <n-slider
          :value="exportOptions.quality"
          :min="1"
          :max="100"
          :step="1"
          :disabled="isProcessing || qualityDisabled"
          @update:value="updateQuality"
        />
      </n-form-item-gi>

      <n-form-item-gi v-if="showBackground" :label="t('background')" :show-feedback="false">
        <n-color-picker
          :value="exportOptions.background"
          :disabled="isProcessing"
          :show-alpha="false"
          @update:value="updateBackground"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('outputWidth')" :show-feedback="false">
        <n-input-number
          :value="exportOptions.targetWidth"
          :min="1"
          :disabled="isProcessing"
          style="width: 100%"
          @update:value="updateTargetWidth"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('outputHeight')" :show-feedback="false">
        <n-input-number
          :value="exportOptions.targetHeight"
          :min="1"
          :disabled="isProcessing"
          style="width: 100%"
          @update:value="updateTargetHeight"
        />
      </n-form-item-gi>
    </n-grid>

    <CropSummaryActions
      :crop-width="cropWidth"
      :crop-height="cropHeight"
      :resolved-width="resolvedWidth"
      :resolved-height="resolvedHeight"
      :can-crop="canCrop"
      :is-processing="isProcessing"
      @crop="$emit('crop')"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NColorPicker, NFormItemGi, NGrid, NInputNumber, NSelect, NSlider } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ExportOptions } from '../types'
import { isLossyOutputFormat } from '../utils/crop-image'
import CropSummaryActions from './CropSummaryActions.vue'

interface Props {
  cropWidth: number
  cropHeight: number
  sourceMimeType: string
  sourceHasAlpha: boolean
  isProcessing: boolean
  canCrop: boolean
}

const props = defineProps<Props>()
defineEmits<{ crop: [] }>()
const exportOptions = defineModel<ExportOptions>('exportOptions', { required: true })
const { t } = useI18n({ useScope: 'local' })

const formatOptions = computed<SelectOption[]>(() => [
  { label: t('formatOriginal'), value: 'original' },
  { label: 'PNG', value: 'png' },
  { label: 'JPEG', value: 'jpeg' },
  { label: 'WebP', value: 'webp' },
])

const qualityDisabled = computed(
  () => !isLossyOutputFormat(props.sourceMimeType, exportOptions.value.format),
)

const showBackground = computed(
  () =>
    props.sourceHasAlpha &&
    resolveMimeType(props.sourceMimeType, exportOptions.value.format) === 'image/jpeg',
)

const resolvedWidth = computed(() => exportOptions.value.targetWidth ?? props.cropWidth)
const resolvedHeight = computed(() => exportOptions.value.targetHeight ?? props.cropHeight)

function resolveMimeType(sourceMimeType: string, format: ExportOptions['format']) {
  if (format === 'png') return 'image/png'
  if (format === 'jpeg') return 'image/jpeg'
  if (format === 'webp') return 'image/webp'
  return sourceMimeType
}

function updateFormat(value: string | number | null) {
  if (typeof value !== 'string') return
  if (!['original', 'png', 'jpeg', 'webp'].includes(value)) return

  exportOptions.value = {
    ...exportOptions.value,
    format: value as ExportOptions['format'],
  }
}

function updateQuality(value: number) {
  exportOptions.value = {
    ...exportOptions.value,
    quality: Math.min(100, Math.max(1, Math.round(value))),
  }
}

function updateBackground(value: string) {
  exportOptions.value = {
    ...exportOptions.value,
    background: value,
  }
}

function updateTargetWidth(value: number | null) {
  if (!value) {
    exportOptions.value = {
      ...exportOptions.value,
      targetWidth: null,
      targetHeight: null,
    }
    return
  }

  const nextWidth = Math.max(1, Math.round(value))
  const nextHeight = Math.max(1, Math.round((nextWidth / props.cropWidth) * props.cropHeight))

  exportOptions.value = {
    ...exportOptions.value,
    targetWidth: nextWidth,
    targetHeight: nextHeight,
  }
}

function updateTargetHeight(value: number | null) {
  if (!value) {
    exportOptions.value = {
      ...exportOptions.value,
      targetWidth: null,
      targetHeight: null,
    }
    return
  }

  const nextHeight = Math.max(1, Math.round(value))
  const nextWidth = Math.max(1, Math.round((nextHeight / props.cropHeight) * props.cropWidth))

  exportOptions.value = {
    ...exportOptions.value,
    targetWidth: nextWidth,
    targetHeight: nextHeight,
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "zh": {
    "title": "导出设置",
    "format": "输出格式",
    "formatOriginal": "尽量保持原始格式",
    "quality": "质量",
    "background": "JPEG 背景色",
    "outputWidth": "输出宽度",
    "outputHeight": "输出高度"
  },
  "zh-CN": {
    "title": "导出设置",
    "format": "输出格式",
    "formatOriginal": "尽量保持原始格式",
    "quality": "质量",
    "background": "JPEG 背景色",
    "outputWidth": "输出宽度",
    "outputHeight": "输出高度"
  },
  "zh-TW": {
    "title": "匯出設定",
    "format": "輸出格式",
    "formatOriginal": "盡量保持原始格式",
    "quality": "品質",
    "background": "JPEG 背景色",
    "outputWidth": "輸出寬度",
    "outputHeight": "輸出高度"
  },
  "zh-HK": {
    "title": "匯出設定",
    "format": "輸出格式",
    "formatOriginal": "盡量保持原始格式",
    "quality": "品質",
    "background": "JPEG 背景色",
    "outputWidth": "輸出寬度",
    "outputHeight": "輸出高度"
  },
  "es": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "fr": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "de": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "it": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "ja": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "ko": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "ru": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "pt": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "ar": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "hi": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "tr": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "nl": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "sv": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "pl": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "vi": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "th": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "id": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "he": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "ms": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  },
  "no": {
    "title": "Export settings",
    "format": "Format",
    "formatOriginal": "Keep original when possible",
    "quality": "Quality",
    "background": "JPEG background",
    "outputWidth": "Output width",
    "outputHeight": "Output height"
  }
}
</i18n>
