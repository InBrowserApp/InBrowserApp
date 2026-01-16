<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSection>
      <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
      <template v-if="!originalFile">
        <n-upload
          accept=".svg,image/svg+xml"
          :max="1"
          :default-upload="false"
          @before-upload="handleBeforeUpload"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <CloudArrowUp24Regular />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">{{ t('dragDropOrClick') }}</n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">{{ t('svgFilesOnly') }}</n-p>
          </n-upload-dragger>
        </n-upload>
      </template>
      <template v-else>
        <n-flex vertical :size="16">
          <n-flex align="center" :size="16">
            <div class="preview-box preview-box--small">
              <img
                v-if="originalPreviewUrl"
                :src="originalPreviewUrl"
                alt="SVG preview"
                class="preview-image"
              />
            </div>
            <n-flex vertical :size="4">
              <n-text strong>{{ originalFile.name }}</n-text>
              <n-text depth="3">{{ originalSizeLabel }}</n-text>
              <n-text v-show="originalDimensionsLabel" depth="3">
                {{ t('dimensions') }}: {{ originalDimensionsLabel }}
              </n-text>
              <n-button size="small" @click="handleClearFile">
                <template #icon>
                  <n-icon><Delete20Regular /></n-icon>
                </template>
                {{ t('removeFile') }}
              </n-button>
            </n-flex>
          </n-flex>
        </n-flex>
      </template>
    </ToolSection>

    <ToolSection v-show="svgText">
      <ToolSectionHeader>{{ t('settingsTitle') }}</ToolSectionHeader>
      <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="12">
        <n-form-item-gi :label="t('format')" :show-feedback="false">
          <n-select :value="format" :options="formatOptions" @update:value="handleFormatUpdate" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('width')" :show-feedback="false">
          <n-input-number
            :value="width"
            :min="1"
            :max="8192"
            style="width: 100%"
            @update:value="handleWidthUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('height')" :show-feedback="false">
          <n-input-number
            :value="height"
            :min="1"
            :max="8192"
            style="width: 100%"
            @update:value="handleHeightUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('lockAspect')" :show-feedback="false">
          <n-checkbox :checked="keepAspect" @update:checked="handleKeepAspectToggle">
            {{ t('lockAspect') }}
          </n-checkbox>
        </n-form-item-gi>
        <n-form-item-gi :label="t('backgroundColor')" :show-feedback="false">
          <n-flex vertical :size="8" style="width: 100%">
            <n-color-picker
              :value="backgroundColor"
              :modes="['hex']"
              :show-alpha="format !== 'jpeg'"
              size="small"
              style="width: 100%"
              @update:value="handleBackgroundChange"
            />
            <n-checkbox
              v-show="format !== 'jpeg'"
              :checked="useBackground"
              @update:checked="handleBackgroundToggle"
            >
              {{ t('applyBackground') }}
            </n-checkbox>
          </n-flex>
        </n-form-item-gi>
        <n-form-item-gi v-show="showQuality" :label="t('quality')" :show-feedback="false">
          <n-flex vertical :size="8">
            <n-slider
              :value="quality"
              :min="1"
              :max="100"
              :step="1"
              @update:value="handleQualityUpdate"
            />
            <n-text depth="3">{{ quality }}%</n-text>
          </n-flex>
        </n-form-item-gi>
      </n-grid>
      <n-flex align="center" :size="12" style="margin-top: 12px">
        <n-button secondary @click="resetToOriginal">
          <template #icon>
            <n-icon><ResizeImage20Regular /></n-icon>
          </template>
          {{ t('resetSize') }}
        </n-button>
        <n-button
          type="primary"
          :loading="isConverting"
          :disabled="isConverting"
          @click="convertSvg"
        >
          <template #icon>
            <n-icon><ImageEdit24Regular /></n-icon>
          </template>
          {{ isConverting ? t('converting') : t('convert') }}
        </n-button>
      </n-flex>
    </ToolSection>

    <ToolSection v-show="outputBlob">
      <ToolSectionHeader>{{ t('resultsTitle') }}</ToolSectionHeader>
      <n-grid cols="1 s:2" responsive="screen" :x-gap="16" :y-gap="16">
        <n-gi>
          <n-flex vertical :size="8">
            <n-text strong>{{ t('original') }}</n-text>
            <n-text depth="3">{{ t('dimensions') }}: {{ originalDimensionsLabel }}</n-text>
            <n-text depth="3">{{ t('fileSize') }}: {{ originalSizeLabel }}</n-text>
          </n-flex>
        </n-gi>
        <n-gi>
          <n-flex vertical :size="8">
            <n-text strong>{{ t('output') }}</n-text>
            <n-text depth="3">{{ t('dimensions') }}: {{ outputDimensionsLabel }}</n-text>
            <n-text depth="3">{{ t('fileSize') }}: {{ outputSizeLabel }}</n-text>
            <n-text depth="3">{{ outputFileName }}</n-text>
          </n-flex>
        </n-gi>
      </n-grid>
      <n-flex vertical :size="12" style="margin-top: 16px">
        <n-flex justify="center">
          <div class="preview-box">
            <img
              v-if="outputPreviewUrl"
              :src="outputPreviewUrl"
              alt="Output preview"
              class="preview-image"
            />
          </div>
        </n-flex>
        <n-button
          tag="a"
          :href="downloadHref || undefined"
          :download="outputFileName"
          :disabled="!downloadHref"
        >
          <template #icon>
            <n-icon><ArrowDownload24Regular /></n-icon>
          </template>
          {{ t('download') }}
        </n-button>
      </n-flex>
    </ToolSection>

    <ToolSection v-show="error">
      <n-alert type="error">{{ error }}</n-alert>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { useObjectUrl } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NCheckbox,
  NColorPicker,
  NFlex,
  NFormItemGi,
  NGi,
  NGrid,
  NIcon,
  NInputNumber,
  NP,
  NSelect,
  NSlider,
  NText,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import {
  ArrowDownload24Regular,
  CloudArrowUp24Regular,
  Delete20Regular,
  ImageEdit24Regular,
  ResizeImage20Regular,
} from '@shared/icons/fluent'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { filesize } from 'filesize'
import type { UploadFileInfo } from 'naive-ui'
import * as toolInfo from './info'

