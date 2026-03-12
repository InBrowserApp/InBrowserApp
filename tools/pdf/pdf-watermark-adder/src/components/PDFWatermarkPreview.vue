<template>
  <section data-test="preview-section">
    <ToolSectionHeader>{{ title }}</ToolSectionHeader>
    <n-flex vertical :size="12">
      <n-text depth="3" class="preview-hint">{{ hint }}</n-text>

      <div class="preview-canvas" data-test="preview-canvas">
        <div v-show="!hasPreviewError" class="preview-paper" data-test="preview-paper">
          <canvas
            ref="previewCanvasRef"
            class="preview-page-canvas"
            data-test="preview-page-canvas"
          />
        </div>

        <n-spin v-if="isRenderingPage" class="preview-spin" size="small" />

        <n-text v-if="hasPreviewError" depth="3" class="preview-error" data-test="preview-error">
          {{ loadFailed }}
        </n-text>
      </div>

      <n-pagination
        v-if="totalPreviewPages > 1"
        class="preview-pagination"
        data-test="preview-pagination"
        size="small"
        :page="previewPage"
        :page-count="totalPreviewPages"
        :simple="false"
        @update:page="setPreviewPage"
      />
    </n-flex>
  </section>
</template>

<script setup lang="ts">
import { NFlex, NPagination, NSpin, NText } from 'naive-ui'
import { ToolSectionHeader } from '@shared/ui/tool'
import type {
  WatermarkFontFamily,
  WatermarkLayoutMode,
  WatermarkMode,
  WatermarkPosition,
} from '../types'
import { usePdfWatermarkPreview } from './usePdfWatermarkPreview'

const props = defineProps<{
  title: string
  hint: string
  loadFailed: string
  file: File | null
  pageCount: number
  rangeInput: string
  rangeErrorCode: string
  mode: WatermarkMode
  layoutMode: WatermarkLayoutMode
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
  imageFile: File | null
  imageScale: number
}>()

const {
  previewCanvasRef,
  previewPage,
  totalPreviewPages,
  isRenderingPage,
  hasPreviewError,
  setPreviewPage,
} = usePdfWatermarkPreview(props)
</script>

<style scoped>
.preview-hint {
  line-height: 1.4;
}

.preview-pagination {
  max-width: 460px;
  margin: 12px auto 0;
}

.preview-canvas {
  position: relative;
  width: 100%;
  max-width: 460px;
  min-height: 220px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-paper {
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.18);
  box-shadow:
    0 16px 30px rgba(15, 23, 42, 0.18),
    0 4px 12px rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.preview-page-canvas {
  width: 100%;
  height: auto;
  display: block;
}

.preview-spin {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.64);
}

.preview-error {
  text-align: center;
  line-height: 1.4;
  padding: 16px;
}
</style>
