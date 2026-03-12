<template>
  <n-grid :cols="24" :x-gap="12" :y-gap="12">
    <PDFWatermarkLayoutModeFields
      :layout-label="layoutLabel"
      :layout-single-label="layoutSingleLabel"
      :layout-tile-label="layoutTileLabel"
      :tile-preset-label="tilePresetLabel"
      :tile-preset-sparse-label="tilePresetSparseLabel"
      :tile-preset-medium-label="tilePresetMediumLabel"
      :tile-preset-dense-label="tilePresetDenseLabel"
      :tile-gap-hint="tileGapHint"
      :tile-gap-x-label="tileGapXLabel"
      :tile-gap-y-label="tileGapYLabel"
      :position-label="positionLabel"
      :offset-x-label="offsetXLabel"
      :offset-y-label="offsetYLabel"
      :position-options="positionOptions"
      :layout-mode="layoutMode"
      :position="position"
      :offset-x="offsetX"
      :offset-y="offsetY"
      :tile-gap-x="tileGapX"
      :tile-gap-y="tileGapY"
      :is-generating="isGenerating"
      @update-layout-mode="emit('update-layout-mode', $event)"
      @update-position="emit('update-position', $event)"
      @update-offset-x="emit('update-offset-x', $event)"
      @update-offset-y="emit('update-offset-y', $event)"
      @apply-tile-preset="emit('apply-tile-preset', $event)"
      @update-tile-gap-x="emit('update-tile-gap-x', $event)"
      @update-tile-gap-y="emit('update-tile-gap-y', $event)"
    />

    <PDFWatermarkAppearanceFields
      :mode="mode"
      :font-family-label="fontFamilyLabel"
      :font-size-label="fontSizeLabel"
      :color-label="colorLabel"
      :opacity-label="opacityLabel"
      :rotation-label="rotationLabel"
      :image-scale-label="imageScaleLabel"
      :font-family-options="fontFamilyOptions"
      :font-family="fontFamily"
      :font-size="fontSize"
      :color="color"
      :opacity="opacity"
      :rotation="rotation"
      :image-scale="imageScale"
      :is-generating="isGenerating"
      @update-font-family="emit('update-font-family', $event)"
      @update-font-size="emit('update-font-size', $event)"
      @update-color="emit('update-color', $event)"
      @update-opacity="emit('update-opacity', $event)"
      @update-rotation="emit('update-rotation', $event)"
      @update-image-scale="emit('update-image-scale', $event)"
    />
  </n-grid>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { NGrid } from 'naive-ui'
import type {
  WatermarkFontFamily,
  WatermarkLayoutMode,
  WatermarkMode,
  WatermarkPosition,
  WatermarkTilePreset,
} from '../types'
import PDFWatermarkAppearanceFields from './PDFWatermarkAppearanceFields.vue'
import PDFWatermarkLayoutModeFields from './PDFWatermarkLayoutModeFields.vue'

defineProps<{
  layoutLabel: string
  layoutSingleLabel: string
  layoutTileLabel: string
  tilePresetLabel: string
  tilePresetSparseLabel: string
  tilePresetMediumLabel: string
  tilePresetDenseLabel: string
  tileGapHint: string
  tileGapXLabel: string
  tileGapYLabel: string
  positionLabel: string
  fontFamilyLabel: string
  fontSizeLabel: string
  colorLabel: string
  opacityLabel: string
  rotationLabel: string
  offsetXLabel: string
  offsetYLabel: string
  imageScaleLabel: string
  fontFamilyOptions: SelectOption[]
  positionOptions: SelectOption[]
  mode: WatermarkMode
  layoutMode: WatermarkLayoutMode
  fontFamily: WatermarkFontFamily
  fontSize: number
  color: string
  opacity: number
  rotation: number
  position: WatermarkPosition
  offsetX: number
  offsetY: number
  tileGapX: number
  tileGapY: number
  imageScale: number
  isGenerating: boolean
}>()

const emit = defineEmits<{
  (event: 'update-layout-mode', value: WatermarkLayoutMode): void
  (event: 'update-position', value: WatermarkPosition): void
  (event: 'update-font-family', value: WatermarkFontFamily): void
  (event: 'update-font-size', value: number | null): void
  (event: 'update-color', value: string): void
  (event: 'update-opacity', value: number | null): void
  (event: 'update-rotation', value: number | null): void
  (event: 'update-offset-x', value: number | null): void
  (event: 'update-offset-y', value: number | null): void
  (event: 'apply-tile-preset', value: WatermarkTilePreset): void
  (event: 'update-tile-gap-x', value: number | null): void
  (event: 'update-tile-gap-y', value: number | null): void
  (event: 'update-image-scale', value: number | null): void
}>()
</script>
