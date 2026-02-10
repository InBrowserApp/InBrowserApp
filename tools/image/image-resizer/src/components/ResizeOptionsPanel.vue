<template>
  <ToolSection>
    <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>

    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="labels.width" :show-feedback="false">
        <n-input-number
          :value="options.width"
          :min="1"
          :max="100000"
          :disabled="isProcessing"
          style="width: 100%"
          @update:value="updateWidth"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="labels.height" :show-feedback="false">
        <n-input-number
          :value="options.height"
          :min="1"
          :max="100000"
          :disabled="isProcessing"
          style="width: 100%"
          @update:value="updateHeight"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="labels.algorithm" :show-feedback="false">
        <n-select
          :value="options.algorithm"
          :options="algorithms"
          :disabled="isProcessing"
          @update:value="updateAlgorithm"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="labels.outputFormat" :show-feedback="false">
        <n-select
          :value="options.outputFormat"
          :options="formats"
          :disabled="isProcessing"
          @update:value="updateFormat"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="labels.quality" :show-feedback="false" :span="2">
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

    <n-flex vertical :size="12">
      <n-switch
        :value="options.keepAspectRatio"
        :disabled="isProcessing"
        @update:value="updateKeepAspectRatio"
      >
        <template #checked>{{ labels.keepAspectRatio }}</template>
        <template #unchecked>{{ labels.keepAspectRatio }}</template>
      </n-switch>

      <n-switch
        :value="options.allowUpscale"
        :disabled="isProcessing"
        @update:value="updateAllowUpscale"
      >
        <template #checked>{{ labels.allowUpscale }}</template>
        <template #unchecked>{{ labels.allowUpscale }}</template>
      </n-switch>

      <n-button
        type="primary"
        :loading="isProcessing"
        :disabled="isProcessing"
        @click="$emit('resize')"
      >
        {{ isProcessing ? labels.resizing : labels.resize }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NButton,
  NFlex,
  NFormItemGi,
  NGrid,
  NInputNumber,
  NSelect,
  NSlider,
  NSwitch,
} from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageDimensions, ResizeAlgorithm, ResizeOptions, ResizeOutputFormat } from '../types'

interface OptionLabels {
  title: string
  width: string
  height: string
  keepAspectRatio: string
  allowUpscale: string
  algorithm: string
  outputFormat: string
  quality: string
  resize: string
  resizing: string
}

interface Props {
  sourceDimensions: ImageDimensions | null
  algorithms: SelectOption[]
  formats: SelectOption[]
  labels: OptionLabels
  isProcessing: boolean
}

const props = defineProps<Props>()

defineEmits<{
  resize: []
}>()

const options = defineModel<ResizeOptions>('options', { required: true })

const qualityDisabled = computed(() => options.value.outputFormat === 'png')

function normalizeDimension(value: number | null | undefined, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.max(1, Math.round(value ?? fallback))
}

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

function updateAllowUpscale(value: boolean) {
  options.value = {
    ...options.value,
    allowUpscale: value,
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

function isResizeAlgorithm(value: string): value is ResizeAlgorithm {
  return (
    value === 'browser-high' ||
    value === 'bicubic' ||
    value === 'bilinear' ||
    value === 'lanczos3' ||
    value === 'nearest'
  )
}

function isResizeOutputFormat(value: string): value is ResizeOutputFormat {
  return value === 'original' || value === 'png' || value === 'jpeg' || value === 'webp'
}
</script>
