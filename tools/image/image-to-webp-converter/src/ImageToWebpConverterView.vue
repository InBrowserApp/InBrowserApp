<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ImageUpload
      v-model:files="files"
      :title="t('uploadTitle')"
      :drag-drop-text="t('dragDropOrClick')"
      :support-text="t('supportedFormats')"
      :selected-count-label="t('selectedCount', { count: files.length })"
      :remove-label="t('removeFile')"
      :clear-all-label="t('clearAll')"
      :invalid-type-message="t('invalidFileType')"
      :duplicate-message="t('duplicateFile')"
    />

    <ConversionOptions
      v-if="files.length"
      v-model:scale="scale"
      v-model:quality="quality"
      v-model:method="method"
      v-model:lossless="lossless"
      v-model:advanced-enabled="advancedEnabled"
      v-model:target-size="targetSize"
      v-model:target-psnr="targetPsnr"
      v-model:near-lossless="nearLossless"
      v-model:alpha-quality="alphaQuality"
      v-model:sns-strength="snsStrength"
      v-model:filter-strength="filterStrength"
      v-model:filter-sharpness="filterSharpness"
      v-model:filter-type="filterType"
      v-model:partitions="partitions"
      v-model:segments="segments"
      v-model:pass-count="passCount"
      v-model:exact-mode="exactMode"
      v-model:sharp-yuv-mode="sharpYuvMode"
      :title="t('optionsTitle')"
      :scale-label="t('scaleLabel')"
      :scale-hint="t('scaleHint')"
      :quality-label="t('qualityLabel')"
      :quality-hint="t('qualityHint')"
      :method-label="t('methodLabel')"
      :method-hint="t('methodHint')"
      :lossless-label="t('losslessLabel')"
      :advanced-label="t('advancedLabel')"
      :target-size-label="t('targetSizeLabel')"
      :target-psnr-label="t('targetPsnrLabel')"
      :near-lossless-label="t('nearLosslessLabel')"
      :alpha-quality-label="t('alphaQualityLabel')"
      :sns-strength-label="t('snsStrengthLabel')"
      :filter-strength-label="t('filterStrengthLabel')"
      :filter-sharpness-label="t('filterSharpnessLabel')"
      :filter-type-label="t('filterTypeLabel')"
      :partitions-label="t('partitionsLabel')"
      :segments-label="t('segmentsLabel')"
      :pass-label="t('passLabel')"
      :exact-label="t('exactLabel')"
      :use-sharp-yuv-label="t('useSharpYuvLabel')"
      :option-default-label="t('optionDefault')"
      :option-on-label="t('optionOn')"
      :option-off-label="t('optionOff')"
      :convert-label="t('convert')"
      :converting-label="t('converting')"
      :min-scale="minScale"
      :max-scale="maxScale"
      :is-converting="isConverting"
      :can-convert="canConvert"
      @convert="convertImages"
    />

    <ConversionResults
      v-if="results.length"
      :title="t('resultsTitle')"
      :count-label="t('resultCount', { count: results.length })"
      :results="results"
      :zip-blob="zipBlob"
      :is-zipping="isZipping"
      :download-zip-name="zipName"
      :download-webp-label="t('downloadWebp')"
      :download-zip-label="t('downloadZip')"
      :original-label="t('original')"
      :output-label="t('output')"
      :saved-label="t('saved')"
      :dimensions-label="t('dimensions')"
      :file-size-label="t('fileSize')"
      :total-saved-label="t('totalSaved')"
    />

    <ToolSection v-if="error">
      <n-alert type="warning" :show-icon="false">{{ error }}</n-alert>
    </ToolSection>

    <ToolSection>
      <n-text depth="3">{{ t('note') }}</n-text>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NAlert, NText } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import ImageUpload from './components/ImageUpload.vue'
import ConversionOptions from './components/ConversionOptions.vue'
import ConversionResults from './components/ConversionResults.vue'
import { convertImageToWebp } from './utils/convert-image-to-webp'
import { createWebpZip } from './utils/create-webp-zip'
import type { WebpConversionOptions, WebpConversionResult } from './types'

const { t } = useI18n()
const message = useMessage()

type TriState = 'default' | 'on' | 'off'

const files = ref<File[]>([])
const scale = ref(100)
const quality = ref(80)
const method = ref(4)
const lossless = ref(false)
const advancedEnabled = ref(false)
const targetSize = ref<number | null>(null)
const targetPsnr = ref<number | null>(null)
const nearLossless = ref<number | null>(null)
const alphaQuality = ref<number | null>(null)
const snsStrength = ref<number | null>(null)
const filterStrength = ref<number | null>(null)
const filterSharpness = ref<number | null>(null)
const filterType = ref<number | null>(null)
const partitions = ref<number | null>(null)
const segments = ref<number | null>(null)
const passCount = ref<number | null>(null)
const exactMode = ref<TriState>('default')
const sharpYuvMode = ref<TriState>('default')
const results = ref<WebpConversionResult[]>([])
const zipBlob = ref<Blob | null>(null)
const error = ref('')
const isConverting = ref(false)
const isZipping = ref(false)

const minScale = 10
const maxScale = 400
const zipName = 'webp-images.zip'

const canConvert = computed(() => files.value.length > 0 && !isConverting.value)

let runId = 0

watch(
  [
    files,
    scale,
    quality,
    method,
    lossless,
    advancedEnabled,
    targetSize,
    targetPsnr,
    nearLossless,
    alphaQuality,
    snsStrength,
    filterStrength,
    filterSharpness,
    filterType,
    partitions,
    segments,
    passCount,
    exactMode,
    sharpYuvMode,
  ],
  () => {
    runId += 1
    results.value = []
    zipBlob.value = null
    error.value = ''
    isConverting.value = false
    isZipping.value = false
  },
)

async function convertImages() {
  if (!files.value.length || isConverting.value) return

  const currentRun = ++runId
  isConverting.value = true
  isZipping.value = false
  error.value = ''
  results.value = []
  zipBlob.value = null

  const nameCounts = new Map<string, number>()
  const nextResults: WebpConversionResult[] = []
  const errors: string[] = []

  try {
    for (const file of files.value) {
      const outputName = buildOutputName(file.name, nameCounts)
      try {
        const result = await convertImageToWebp(file, buildConversionOptions(), outputName)
        if (currentRun !== runId) return
        nextResults.push(result)
      } catch (err) {
        errors.push(resolveErrorMessage(err))
      }
    }

    if (currentRun !== runId) return
    results.value = nextResults

    if (nextResults.length > 1) {
      isZipping.value = true
      try {
        const zip = await createWebpZip(nextResults)
        if (currentRun !== runId) return
        zipBlob.value = zip
      } catch {
        if (currentRun !== runId) return
        const zipError = t('zipFailed')
        error.value = zipError
        message.error(zipError)
      } finally {
        if (currentRun === runId) {
          isZipping.value = false
        }
      }
    }

    if (errors.length) {
      const errorMessage = nextResults.length
        ? t('partialFailed', { count: errors.length })
        : (errors[0] ?? t('convertFailed'))
      error.value = errorMessage
      message.error(errorMessage)
    } else if (nextResults.length) {
      message.success(t('convertSuccess'))
    } else {
      error.value = t('convertFailed')
      message.error(error.value)
    }
  } finally {
    if (currentRun === runId) {
      isConverting.value = false
    }
  }
}

function buildConversionOptions(): WebpConversionOptions {
  const options: WebpConversionOptions = {
    scale: scale.value,
    quality: quality.value,
    method: method.value,
    lossless: lossless.value,
  }

  if (!advancedEnabled.value) return options

  if (targetSize.value !== null && Number.isFinite(targetSize.value)) {
    options.targetSize = Math.max(0, Math.round(targetSize.value * 1024))
  }
  if (targetPsnr.value !== null && Number.isFinite(targetPsnr.value)) {
    options.targetPsnr = targetPsnr.value
  }
  if (nearLossless.value !== null && Number.isFinite(nearLossless.value)) {
    options.nearLossless = nearLossless.value
  }
  if (alphaQuality.value !== null && Number.isFinite(alphaQuality.value)) {
    options.alphaQuality = alphaQuality.value
  }
  if (snsStrength.value !== null && Number.isFinite(snsStrength.value)) {
    options.snsStrength = snsStrength.value
  }
  if (filterStrength.value !== null && Number.isFinite(filterStrength.value)) {
    options.filterStrength = filterStrength.value
  }
  if (filterSharpness.value !== null && Number.isFinite(filterSharpness.value)) {
    options.filterSharpness = filterSharpness.value
  }
  if (filterType.value !== null && Number.isFinite(filterType.value)) {
    options.filterType = filterType.value
  }
  if (partitions.value !== null && Number.isFinite(partitions.value)) {
    options.partitions = partitions.value
  }
  if (segments.value !== null && Number.isFinite(segments.value)) {
    options.segments = segments.value
  }
  if (passCount.value !== null && Number.isFinite(passCount.value)) {
    options.pass = passCount.value
  }
  const exactValue = resolveTriState(exactMode.value)
  if (exactValue !== undefined) {
    options.exact = exactValue
  }
  const sharpYuvValue = resolveTriState(sharpYuvMode.value)
  if (sharpYuvValue !== undefined) {
    options.useSharpYuv = sharpYuvValue
  }

  return options
}

function resolveTriState(value: TriState) {
  if (value === 'on') return true
  if (value === 'off') return false
  return undefined
}

function resolveErrorMessage(err: unknown) {
  if (err instanceof Error) {
    switch (err.message) {
      case 'INVALID_IMAGE':
        return t('invalidImage')
      case 'CANVAS_CONTEXT_UNAVAILABLE':
        return t('canvasUnavailable')
      default:
        return t('convertFailed')
    }
  }
  return t('convertFailed')
}