type OutputFormat = 'png' | 'jpeg' | 'webp'

const { t } = useI18n()
const message = useMessage()

const originalFile = ref<File | null>(null)
const svgText = ref('')
const svgDimensions = ref<{ width: number; height: number } | null>(null)
const outputBlob = ref<Blob | null>(null)
const outputDimensions = ref<{ width: number; height: number } | null>(null)
const error = ref('')
const isConverting = ref(false)

const format = ref<OutputFormat>('png')
const width = ref(0)
const height = ref(0)
const keepAspect = ref(true)
const useBackground = ref(false)
const backgroundColor = ref('#ffffff')
const quality = ref(92)

const originalPreviewUrl = useObjectUrl(originalFile)
const outputPreviewUrl = useObjectUrl(outputBlob)
const downloadHref = computed(() => outputPreviewUrl.value || '')

const formatOptions = computed(() => [
  { label: t('formatPng'), value: 'png' },
  { label: t('formatJpeg'), value: 'jpeg' },
  { label: t('formatWebp'), value: 'webp' },
])

const aspectRatio = computed(() => {
  if (!svgDimensions.value) return 1
  return svgDimensions.value.width / svgDimensions.value.height
})

const outputExtension = computed(() => (format.value === 'jpeg' ? 'jpg' : format.value))

const outputMimeType = computed(() => {
  if (format.value === 'png') return 'image/png'
  if (format.value === 'jpeg') return 'image/jpeg'
  return 'image/webp'
})

const outputFileName = computed(() => {
  const base = originalFile.value?.name?.replace(/\.svg$/i, '') || 'converted'
  return `${base}.${outputExtension.value}`
})

const originalSizeLabel = computed(() =>
  originalFile.value ? (filesize(originalFile.value.size) as string) : '',
)

const outputSizeLabel = computed(() =>
  outputBlob.value ? (filesize(outputBlob.value.size) as string) : '',
)

const originalDimensionsLabel = computed(() =>
  svgDimensions.value
    ? `${Math.round(svgDimensions.value.width)} × ${Math.round(svgDimensions.value.height)}`
    : '',
)

const outputDimensionsLabel = computed(() =>
  outputDimensions.value
    ? `${outputDimensions.value.width} × ${outputDimensions.value.height}`
    : '',
)

const showQuality = computed(() => format.value !== 'png')

const shouldFillBackground = computed(() => (format.value === 'jpeg' ? true : useBackground.value))

function resetOutput() {
  outputBlob.value = null
  outputDimensions.value = null
}

function resetError() {
  error.value = ''
}

function setOriginalDimensions(dimensions: { width: number; height: number }) {
  svgDimensions.value = dimensions
  width.value = Math.max(1, Math.round(dimensions.width))
  height.value = Math.max(1, Math.round(dimensions.height))
}

function handleClearFile() {
  originalFile.value = null
  svgText.value = ''
  svgDimensions.value = null
  width.value = 0
  height.value = 0
  resetOutput()
  resetError()
}

async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const file = data.file.file
  if (!file) return false

  if (data.fileList.length > 1) {
    message.error(t('onlyOneFile'))
    return false
  }

  if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
    message.error(t('invalidFileType'))
    return false
  }

  resetError()
  resetOutput()

  try {
    const content = await file.text()
    const dimensions = getSvgDimensions(content)

    originalFile.value = file
    svgText.value = content
    setOriginalDimensions(dimensions)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('readError')
    error.value = errorMessage
    message.error(errorMessage)
  }

  return false
}

function handleWidthUpdate(value: number | null) {
  if (!value) return
  width.value = value
  if (keepAspect.value && svgDimensions.value) {
    height.value = Math.max(1, Math.round(value / aspectRatio.value))
  }
  resetOutput()
}

function handleHeightUpdate(value: number | null) {
  if (!value) return
  height.value = value
  if (keepAspect.value && svgDimensions.value) {
    width.value = Math.max(1, Math.round(value * aspectRatio.value))
  }
  resetOutput()
}

function handleKeepAspectToggle(value: boolean) {
  keepAspect.value = value
  if (value && svgDimensions.value) {
    width.value = Math.max(1, Math.round(width.value || svgDimensions.value.width))
    height.value = Math.max(1, Math.round(width.value / aspectRatio.value))
  }
  resetOutput()
}

function resetToOriginal() {
  if (!svgDimensions.value) return
  setOriginalDimensions(svgDimensions.value)
  resetOutput()
}

function handleFormatUpdate(value: OutputFormat) {
  format.value = value
  backgroundColor.value = normalizeBackgroundColor(backgroundColor.value, value)
  resetOutput()
}

function handleQualityUpdate(value: number) {
  quality.value = value
  resetOutput()
}

function handleBackgroundToggle(value: boolean) {
  useBackground.value = value
  resetOutput()
}

function handleBackgroundChange(value: string) {
  backgroundColor.value = normalizeBackgroundColor(value, format.value)
  resetOutput()
}

function normalizeBackgroundColor(value: string, formatValue: OutputFormat) {
  if (formatValue !== 'jpeg') return value
  if (value.startsWith('#') && value.length === 9) {
    return value.slice(0, 7)
  }
  return value
}

function resolveOutputSize() {
  const base = svgDimensions.value ?? { width: 512, height: 512 }
  const outputWidth = width.value > 0 ? width.value : Math.round(base.width)
  const outputHeight = height.value > 0 ? height.value : Math.round(base.height)

  return {
    width: Math.max(1, Math.round(outputWidth)),
    height: Math.max(1, Math.round(outputHeight)),
  }
}

async function convertSvg() {
  if (!svgText.value) return

  resetError()
  isConverting.value = true

  try {
    const { width: outputWidth, height: outputHeight } = resolveOutputSize()
    const image = await loadSvgImage(svgText.value)
    const canvas = document.createElement('canvas')

    canvas.width = outputWidth
    canvas.height = outputHeight

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error(t('noCanvas'))
    }

    if (shouldFillBackground.value) {
      context.fillStyle = backgroundColor.value
      context.fillRect(0, 0, outputWidth, outputHeight)
    }

    context.drawImage(image, 0, 0, outputWidth, outputHeight)

    const qualityValue = showQuality.value ? quality.value / 100 : undefined
    const blob = await canvasToBlob(canvas, outputMimeType.value, qualityValue)

    outputBlob.value = blob
    outputDimensions.value = { width: outputWidth, height: outputHeight }
    message.success(t('convertSuccess'))
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('convertFailed')
    error.value = errorMessage
    message.error(t('convertFailed'))
  } finally {
    isConverting.value = false
  }
}

