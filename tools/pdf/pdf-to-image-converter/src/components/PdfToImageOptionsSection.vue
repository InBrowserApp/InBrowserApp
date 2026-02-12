<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('settingsTitle') }}</ToolSectionHeader>

    <n-flex vertical :size="16">
      <n-form label-placement="top" show-feedback>
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
    "format": "Output format",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Preset",
    "quality": "Quality"
  },
  "zh": {
    "settingsTitle": "导出选项",
    "format": "输出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "预设",
    "quality": "质量"
  },
  "zh-CN": {
    "settingsTitle": "导出选项",
    "format": "输出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "预设",
    "quality": "质量"
  },
  "zh-TW": {
    "settingsTitle": "匯出選項",
    "format": "輸出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "預設",
    "quality": "品質"
  },
  "zh-HK": {
    "settingsTitle": "匯出選項",
    "format": "輸出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "預設",
    "quality": "品質"
  },
  "es": {
    "settingsTitle": "Opciones de exportación",
    "format": "Formato de salida",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Preajuste",
    "quality": "Calidad"
  },
  "fr": {
    "settingsTitle": "Options d'exportation",
    "format": "Format de sortie",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Préréglage",
    "quality": "Qualité"
  },
  "de": {
    "settingsTitle": "Exportoptionen",
    "format": "Ausgabeformat",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Voreinstellung",
    "quality": "Qualität"
  },
  "it": {
    "settingsTitle": "Opzioni di esportazione",
    "format": "Formato di output",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Preimpostazione",
    "quality": "Qualità"
  },
  "ja": {
    "settingsTitle": "エクスポートオプション",
    "format": "出力形式",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "プリセット",
    "quality": "品質"
  },
  "ko": {
    "settingsTitle": "내보내기 옵션",
    "format": "출력 형식",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "프리셋",
    "quality": "품질"
  },
  "ru": {
    "settingsTitle": "Параметры экспорта",
    "format": "Формат вывода",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Пресет",
    "quality": "Качество"
  },
  "pt": {
    "settingsTitle": "Opções de exportação",
    "format": "Formato de saída",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Predefinição",
    "quality": "Qualidade"
  },
  "ar": {
    "settingsTitle": "خيارات التصدير",
    "format": "تنسيق الإخراج",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "إعداد مسبق",
    "quality": "الجودة"
  },
  "hi": {
    "settingsTitle": "निर्यात विकल्प",
    "format": "आउटपुट प्रारूप",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "प्रीसेट",
    "quality": "गुणवत्ता"
  },
  "tr": {
    "settingsTitle": "Dışa aktarma seçenekleri",
    "format": "Çıkış formatı",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Ön ayar",
    "quality": "Kalite"
  },
  "nl": {
    "settingsTitle": "Exportopties",
    "format": "Uitvoerformaat",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Voorinstelling",
    "quality": "Kwaliteit"
  },
  "sv": {
    "settingsTitle": "Exportalternativ",
    "format": "Utdataformat",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Förinställning",
    "quality": "Kvalitet"
  },
  "pl": {
    "settingsTitle": "Opcje eksportu",
    "format": "Format wyjściowy",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Ustawienie wstępne",
    "quality": "Jakość"
  },
  "vi": {
    "settingsTitle": "Tùy chọn xuất",
    "format": "Định dạng đầu ra",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Cài đặt sẵn",
    "quality": "Chất lượng"
  },
  "th": {
    "settingsTitle": "ตัวเลือกการส่งออก",
    "format": "รูปแบบผลลัพธ์",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "ค่าที่ตั้งไว้ล่วงหน้า",
    "quality": "คุณภาพ"
  },
  "id": {
    "settingsTitle": "Opsi ekspor",
    "format": "Format output",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Praset",
    "quality": "Kualitas"
  },
  "he": {
    "settingsTitle": "אפשרויות ייצוא",
    "format": "פורמט פלט",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "הגדרה קבועה מראש",
    "quality": "איכות"
  },
  "ms": {
    "settingsTitle": "Pilihan eksport",
    "format": "Format output",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Pratetap",
    "quality": "Kualiti"
  },
  "no": {
    "settingsTitle": "Eksportalternativer",
    "format": "Utdataformat",
    "formatPng": "PNG",
    "formatJpeg": "JPG",
    "formatWebp": "WebP",
    "dpi": "DPI",
    "preset": "Forhåndsinnstilling",
    "quality": "Kvalitet"
  }
}
</i18n>