function buildOutputName(name: string, nameCounts: Map<string, number>) {
  const base = name.replace(/\.[^/.]+$/, '') || 'image'
  const candidate = `${base}.webp`
  const currentCount = nameCounts.get(candidate) ?? 0
  nameCounts.set(candidate, currentCount + 1)

  if (currentCount === 0) return candidate
  return `${base}-${currentCount + 1}.webp`
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload images",
    "dragDropOrClick": "Click or drag to upload images",
    "supportedFormats": "Supports PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Selected {count} images",
    "removeFile": "Remove",
    "clearAll": "Clear all",
    "invalidFileType": "Please select a valid image file",
    "duplicateFile": "This file is already added",
    "optionsTitle": "Conversion Options",
    "scaleLabel": "Scale (%)",
    "scaleHint": "Resize all images by percentage.",
    "qualityLabel": "Quality",
    "qualityHint": "Higher values keep more detail but increase file size.",
    "methodLabel": "Compression effort",
    "methodHint": "0 = fastest, 6 = best compression.",
    "losslessLabel": "Lossless",
    "advancedLabel": "Advanced options",
    "targetSizeLabel": "Target size (KB)",
    "targetPsnrLabel": "Target PSNR",
    "nearLosslessLabel": "Near lossless",
    "alphaQualityLabel": "Alpha quality",
    "snsStrengthLabel": "SNS strength",
    "filterStrengthLabel": "Filter strength",
    "filterSharpnessLabel": "Filter sharpness",
    "filterTypeLabel": "Filter type",
    "partitionsLabel": "Partitions",
    "segmentsLabel": "Segments",
    "passLabel": "Passes",
    "exactLabel": "Exact",
    "useSharpYuvLabel": "Sharp YUV",
    "optionDefault": "Default",
    "optionOn": "On",
    "optionOff": "Off",
    "saved": "Saved",
    "totalSaved": "Total saved",
    "convert": "Convert to WebP",
    "converting": "Converting...",
    "resultsTitle": "Results",
    "resultCount": "Converted {count} images",
    "downloadWebp": "Download WebP",
    "downloadZip": "Download WebP ZIP",
    "original": "Original",
    "output": "Output",
    "dimensions": "Dimensions",
    "fileSize": "File size",
    "convertSuccess": "Conversion completed!",
    "convertFailed": "Failed to convert images. Please try again.",
    "partialFailed": "Some files failed to convert ({count}).",
    "invalidImage": "Failed to load the image. Please try another file.",
    "canvasUnavailable": "Canvas is not available in this browser.",
    "zipFailed": "Failed to create ZIP. Please try again.",
    "note": "Runs locally in your browser. No uploads."
  },
  "zh": {
    "uploadTitle": "上传图片",
    "dragDropOrClick": "点击或拖拽上传图片",
    "supportedFormats": "支持 PNG、JPG、WebP、GIF、SVG",
    "selectedCount": "已选择 {count} 张图片",
    "removeFile": "移除",
    "clearAll": "清空全部",
    "invalidFileType": "请选择有效的图片文件",
    "duplicateFile": "该文件已添加",
    "optionsTitle": "转换选项",
    "scaleLabel": "缩放比例 (%)",
    "scaleHint": "按比例调整所有图片大小。",
    "qualityLabel": "质量",
    "qualityHint": "数值越高细节越多，文件越大。",
    "methodLabel": "压缩强度",
    "methodHint": "0 最快，6 压缩最佳。",
    "losslessLabel": "无损",
    "advancedLabel": "高级选项",
    "targetSizeLabel": "目标大小 (KB)",
    "targetPsnrLabel": "目标 PSNR",
    "nearLosslessLabel": "近无损",
    "alphaQualityLabel": "透明度质量",
    "snsStrengthLabel": "SNS 强度",
    "filterStrengthLabel": "滤镜强度",
    "filterSharpnessLabel": "滤镜锐度",
    "filterTypeLabel": "滤镜类型",
    "partitionsLabel": "分区数",
    "segmentsLabel": "分段数",
    "passLabel": "遍数",
    "exactLabel": "精确透明",
    "useSharpYuvLabel": "锐化 YUV",
    "optionDefault": "默认",
    "optionOn": "开启",
    "optionOff": "关闭",
    "saved": "节省",
    "totalSaved": "总共节省",
    "convert": "转换为 WebP",
    "converting": "转换中...",
    "resultsTitle": "结果",
    "resultCount": "已转换 {count} 张图片",
    "downloadWebp": "下载 WebP",
    "downloadZip": "下载 WebP ZIP",
    "original": "原始",
    "output": "输出",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "convertSuccess": "转换完成！",
    "convertFailed": "转换失败，请重试。",
    "partialFailed": "部分文件转换失败（{count}）。",
    "invalidImage": "图片加载失败，请尝试其他文件。",
    "canvasUnavailable": "当前浏览器不支持 Canvas。",
    "zipFailed": "生成 ZIP 失败，请重试。",
    "note": "所有操作均在本地浏览器完成，不会上传文件。"
  },
  "zh-CN": {
    "uploadTitle": "上传图片",
    "dragDropOrClick": "点击或拖拽上传图片",
    "supportedFormats": "支持 PNG、JPG、WebP、GIF、SVG",
    "selectedCount": "已选择 {count} 张图片",
    "removeFile": "移除",
    "clearAll": "清空全部",
    "invalidFileType": "请选择有效的图片文件",
    "duplicateFile": "该文件已添加",
    "optionsTitle": "转换选项",
    "scaleLabel": "缩放比例 (%)",
    "scaleHint": "按比例调整所有图片大小。",
    "qualityLabel": "质量",
    "qualityHint": "数值越高细节越多，文件越大。",
    "methodLabel": "压缩强度",
    "methodHint": "0 最快，6 压缩最佳。",
    "losslessLabel": "无损",
    "advancedLabel": "高级选项",
    "targetSizeLabel": "目标大小 (KB)",
    "targetPsnrLabel": "目标 PSNR",
    "nearLosslessLabel": "近无损",
    "alphaQualityLabel": "透明度质量",
    "snsStrengthLabel": "SNS 强度",
    "filterStrengthLabel": "滤镜强度",
    "filterSharpnessLabel": "滤镜锐度",
    "filterTypeLabel": "滤镜类型",
    "partitionsLabel": "分区数",
    "segmentsLabel": "分段数",
    "passLabel": "遍数",
    "exactLabel": "精确透明",
    "useSharpYuvLabel": "锐化 YUV",
    "optionDefault": "默认",
    "optionOn": "开启",
    "optionOff": "关闭",
    "saved": "节省",
    "totalSaved": "总共节省",
    "convert": "转换为 WebP",
    "converting": "转换中...",
    "resultsTitle": "结果",
    "resultCount": "已转换 {count} 张图片",
    "downloadWebp": "下载 WebP",
    "downloadZip": "下载 WebP ZIP",
    "original": "原始",
    "output": "输出",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "convertSuccess": "转换完成！",
    "convertFailed": "转换失败，请重试。",
    "partialFailed": "部分文件转换失败（{count}）。",
    "invalidImage": "图片加载失败，请尝试其他文件。",
    "canvasUnavailable": "当前浏览器不支持 Canvas。",
    "zipFailed": "生成 ZIP 失败，请重试。",
    "note": "所有操作均在本地浏览器完成，不会上传文件。"
  },
  "zh-TW": {
    "uploadTitle": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳上傳圖片",
    "supportedFormats": "支援 PNG、JPG、WebP、GIF、SVG",
    "selectedCount": "已選擇 {count} 張圖片",
    "removeFile": "移除",
    "clearAll": "清空全部",
    "invalidFileType": "請選擇有效的圖片檔案",
    "duplicateFile": "此檔案已加入",
    "optionsTitle": "轉換選項",
    "scaleLabel": "縮放比例 (%)",
    "scaleHint": "依比例調整所有圖片大小。",
    "qualityLabel": "品質",
    "qualityHint": "數值越高細節越多，檔案越大。",
    "methodLabel": "壓縮強度",
    "methodHint": "0 最快，6 壓縮最佳。",
    "losslessLabel": "無損",
    "advancedLabel": "進階選項",
    "targetSizeLabel": "目標大小 (KB)",
    "targetPsnrLabel": "目標 PSNR",
    "nearLosslessLabel": "近無損",
    "alphaQualityLabel": "透明度品質",
    "snsStrengthLabel": "SNS 強度",
    "filterStrengthLabel": "濾鏡強度",
    "filterSharpnessLabel": "濾鏡銳度",
    "filterTypeLabel": "濾鏡類型",
    "partitionsLabel": "分區數",
    "segmentsLabel": "分段數",
    "passLabel": "次數",
    "exactLabel": "精確透明",
    "useSharpYuvLabel": "銳化 YUV",
    "optionDefault": "預設",
    "optionOn": "開啟",
    "optionOff": "關閉",
    "saved": "節省",
    "totalSaved": "總共節省",
    "convert": "轉換為 WebP",
    "converting": "轉換中...",
    "resultsTitle": "結果",
    "resultCount": "已轉換 {count} 張圖片",
    "downloadWebp": "下載 WebP",
    "downloadZip": "下載 WebP ZIP",
    "original": "原始",
    "output": "輸出",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "convertSuccess": "轉換完成！",
    "convertFailed": "轉換失敗，請重試。",
    "partialFailed": "部分檔案轉換失敗（{count}）。",
    "invalidImage": "圖片載入失敗，請嘗試其他檔案。",
    "canvasUnavailable": "目前瀏覽器不支援 Canvas。",
    "zipFailed": "產生 ZIP 失敗，請重試。",
    "note": "所有操作都在本機瀏覽器完成，不會上傳檔案。"
  },
  "zh-HK": {
    "uploadTitle": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳上傳圖片",
    "supportedFormats": "支援 PNG、JPG、WebP、GIF、SVG",
    "selectedCount": "已選擇 {count} 張圖片",
    "removeFile": "移除",
    "clearAll": "清空全部",
    "invalidFileType": "請選擇有效的圖片檔案",
    "duplicateFile": "此檔案已加入",
    "optionsTitle": "轉換選項",
    "scaleLabel": "縮放比例 (%)",
    "scaleHint": "依比例調整所有圖片大小。",
    "qualityLabel": "品質",
    "qualityHint": "數值越高細節越多，檔案越大。",
    "methodLabel": "壓縮強度",
    "methodHint": "0 最快，6 壓縮最佳。",
    "losslessLabel": "無損",
    "advancedLabel": "進階選項",
    "targetSizeLabel": "目標大小 (KB)",
    "targetPsnrLabel": "目標 PSNR",
    "nearLosslessLabel": "近無損",
    "alphaQualityLabel": "透明度品質",
    "snsStrengthLabel": "SNS 強度",
    "filterStrengthLabel": "濾鏡強度",
    "filterSharpnessLabel": "濾鏡銳度",
    "filterTypeLabel": "濾鏡類型",
    "partitionsLabel": "分區數",
    "segmentsLabel": "分段數",
    "passLabel": "次數",
    "exactLabel": "精確透明",
    "useSharpYuvLabel": "銳化 YUV",
    "optionDefault": "預設",
    "optionOn": "開啟",
    "optionOff": "關閉",
    "saved": "節省",
    "totalSaved": "總共節省",
    "convert": "轉換為 WebP",
    "converting": "轉換中...",
    "resultsTitle": "結果",
    "resultCount": "已轉換 {count} 張圖片",
    "downloadWebp": "下載 WebP",
    "downloadZip": "下載 WebP ZIP",
    "original": "原始",
    "output": "輸出",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "convertSuccess": "轉換完成！",
    "convertFailed": "轉換失敗，請重試。",
    "partialFailed": "部分檔案轉換失敗（{count}）。",
    "invalidImage": "圖片載入失敗，請嘗試其他檔案。",
    "canvasUnavailable": "目前瀏覽器不支援 Canvas。",
    "zipFailed": "產生 ZIP 失敗，請重試。",
    "note": "所有操作都在本機瀏覽器完成，不會上傳檔案。"
  },
  "es": {
    "uploadTitle": "Subir imágenes",
    "dragDropOrClick": "Haz clic o arrastra para subir imágenes",
    "supportedFormats": "Admite PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Seleccionadas {count} imágenes",
    "removeFile": "Eliminar",
    "clearAll": "Borrar todo",
    "invalidFileType": "Por favor selecciona un archivo de imagen válido",
    "duplicateFile": "Este archivo ya está añadido",
    "optionsTitle": "Opciones de conversión",
    "scaleLabel": "Escala (%)",
    "scaleHint": "Redimensiona todas las imágenes por porcentaje.",
    "qualityLabel": "Calidad",
    "qualityHint": "Valores más altos conservan más detalle pero aumentan el tamaño.",
    "methodLabel": "Esfuerzo de compresión",
    "methodHint": "0 = más rápido, 6 = mejor compresión.",
    "losslessLabel": "Sin pérdidas",
    "advancedLabel": "Opciones avanzadas",
    "targetSizeLabel": "Tamaño objetivo (KB)",
    "targetPsnrLabel": "PSNR objetivo",
    "nearLosslessLabel": "Casi sin pérdidas",
    "alphaQualityLabel": "Calidad alfa",
    "snsStrengthLabel": "Fuerza SNS",
    "filterStrengthLabel": "Fuerza del filtro",
    "filterSharpnessLabel": "Nitidez del filtro",
    "filterTypeLabel": "Tipo de filtro",
    "partitionsLabel": "Particiones",
    "segmentsLabel": "Segmentos",
    "passLabel": "Pasadas",
    "exactLabel": "Exacto",
    "useSharpYuvLabel": "YUV nítido",
    "optionDefault": "Predeterminado",
    "optionOn": "Activado",
    "optionOff": "Desactivado",
    "saved": "Ahorro",
    "totalSaved": "Ahorro total",
    "convert": "Convertir a WebP",
    "converting": "Convirtiendo...",
    "resultsTitle": "Resultados",
    "resultCount": "Convertidas {count} imágenes",
    "downloadWebp": "Descargar WebP",
    "downloadZip": "Descargar ZIP WebP",
    "original": "Original",
    "output": "Salida",
    "dimensions": "Dimensiones",
    "fileSize": "Tamaño de archivo",
    "convertSuccess": "¡Conversión completada!",
    "convertFailed": "Error al convertir las imágenes. Inténtalo de nuevo.",
    "partialFailed": "Algunos archivos no se pudieron convertir ({count}).",
    "invalidImage": "No se pudo cargar la imagen. Prueba con otro archivo.",
    "canvasUnavailable": "Canvas no está disponible en este navegador.",
    "zipFailed": "No se pudo crear el ZIP. Inténtalo de nuevo.",
    "note": "Se ejecuta localmente en tu navegador. Sin subidas."
  },
  "fr": {
    "uploadTitle": "Téléverser des images",
    "dragDropOrClick": "Cliquez ou glissez pour téléverser des images",
    "supportedFormats": "Prend en charge PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} images sélectionnées",
    "removeFile": "Supprimer",
    "clearAll": "Tout effacer",
    "invalidFileType": "Veuillez sélectionner un fichier image valide",
    "duplicateFile": "Ce fichier est déjà ajouté",
    "optionsTitle": "Options de conversion",
    "scaleLabel": "Échelle (%)",
    "scaleHint": "Redimensionne toutes les images par pourcentage.",
    "qualityLabel": "Qualité",
    "qualityHint": "Des valeurs plus élevées conservent plus de détails mais augmentent la taille.",
    "methodLabel": "Effort de compression",
    "methodHint": "0 = le plus rapide, 6 = la meilleure compression.",
    "losslessLabel": "Sans perte",
    "advancedLabel": "Options avancées",
    "targetSizeLabel": "Taille cible (KB)",
    "targetPsnrLabel": "PSNR cible",
    "nearLosslessLabel": "Presque sans perte",
    "alphaQualityLabel": "Qualité alpha",
    "snsStrengthLabel": "Force SNS",
    "filterStrengthLabel": "Force du filtre",
    "filterSharpnessLabel": "Netteté du filtre",
    "filterTypeLabel": "Type de filtre",
    "partitionsLabel": "Partitions",
    "segmentsLabel": "Segments",
    "passLabel": "Passes",
    "exactLabel": "Exact",
    "useSharpYuvLabel": "YUV net",
    "optionDefault": "Par défaut",
    "optionOn": "Activé",
    "optionOff": "Désactivé",
    "saved": "Économie",
    "totalSaved": "Économie totale",
    "convert": "Convertir en WebP",
    "converting": "Conversion...",
    "resultsTitle": "Résultats",
    "resultCount": "{count} images converties",
    "downloadWebp": "Télécharger WebP",
    "downloadZip": "Télécharger le ZIP WebP",
    "original": "Original",
    "output": "Sortie",
    "dimensions": "Dimensions",
    "fileSize": "Taille du fichier",
    "convertSuccess": "Conversion terminée !",
    "convertFailed": "Échec de la conversion des images. Veuillez réessayer.",
    "partialFailed": "Certains fichiers n'ont pas été convertis ({count}).",
    "invalidImage": "Impossible de charger l'image. Essayez un autre fichier.",
    "canvasUnavailable": "Canvas n'est pas disponible dans ce navigateur.",
    "zipFailed": "Échec de la création du ZIP. Veuillez réessayer.",
    "note": "Fonctionne localement dans votre navigateur. Aucun envoi."
  },
  "de": {
    "uploadTitle": "Bilder hochladen",
    "dragDropOrClick": "Klicken oder ziehen Sie, um Bilder hochzuladen",
    "supportedFormats": "Unterstützt PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} Bilder ausgewählt",
    "removeFile": "Entfernen",
    "clearAll": "Alles löschen",
    "invalidFileType": "Bitte wählen Sie eine gültige Bilddatei",
    "duplicateFile": "Diese Datei ist bereits hinzugefügt",
    "optionsTitle": "Konvertierungsoptionen",
    "scaleLabel": "Skalierung (%)",
    "scaleHint": "Alle Bilder prozentual skalieren.",
    "qualityLabel": "Qualität",
    "qualityHint": "Höhere Werte behalten mehr Details, erhöhen aber die Dateigröße.",
    "methodLabel": "Kompressionsaufwand",
    "methodHint": "0 = am schnellsten, 6 = beste Kompression.",
    "losslessLabel": "Verlustfrei",
    "advancedLabel": "Erweiterte Optionen",
    "targetSizeLabel": "Zielgröße (KB)",
    "targetPsnrLabel": "Ziel-PSNR",
    "nearLosslessLabel": "Nahezu verlustfrei",
    "alphaQualityLabel": "Alpha-Qualität",
    "snsStrengthLabel": "SNS-Stärke",
    "filterStrengthLabel": "Filterstärke",
    "filterSharpnessLabel": "Filter-Schärfe",
    "filterTypeLabel": "Filtertyp",
    "partitionsLabel": "Partitionen",
    "segmentsLabel": "Segmente",
    "passLabel": "Durchläufe",
    "exactLabel": "Exakt",
    "useSharpYuvLabel": "Scharfes YUV",
    "optionDefault": "Standard",
    "optionOn": "An",
    "optionOff": "Aus",
    "saved": "Ersparnis",
    "totalSaved": "Gesamtersparnis",
    "convert": "In WebP konvertieren",
    "converting": "Konvertieren...",
    "resultsTitle": "Ergebnisse",
    "resultCount": "{count} Bilder konvertiert",
    "downloadWebp": "WebP herunterladen",
    "downloadZip": "WebP ZIP herunterladen",
    "original": "Original",
    "output": "Ausgabe",
    "dimensions": "Abmessungen",
    "fileSize": "Dateigröße",
    "convertSuccess": "Konvertierung abgeschlossen!",
    "convertFailed": "Bilder konnten nicht konvertiert werden. Bitte erneut versuchen.",
    "partialFailed": "Einige Dateien konnten nicht konvertiert werden ({count}).",
    "invalidImage": "Bild konnte nicht geladen werden. Bitte andere Datei versuchen.",
    "canvasUnavailable": "Canvas ist in diesem Browser nicht verfügbar.",
    "zipFailed": "ZIP konnte nicht erstellt werden. Bitte erneut versuchen.",
    "note": "Läuft lokal in Ihrem Browser. Keine Uploads."
  },
  "it": {
    "uploadTitle": "Carica immagini",
    "dragDropOrClick": "Clicca o trascina per caricare immagini",
    "supportedFormats": "Supporta PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} immagini selezionate",
    "removeFile": "Rimuovi",
    "clearAll": "Cancella tutto",
    "invalidFileType": "Seleziona un file immagine valido",
    "duplicateFile": "Questo file è già stato aggiunto",
    "optionsTitle": "Opzioni di conversione",
    "scaleLabel": "Scala (%)",
    "scaleHint": "Ridimensiona tutte le immagini in percentuale.",
    "qualityLabel": "Qualità",
    "qualityHint": "Valori più alti mantengono più dettagli ma aumentano la dimensione.",
    "methodLabel": "Sforzo di compressione",
    "methodHint": "0 = più veloce, 6 = migliore compressione.",
    "losslessLabel": "Senza perdita",
    "advancedLabel": "Opzioni avanzate",
    "targetSizeLabel": "Dimensione obiettivo (KB)",
    "targetPsnrLabel": "PSNR obiettivo",
    "nearLosslessLabel": "Quasi lossless",
    "alphaQualityLabel": "Qualità alpha",
    "snsStrengthLabel": "Intensità SNS",
    "filterStrengthLabel": "Intensità filtro",
    "filterSharpnessLabel": "Nitidezza filtro",
    "filterTypeLabel": "Tipo filtro",
    "partitionsLabel": "Partizioni",
    "segmentsLabel": "Segmenti",
    "passLabel": "Passaggi",
    "exactLabel": "Esatto",
    "useSharpYuvLabel": "YUV nitido",
    "optionDefault": "Predefinito",
    "optionOn": "Attivo",
    "optionOff": "Disattivo",
    "saved": "Risparmio",
    "totalSaved": "Risparmio totale",
    "convert": "Converti in WebP",
    "converting": "Conversione...",
    "resultsTitle": "Risultati",
    "resultCount": "{count} immagini convertite",
    "downloadWebp": "Scarica WebP",
    "downloadZip": "Scarica ZIP WebP",
    "original": "Originale",
    "output": "Output",
    "dimensions": "Dimensioni",
    "fileSize": "Dimensione file",
    "convertSuccess": "Conversione completata!",
    "convertFailed": "Conversione immagini fallita. Riprova.",
    "partialFailed": "Alcuni file non sono stati convertiti ({count}).",
    "invalidImage": "Impossibile caricare l'immagine. Prova un altro file.",
    "canvasUnavailable": "Canvas non è disponibile in questo browser.",
    "zipFailed": "Impossibile creare lo ZIP. Riprova.",
    "note": "Funziona localmente nel browser. Nessun upload."
  },
  "ja": {
    "uploadTitle": "画像をアップロード",
    "dragDropOrClick": "クリックまたはドラッグして画像をアップロード",
    "supportedFormats": "PNG、JPG、WebP、GIF、SVG に対応",
    "selectedCount": "{count} 枚の画像を選択",
    "removeFile": "削除",
    "clearAll": "すべてクリア",
    "invalidFileType": "有効な画像ファイルを選択してください",
    "duplicateFile": "このファイルは既に追加されています",
    "optionsTitle": "変換オプション",
    "scaleLabel": "倍率 (%)",
    "scaleHint": "すべての画像を割合でリサイズします。",
    "qualityLabel": "品質",
    "qualityHint": "数値が高いほど詳細を保持しますがサイズが大きくなります。",
    "methodLabel": "圧縮強度",
    "methodHint": "0 = 最速、6 = 最高圧縮。",
    "losslessLabel": "可逆",
    "advancedLabel": "詳細オプション",
    "targetSizeLabel": "目標サイズ (KB)",
    "targetPsnrLabel": "目標 PSNR",
    "nearLosslessLabel": "準ロスレス",
    "alphaQualityLabel": "アルファ品質",
    "snsStrengthLabel": "SNS 強度",
    "filterStrengthLabel": "フィルター強度",
    "filterSharpnessLabel": "フィルターシャープネス",
    "filterTypeLabel": "フィルター種類",
    "partitionsLabel": "パーティション",
    "segmentsLabel": "セグメント",
    "passLabel": "パス",
    "exactLabel": "厳密",
    "useSharpYuvLabel": "シャープ YUV",
    "optionDefault": "デフォルト",
    "optionOn": "オン",
    "optionOff": "オフ",
    "saved": "削減",
    "totalSaved": "合計削減",
    "convert": "WebP に変換",
    "converting": "変換中...",
    "resultsTitle": "結果",
    "resultCount": "{count} 枚の画像を変換",
    "downloadWebp": "WebP をダウンロード",
    "downloadZip": "WebP ZIP をダウンロード",
    "original": "元",
    "output": "出力",
    "dimensions": "サイズ",
    "fileSize": "ファイルサイズ",
    "convertSuccess": "変換が完了しました！",
    "convertFailed": "画像の変換に失敗しました。もう一度お試しください。",
    "partialFailed": "一部のファイルを変換できませんでした（{count}）。",
    "invalidImage": "画像の読み込みに失敗しました。別のファイルをお試しください。",
    "canvasUnavailable": "このブラウザは Canvas をサポートしていません。",
    "zipFailed": "ZIP の作成に失敗しました。もう一度お試しください。",
    "note": "処理はブラウザ内で完結します。アップロードは行いません。"
  },
  "ko": {
    "uploadTitle": "이미지 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 이미지 업로드",
    "supportedFormats": "PNG, JPG, WebP, GIF, SVG 지원",
    "selectedCount": "{count}개 이미지 선택됨",
    "removeFile": "제거",
    "clearAll": "모두 지우기",
    "invalidFileType": "유효한 이미지 파일을 선택하세요",
    "duplicateFile": "이 파일은 이미 추가되었습니다",
    "optionsTitle": "변환 옵션",
    "scaleLabel": "배율 (%)",
    "scaleHint": "모든 이미지를 백분율로 크기 조정합니다.",
    "qualityLabel": "품질",
    "qualityHint": "값이 높을수록 디테일을 유지하지만 파일이 커집니다.",
    "methodLabel": "압축 강도",
    "methodHint": "0 = 가장 빠름, 6 = 최고의 압축.",
    "losslessLabel": "무손실",
    "advancedLabel": "고급 옵션",
    "targetSizeLabel": "목표 크기 (KB)",
    "targetPsnrLabel": "목표 PSNR",
    "nearLosslessLabel": "준 무손실",
    "alphaQualityLabel": "알파 품질",
    "snsStrengthLabel": "SNS 강도",
    "filterStrengthLabel": "필터 강도",
    "filterSharpnessLabel": "필터 선명도",
    "filterTypeLabel": "필터 유형",
    "partitionsLabel": "파티션",
    "segmentsLabel": "세그먼트",
    "passLabel": "패스",
    "exactLabel": "정확",
    "useSharpYuvLabel": "선명 YUV",
    "optionDefault": "기본값",
    "optionOn": "켜기",
    "optionOff": "끄기",
    "saved": "절감",
    "totalSaved": "총 절감",
    "convert": "WebP로 변환",
    "converting": "변환 중...",
    "resultsTitle": "결과",
    "resultCount": "{count}개 이미지 변환됨",
    "downloadWebp": "WebP 다운로드",
    "downloadZip": "WebP ZIP 다운로드",
    "original": "원본",
    "output": "출력",
    "dimensions": "크기",
    "fileSize": "파일 크기",
    "convertSuccess": "변환 완료!",
    "convertFailed": "이미지 변환에 실패했습니다. 다시 시도하세요.",
    "partialFailed": "일부 파일을 변환하지 못했습니다({count}).",
    "invalidImage": "이미지를 불러오지 못했습니다. 다른 파일을 시도하세요.",
    "canvasUnavailable": "이 브라우저는 Canvas를 지원하지 않습니다.",
    "zipFailed": "ZIP 생성에 실패했습니다. 다시 시도하세요.",
    "note": "브라우저에서 로컬로 실행됩니다. 업로드 없음."
  },
  "ru": {
    "uploadTitle": "Загрузить изображения",
    "dragDropOrClick": "Нажмите или перетащите для загрузки изображений",
    "supportedFormats": "Поддерживает PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Выбрано изображений: {count}",
    "removeFile": "Удалить",
    "clearAll": "Очистить всё",
    "invalidFileType": "Пожалуйста, выберите допустимый файл изображения",
    "duplicateFile": "Этот файл уже добавлен",
    "optionsTitle": "Параметры конвертации",
    "scaleLabel": "Масштаб (%)",
    "scaleHint": "Масштабируйте все изображения в процентах.",
    "qualityLabel": "Качество",
    "qualityHint": "Чем выше значение, тем больше деталей, но больше размер файла.",
    "methodLabel": "Интенсивность сжатия",
    "methodHint": "0 = быстрее всего, 6 = лучшее сжатие.",
    "losslessLabel": "Без потерь",
    "advancedLabel": "Расширенные параметры",
    "targetSizeLabel": "Целевой размер (КБ)",
    "targetPsnrLabel": "Целевой PSNR",
    "nearLosslessLabel": "Почти без потерь",
    "alphaQualityLabel": "Качество альфа",
    "snsStrengthLabel": "Сила SNS",
    "filterStrengthLabel": "Сила фильтра",
    "filterSharpnessLabel": "Резкость фильтра",
    "filterTypeLabel": "Тип фильтра",
    "partitionsLabel": "Разделы",
    "segmentsLabel": "Сегменты",
    "passLabel": "Проходы",
    "exactLabel": "Точно",
    "useSharpYuvLabel": "Резкий YUV",
    "optionDefault": "По умолчанию",
    "optionOn": "Вкл",
    "optionOff": "Выкл",
    "saved": "Экономия",
    "totalSaved": "Общая экономия",
    "convert": "Конвертировать в WebP",
    "converting": "Конвертация...",
    "resultsTitle": "Результаты",
    "resultCount": "Конвертировано изображений: {count}",
    "downloadWebp": "Скачать WebP",
    "downloadZip": "Скачать ZIP WebP",
    "original": "Исходное",
    "output": "Результат",
    "dimensions": "Размеры",
    "fileSize": "Размер файла",
    "convertSuccess": "Конвертация завершена!",
    "convertFailed": "Не удалось конвертировать изображения. Попробуйте снова.",
    "partialFailed": "Некоторые файлы не удалось конвертировать ({count}).",
    "invalidImage": "Не удалось загрузить изображение. Попробуйте другой файл.",
    "canvasUnavailable": "Canvas недоступен в этом браузере.",
    "zipFailed": "Не удалось создать ZIP. Попробуйте снова.",
    "note": "Работает локально в вашем браузере. Без загрузок."
  },
  "pt": {
    "uploadTitle": "Enviar imagens",
    "dragDropOrClick": "Clique ou arraste para enviar imagens",
    "supportedFormats": "Suporta PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} imagens selecionadas",
    "removeFile": "Remover",
    "clearAll": "Limpar tudo",
    "invalidFileType": "Selecione um arquivo de imagem válido",
    "duplicateFile": "Este arquivo já foi adicionado",
    "optionsTitle": "Opções de conversão",
    "scaleLabel": "Escala (%)",
    "scaleHint": "Redimensione todas as imagens por porcentagem.",
    "qualityLabel": "Qualidade",
    "qualityHint": "Valores mais altos preservam mais detalhes, mas aumentam o tamanho.",
    "methodLabel": "Esforço de compressão",
    "methodHint": "0 = mais rápido, 6 = melhor compressão.",
    "losslessLabel": "Sem perdas",
    "advancedLabel": "Opções avançadas",
    "targetSizeLabel": "Tamanho alvo (KB)",
    "targetPsnrLabel": "PSNR alvo",
    "nearLosslessLabel": "Quase sem perdas",
    "alphaQualityLabel": "Qualidade alfa",
    "snsStrengthLabel": "Força SNS",
    "filterStrengthLabel": "Força do filtro",
    "filterSharpnessLabel": "Nitidez do filtro",
    "filterTypeLabel": "Tipo de filtro",
    "partitionsLabel": "Partições",
    "segmentsLabel": "Segmentos",
    "passLabel": "Passes",
    "exactLabel": "Exato",
    "useSharpYuvLabel": "YUV nítido",
    "optionDefault": "Padrão",
    "optionOn": "Ligado",
    "optionOff": "Desligado",
    "saved": "Economia",
    "totalSaved": "Economia total",
    "convert": "Converter para WebP",
    "converting": "Convertendo...",
    "resultsTitle": "Resultados",
    "resultCount": "{count} imagens convertidas",
    "downloadWebp": "Baixar WebP",
    "downloadZip": "Baixar ZIP WebP",
    "original": "Original",
    "output": "Saída",
    "dimensions": "Dimensões",
    "fileSize": "Tamanho do arquivo",
    "convertSuccess": "Conversão concluída!",
    "convertFailed": "Falha ao converter imagens. Tente novamente.",
    "partialFailed": "Alguns arquivos não foram convertidos ({count}).",
    "invalidImage": "Não foi possível carregar a imagem. Tente outro arquivo.",
    "canvasUnavailable": "Canvas não está disponível neste navegador.",
    "zipFailed": "Falha ao criar o ZIP. Tente novamente.",
    "note": "Executa localmente no seu navegador. Sem envios."
  },
  "ar": {
    "uploadTitle": "رفع الصور",
    "dragDropOrClick": "انقر أو اسحب لرفع الصور",
    "supportedFormats": "يدعم PNG وJPG وWebP وGIF وSVG",
    "selectedCount": "تم اختيار {count} صورة",
    "removeFile": "إزالة",
    "clearAll": "مسح الكل",
    "invalidFileType": "يرجى اختيار ملف صورة صالح",
    "duplicateFile": "هذا الملف تمت إضافته بالفعل",
    "optionsTitle": "خيارات التحويل",
    "scaleLabel": "المقياس (%)",
    "scaleHint": "تغيير حجم جميع الصور بالنسبة المئوية.",
    "qualityLabel": "الجودة",
    "qualityHint": "القيم الأعلى تحتفظ بتفاصيل أكثر لكنها تزيد الحجم.",
    "methodLabel": "مستوى الضغط",
    "methodHint": "0 = الأسرع، 6 = أفضل ضغط.",
    "losslessLabel": "بدون فقدان",
    "advancedLabel": "خيارات متقدمة",
    "targetSizeLabel": "الحجم المستهدف (KB)",
    "targetPsnrLabel": "PSNR مستهدف",
    "nearLosslessLabel": "قريب من بدون فقدان",
    "alphaQualityLabel": "جودة ألفا",
    "snsStrengthLabel": "قوة SNS",
    "filterStrengthLabel": "قوة المرشح",
    "filterSharpnessLabel": "حدة المرشح",
    "filterTypeLabel": "نوع المرشح",
    "partitionsLabel": "الأقسام",
    "segmentsLabel": "المقاطع",
    "passLabel": "عدد التمريرات",
    "exactLabel": "دقيق",
    "useSharpYuvLabel": "YUV حاد",
    "optionDefault": "افتراضي",
    "optionOn": "تشغيل",
    "optionOff": "إيقاف",
    "saved": "توفير",
    "totalSaved": "إجمالي التوفير",
    "convert": "تحويل إلى WebP",
    "converting": "جارٍ التحويل...",
    "resultsTitle": "النتائج",
    "resultCount": "تم تحويل {count} صورة",
    "downloadWebp": "تنزيل WebP",
    "downloadZip": "تنزيل ZIP WebP",
    "original": "الأصل",
    "output": "النتيجة",
    "dimensions": "الأبعاد",
    "fileSize": "حجم الملف",
    "convertSuccess": "اكتمل التحويل!",
    "convertFailed": "فشل تحويل الصور. حاول مرة أخرى.",
    "partialFailed": "تعذر تحويل بعض الملفات ({count}).",
    "invalidImage": "تعذر تحميل الصورة. جرّب ملفًا آخر.",
    "canvasUnavailable": "Canvas غير متاح في هذا المتصفح.",
    "zipFailed": "تعذر إنشاء ملف ZIP. حاول مرة أخرى.",
    "note": "يعمل محليًا في المتصفح. لا يوجد رفع للملفات."
  },
  "hi": {
    "uploadTitle": "इमेज अपलोड करें",
    "dragDropOrClick": "इमेज अपलोड करने के लिए क्लिक करें या ड्रैग करें",
    "supportedFormats": "PNG, JPG, WebP, GIF, SVG समर्थित",
    "selectedCount": "{count} इमेज चुनी गई",
    "removeFile": "हटाएँ",
    "clearAll": "सब साफ़ करें",
    "invalidFileType": "कृपया एक मान्य इमेज फ़ाइल चुनें",
    "duplicateFile": "यह फ़ाइल पहले से जोड़ी गई है",
    "optionsTitle": "परिवर्तन विकल्प",
    "scaleLabel": "स्केल (%)",
    "scaleHint": "सभी इमेज को प्रतिशत के अनुसार रीसाइज़ करें।",
    "qualityLabel": "गुणवत्ता",
    "qualityHint": "ऊँचे मान अधिक विवरण रखते हैं लेकिन आकार बढ़ाते हैं।",
    "methodLabel": "कंप्रेशन स्तर",
    "methodHint": "0 = सबसे तेज़, 6 = सर्वोत्तम कंप्रेशन।",
    "losslessLabel": "लॉसलेस",
    "advancedLabel": "उन्नत विकल्प",
    "targetSizeLabel": "लक्ष्य आकार (KB)",
    "targetPsnrLabel": "लक्ष्य PSNR",
    "nearLosslessLabel": "लगभग लॉसलेस",
    "alphaQualityLabel": "अल्फ़ा गुणवत्ता",
    "snsStrengthLabel": "SNS शक्ति",
    "filterStrengthLabel": "फ़िल्टर शक्ति",
    "filterSharpnessLabel": "फ़िल्टर तीक्ष्णता",
    "filterTypeLabel": "फ़िल्टर प्रकार",
    "partitionsLabel": "पार्टिशन",
    "segmentsLabel": "सेगमेंट",
    "passLabel": "पास",
    "exactLabel": "सटीक",
    "useSharpYuvLabel": "शार्प YUV",
    "optionDefault": "डिफ़ॉल्ट",
    "optionOn": "चालू",
    "optionOff": "बंद",
    "saved": "बचत",
    "totalSaved": "कुल बचत",
    "convert": "WebP में बदलें",
    "converting": "बदल रहा है...",
    "resultsTitle": "परिणाम",
    "resultCount": "{count} इमेज बदली गई",
    "downloadWebp": "WebP डाउनलोड करें",
    "downloadZip": "WebP ZIP डाउनलोड करें",
    "original": "मूल",
    "output": "आउटपुट",
    "dimensions": "आकार",
    "fileSize": "फ़ाइल आकार",
    "convertSuccess": "रूपांतरण पूर्ण!",
    "convertFailed": "इमेज बदलने में विफल। कृपया फिर से प्रयास करें।",
    "partialFailed": "कुछ फ़ाइलें नहीं बदली जा सकीं ({count}).",
    "invalidImage": "इमेज लोड नहीं हो सकी। कोई अन्य फ़ाइल आज़माएँ।",
    "canvasUnavailable": "इस ब्राउज़र में Canvas उपलब्ध नहीं है।",
    "zipFailed": "ZIP बनाना विफल रहा। कृपया फिर से प्रयास करें।",
    "note": "सब कुछ आपके ब्राउज़र में स्थानीय रूप से चलता है। अपलोड नहीं होता।"
  },
  "tr": {
    "uploadTitle": "Görselleri yükle",
    "dragDropOrClick": "Görselleri yüklemek için tıklayın veya sürükleyin",
    "supportedFormats": "PNG, JPG, WebP, GIF, SVG desteklenir",
    "selectedCount": "{count} görsel seçildi",
    "removeFile": "Kaldır",
    "clearAll": "Tümünü temizle",
    "invalidFileType": "Lütfen geçerli bir görsel dosyası seçin",
    "duplicateFile": "Bu dosya zaten eklendi",
    "optionsTitle": "Dönüştürme seçenekleri",
    "scaleLabel": "Ölçek (%)",
    "scaleHint": "Tüm görselleri yüzdeye göre yeniden boyutlandırın.",
    "qualityLabel": "Kalite",
    "qualityHint": "Daha yüksek değerler daha fazla ayrıntı korur, ancak boyutu artırır.",
    "methodLabel": "Sıkıştırma düzeyi",
    "methodHint": "0 = en hızlı, 6 = en iyi sıkıştırma.",
    "losslessLabel": "Kayıpsız",
    "advancedLabel": "Gelişmiş seçenekler",
    "targetSizeLabel": "Hedef boyut (KB)",
    "targetPsnrLabel": "Hedef PSNR",
    "nearLosslessLabel": "Neredeyse kayıpsız",
    "alphaQualityLabel": "Alfa kalitesi",
    "snsStrengthLabel": "SNS gücü",
    "filterStrengthLabel": "Filtre gücü",
    "filterSharpnessLabel": "Filtre keskinliği",
    "filterTypeLabel": "Filtre türü",
    "partitionsLabel": "Bölümler",
    "segmentsLabel": "Segmentler",
    "passLabel": "Geçişler",
    "exactLabel": "Kesin",
    "useSharpYuvLabel": "Keskin YUV",
    "optionDefault": "Varsayılan",
    "optionOn": "Açık",
    "optionOff": "Kapalı",
    "saved": "Tasarruf",
    "totalSaved": "Toplam tasarruf",
    "convert": "WebP'ye dönüştür",
    "converting": "Dönüştürülüyor...",
    "resultsTitle": "Sonuçlar",
    "resultCount": "{count} görsel dönüştürüldü",
    "downloadWebp": "WebP indir",
    "downloadZip": "WebP ZIP indir",
    "original": "Orijinal",
    "output": "Çıktı",
    "dimensions": "Boyutlar",
    "fileSize": "Dosya boyutu",
    "convertSuccess": "Dönüştürme tamamlandı!",
    "convertFailed": "Görseller dönüştürülemedi. Lütfen tekrar deneyin.",
    "partialFailed": "Bazı dosyalar dönüştürülemedi ({count}).",
    "invalidImage": "Görsel yüklenemedi. Başka bir dosya deneyin.",
    "canvasUnavailable": "Canvas bu tarayıcıda kullanılamıyor.",
    "zipFailed": "ZIP oluşturulamadı. Lütfen tekrar deneyin.",
    "note": "Tarayıcınızda yerel olarak çalışır. Yükleme yok."
  },
  "nl": {
    "uploadTitle": "Afbeeldingen uploaden",
    "dragDropOrClick": "Klik of sleep om afbeeldingen te uploaden",
    "supportedFormats": "Ondersteunt PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} afbeeldingen geselecteerd",
    "removeFile": "Verwijderen",
    "clearAll": "Alles wissen",
    "invalidFileType": "Selecteer een geldig afbeeldingsbestand",
    "duplicateFile": "Dit bestand is al toegevoegd",
    "optionsTitle": "Conversie-opties",
    "scaleLabel": "Schaal (%)",
    "scaleHint": "Schaal alle afbeeldingen op basis van percentage.",
    "qualityLabel": "Kwaliteit",
    "qualityHint": "Hogere waarden behouden meer detail maar vergroten de bestandsgrootte.",
    "methodLabel": "Compressie-inspanning",
    "methodHint": "0 = snelst, 6 = beste compressie.",
    "losslessLabel": "Verliesvrij",
    "advancedLabel": "Geavanceerde opties",
    "targetSizeLabel": "Doelgrootte (KB)",
    "targetPsnrLabel": "Doel-PSNR",
    "nearLosslessLabel": "Bijna verliesvrij",
    "alphaQualityLabel": "Alfa-kwaliteit",
    "snsStrengthLabel": "SNS-sterkte",
    "filterStrengthLabel": "Filtersterkte",
    "filterSharpnessLabel": "Filterscherpte",
    "filterTypeLabel": "Filtertype",
    "partitionsLabel": "Partities",
    "segmentsLabel": "Segmenten",
    "passLabel": "Passes",
    "exactLabel": "Exact",
    "useSharpYuvLabel": "Scherpe YUV",
    "optionDefault": "Standaard",
    "optionOn": "Aan",
    "optionOff": "Uit",
    "saved": "Besparing",
    "totalSaved": "Totale besparing",
    "convert": "Converteren naar WebP",
    "converting": "Converteren...",
    "resultsTitle": "Resultaten",
    "resultCount": "{count} afbeeldingen geconverteerd",
    "downloadWebp": "WebP downloaden",
    "downloadZip": "WebP ZIP downloaden",
    "original": "Origineel",
    "output": "Uitvoer",
    "dimensions": "Afmetingen",
    "fileSize": "Bestandsgrootte",
    "convertSuccess": "Conversie voltooid!",
    "convertFailed": "Afbeeldingen konden niet worden geconverteerd. Probeer opnieuw.",
    "partialFailed": "Sommige bestanden konden niet worden geconverteerd ({count}).",
    "invalidImage": "Afbeelding kon niet worden geladen. Probeer een ander bestand.",
    "canvasUnavailable": "Canvas is niet beschikbaar in deze browser.",
    "zipFailed": "ZIP maken mislukt. Probeer opnieuw.",
    "note": "Werkt lokaal in je browser. Geen uploads."
  },
  "sv": {
    "uploadTitle": "Ladda upp bilder",
    "dragDropOrClick": "Klicka eller dra för att ladda upp bilder",
    "supportedFormats": "Stöder PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} bilder valda",
    "removeFile": "Ta bort",
    "clearAll": "Rensa alla",
    "invalidFileType": "Välj en giltig bildfil",
    "duplicateFile": "Den här filen är redan tillagd",
    "optionsTitle": "Konverteringsalternativ",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Ändra storlek på alla bilder i procent.",
    "qualityLabel": "Kvalitet",
    "qualityHint": "Högre värden behåller mer detalj men ökar filstorleken.",
    "methodLabel": "Komprimeringsinsats",
    "methodHint": "0 = snabbast, 6 = bästa komprimering.",
    "losslessLabel": "Förlustfri",
    "advancedLabel": "Avancerade alternativ",
    "targetSizeLabel": "Målstorlek (KB)",
    "targetPsnrLabel": "Mål-PSNR",
    "nearLosslessLabel": "Nästan förlustfri",
    "alphaQualityLabel": "Alfa-kvalitet",
    "snsStrengthLabel": "SNS-styrka",
    "filterStrengthLabel": "Filterstyrka",
    "filterSharpnessLabel": "Filterskärpa",
    "filterTypeLabel": "Filtertyp",
    "partitionsLabel": "Partitioner",
    "segmentsLabel": "Segment",
    "passLabel": "Pass",
    "exactLabel": "Exakt",
    "useSharpYuvLabel": "Skärpt YUV",
    "optionDefault": "Standard",
    "optionOn": "På",
    "optionOff": "Av",
    "saved": "Sparat",
    "totalSaved": "Totalt sparat",
    "convert": "Konvertera till WebP",
    "converting": "Konverterar...",
    "resultsTitle": "Resultat",
    "resultCount": "{count} bilder konverterade",
    "downloadWebp": "Ladda ner WebP",
    "downloadZip": "Ladda ner WebP ZIP",
    "original": "Original",
    "output": "Utdata",
    "dimensions": "Dimensioner",
    "fileSize": "Filstorlek",
    "convertSuccess": "Konverteringen klar!",
    "convertFailed": "Det gick inte att konvertera bilderna. Försök igen.",
    "partialFailed": "Vissa filer kunde inte konverteras ({count}).",
    "invalidImage": "Det gick inte att ladda bilden. Prova en annan fil.",
    "canvasUnavailable": "Canvas är inte tillgängligt i den här webbläsaren.",
    "zipFailed": "Det gick inte att skapa ZIP. Försök igen.",
    "note": "Körs lokalt i din webbläsare. Inga uppladdningar."
  },
  "pl": {
    "uploadTitle": "Prześlij obrazy",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać obrazy",
    "supportedFormats": "Obsługuje PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Wybrano {count} obrazów",
    "removeFile": "Usuń",
    "clearAll": "Wyczyść wszystko",
    "invalidFileType": "Wybierz prawidłowy plik obrazu",
    "duplicateFile": "Ten plik został już dodany",
    "optionsTitle": "Opcje konwersji",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Zmień rozmiar wszystkich obrazów procentowo.",
    "qualityLabel": "Jakość",
    "qualityHint": "Wyższe wartości zachowują więcej szczegółów, ale zwiększają rozmiar.",
    "methodLabel": "Wysiłek kompresji",
    "methodHint": "0 = najszybciej, 6 = najlepsza kompresja.",
    "losslessLabel": "Bezstratnie",
    "advancedLabel": "Zaawansowane opcje",
    "targetSizeLabel": "Rozmiar docelowy (KB)",
    "targetPsnrLabel": "Docelowy PSNR",
    "nearLosslessLabel": "Prawie bezstratny",
    "alphaQualityLabel": "Jakość alfa",
    "snsStrengthLabel": "Siła SNS",
    "filterStrengthLabel": "Siła filtra",
    "filterSharpnessLabel": "Ostrość filtra",
    "filterTypeLabel": "Typ filtra",
    "partitionsLabel": "Partycje",
    "segmentsLabel": "Segmenty",
    "passLabel": "Przebiegi",
    "exactLabel": "Dokładny",
    "useSharpYuvLabel": "Ostry YUV",
    "optionDefault": "Domyślny",
    "optionOn": "Włącz",
    "optionOff": "Wyłącz",
    "saved": "Oszczędność",
    "totalSaved": "Łączna oszczędność",
    "convert": "Konwertuj do WebP",
    "converting": "Konwertowanie...",
    "resultsTitle": "Wyniki",
    "resultCount": "Skonwertowano {count} obrazów",
    "downloadWebp": "Pobierz WebP",
    "downloadZip": "Pobierz ZIP WebP",
    "original": "Oryginał",
    "output": "Wynik",
    "dimensions": "Wymiary",
    "fileSize": "Rozmiar pliku",
    "convertSuccess": "Konwersja zakończona!",
    "convertFailed": "Nie udało się przekonwertować obrazów. Spróbuj ponownie.",
    "partialFailed": "Niektórych plików nie udało się przekonwertować ({count}).",
    "invalidImage": "Nie udało się wczytać obrazu. Spróbuj innego pliku.",
    "canvasUnavailable": "Canvas nie jest dostępny w tej przeglądarce.",
    "zipFailed": "Nie udało się utworzyć ZIP. Spróbuj ponownie.",
    "note": "Działa lokalnie w Twojej przeglądarce. Brak przesyłania."
  },
  "vi": {
    "uploadTitle": "Tải ảnh lên",
    "dragDropOrClick": "Nhấp hoặc kéo để tải ảnh lên",
    "supportedFormats": "Hỗ trợ PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "Đã chọn {count} ảnh",
    "removeFile": "Xóa",
    "clearAll": "Xóa tất cả",
    "invalidFileType": "Vui lòng chọn tệp ảnh hợp lệ",
    "duplicateFile": "Tệp này đã được thêm",
    "optionsTitle": "Tùy chọn chuyển đổi",
    "scaleLabel": "Tỷ lệ (%)",
    "scaleHint": "Đổi kích thước tất cả ảnh theo phần trăm.",
    "qualityLabel": "Chất lượng",
    "qualityHint": "Giá trị cao hơn giữ nhiều chi tiết hơn nhưng tăng dung lượng.",
    "methodLabel": "Mức nén",
    "methodHint": "0 = nhanh nhất, 6 = nén tốt nhất.",
    "losslessLabel": "Không mất dữ liệu",
    "advancedLabel": "Tùy chọn nâng cao",
    "targetSizeLabel": "Kích thước mục tiêu (KB)",
    "targetPsnrLabel": "PSNR mục tiêu",
    "nearLosslessLabel": "Gần như không mất dữ liệu",
    "alphaQualityLabel": "Chất lượng alpha",
    "snsStrengthLabel": "Cường độ SNS",
    "filterStrengthLabel": "Cường độ bộ lọc",
    "filterSharpnessLabel": "Độ sắc nét bộ lọc",
    "filterTypeLabel": "Loại bộ lọc",
    "partitionsLabel": "Phân vùng",
    "segmentsLabel": "Đoạn",
    "passLabel": "Lượt",
    "exactLabel": "Chính xác",
    "useSharpYuvLabel": "YUV sắc nét",
    "optionDefault": "Mặc định",
    "optionOn": "Bật",
    "optionOff": "Tắt",
    "saved": "Tiết kiệm",
    "totalSaved": "Tổng tiết kiệm",
    "convert": "Chuyển sang WebP",
    "converting": "Đang chuyển đổi...",
    "resultsTitle": "Kết quả",
    "resultCount": "Đã chuyển đổi {count} ảnh",
    "downloadWebp": "Tải WebP",
    "downloadZip": "Tải ZIP WebP",
    "original": "Gốc",
    "output": "Kết quả",
    "dimensions": "Kích thước",
    "fileSize": "Dung lượng tệp",
    "convertSuccess": "Chuyển đổi hoàn tất!",
    "convertFailed": "Chuyển đổi ảnh thất bại. Vui lòng thử lại.",
    "partialFailed": "Một số tệp không thể chuyển đổi ({count}).",
    "invalidImage": "Không thể tải ảnh. Vui lòng thử tệp khác.",
    "canvasUnavailable": "Canvas không khả dụng trên trình duyệt này.",
    "zipFailed": "Không thể tạo ZIP. Vui lòng thử lại.",
    "note": "Chạy cục bộ trong trình duyệt. Không tải lên."
  },
  "th": {
    "uploadTitle": "อัปโหลดรูปภาพ",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลดรูปภาพ",
    "supportedFormats": "รองรับ PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "เลือกแล้ว {count} รูป",
    "removeFile": "ลบ",
    "clearAll": "ล้างทั้งหมด",
    "invalidFileType": "โปรดเลือกไฟล์รูปภาพที่ถูกต้อง",
    "duplicateFile": "ไฟล์นี้ถูกเพิ่มแล้ว",
    "optionsTitle": "ตัวเลือกการแปลง",
    "scaleLabel": "สเกล (%)",
    "scaleHint": "ปรับขนาดรูปทั้งหมดตามเปอร์เซ็นต์",
    "qualityLabel": "คุณภาพ",
    "qualityHint": "ค่าสูงขึ้นเก็บรายละเอียดมากขึ้นแต่ไฟล์ใหญ่ขึ้น",
    "methodLabel": "ระดับการบีบอัด",
    "methodHint": "0 = เร็วที่สุด, 6 = บีบอัดดีที่สุด",
    "losslessLabel": "ไม่สูญเสีย",
    "advancedLabel": "ตัวเลือกขั้นสูง",
    "targetSizeLabel": "ขนาดเป้าหมาย (KB)",
    "targetPsnrLabel": "PSNR เป้าหมาย",
    "nearLosslessLabel": "เกือบไม่สูญเสีย",
    "alphaQualityLabel": "คุณภาพอัลฟา",
    "snsStrengthLabel": "ความแรง SNS",
    "filterStrengthLabel": "ความแรงฟิลเตอร์",
    "filterSharpnessLabel": "ความคมฟิลเตอร์",
    "filterTypeLabel": "ชนิดฟิลเตอร์",
    "partitionsLabel": "พาร์ทิชัน",
    "segmentsLabel": "เซ็กเมนต์",
    "passLabel": "จำนวนรอบ",
    "exactLabel": "แม่นยำ",
    "useSharpYuvLabel": "YUV คมชัด",
    "optionDefault": "ค่าเริ่มต้น",
    "optionOn": "เปิด",
    "optionOff": "ปิด",
    "saved": "ประหยัด",
    "totalSaved": "ประหยัดทั้งหมด",
    "convert": "แปลงเป็น WebP",
    "converting": "กำลังแปลง...",
    "resultsTitle": "ผลลัพธ์",
    "resultCount": "แปลงแล้ว {count} รูป",
    "downloadWebp": "ดาวน์โหลด WebP",
    "downloadZip": "ดาวน์โหลด ZIP WebP",
    "original": "ต้นฉบับ",
    "output": "ผลลัพธ์",
    "dimensions": "ขนาด",
    "fileSize": "ขนาดไฟล์",
    "convertSuccess": "แปลงเสร็จแล้ว!",
    "convertFailed": "แปลงรูปภาพไม่สำเร็จ โปรดลองอีกครั้ง",
    "partialFailed": "บางไฟล์ไม่สามารถแปลงได้ ({count}).",
    "invalidImage": "โหลดรูปภาพไม่สำเร็จ โปรดลองไฟล์อื่น",
    "canvasUnavailable": "Canvas ไม่พร้อมใช้งานในเบราว์เซอร์นี้",
    "zipFailed": "สร้าง ZIP ไม่สำเร็จ โปรดลองอีกครั้ง",
    "note": "ทำงานในเบราว์เซอร์ของคุณแบบโลคัล ไม่มีการอัปโหลด"
  },
  "id": {
    "uploadTitle": "Unggah gambar",
    "dragDropOrClick": "Klik atau seret untuk mengunggah gambar",
    "supportedFormats": "Mendukung PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} gambar dipilih",
    "removeFile": "Hapus",
    "clearAll": "Bersihkan semua",
    "invalidFileType": "Silakan pilih file gambar yang valid",
    "duplicateFile": "File ini sudah ditambahkan",
    "optionsTitle": "Opsi konversi",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Ubah ukuran semua gambar berdasarkan persentase.",
    "qualityLabel": "Kualitas",
    "qualityHint": "Nilai lebih tinggi mempertahankan detail lebih banyak tetapi ukuran bertambah.",
    "methodLabel": "Tingkat kompresi",
    "methodHint": "0 = tercepat, 6 = kompresi terbaik.",
    "losslessLabel": "Tanpa kehilangan",
    "advancedLabel": "Opsi lanjutan",
    "targetSizeLabel": "Ukuran target (KB)",
    "targetPsnrLabel": "PSNR target",
    "nearLosslessLabel": "Hampir tanpa kehilangan",
    "alphaQualityLabel": "Kualitas alfa",
    "snsStrengthLabel": "Kekuatan SNS",
    "filterStrengthLabel": "Kekuatan filter",
    "filterSharpnessLabel": "Ketajaman filter",
    "filterTypeLabel": "Jenis filter",
    "partitionsLabel": "Partisi",
    "segmentsLabel": "Segmen",
    "passLabel": "Putaran",
    "exactLabel": "Tepat",
    "useSharpYuvLabel": "YUV tajam",
    "optionDefault": "Default",
    "optionOn": "Aktif",
    "optionOff": "Nonaktif",
    "saved": "Hemat",
    "totalSaved": "Total hemat",
    "convert": "Konversi ke WebP",
    "converting": "Mengonversi...",
    "resultsTitle": "Hasil",
    "resultCount": "{count} gambar dikonversi",
    "downloadWebp": "Unduh WebP",
    "downloadZip": "Unduh ZIP WebP",
    "original": "Asli",
    "output": "Hasil",
    "dimensions": "Dimensi",
    "fileSize": "Ukuran file",
    "convertSuccess": "Konversi selesai!",
    "convertFailed": "Gagal mengonversi gambar. Silakan coba lagi.",
    "partialFailed": "Beberapa file tidak dapat dikonversi ({count}).",
    "invalidImage": "Gagal memuat gambar. Coba file lain.",
    "canvasUnavailable": "Canvas tidak tersedia di browser ini.",
    "zipFailed": "Gagal membuat ZIP. Silakan coba lagi.",
    "note": "Berjalan secara lokal di browser Anda. Tidak ada unggahan."
  },
  "he": {
    "uploadTitle": "העלאת תמונות",
    "dragDropOrClick": "לחץ או גרור כדי להעלות תמונות",
    "supportedFormats": "תומך ב-PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "נבחרו {count} תמונות",
    "removeFile": "הסר",
    "clearAll": "נקה הכל",
    "invalidFileType": "אנא בחר קובץ תמונה תקין",
    "duplicateFile": "הקובץ הזה כבר נוסף",
    "optionsTitle": "אפשרויות המרה",
    "scaleLabel": "קנה מידה (%)",
    "scaleHint": "שנה את גודל כל התמונות לפי אחוז.",
    "qualityLabel": "איכות",
    "qualityHint": "ערכים גבוהים שומרים על יותר פרטים אך מגדילים את הקובץ.",
    "methodLabel": "מאמץ דחיסה",
    "methodHint": "0 = המהיר ביותר, 6 = הדחיסה הטובה ביותר.",
    "losslessLabel": "ללא אובדן",
    "advancedLabel": "אפשרויות מתקדמות",
    "targetSizeLabel": "גודל יעד (KB)",
    "targetPsnrLabel": "PSNR יעד",
    "nearLosslessLabel": "כמעט ללא אובדן",
    "alphaQualityLabel": "איכות אלפא",
    "snsStrengthLabel": "עוצמת SNS",
    "filterStrengthLabel": "עוצמת פילטר",
    "filterSharpnessLabel": "חדות פילטר",
    "filterTypeLabel": "סוג פילטר",
    "partitionsLabel": "מחיצות",
    "segmentsLabel": "מקטעים",
    "passLabel": "מעברים",
    "exactLabel": "מדויק",
    "useSharpYuvLabel": "YUV חד",
    "optionDefault": "ברירת מחדל",
    "optionOn": "מופעל",
    "optionOff": "כבוי",
    "saved": "חיסכון",
    "totalSaved": "חיסכון כולל",
    "convert": "המר ל-WebP",
    "converting": "ממיר...",
    "resultsTitle": "תוצאות",
    "resultCount": "הומרו {count} תמונות",
    "downloadWebp": "הורד WebP",
    "downloadZip": "הורד ZIP WebP",
    "original": "מקור",
    "output": "פלט",
    "dimensions": "ממדים",
    "fileSize": "גודל קובץ",
    "convertSuccess": "ההמרה הושלמה!",
    "convertFailed": "המרת התמונות נכשלה. נסה שוב.",
    "partialFailed": "חלק מהקבצים לא הומרו ({count}).",
    "invalidImage": "לא ניתן היה לטעון את התמונה. נסה קובץ אחר.",
    "canvasUnavailable": "Canvas לא זמין בדפדפן זה.",
    "zipFailed": "יצירת ZIP נכשלה. נסה שוב.",
    "note": "פועל מקומית בדפדפן שלך. ללא העלאות."
  },
  "ms": {
    "uploadTitle": "Muat naik imej",
    "dragDropOrClick": "Klik atau seret untuk memuat naik imej",
    "supportedFormats": "Menyokong PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} imej dipilih",
    "removeFile": "Buang",
    "clearAll": "Kosongkan semua",
    "invalidFileType": "Sila pilih fail imej yang sah",
    "duplicateFile": "Fail ini sudah ditambah",
    "optionsTitle": "Pilihan penukaran",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Ubah saiz semua imej mengikut peratusan.",
    "qualityLabel": "Kualiti",
    "qualityHint": "Nilai lebih tinggi mengekalkan lebih banyak butiran tetapi saiz bertambah.",
    "methodLabel": "Usaha pemampatan",
    "methodHint": "0 = terpantas, 6 = pemampatan terbaik.",
    "losslessLabel": "Tanpa kehilangan",
    "advancedLabel": "Pilihan lanjutan",
    "targetSizeLabel": "Saiz sasaran (KB)",
    "targetPsnrLabel": "PSNR sasaran",
    "nearLosslessLabel": "Hampir tanpa kehilangan",
    "alphaQualityLabel": "Kualiti alfa",
    "snsStrengthLabel": "Kekuatan SNS",
    "filterStrengthLabel": "Kekuatan penapis",
    "filterSharpnessLabel": "Ketajaman penapis",
    "filterTypeLabel": "Jenis penapis",
    "partitionsLabel": "Partisi",
    "segmentsLabel": "Segmen",
    "passLabel": "Laluan",
    "exactLabel": "Tepat",
    "useSharpYuvLabel": "YUV tajam",
    "optionDefault": "Lalai",
    "optionOn": "Hidup",
    "optionOff": "Mati",
    "saved": "Penjimatan",
    "totalSaved": "Jumlah penjimatan",
    "convert": "Tukar ke WebP",
    "converting": "Menukar...",
    "resultsTitle": "Keputusan",
    "resultCount": "{count} imej ditukar",
    "downloadWebp": "Muat turun WebP",
    "downloadZip": "Muat turun ZIP WebP",
    "original": "Asal",
    "output": "Output",
    "dimensions": "Dimensi",
    "fileSize": "Saiz fail",
    "convertSuccess": "Penukaran selesai!",
    "convertFailed": "Gagal menukar imej. Sila cuba lagi.",
    "partialFailed": "Sebahagian fail tidak dapat ditukar ({count}).",
    "invalidImage": "Gagal memuatkan imej. Cuba fail lain.",
    "canvasUnavailable": "Canvas tidak tersedia dalam pelayar ini.",
    "zipFailed": "Gagal membuat ZIP. Sila cuba lagi.",
    "note": "Berjalan secara tempatan dalam pelayar anda. Tiada muat naik."
  },
  "no": {
    "uploadTitle": "Last opp bilder",
    "dragDropOrClick": "Klikk eller dra for å laste opp bilder",
    "supportedFormats": "Støtter PNG, JPG, WebP, GIF, SVG",
    "selectedCount": "{count} bilder valgt",
    "removeFile": "Fjern",
    "clearAll": "Tøm alt",
    "invalidFileType": "Velg en gyldig bildefil",
    "duplicateFile": "Denne filen er allerede lagt til",
    "optionsTitle": "Konverteringsvalg",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Endre størrelse på alle bilder i prosent.",
    "qualityLabel": "Kvalitet",
    "qualityHint": "Høyere verdier beholder mer detaljer, men øker filstørrelsen.",
    "methodLabel": "Kompresjonsnivå",
    "methodHint": "0 = raskest, 6 = best komprimering.",
    "losslessLabel": "Tapsfri",
    "advancedLabel": "Avanserte alternativer",
    "targetSizeLabel": "Målstørrelse (KB)",
    "targetPsnrLabel": "Mål-PSNR",
    "nearLosslessLabel": "Nesten tapsfri",
    "alphaQualityLabel": "Alfakvalitet",
    "snsStrengthLabel": "SNS-styrke",
    "filterStrengthLabel": "Filterstyrke",
    "filterSharpnessLabel": "Filterskarphet",
    "filterTypeLabel": "Filtertype",
    "partitionsLabel": "Partisjoner",
    "segmentsLabel": "Segmenter",
    "passLabel": "Passeringer",
    "exactLabel": "Eksakt",
    "useSharpYuvLabel": "Skarp YUV",
    "optionDefault": "Standard",
    "optionOn": "På",
    "optionOff": "Av",
    "saved": "Spart",
    "totalSaved": "Totalt spart",
    "convert": "Konverter til WebP",
    "converting": "Konverterer...",
    "resultsTitle": "Resultater",
    "resultCount": "{count} bilder konvertert",
    "downloadWebp": "Last ned WebP",
    "downloadZip": "Last ned WebP ZIP",
    "original": "Original",
    "output": "Utdata",
    "dimensions": "Dimensjoner",
    "fileSize": "Filstørrelse",
    "convertSuccess": "Konvertering fullført!",
    "convertFailed": "Kunne ikke konvertere bildene. Prøv igjen.",
    "partialFailed": "Noen filer kunne ikke konverteres ({count}).",
    "invalidImage": "Kunne ikke laste bildet. Prøv en annen fil.",
    "canvasUnavailable": "Canvas er ikke tilgjengelig i denne nettleseren.",
    "zipFailed": "Kunne ikke opprette ZIP. Prøv igjen.",
    "note": "Kjører lokalt i nettleseren din. Ingen opplastinger."
  }
}
</i18n>