function buildSvgDataUrl(svgString: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
}

function parseSvgLength(value: string | null) {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed || trimmed.endsWith('%')) return null

  const match = trimmed.match(/^([0-9.]+)(px)?$/i)
  if (!match) return null

  const parsed = Number(match[1])
  if (!Number.isFinite(parsed) || parsed <= 0) return null

  return parsed
}

function parseViewBox(value: string | null) {
  if (!value) return null

  const parts = value
    .trim()
    .split(/[\s,]+/)
    .map((part) => Number(part))

  if (parts.length < 4 || parts.some((part) => Number.isNaN(part))) return null

  const width = parts[2] as number
  const height = parts[3] as number

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null

  return { width, height }
}

function getSvgDimensions(svgString: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')

  if (doc.querySelector('parsererror')) {
    throw new Error(t('invalidSvg'))
  }

  const svg = doc.querySelector('svg')
  if (!svg) {
    throw new Error(t('invalidSvg'))
  }

  const widthAttr = parseSvgLength(svg.getAttribute('width'))
  const heightAttr = parseSvgLength(svg.getAttribute('height'))
  const viewBox = parseViewBox(svg.getAttribute('viewBox'))

  let width = widthAttr
  let height = heightAttr

  if (viewBox && (!width || !height)) {
    if (!width && height) {
      width = (height * viewBox.width) / viewBox.height
    } else if (!height && width) {
      height = (width * viewBox.height) / viewBox.width
    }
  }

  if (viewBox && (!width || !height)) {
    width = width || viewBox.width
    height = height || viewBox.height
  }

  if (!width || !height) {
    return { width: 512, height: 512 }
  }

  return { width, height }
}

function loadSvgImage(svgString: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(t('imageLoadFailed')))
    image.src = buildSvgDataUrl(svgString)
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(t('convertFailed')))
          return
        }
        resolve(blob)
      },
      type,
      quality,
    )
  })
}
</script>

<style scoped>
.preview-box {
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  background: #f5f5f5;
}

