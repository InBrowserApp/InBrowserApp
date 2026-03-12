<template>
  <n-gi :span="12">
    <n-form-item :label="opacityLabel" :show-feedback="false">
      <n-slider
        data-test="opacity-slider"
        :value="opacity"
        :min="0"
        :max="100"
        :step="1"
        :disabled="isGenerating"
        :format-tooltip="formatPercentTooltip"
        @update:value="emit('update-opacity', $event)"
      />
    </n-form-item>
  </n-gi>

  <n-gi :span="12">
    <n-form-item :label="rotationLabel" :show-feedback="false">
      <n-slider
        data-test="rotation-slider"
        :value="rotation"
        :min="-180"
        :max="180"
        :step="1"
        :disabled="isGenerating"
        :format-tooltip="formatRotationTooltip"
        @update:value="emit('update-rotation', $event)"
      />
    </n-form-item>
  </n-gi>

  <template v-if="mode === 'text'">
    <n-gi :span="12">
      <n-form-item :label="fontFamilyLabel" :show-feedback="false">
        <n-select
          data-test="font-family-select"
          :value="fontFamily"
          :options="fontFamilyOptions"
          :render-label="renderFontFamilyOption"
          :style="{ fontFamily: resolvePreviewFontFamily(fontFamily) }"
          :disabled="isGenerating"
          @update:value="handleFontFamilyChange"
        />
      </n-form-item>
    </n-gi>

    <n-gi :span="12">
      <n-form-item :label="fontSizeLabel" :show-feedback="false">
        <n-input-number
          data-test="font-size-input"
          style="width: 100%"
          :value="fontSize"
          :min="8"
          :max="240"
          :step="1"
          :disabled="isGenerating"
          @update:value="emit('update-font-size', $event)"
        />
      </n-form-item>
    </n-gi>

    <n-gi :span="24">
      <n-form-item :label="colorLabel" :show-feedback="false">
        <n-color-picker
          data-test="color-picker"
          :value="color"
          :modes="['hex']"
          :show-alpha="false"
          :disabled="isGenerating"
          @update:value="emit('update-color', $event)"
        />
      </n-form-item>
    </n-gi>
  </template>

  <n-gi v-else :span="12">
    <n-form-item :label="imageScaleLabel" :show-feedback="false">
      <n-input-number
        data-test="image-scale-input"
        style="width: 100%"
        :value="imageScale"
        :min="5"
        :max="100"
        :step="1"
        :disabled="isGenerating"
        @update:value="emit('update-image-scale', $event)"
      />
    </n-form-item>
  </n-gi>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { SelectOption } from 'naive-ui'
import { NColorPicker, NFormItem, NGi, NInputNumber, NSelect, NSlider } from 'naive-ui'
import type { WatermarkFontFamily, WatermarkMode } from '../types'
import { resolvePreviewFontFamily } from '../utils/watermark-font'

defineProps<{
  mode: WatermarkMode
  fontFamilyLabel: string
  fontSizeLabel: string
  colorLabel: string
  opacityLabel: string
  rotationLabel: string
  imageScaleLabel: string
  fontFamilyOptions: SelectOption[]
  fontFamily: WatermarkFontFamily
  fontSize: number
  color: string
  opacity: number
  rotation: number
  imageScale: number
  isGenerating: boolean
}>()

const emit = defineEmits<{
  (event: 'update-font-family', value: WatermarkFontFamily): void
  (event: 'update-font-size', value: number | null): void
  (event: 'update-color', value: string): void
  (event: 'update-opacity', value: number | null): void
  (event: 'update-rotation', value: number | null): void
  (event: 'update-image-scale', value: number | null): void
}>()

const renderFontFamilyOption = (option: SelectOption) => {
  const value = option.value
  if (value !== 'sans-serif' && value !== 'serif' && value !== 'monospace') {
    return String(option.label ?? value ?? '')
  }

  return h(
    'span',
    {
      style: {
        fontFamily: resolvePreviewFontFamily(value),
      },
    },
    String(option.label ?? value),
  )
}

const handleFontFamilyChange = (value: string): void => {
  if (value === 'serif' || value === 'sans-serif' || value === 'monospace') {
    emit('update-font-family', value)
  }
}

const formatPercentTooltip = (value: number): string => `${value}%`

const formatRotationTooltip = (value: number): string => `${value}°`
</script>
