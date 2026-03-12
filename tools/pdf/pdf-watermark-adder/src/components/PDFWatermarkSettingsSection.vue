<template>
  <section data-test="settings-section">
    <ToolSection>
      <n-flex vertical :size="12">
        <n-grid cols="1 s:2" responsive="screen" :x-gap="24" :y-gap="20">
          <n-gi>
            <n-flex vertical :size="12">
              <ToolSectionHeader>{{ title }}</ToolSectionHeader>

              <n-form label-placement="top">
                <PDFWatermarkContentPanel
                  :mode-label="modeLabel"
                  :text-mode-label="textModeLabel"
                  :image-mode-label="imageModeLabel"
                  :text-content-label="textContentLabel"
                  :image-content-label="imageContentLabel"
                  :text-placeholder="textPlaceholder"
                  :upload-image-label="uploadImageLabel"
                  :replace-image-label="replaceImageLabel"
                  :clear-image-label="clearImageLabel"
                  :image-hint="imageHint"
                  :page-ranges-label="pageRangesLabel"
                  :page-ranges-placeholder="pageRangesPlaceholder"
                  :image-error-message="imageErrorMessage"
                  :text-presets="textPresets"
                  :image-file="imageFile"
                  :mode="mode"
                  :range-input="rangeInput"
                  :text="text"
                  :is-generating="isGenerating"
                  @update-mode="emit('update-mode', $event)"
                  @update-range-input="emit('update-range-input', $event)"
                  @update-text="emit('update-text', $event)"
                  @preset-text="emit('preset-text', $event)"
                  @upload-image="emit('upload-image', $event)"
                  @clear-image="emit('clear-image')"
                />

                <PDFWatermarkLayoutPanel
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
                  :font-family-label="fontFamilyLabel"
                  :font-size-label="fontSizeLabel"
                  :color-label="colorLabel"
                  :opacity-label="opacityLabel"
                  :rotation-label="rotationLabel"
                  :offset-x-label="offsetXLabel"
                  :offset-y-label="offsetYLabel"
                  :image-scale-label="imageScaleLabel"
                  :font-family-options="fontFamilyOptions"
                  :position-options="positionOptions"
                  :mode="mode"
                  :layout-mode="layoutMode"
                  :font-family="fontFamily"
                  :font-size="fontSize"
                  :color="color"
                  :opacity="opacity"
                  :rotation="rotation"
                  :position="position"
                  :offset-x="offsetX"
                  :offset-y="offsetY"
                  :tile-gap-x="tileGapX"
                  :tile-gap-y="tileGapY"
                  :image-scale="imageScale"
                  :is-generating="isGenerating"
                  @update-layout-mode="emit('update-layout-mode', $event)"
                  @update-position="emit('update-position', $event)"
                  @update-font-family="emit('update-font-family', $event)"
                  @update-font-size="emit('update-font-size', $event)"
                  @update-color="emit('update-color', $event)"
                  @update-opacity="emit('update-opacity', $event)"
                  @update-rotation="emit('update-rotation', $event)"
                  @update-offset-x="emit('update-offset-x', $event)"
                  @update-offset-y="emit('update-offset-y', $event)"
                  @apply-tile-preset="emit('apply-tile-preset', $event)"
                  @update-tile-gap-x="emit('update-tile-gap-x', $event)"
                  @update-tile-gap-y="emit('update-tile-gap-y', $event)"
                  @update-image-scale="emit('update-image-scale', $event)"
                />
              </n-form>
            </n-flex>
          </n-gi>

          <n-gi>
            <PDFWatermarkPreview
              :title="previewTitle"
              :hint="previewHint"
              :load-failed="previewLoadFailed"
              :file="file"
              :page-count="pageCount"
              :range-input="rangeInput"
              :range-error-code="rangeErrorCode"
              :mode="mode"
              :layout-mode="layoutMode"
              :text="text"
              :font-family="fontFamily"
              :font-size="fontSize"
              :color="color"
              :opacity="opacity"
              :rotation="rotation"
              :position="position"
              :offset-x="offsetX"
              :offset-y="offsetY"
              :tile-gap-x="tileGapX"
              :tile-gap-y="tileGapY"
              :image-file="imageFile"
              :image-scale="imageScale"
            />
          </n-gi>
        </n-grid>

        <n-alert v-if="rangeErrorMessage" type="error" :title="rangeErrorMessage" />
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { NAlert, NFlex, NForm, NGi, NGrid } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type {
  WatermarkFontFamily,
  WatermarkLayoutMode,
  WatermarkMode,
  WatermarkPosition,
  WatermarkTilePreset,
} from '../types'
import PDFWatermarkContentPanel from './PDFWatermarkContentPanel.vue'
import PDFWatermarkLayoutPanel from './PDFWatermarkLayoutPanel.vue'
import PDFWatermarkPreview from './PDFWatermarkPreview.vue'

defineProps<{
  title: string
  modeLabel: string
  textModeLabel: string
  imageModeLabel: string
  textContentLabel: string
  imageContentLabel: string
  textPlaceholder: string
  uploadImageLabel: string
  replaceImageLabel: string
  clearImageLabel: string
  imageHint: string
  pageRangesLabel: string
  pageRangesPlaceholder: string
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
  previewTitle: string
  previewHint: string
  previewLoadFailed: string
  rangeErrorMessage: string
  imageErrorMessage: string
  textPresets: string[]
  fontFamilyOptions: SelectOption[]
  positionOptions: SelectOption[]
  file: File | null
  pageCount: number
  imageFile: File | null
  mode: WatermarkMode
  layoutMode: WatermarkLayoutMode
  rangeInput: string
  rangeErrorCode: string
  text: string
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
  (event: 'update-mode', value: WatermarkMode): void
  (event: 'update-layout-mode', value: WatermarkLayoutMode): void
  (event: 'update-range-input', value: string): void
  (event: 'update-text', value: string): void
  (event: 'preset-text', value: string): void
  (event: 'upload-image', file: File): void
  (event: 'clear-image'): void
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