.preview-box--small {
  width: 120px;
  height: 120px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
</style>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload SVG",
    "dragDropOrClick": "Click or drag to upload SVG file",
    "svgFilesOnly": "SVG files only",
    "removeFile": "Remove File",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid SVG file",
    "readError": "Failed to read SVG file",
    "invalidSvg": "Invalid SVG content",
    "settingsTitle": "Conversion Options",
    "format": "Output format",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Width (px)",
    "height": "Height (px)",
    "lockAspect": "Lock aspect ratio",
    "resetSize": "Use original size",
    "backgroundColor": "Background color",
    "applyBackground": "Fill background (PNG/WebP)",
    "quality": "Quality",
    "convert": "Convert",
    "converting": "Converting...",
    "resultsTitle": "Output",
    "original": "Original",
    "output": "Output",
    "dimensions": "Dimensions",
    "fileSize": "File size",
    "download": "Download",
    "convertSuccess": "Conversion completed!",
    "convertFailed": "Failed to convert SVG",
    "imageLoadFailed": "Failed to load SVG image",
    "noCanvas": "Canvas is not supported in this browser"
  },
  "zh": {
    "uploadTitle": "上传 SVG",
    "dragDropOrClick": "点击或拖拽上传 SVG 文件",
    "svgFilesOnly": "仅支持 SVG 文件",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的 SVG 文件",
    "readError": "读取 SVG 文件失败",
    "invalidSvg": "无效的 SVG 内容",
    "settingsTitle": "转换选项",
    "format": "输出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "宽度 (px)",
    "height": "高度 (px)",
    "lockAspect": "锁定纵横比",
    "resetSize": "使用原始尺寸",
    "backgroundColor": "背景颜色",
    "applyBackground": "填充背景（PNG/WebP）",
    "quality": "质量",
    "convert": "转换",
    "converting": "转换中...",
    "resultsTitle": "输出",
    "original": "原始",
    "output": "输出",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "download": "下载",
    "convertSuccess": "转换完成！",
    "convertFailed": "转换 SVG 失败",
    "imageLoadFailed": "加载 SVG 图像失败",
    "noCanvas": "当前浏览器不支持 Canvas"
  },
  "zh-CN": {
    "uploadTitle": "上传 SVG",
    "dragDropOrClick": "点击或拖拽上传 SVG 文件",
    "svgFilesOnly": "仅支持 SVG 文件",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的 SVG 文件",
    "readError": "读取 SVG 文件失败",
    "invalidSvg": "无效的 SVG 内容",
    "settingsTitle": "转换选项",
    "format": "输出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "宽度 (px)",
    "height": "高度 (px)",
    "lockAspect": "锁定纵横比",
    "resetSize": "使用原始尺寸",
    "backgroundColor": "背景颜色",
    "applyBackground": "填充背景（PNG/WebP）",
    "quality": "质量",
    "convert": "转换",
    "converting": "转换中...",
    "resultsTitle": "输出",
    "original": "原始",
    "output": "输出",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "download": "下载",
    "convertSuccess": "转换完成！",
    "convertFailed": "转换 SVG 失败",
    "imageLoadFailed": "加载 SVG 图像失败",
    "noCanvas": "当前浏览器不支持 Canvas"
  },
  "zh-TW": {
    "uploadTitle": "上傳 SVG",
    "dragDropOrClick": "點擊或拖曳上傳 SVG 檔案",
    "svgFilesOnly": "僅支援 SVG 檔案",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的 SVG 檔案",
    "readError": "讀取 SVG 檔案失敗",
    "invalidSvg": "無效的 SVG 內容",
    "settingsTitle": "轉換選項",
    "format": "輸出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "寬度 (px)",
    "height": "高度 (px)",
    "lockAspect": "鎖定長寬比",
    "resetSize": "使用原始尺寸",
    "backgroundColor": "背景顏色",
    "applyBackground": "填充背景（PNG/WebP）",
    "quality": "品質",
    "convert": "轉換",
    "converting": "轉換中...",
    "resultsTitle": "輸出",
    "original": "原始",
    "output": "輸出",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "download": "下載",
    "convertSuccess": "轉換完成！",
    "convertFailed": "SVG 轉換失敗",
    "imageLoadFailed": "載入 SVG 圖像失敗",
    "noCanvas": "目前瀏覽器不支援 Canvas"
  },
  "zh-HK": {
    "uploadTitle": "上傳 SVG",
    "dragDropOrClick": "點擊或拖曳上傳 SVG 檔案",
    "svgFilesOnly": "僅支援 SVG 檔案",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的 SVG 檔案",
    "readError": "讀取 SVG 檔案失敗",
    "invalidSvg": "無效的 SVG 內容",
    "settingsTitle": "轉換選項",
    "format": "輸出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "寬度 (px)",
    "height": "高度 (px)",
    "lockAspect": "鎖定長寬比",
    "resetSize": "使用原始尺寸",
    "backgroundColor": "背景顏色",
    "applyBackground": "填充背景（PNG/WebP）",
    "quality": "品質",
    "convert": "轉換",
    "converting": "轉換中...",
    "resultsTitle": "輸出",
    "original": "原始",
    "output": "輸出",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "download": "下載",
    "convertSuccess": "轉換完成！",
    "convertFailed": "SVG 轉換失敗",
    "imageLoadFailed": "載入 SVG 圖像失敗",
    "noCanvas": "目前瀏覽器不支援 Canvas"
  },
  "es": {
    "uploadTitle": "Subir SVG",
    "dragDropOrClick": "Haz clic o arrastra para subir el archivo SVG",
    "svgFilesOnly": "Solo archivos SVG",
    "removeFile": "Eliminar archivo",
    "onlyOneFile": "Solo se puede subir un archivo",
    "invalidFileType": "Por favor selecciona un archivo SVG válido",
    "readError": "Error al leer el archivo SVG",
    "invalidSvg": "Contenido SVG inválido",
    "settingsTitle": "Opciones de conversión",
    "format": "Formato de salida",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Ancho (px)",
    "height": "Alto (px)",
    "lockAspect": "Bloquear relación de aspecto",
    "resetSize": "Usar tamaño original",
    "backgroundColor": "Color de fondo",
    "applyBackground": "Rellenar fondo (PNG/WebP)",
    "quality": "Calidad",
    "convert": "Convertir",
    "converting": "Convirtiendo...",
    "resultsTitle": "Salida",
    "original": "Original",
    "output": "Salida",
    "dimensions": "Dimensiones",
    "fileSize": "Tamaño de archivo",
    "download": "Descargar",
    "convertSuccess": "¡Conversión completada!",
    "convertFailed": "Error al convertir SVG",
    "imageLoadFailed": "Error al cargar la imagen SVG",
    "noCanvas": "Este navegador no admite Canvas"
  },
  "fr": {
    "uploadTitle": "Téléverser SVG",
    "dragDropOrClick": "Cliquez ou glissez pour téléverser un fichier SVG",
    "svgFilesOnly": "Fichiers SVG uniquement",
    "removeFile": "Supprimer le fichier",
    "onlyOneFile": "Un seul fichier peut être téléversé",
    "invalidFileType": "Veuillez sélectionner un fichier SVG valide",
    "readError": "Échec de la lecture du fichier SVG",
    "invalidSvg": "Contenu SVG invalide",
    "settingsTitle": "Options de conversion",
    "format": "Format de sortie",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Largeur (px)",
    "height": "Hauteur (px)",
    "lockAspect": "Verrouiller le ratio",
    "resetSize": "Utiliser la taille d'origine",
    "backgroundColor": "Couleur de fond",
    "applyBackground": "Remplir l'arrière-plan (PNG/WebP)",
    "quality": "Qualité",
    "convert": "Convertir",
    "converting": "Conversion...",
    "resultsTitle": "Sortie",
    "original": "Original",
    "output": "Sortie",
    "dimensions": "Dimensions",
    "fileSize": "Taille du fichier",
    "download": "Télécharger",
    "convertSuccess": "Conversion terminée !",
    "convertFailed": "Échec de la conversion SVG",
    "imageLoadFailed": "Échec du chargement de l'image SVG",
    "noCanvas": "Ce navigateur ne prend pas en charge Canvas"
  },
  "de": {
    "uploadTitle": "SVG hochladen",
    "dragDropOrClick": "Klicken oder ziehen Sie, um SVG-Datei hochzuladen",
    "svgFilesOnly": "Nur SVG-Dateien",
    "removeFile": "Datei entfernen",
    "onlyOneFile": "Es kann nur eine Datei hochgeladen werden",
    "invalidFileType": "Bitte wählen Sie eine gültige SVG-Datei",
    "readError": "SVG-Datei konnte nicht gelesen werden",
    "invalidSvg": "Ungültiger SVG-Inhalt",
    "settingsTitle": "Konvertierungsoptionen",
    "format": "Ausgabeformat",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Breite (px)",
    "height": "Höhe (px)",
    "lockAspect": "Seitenverhältnis sperren",
    "resetSize": "Originalgröße verwenden",
    "backgroundColor": "Hintergrundfarbe",
    "applyBackground": "Hintergrund füllen (PNG/WebP)",
    "quality": "Qualität",
    "convert": "Konvertieren",
    "converting": "Konvertieren...",
    "resultsTitle": "Ausgabe",
    "original": "Original",
    "output": "Ausgabe",
    "dimensions": "Abmessungen",
    "fileSize": "Dateigröße",
    "download": "Herunterladen",
    "convertSuccess": "Konvertierung abgeschlossen!",
    "convertFailed": "SVG-Konvertierung fehlgeschlagen",
    "imageLoadFailed": "SVG-Bild konnte nicht geladen werden",
    "noCanvas": "Dieser Browser unterstützt Canvas nicht"
  },
  "it": {
    "uploadTitle": "Carica SVG",
    "dragDropOrClick": "Clicca o trascina per caricare file SVG",
    "svgFilesOnly": "Solo file SVG",
    "removeFile": "Rimuovi file",
    "onlyOneFile": "È possibile caricare un solo file",
    "invalidFileType": "Seleziona un file SVG valido",
    "readError": "Impossibile leggere il file SVG",
    "invalidSvg": "Contenuto SVG non valido",
    "settingsTitle": "Opzioni di conversione",
    "format": "Formato di output",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Larghezza (px)",
    "height": "Altezza (px)",
    "lockAspect": "Blocca proporzioni",
    "resetSize": "Usa dimensione originale",
    "backgroundColor": "Colore di sfondo",
    "applyBackground": "Riempi sfondo (PNG/WebP)",
    "quality": "Qualità",
    "convert": "Converti",
    "converting": "Conversione...",
    "resultsTitle": "Output",
    "original": "Originale",
    "output": "Output",
    "dimensions": "Dimensioni",
    "fileSize": "Dimensione file",
    "download": "Scarica",
    "convertSuccess": "Conversione completata!",
    "convertFailed": "Conversione SVG non riuscita",
    "imageLoadFailed": "Caricamento immagine SVG non riuscito",
    "noCanvas": "Questo browser non supporta Canvas"
  },
  "ja": {
    "uploadTitle": "SVG をアップロード",
    "dragDropOrClick": "クリックまたはドラッグして SVG ファイルをアップロード",
    "svgFilesOnly": "SVG ファイルのみ",
    "removeFile": "ファイルを削除",
    "onlyOneFile": "アップロードできるファイルは 1 つだけです",
    "invalidFileType": "有効な SVG ファイルを選択してください",
    "readError": "SVG ファイルの読み込みに失敗しました",
    "invalidSvg": "無効な SVG コンテンツ",
    "settingsTitle": "変換オプション",
    "format": "出力形式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "幅 (px)",
    "height": "高さ (px)",
    "lockAspect": "縦横比を固定",
    "resetSize": "元のサイズを使用",
    "backgroundColor": "背景色",
    "applyBackground": "背景を塗りつぶす（PNG/WebP）",
    "quality": "品質",
    "convert": "変換",
    "converting": "変換中...",
    "resultsTitle": "出力",
    "original": "元",
    "output": "出力",
    "dimensions": "サイズ",
    "fileSize": "ファイルサイズ",
    "download": "ダウンロード",
    "convertSuccess": "変換が完了しました！",
    "convertFailed": "SVG の変換に失敗しました",
    "imageLoadFailed": "SVG 画像の読み込みに失敗しました",
    "noCanvas": "このブラウザは Canvas をサポートしていません"
  },
  "ko": {
    "uploadTitle": "SVG 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 SVG 파일 업로드",
    "svgFilesOnly": "SVG 파일만",
    "removeFile": "파일 제거",
    "onlyOneFile": "하나의 파일만 업로드할 수 있습니다",
    "invalidFileType": "유효한 SVG 파일을 선택하세요",
    "readError": "SVG 파일을 읽지 못했습니다",
    "invalidSvg": "잘못된 SVG 콘텐츠",
    "settingsTitle": "변환 옵션",
    "format": "출력 형식",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "너비 (px)",
    "height": "높이 (px)",
    "lockAspect": "종횡비 고정",
    "resetSize": "원본 크기 사용",
    "backgroundColor": "배경색",
    "applyBackground": "배경 채우기 (PNG/WebP)",
    "quality": "품질",
    "convert": "변환",
    "converting": "변환 중...",
    "resultsTitle": "출력",
    "original": "원본",
    "output": "출력",
    "dimensions": "크기",
    "fileSize": "파일 크기",
    "download": "다운로드",
    "convertSuccess": "변환 완료!",
    "convertFailed": "SVG 변환 실패",
    "imageLoadFailed": "SVG 이미지 로드 실패",
    "noCanvas": "이 브라우저는 Canvas를 지원하지 않습니다"
  },
  "ru": {
    "uploadTitle": "Загрузить SVG",
    "dragDropOrClick": "Нажмите или перетащите для загрузки SVG-файла",
    "svgFilesOnly": "Только SVG файлы",
    "removeFile": "Удалить файл",
    "onlyOneFile": "Можно загрузить только один файл",
    "invalidFileType": "Пожалуйста, выберите действительный SVG файл",
    "readError": "Не удалось прочитать SVG файл",
    "invalidSvg": "Недопустимое содержимое SVG",
    "settingsTitle": "Параметры конвертации",
    "format": "Формат вывода",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Ширина (px)",
    "height": "Высота (px)",
    "lockAspect": "Сохранить пропорции",
    "resetSize": "Использовать исходный размер",
    "backgroundColor": "Цвет фона",
    "applyBackground": "Заполнить фон (PNG/WebP)",
    "quality": "Качество",
    "convert": "Конвертировать",
    "converting": "Конвертация...",
    "resultsTitle": "Результат",
    "original": "Исходный",
    "output": "Выход",
    "dimensions": "Размеры",
    "fileSize": "Размер файла",
    "download": "Скачать",
    "convertSuccess": "Конвертация завершена!",
    "convertFailed": "Не удалось конвертировать SVG",
    "imageLoadFailed": "Не удалось загрузить SVG изображение",
    "noCanvas": "Этот браузер не поддерживает Canvas"
  },
  "pt": {
    "uploadTitle": "Enviar SVG",
    "dragDropOrClick": "Clique ou arraste para enviar arquivo SVG",
    "svgFilesOnly": "Apenas arquivos SVG",
    "removeFile": "Remover arquivo",
    "onlyOneFile": "Apenas um arquivo pode ser enviado",
    "invalidFileType": "Por favor selecione um arquivo SVG válido",
    "readError": "Falha ao ler o arquivo SVG",
    "invalidSvg": "Conteúdo SVG inválido",
    "settingsTitle": "Opções de conversão",
    "format": "Formato de saída",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Largura (px)",
    "height": "Altura (px)",
    "lockAspect": "Bloquear proporção",
    "resetSize": "Usar tamanho original",
    "backgroundColor": "Cor de fundo",
    "applyBackground": "Preencher fundo (PNG/WebP)",
    "quality": "Qualidade",
    "convert": "Converter",
    "converting": "Convertendo...",
    "resultsTitle": "Saída",
    "original": "Original",
    "output": "Saída",
    "dimensions": "Dimensões",
    "fileSize": "Tamanho do arquivo",
    "download": "Baixar",
    "convertSuccess": "Conversão concluída!",
    "convertFailed": "Falha ao converter SVG",
    "imageLoadFailed": "Falha ao carregar a imagem SVG",
    "noCanvas": "Este navegador não suporta Canvas"
  },
  "ar": {
    "uploadTitle": "رفع SVG",
    "dragDropOrClick": "انقر أو اسحب لرفع ملف SVG",
    "svgFilesOnly": "ملفات SVG فقط",
    "removeFile": "إزالة الملف",
    "onlyOneFile": "يمكن رفع ملف واحد فقط",
    "invalidFileType": "يرجى اختيار ملف SVG صالح",
    "readError": "فشل في قراءة ملف SVG",
    "invalidSvg": "محتوى SVG غير صالح",
    "settingsTitle": "خيارات التحويل",
    "format": "تنسيق الإخراج",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "العرض (px)",
    "height": "الارتفاع (px)",
    "lockAspect": "قفل نسبة الأبعاد",
    "resetSize": "استخدم الحجم الأصلي",
    "backgroundColor": "لون الخلفية",
    "applyBackground": "تعبئة الخلفية (PNG/WebP)",
    "quality": "الجودة",
    "convert": "تحويل",
    "converting": "جارٍ التحويل...",
    "resultsTitle": "الإخراج",
    "original": "الأصل",
    "output": "الإخراج",
    "dimensions": "الأبعاد",
    "fileSize": "حجم الملف",
    "download": "تنزيل",
    "convertSuccess": "اكتمل التحويل!",
    "convertFailed": "فشل في تحويل SVG",
    "imageLoadFailed": "فشل في تحميل صورة SVG",
    "noCanvas": "هذا المتصفح لا يدعم Canvas"
  },
  "hi": {
    "uploadTitle": "SVG अपलोड करें",
    "dragDropOrClick": "SVG फ़ाइल अपलोड करने के लिए क्लिक करें या खींचें",
    "svgFilesOnly": "केवल SVG फ़ाइलें",
    "removeFile": "फ़ाइल हटाएं",
    "onlyOneFile": "केवल एक फ़ाइल अपलोड की जा सकती है",
    "invalidFileType": "कृपया एक मान्य SVG फ़ाइल चुनें",
    "readError": "SVG फ़ाइल पढ़ने में विफल",
    "invalidSvg": "अमान्य SVG सामग्री",
    "settingsTitle": "रूपांतरण विकल्प",
    "format": "आउटपुट प्रारूप",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "चौड़ाई (px)",
    "height": "ऊंचाई (px)",
    "lockAspect": "आस्पेक्ट अनुपात लॉक करें",
    "resetSize": "मूल आकार उपयोग करें",
    "backgroundColor": "पृष्ठभूमि रंग",
    "applyBackground": "पृष्ठभूमि भरें (PNG/WebP)",
    "quality": "गुणवत्ता",
    "convert": "परिवर्तित करें",
    "converting": "परिवर्तित किया जा रहा है...",
    "resultsTitle": "आउटपुट",
    "original": "मूल",
    "output": "आउटपुट",
    "dimensions": "आयाम",
    "fileSize": "फ़ाइल आकार",
    "download": "डाउनलोड",
    "convertSuccess": "रूपांतरण पूरा हुआ!",
    "convertFailed": "SVG रूपांतरण विफल",
    "imageLoadFailed": "SVG छवि लोड करने में विफल",
    "noCanvas": "यह ब्राउज़र Canvas को सपोर्ट नहीं करता"
  },
  "tr": {
    "uploadTitle": "SVG Yükle",
    "dragDropOrClick": "SVG dosyasını yüklemek için tıklayın veya sürükleyin",
    "svgFilesOnly": "Sadece SVG dosyaları",
    "removeFile": "Dosyayı kaldır",
    "onlyOneFile": "Sadece bir dosya yüklenebilir",
    "invalidFileType": "Lütfen geçerli bir SVG dosyası seçin",
    "readError": "SVG dosyası okunamadı",
    "invalidSvg": "Geçersiz SVG içeriği",
    "settingsTitle": "Dönüştürme seçenekleri",
    "format": "Çıkış formatı",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Genişlik (px)",
    "height": "Yükseklik (px)",
    "lockAspect": "En-boy oranını kilitle",
    "resetSize": "Orijinal boyutu kullan",
    "backgroundColor": "Arka plan rengi",
    "applyBackground": "Arka planı doldur (PNG/WebP)",
    "quality": "Kalite",
    "convert": "Dönüştür",
    "converting": "Dönüştürülüyor...",
    "resultsTitle": "Çıktı",
    "original": "Orijinal",
    "output": "Çıktı",
    "dimensions": "Boyutlar",
    "fileSize": "Dosya boyutu",
    "download": "İndir",
    "convertSuccess": "Dönüştürme tamamlandı!",
    "convertFailed": "SVG dönüştürülemedi",
    "imageLoadFailed": "SVG resmi yüklenemedi",
    "noCanvas": "Bu tarayıcı Canvas'ı desteklemiyor"
  },
  "nl": {
    "uploadTitle": "SVG uploaden",
    "dragDropOrClick": "Klik of sleep om SVG-bestand te uploaden",
    "svgFilesOnly": "Alleen SVG-bestanden",
    "removeFile": "Bestand verwijderen",
    "onlyOneFile": "Er kan slechts één bestand worden geüpload",
    "invalidFileType": "Selecteer een geldig SVG-bestand",
    "readError": "Kan SVG-bestand niet lezen",
    "invalidSvg": "Ongeldige SVG-inhoud",
    "settingsTitle": "Conversieopties",
    "format": "Uitvoerformaat",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Breedte (px)",
    "height": "Hoogte (px)",
    "lockAspect": "Beeldverhouding vergrendelen",
    "resetSize": "Originele grootte gebruiken",
    "backgroundColor": "Achtergrondkleur",
    "applyBackground": "Achtergrond vullen (PNG/WebP)",
    "quality": "Kwaliteit",
    "convert": "Converteren",
    "converting": "Converteren...",
    "resultsTitle": "Uitvoer",
    "original": "Origineel",
    "output": "Uitvoer",
    "dimensions": "Afmetingen",
    "fileSize": "Bestandsgrootte",
    "download": "Downloaden",
    "convertSuccess": "Conversie voltooid!",
    "convertFailed": "SVG-conversie mislukt",
    "imageLoadFailed": "SVG-afbeelding laden mislukt",
    "noCanvas": "Deze browser ondersteunt Canvas niet"
  },
  "sv": {
    "uploadTitle": "Ladda upp SVG",
    "dragDropOrClick": "Klicka eller dra för att ladda upp SVG-fil",
    "svgFilesOnly": "Endast SVG-filer",
    "removeFile": "Ta bort fil",
    "onlyOneFile": "Endast en fil kan laddas upp",
    "invalidFileType": "Välj en giltig SVG-fil",
    "readError": "Kunde inte läsa SVG-fil",
    "invalidSvg": "Ogiltigt SVG-innehåll",
    "settingsTitle": "Konverteringsalternativ",
    "format": "Utdataformat",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Bredd (px)",
    "height": "Höjd (px)",
    "lockAspect": "Lås bildförhållande",
    "resetSize": "Använd originalstorlek",
    "backgroundColor": "Bakgrundsfärg",
    "applyBackground": "Fyll bakgrund (PNG/WebP)",
    "quality": "Kvalitet",
    "convert": "Konvertera",
    "converting": "Konverterar...",
    "resultsTitle": "Utdata",
    "original": "Original",
    "output": "Utdata",
    "dimensions": "Dimensioner",
    "fileSize": "Filstorlek",
    "download": "Ladda ner",
    "convertSuccess": "Konvertering klar!",
    "convertFailed": "Misslyckades med att konvertera SVG",
    "imageLoadFailed": "Misslyckades med att ladda SVG-bilden",
    "noCanvas": "Denna webbläsare stöder inte Canvas"
  },
  "pl": {
    "uploadTitle": "Prześlij SVG",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać plik SVG",
    "svgFilesOnly": "Tylko pliki SVG",
    "removeFile": "Usuń plik",
    "onlyOneFile": "Można przesłać tylko jeden plik",
    "invalidFileType": "Wybierz prawidłowy plik SVG",
    "readError": "Nie udało się odczytać pliku SVG",
    "invalidSvg": "Nieprawidłowa zawartość SVG",
    "settingsTitle": "Opcje konwersji",
    "format": "Format wyjściowy",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Szerokość (px)",
    "height": "Wysokość (px)",
    "lockAspect": "Zablokuj proporcje",
    "resetSize": "Użyj oryginalnego rozmiaru",
    "backgroundColor": "Kolor tła",
    "applyBackground": "Wypełnij tło (PNG/WebP)",
    "quality": "Jakość",
    "convert": "Konwertuj",
    "converting": "Konwertowanie...",
    "resultsTitle": "Wynik",
    "original": "Oryginał",
    "output": "Wynik",
    "dimensions": "Wymiary",
    "fileSize": "Rozmiar pliku",
    "download": "Pobierz",
    "convertSuccess": "Konwersja zakończona!",
    "convertFailed": "Nie udało się przekonwertować SVG",
    "imageLoadFailed": "Nie udało się wczytać obrazu SVG",
    "noCanvas": "Ta przeglądarka nie obsługuje Canvas"
  },
  "vi": {
    "uploadTitle": "Tải lên SVG",
    "dragDropOrClick": "Nhấp hoặc kéo để tải lên tệp SVG",
    "svgFilesOnly": "Chỉ tệp SVG",
    "removeFile": "Xóa tệp",
    "onlyOneFile": "Chỉ có thể tải lên một tệp",
    "invalidFileType": "Vui lòng chọn tệp SVG hợp lệ",
    "readError": "Không thể đọc tệp SVG",
    "invalidSvg": "Nội dung SVG không hợp lệ",
    "settingsTitle": "Tùy chọn chuyển đổi",
    "format": "Định dạng đầu ra",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Chiều rộng (px)",
    "height": "Chiều cao (px)",
    "lockAspect": "Khóa tỷ lệ",
    "resetSize": "Dùng kích thước gốc",
    "backgroundColor": "Màu nền",
    "applyBackground": "Tô nền (PNG/WebP)",
    "quality": "Chất lượng",
    "convert": "Chuyển đổi",
    "converting": "Đang chuyển đổi...",
    "resultsTitle": "Đầu ra",
    "original": "Gốc",
    "output": "Đầu ra",
    "dimensions": "Kích thước",
    "fileSize": "Kích thước tệp",
    "download": "Tải xuống",
    "convertSuccess": "Chuyển đổi hoàn tất!",
    "convertFailed": "Không thể chuyển đổi SVG",
    "imageLoadFailed": "Không thể tải ảnh SVG",
    "noCanvas": "Trình duyệt này không hỗ trợ Canvas"
  },
  "th": {
    "uploadTitle": "อัปโหลด SVG",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลดไฟล์ SVG",
    "svgFilesOnly": "เฉพาะไฟล์ SVG",
    "removeFile": "ลบไฟล์",
    "onlyOneFile": "สามารถอัปโหลดได้เพียงหนึ่งไฟล์",
    "invalidFileType": "กรุณาเลือกไฟล์ SVG ที่ถูกต้อง",
    "readError": "ไม่สามารถอ่านไฟล์ SVG ได้",
    "invalidSvg": "เนื้อหา SVG ไม่ถูกต้อง",
    "settingsTitle": "ตัวเลือกการแปลง",
    "format": "รูปแบบผลลัพธ์",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "ความกว้าง (px)",
    "height": "ความสูง (px)",
    "lockAspect": "ล็อกอัตราส่วนภาพ",
    "resetSize": "ใช้ขนาดเดิม",
    "backgroundColor": "สีพื้นหลัง",
    "applyBackground": "เติมพื้นหลัง (PNG/WebP)",
    "quality": "คุณภาพ",
    "convert": "แปลง",
    "converting": "กำลังแปลง...",
    "resultsTitle": "ผลลัพธ์",
    "original": "ต้นฉบับ",
    "output": "ผลลัพธ์",
    "dimensions": "ขนาด",
    "fileSize": "ขนาดไฟล์",
    "download": "ดาวน์โหลด",
    "convertSuccess": "แปลงเสร็จสิ้น!",
    "convertFailed": "แปลง SVG ไม่สำเร็จ",
    "imageLoadFailed": "ไม่สามารถโหลดรูป SVG ได้",
    "noCanvas": "เบราว์เซอร์นี้ไม่รองรับ Canvas"
  },
  "id": {
    "uploadTitle": "Unggah SVG",
    "dragDropOrClick": "Klik atau seret untuk mengunggah file SVG",
    "svgFilesOnly": "Hanya file SVG",
    "removeFile": "Hapus file",
    "onlyOneFile": "Hanya satu file yang dapat diunggah",
    "invalidFileType": "Silakan pilih file SVG yang valid",
    "readError": "Gagal membaca file SVG",
    "invalidSvg": "Konten SVG tidak valid",
    "settingsTitle": "Opsi konversi",
    "format": "Format output",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Lebar (px)",
    "height": "Tinggi (px)",
    "lockAspect": "Kunci rasio aspek",
    "resetSize": "Gunakan ukuran asli",
    "backgroundColor": "Warna latar belakang",
    "applyBackground": "Isi latar belakang (PNG/WebP)",
    "quality": "Kualitas",
    "convert": "Konversi",
    "converting": "Mengonversi...",
    "resultsTitle": "Output",
    "original": "Asli",
    "output": "Output",
    "dimensions": "Dimensi",
    "fileSize": "Ukuran file",
    "download": "Unduh",
    "convertSuccess": "Konversi selesai!",
    "convertFailed": "Gagal mengonversi SVG",
    "imageLoadFailed": "Gagal memuat gambar SVG",
    "noCanvas": "Browser ini tidak mendukung Canvas"
  },
  "he": {
    "uploadTitle": "העלה SVG",
    "dragDropOrClick": "לחץ או גרור כדי להעלות קובץ SVG",
    "svgFilesOnly": "קבצי SVG בלבד",
    "removeFile": "הסר קובץ",
    "onlyOneFile": "ניתן להעלות קובץ אחד בלבד",
    "invalidFileType": "אנא בחר קובץ SVG תקין",
    "readError": "נכשל בקריאת קובץ SVG",
    "invalidSvg": "תוכן SVG לא חוקי",
    "settingsTitle": "אפשרויות המרה",
    "format": "פורמט פלט",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "רוחב (px)",
    "height": "גובה (px)",
    "lockAspect": "נעל יחס ממדים",
    "resetSize": "השתמש בגודל המקורי",
    "backgroundColor": "צבע רקע",
    "applyBackground": "מילוי רקע (PNG/WebP)",
    "quality": "איכות",
    "convert": "המר",
    "converting": "ממיר...",
    "resultsTitle": "פלט",
    "original": "מקורי",
    "output": "פלט",
    "dimensions": "ממדים",
    "fileSize": "גודל קובץ",
    "download": "הורדה",
    "convertSuccess": "ההמרה הושלמה!",
    "convertFailed": "המרת SVG נכשלה",
    "imageLoadFailed": "טעינת תמונת SVG נכשלה",
    "noCanvas": "דפדפן זה אינו תומך ב-Canvas"
  },
  "ms": {
    "uploadTitle": "Muat naik SVG",
    "dragDropOrClick": "Klik atau seret untuk muat naik fail SVG",
    "svgFilesOnly": "Hanya fail SVG",
    "removeFile": "Buang fail",
    "onlyOneFile": "Hanya satu fail boleh dimuat naik",
    "invalidFileType": "Sila pilih fail SVG yang sah",
    "readError": "Gagal membaca fail SVG",
    "invalidSvg": "Kandungan SVG tidak sah",
    "settingsTitle": "Pilihan penukaran",
    "format": "Format output",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Lebar (px)",
    "height": "Tinggi (px)",
    "lockAspect": "Kunci nisbah aspek",
    "resetSize": "Gunakan saiz asal",
    "backgroundColor": "Warna latar belakang",
    "applyBackground": "Isi latar belakang (PNG/WebP)",
    "quality": "Kualiti",
    "convert": "Tukar",
    "converting": "Menukar...",
    "resultsTitle": "Output",
    "original": "Asal",
    "output": "Output",
    "dimensions": "Dimensi",
    "fileSize": "Saiz fail",
    "download": "Muat turun",
    "convertSuccess": "Penukaran selesai!",
    "convertFailed": "Gagal menukar SVG",
    "imageLoadFailed": "Gagal memuat imej SVG",
    "noCanvas": "Pelayar ini tidak menyokong Canvas"
  },
  "no": {
    "uploadTitle": "Last opp SVG",
    "dragDropOrClick": "Klikk eller dra for å laste opp SVG-fil",
    "svgFilesOnly": "Kun SVG-filer",
    "removeFile": "Fjern fil",
    "onlyOneFile": "Kun én fil kan lastes opp",
    "invalidFileType": "Vennligst velg en gyldig SVG-fil",
    "readError": "Kunne ikke lese SVG-fil",
    "invalidSvg": "Ugyldig SVG-innhold",
    "settingsTitle": "Konverteringsalternativer",
    "format": "Utdataformat",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Bredde (px)",
    "height": "Høyde (px)",
    "lockAspect": "Lås sideforhold",
    "resetSize": "Bruk original størrelse",
    "backgroundColor": "Bakgrunnsfarge",
    "applyBackground": "Fyll bakgrunn (PNG/WebP)",
    "quality": "Kvalitet",
    "convert": "Konverter",
    "converting": "Konverterer...",
    "resultsTitle": "Utdata",
    "original": "Original",
    "output": "Utdata",
    "dimensions": "Dimensjoner",
    "fileSize": "Filstørrelse",
    "download": "Last ned",
    "convertSuccess": "Konvertering fullført!",
    "convertFailed": "Kunne ikke konvertere SVG",
    "imageLoadFailed": "Kunne ikke laste SVG-bildet",
    "noCanvas": "Denne nettleseren støtter ikke Canvas"
  }
}
</i18n>
