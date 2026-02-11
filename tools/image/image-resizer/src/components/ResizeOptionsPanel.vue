<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('width')" :show-feedback="false">
        <n-input-number
          :value="options.width"
          :min="1"
          :max="100000"
          :disabled="isProcessing"
          style="width: 100%"
          @update:value="updateWidth"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('height')" :show-feedback="false">
        <n-input-number
          :value="options.height"
          :min="1"
          :max="100000"
          :disabled="isProcessing"
          style="width: 100%"
          @update:value="updateHeight"
        />
      </n-form-item-gi>

      <n-form-item-gi :show-feedback="false">
        <template #label>
          <n-flex align="center" :size="6">
            <span>{{ t('algorithm') }}</span>
            <AlgorithmInfoPopover />
          </n-flex>
        </template>

        <n-select
          :value="options.algorithm"
          :options="algorithms"
          :disabled="isProcessing"
          @update:value="updateAlgorithm"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('outputFormat')" :show-feedback="false">
        <n-select
          :value="options.outputFormat"
          :options="formats"
          :disabled="isProcessing"
          @update:value="updateFormat"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('keepAspectRatio')" :show-feedback="false" :span="2">
        <n-switch
          :value="options.keepAspectRatio"
          :disabled="isProcessing"
          @update:value="updateKeepAspectRatio"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('quality')" :show-feedback="false" :span="2">
        <n-slider
          :value="options.quality"
          :min="1"
          :max="100"
          :step="1"
          :disabled="isProcessing || qualityDisabled"
          @update:value="updateQuality"
        />
      </n-form-item-gi>
    </n-grid>

    <div style="margin-top: 12px">
      <n-button
        type="primary"
        :loading="isProcessing"
        :disabled="isProcessing || !hasImage"
        @click="$emit('resize')"
      >
        <template #icon>
          <n-icon><ResizeSmall20Regular /></n-icon>
        </template>
        {{ isProcessing ? t('resizing') : t('resize') }}
      </n-button>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInputNumber,
  NSelect,
  NSlider,
  NSwitch,
} from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import ResizeSmall20Regular from '@vicons/fluent/ResizeSmall20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageDimensions, ResizeOptions } from '../types'
import {
  isResizeAlgorithm,
  isResizeOutputFormat,
  normalizeDimension,
} from '../utils/resize-options'
import AlgorithmInfoPopover from './AlgorithmInfoPopover.vue'

interface Props {
  sourceDimensions: ImageDimensions | null
  algorithms: SelectOption[]
  formats: SelectOption[]
  isProcessing: boolean
  hasImage: boolean
}

const props = defineProps<Props>()
defineEmits<{
  resize: []
}>()

const { t } = useI18n({ useScope: 'local' })
const options = defineModel<ResizeOptions>('options', { required: true })

const qualityDisabled = computed(() => options.value.outputFormat === 'png')

function updateWidth(value: number | null) {
  const nextWidth = normalizeDimension(value, options.value.width)
  if (!options.value.keepAspectRatio || !props.sourceDimensions) {
    options.value = { ...options.value, width: nextWidth }
    return
  }

  const ratio = props.sourceDimensions.height / props.sourceDimensions.width
  const nextHeight = Math.max(1, Math.round(nextWidth * ratio))

  options.value = {
    ...options.value,
    width: nextWidth,
    height: nextHeight,
  }
}

function updateHeight(value: number | null) {
  const nextHeight = normalizeDimension(value, options.value.height)
  if (!options.value.keepAspectRatio || !props.sourceDimensions) {
    options.value = { ...options.value, height: nextHeight }
    return
  }

  const ratio = props.sourceDimensions.width / props.sourceDimensions.height
  const nextWidth = Math.max(1, Math.round(nextHeight * ratio))

  options.value = {
    ...options.value,
    width: nextWidth,
    height: nextHeight,
  }
}

function updateKeepAspectRatio(value: boolean) {
  if (!value || !props.sourceDimensions) {
    options.value = {
      ...options.value,
      keepAspectRatio: value,
    }
    return
  }

  const ratio = props.sourceDimensions.height / props.sourceDimensions.width
  const nextHeight = Math.max(1, Math.round(options.value.width * ratio))

  options.value = {
    ...options.value,
    keepAspectRatio: true,
    height: nextHeight,
  }
}

function updateAlgorithm(value: string | number | null) {
  if (typeof value !== 'string') return
  if (!isResizeAlgorithm(value)) return

  options.value = {
    ...options.value,
    algorithm: value,
  }
}

function updateFormat(value: string | number | null) {
  if (typeof value !== 'string') return
  if (!isResizeOutputFormat(value)) return

  options.value = {
    ...options.value,
    outputFormat: value,
  }
}

function updateQuality(value: number) {
  options.value = {
    ...options.value,
    quality: normalizeDimension(value, options.value.quality),
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "zh": {
    "title": "调整设置",
    "width": "宽度",
    "height": "高度",
    "keepAspectRatio": "保持比例",
    "algorithm": "算法",
    "outputFormat": "输出格式",
    "quality": "质量",
    "resize": "调整图片",
    "resizing": "正在调整图片..."
  },
  "zh-CN": {
    "title": "调整设置",
    "width": "宽度",
    "height": "高度",
    "keepAspectRatio": "保持比例",
    "algorithm": "算法",
    "outputFormat": "输出格式",
    "quality": "质量",
    "resize": "调整图片",
    "resizing": "正在调整图片..."
  },
  "zh-TW": {
    "title": "調整設定",
    "width": "寬度",
    "height": "高度",
    "keepAspectRatio": "保持比例",
    "algorithm": "演算法",
    "outputFormat": "輸出格式",
    "quality": "品質",
    "resize": "調整圖片",
    "resizing": "正在調整圖片..."
  },
  "zh-HK": {
    "title": "調整設定",
    "width": "寬度",
    "height": "高度",
    "keepAspectRatio": "保持比例",
    "algorithm": "演算法",
    "outputFormat": "輸出格式",
    "quality": "品質",
    "resize": "調整圖片",
    "resizing": "正在調整圖片..."
  },
  "es": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "fr": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "de": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "it": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "ja": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "ko": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "ru": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "pt": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "ar": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "hi": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "tr": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "nl": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "sv": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "pl": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "vi": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "th": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "id": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "he": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "ms": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "no": {
    "title": "Resize settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  }
}
</i18n>
