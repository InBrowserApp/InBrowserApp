<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('settingsTitle') }}</ToolSectionHeader>

    <n-flex vertical :size="16">
      <n-form label-placement="top" :show-feedback="false">
        <n-form-item :label="t('format')">
          <n-select
            :value="format"
            :options="formatOptions"
            :disabled="isRendering || isExporting"
            @update:value="handleFormatChange"
          />
        </n-form-item>

        <n-form-item :label="t('dpi')">
          <n-input-number
            :value="dpi"
            :min="minDpi"
            :max="maxDpi"
            :step="1"
            :disabled="isRendering || isExporting"
            style="width: 100%"
            @update:value="handleDpiChange"
          />
        </n-form-item>

        <n-form-item :label="t('preset')">
          <n-flex :size="8" wrap>
            <n-button
              v-for="presetValue in dpiPresets"
              :key="presetValue"
              size="small"
              tertiary
              :type="dpi === presetValue ? 'primary' : 'default'"
              :disabled="isRendering || isExporting"
              @click="setDpiPreset(presetValue)"
            >
              {{ presetValue }}
            </n-button>
          </n-flex>
        </n-form-item>

        <n-form-item v-if="showQuality" :label="t('quality')">
          <n-slider
            :value="quality"
            :min="0.1"
            :max="1"
            :step="0.01"
            :disabled="isRendering || isExporting"
            :format-tooltip="formatQuality"
            @update:value="handleQualityChange"
          />
        </n-form-item>
      </n-form>

      <PdfToImageExportActions
        :num-pages="numPages"
        :has-current-image="hasCurrentImage"
        :is-rendering="isRendering"
        :is-exporting="isExporting"
        :export-progress="exportProgress"
        :current-download-url="currentDownloadUrl"
        :current-download-name="currentDownloadName"
        :zip-download-url="zipDownloadUrl"
        :zip-download-name="zipDownloadName"
        @export-all="emit('export-all')"
      />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NFlex, NForm, NFormItem, NInputNumber, NSlider, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageFormat } from '../types'
import { DPI_PRESETS, MAX_DPI, MIN_DPI } from '../utils/dpi'
import { shouldUseQuality } from '../utils/mime'
import PdfToImageExportActions from './PdfToImageExportActions.vue'

const props = defineProps<{
  format: ImageFormat
  dpi: number
  quality: number
  numPages: number
  hasCurrentImage: boolean
  isRendering: boolean
  isExporting: boolean
  exportProgress: number
  currentDownloadUrl: string | null
  currentDownloadName: string
  zipDownloadUrl: string | null
  zipDownloadName: string
}>()

const emit = defineEmits<{
  (event: 'update:format', value: ImageFormat): void
  (event: 'update:dpi', value: number): void
  (event: 'update:quality', value: number): void
  (event: 'export-all'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const minDpi = MIN_DPI
const maxDpi = MAX_DPI
const dpiPresets = DPI_PRESETS

const showQuality = computed(() => shouldUseQuality(props.format))

const formatOptions = computed(() => [
  { label: t('formatPng'), value: 'png' },
  { label: t('formatJpeg'), value: 'jpeg' },
  { label: t('formatWebp'), value: 'webp' },
])

function formatQuality(value: number): string {
  return `${Math.round(value * 100)}%`
}

function handleFormatChange(value: ImageFormat): void {
  emit('update:format', value)
}

function handleDpiChange(value: number | null): void {
  if (value === null) return
  emit('update:dpi', value)
}

function setDpiPreset(value: number): void {
  emit('update:dpi', value)
}

function handleQualityChange(value: number): void {
  emit('update:quality', value)
}
</script>

<i18n lang="json">
{
  "en": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "zh": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "zh-CN": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "zh-TW": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "zh-HK": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "es": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "fr": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "de": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "it": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "ja": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "ko": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "ru": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "pt": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "ar": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "hi": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "tr": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "nl": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "sv": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "pl": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "vi": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "th": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "id": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "he": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "ms": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  },
  "no": {
    "settingsTitle": "Export Options",
    "format": "Format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Presets",
    "quality": "Quality"
  }
}
</i18n>
