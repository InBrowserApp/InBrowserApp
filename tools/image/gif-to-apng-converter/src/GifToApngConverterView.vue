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
      v-model:speed="speed"
      v-model:loop-mode="loopMode"
      v-model:loop-count="loopCount"
      v-model:optimize="optimize"
      v-model:optimize-level="optimizeLevel"
      :title="t('optionsTitle')"
      :scale-label="t('scaleLabel')"
      :scale-hint="t('scaleHint')"
      :speed-label="t('speedLabel')"
      :speed-hint="t('speedHint')"
      :loop-label="t('loopLabel')"
      :loop-hint="t('loopHint')"
      :loop-count-label="t('loopCountLabel')"
      :loop-inherit-label="t('loopInherit')"
      :loop-infinite-label="t('loopInfinite')"
      :loop-custom-label="t('loopCustom')"
      :optimize-label="t('optimizeLabel')"
      :optimize-level-label="t('optimizeLevelLabel')"
      :optimize-hint="t('optimizeHint')"
      :convert-label="t('convert')"
      :converting-label="t('converting')"
      :min-scale="minScale"
      :max-scale="maxScale"
      :min-speed="minSpeed"
      :max-speed="maxSpeed"
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
      :download-png-label="t('downloadPng')"
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
import { convertGifToApng } from './utils/convert-gif-to-apng'
import { createApngZip } from './utils/create-apng-zip'
import type { GifLoopMode, GifToApngOptions, GifToApngResult } from './types'

const { t } = useI18n()
const message = useMessage()

const files = ref<File[]>([])
const scale = ref(100)
const speed = ref(1)
const loopMode = ref<GifLoopMode>('inherit')
const loopCount = ref<number | null>(null)
const optimize = ref(true)
const optimizeLevel = ref(2)
const results = ref<GifToApngResult[]>([])
const zipBlob = ref<Blob | null>(null)
const error = ref('')
const isConverting = ref(false)
const isZipping = ref(false)

const minScale = 10
const maxScale = 400
const minSpeed = 0.25
const maxSpeed = 4
const zipName = 'apng-images.zip'

const canConvert = computed(() => files.value.length > 0 && !isConverting.value)

let runId = 0

watch([files, scale, speed, loopMode, loopCount, optimize, optimizeLevel], () => {
  runId += 1
  results.value = []
  zipBlob.value = null
  error.value = ''
  isConverting.value = false
  isZipping.value = false
})

watch(loopMode, (mode) => {
  if (mode === 'custom' && loopCount.value === null) {
    loopCount.value = 1
  }
})

async function convertImages() {
  if (!files.value.length || isConverting.value) return

  const currentRun = ++runId
  isConverting.value = true
  isZipping.value = false
  error.value = ''
  results.value = []
  zipBlob.value = null

  const nameCounts = new Map<string, number>()
  const nextResults: GifToApngResult[] = []
  const errors: string[] = []

  try {
    for (const file of files.value) {
      const outputName = buildOutputName(file.name, nameCounts)
      try {
        const result = await convertGifToApng(file, buildConversionOptions(), outputName)
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
        const zip = await createApngZip(nextResults)
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

function buildConversionOptions(): GifToApngOptions {
  return {
    scale: scale.value,
    speed: speed.value,
    loopMode: loopMode.value,
    loopCount: loopCount.value ?? undefined,
    optimize: optimize.value,
    optimizeLevel: optimizeLevel.value,
  }
}

function resolveErrorMessage(err: unknown) {
  if (err instanceof Error) {
    switch (err.message) {
      case 'INVALID_GIF':
        return t('invalidGif')
      case 'EMPTY_GIF':
        return t('emptyGif')
      case 'INVALID_FRAME':
        return t('invalidFrame')
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
  const candidate = `${base}.png`
  const currentCount = nameCounts.get(candidate) ?? 0
  nameCounts.set(candidate, currentCount + 1)

  if (currentCount === 0) return candidate
  return `${base}-${currentCount + 1}.png`
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload GIFs",
    "dragDropOrClick": "Click or drag to upload GIFs",
    "supportedFormats": "Supports GIF files",
    "selectedCount": "Selected {count} GIFs",
    "removeFile": "Remove",
    "clearAll": "Clear all",
    "invalidFileType": "Please select a valid GIF file",
    "duplicateFile": "This file is already added",
    "optionsTitle": "Conversion Options",
    "scaleLabel": "Scale (%)",
    "scaleHint": "Resize frames by percentage.",
    "speedLabel": "Speed multiplier",
    "speedHint": "1 = original speed, 2 = twice as fast.",
    "loopLabel": "Loop",
    "loopHint": "Follow GIF defaults to 1 if missing.",
    "loopCountLabel": "Loop count",
    "loopInherit": "Follow GIF",
    "loopInfinite": "Infinite",
    "loopCustom": "Custom",
    "optimizeLabel": "Optimize with Oxipng",
    "optimizeLevelLabel": "Optimization level",
    "optimizeHint": "0 = fastest, 6 = smallest size.",
    "convert": "Convert to APNG",
    "converting": "Converting...",
    "resultsTitle": "Results",
    "resultCount": "Converted {count} files",
    "downloadPng": "Download PNG",
    "downloadZip": "Download ZIP",
    "original": "Original",
    "output": "Output",
    "saved": "Saved",
    "dimensions": "Dimensions",
    "fileSize": "File size",
    "totalSaved": "Total saved",
    "note": "APNG outputs are saved as .png files. If the GIF has no loop info, the default is 1 play.",
    "convertSuccess": "Conversion completed!",
    "convertFailed": "Failed to convert GIFs. Please try again.",
    "partialFailed": "{count} files failed to convert.",
    "invalidGif": "Invalid GIF file.",
    "emptyGif": "The GIF contains no frames.",
    "invalidFrame": "Failed to decode GIF frames.",
    "canvasUnavailable": "Canvas rendering is unavailable.",
    "zipFailed": "Failed to create ZIP file."
  },
  "zh": {
    "uploadTitle": "上传 GIF",
    "dragDropOrClick": "点击或拖拽上传 GIF",
    "supportedFormats": "支持 GIF 文件",
    "selectedCount": "已选择 {count} 个 GIF",
    "removeFile": "移除",
    "clearAll": "清空",
    "invalidFileType": "请选择有效的 GIF 文件",
    "duplicateFile": "该文件已添加",
    "optionsTitle": "转换选项",
    "scaleLabel": "缩放 (%)",
    "scaleHint": "按百分比缩放帧。",
    "speedLabel": "速度倍数",
    "speedHint": "1 为原速，2 为两倍速。",
    "loopLabel": "循环",
    "loopHint": "沿用 GIF，缺省则为 1 次。",
    "loopCountLabel": "循环次数",
    "loopInherit": "沿用 GIF",
    "loopInfinite": "无限循环",
    "loopCustom": "自定义",
    "optimizeLabel": "使用 Oxipng 优化",
    "optimizeLevelLabel": "优化级别",
    "optimizeHint": "0 最快，6 体积最小。",
    "convert": "转换为 APNG",
    "converting": "转换中...",
    "resultsTitle": "结果",
    "resultCount": "已转换 {count} 个文件",
    "downloadPng": "下载 PNG",
    "downloadZip": "下载 ZIP",
    "original": "原始",
    "output": "输出",
    "saved": "节省",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "totalSaved": "总共节省",
    "note": "APNG 输出为 .png 文件。如果 GIF 未提供循环信息，默认播放 1 次。",
    "convertSuccess": "转换完成！",
    "convertFailed": "转换失败，请重试。",
    "partialFailed": "有 {count} 个文件转换失败。",
    "invalidGif": "GIF 文件无效。",
    "emptyGif": "GIF 不包含帧。",
    "invalidFrame": "GIF 帧解码失败。",
    "canvasUnavailable": "无法使用画布渲染。",
    "zipFailed": "生成 ZIP 失败。"
  },
  "zh-CN": {
    "uploadTitle": "上传 GIF",
    "dragDropOrClick": "点击或拖拽上传 GIF",
    "supportedFormats": "支持 GIF 文件",
    "selectedCount": "已选择 {count} 个 GIF",
    "removeFile": "移除",
    "clearAll": "清空",
    "invalidFileType": "请选择有效的 GIF 文件",
    "duplicateFile": "该文件已添加",
    "optionsTitle": "转换选项",
    "scaleLabel": "缩放 (%)",
    "scaleHint": "按百分比缩放帧。",
    "speedLabel": "速度倍数",
    "speedHint": "1 为原速，2 为两倍速。",
    "loopLabel": "循环",
    "loopHint": "沿用 GIF，缺省则为 1 次。",
    "loopCountLabel": "循环次数",
    "loopInherit": "沿用 GIF",
    "loopInfinite": "无限循环",
    "loopCustom": "自定义",
    "optimizeLabel": "使用 Oxipng 优化",
    "optimizeLevelLabel": "优化级别",
    "optimizeHint": "0 最快，6 体积最小。",
    "convert": "转换为 APNG",
    "converting": "转换中...",
    "resultsTitle": "结果",
    "resultCount": "已转换 {count} 个文件",
    "downloadPng": "下载 PNG",
    "downloadZip": "下载 ZIP",
    "original": "原始",
    "output": "输出",
    "saved": "节省",
    "dimensions": "尺寸",
    "fileSize": "文件大小",
    "totalSaved": "总共节省",
    "note": "APNG 输出为 .png 文件。如果 GIF 未提供循环信息，默认播放 1 次。",
    "convertSuccess": "转换完成！",
    "convertFailed": "转换失败，请重试。",
    "partialFailed": "有 {count} 个文件转换失败。",
    "invalidGif": "GIF 文件无效。",
    "emptyGif": "GIF 不包含帧。",
    "invalidFrame": "GIF 帧解码失败。",
    "canvasUnavailable": "无法使用画布渲染。",
    "zipFailed": "生成 ZIP 失败。"
  },
  "zh-TW": {
    "uploadTitle": "上傳 GIF",
    "dragDropOrClick": "點擊或拖曳上傳 GIF",
    "supportedFormats": "支援 GIF 檔案",
    "selectedCount": "已選擇 {count} 個 GIF",
    "removeFile": "移除",
    "clearAll": "清空",
    "invalidFileType": "請選擇有效的 GIF 檔案",
    "duplicateFile": "此檔案已新增",
    "optionsTitle": "轉換選項",
    "scaleLabel": "縮放 (%)",
    "scaleHint": "依百分比縮放影格。",
    "speedLabel": "速度倍數",
    "speedHint": "1 為原速，2 為兩倍速。",
    "loopLabel": "循環",
    "loopHint": "沿用 GIF，缺省為 1 次。",
    "loopCountLabel": "循環次數",
    "loopInherit": "沿用 GIF",
    "loopInfinite": "無限循環",
    "loopCustom": "自訂",
    "optimizeLabel": "使用 Oxipng 最佳化",
    "optimizeLevelLabel": "最佳化級別",
    "optimizeHint": "0 最快，6 體積最小。",
    "convert": "轉換為 APNG",
    "converting": "轉換中...",
    "resultsTitle": "結果",
    "resultCount": "已轉換 {count} 個檔案",
    "downloadPng": "下載 PNG",
    "downloadZip": "下載 ZIP",
    "original": "原始",
    "output": "輸出",
    "saved": "節省",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "totalSaved": "總共節省",
    "note": "APNG 輸出為 .png 檔案。如果 GIF 未提供循環資訊，預設播放 1 次。",
    "convertSuccess": "轉換完成！",
    "convertFailed": "轉換失敗，請重試。",
    "partialFailed": "有 {count} 個檔案轉換失敗。",
    "invalidGif": "GIF 檔案無效。",
    "emptyGif": "GIF 不包含影格。",
    "invalidFrame": "GIF 影格解碼失敗。",
    "canvasUnavailable": "無法使用畫布渲染。",
    "zipFailed": "建立 ZIP 失敗。"
  },
  "zh-HK": {
    "uploadTitle": "上傳 GIF",
    "dragDropOrClick": "點擊或拖曳上傳 GIF",
    "supportedFormats": "支援 GIF 檔案",
    "selectedCount": "已選擇 {count} 個 GIF",
    "removeFile": "移除",
    "clearAll": "清空",
    "invalidFileType": "請選擇有效的 GIF 檔案",
    "duplicateFile": "此檔案已新增",
    "optionsTitle": "轉換選項",
    "scaleLabel": "縮放 (%)",
    "scaleHint": "依百分比縮放影格。",
    "speedLabel": "速度倍數",
    "speedHint": "1 為原速，2 為兩倍速。",
    "loopLabel": "循環",
    "loopHint": "沿用 GIF，缺省為 1 次。",
    "loopCountLabel": "循環次數",
    "loopInherit": "沿用 GIF",
    "loopInfinite": "無限循環",
    "loopCustom": "自訂",
    "optimizeLabel": "使用 Oxipng 最佳化",
    "optimizeLevelLabel": "最佳化級別",
    "optimizeHint": "0 最快，6 體積最小。",
    "convert": "轉換為 APNG",
    "converting": "轉換中...",
    "resultsTitle": "結果",
    "resultCount": "已轉換 {count} 個檔案",
    "downloadPng": "下載 PNG",
    "downloadZip": "下載 ZIP",
    "original": "原始",
    "output": "輸出",
    "saved": "節省",
    "dimensions": "尺寸",
    "fileSize": "檔案大小",
    "totalSaved": "總共節省",
    "note": "APNG 輸出為 .png 檔案。如果 GIF 未提供循環資訊，預設播放 1 次。",
    "convertSuccess": "轉換完成！",
    "convertFailed": "轉換失敗，請重試。",
    "partialFailed": "有 {count} 個檔案轉換失敗。",
    "invalidGif": "GIF 檔案無效。",
    "emptyGif": "GIF 不包含影格。",
    "invalidFrame": "GIF 影格解碼失敗。",
    "canvasUnavailable": "無法使用畫布渲染。",
    "zipFailed": "建立 ZIP 失敗。"
  },
  "es": {
    "uploadTitle": "Subir GIF",
    "dragDropOrClick": "Haz clic o arrastra para subir GIF",
    "supportedFormats": "Admite archivos GIF",
    "selectedCount": "Seleccionados {count} GIF",
    "removeFile": "Eliminar",
    "clearAll": "Limpiar todo",
    "invalidFileType": "Selecciona un GIF válido",
    "duplicateFile": "Este archivo ya está añadido",
    "optionsTitle": "Opciones de conversión",
    "scaleLabel": "Escala (%)",
    "scaleHint": "Redimensiona los fotogramas por porcentaje.",
    "speedLabel": "Multiplicador de velocidad",
    "speedHint": "1 = velocidad original, 2 = el doble de rápido.",
    "loopLabel": "Bucle",
    "loopHint": "Seguir GIF, por defecto 1 si falta.",
    "loopCountLabel": "Repeticiones",
    "loopInherit": "Seguir GIF",
    "loopInfinite": "Infinito",
    "loopCustom": "Personalizado",
    "optimizeLabel": "Optimizar con Oxipng",
    "optimizeLevelLabel": "Nivel de optimización",
    "optimizeHint": "0 = más rápido, 6 = tamaño más pequeño.",
    "convert": "Convertir a APNG",
    "converting": "Convirtiendo...",
    "resultsTitle": "Resultados",
    "resultCount": "Convertidos {count} archivos",
    "downloadPng": "Descargar PNG",
    "downloadZip": "Descargar ZIP",
    "original": "Original",
    "output": "Salida",
    "saved": "Ahorro",
    "dimensions": "Dimensiones",
    "fileSize": "Tamaño",
    "totalSaved": "Ahorro total",
    "note": "Los APNG se guardan como archivos .png. Si el GIF no define bucle, se usa 1 repetición.",
    "convertSuccess": "¡Conversión completada!",
    "convertFailed": "No se pudieron convertir los GIF. Inténtalo de nuevo.",
    "partialFailed": "{count} archivos fallaron al convertir.",
    "invalidGif": "Archivo GIF no válido.",
    "emptyGif": "El GIF no contiene fotogramas.",
    "invalidFrame": "No se pudieron decodificar los fotogramas del GIF.",
    "canvasUnavailable": "El lienzo no está disponible.",
    "zipFailed": "No se pudo crear el ZIP."
  },
  "fr": {
    "uploadTitle": "Télécharger des GIF",
    "dragDropOrClick": "Cliquez ou faites glisser pour téléverser des GIF",
    "supportedFormats": "Prend en charge les fichiers GIF",
    "selectedCount": "{count} GIF sélectionnés",
    "removeFile": "Supprimer",
    "clearAll": "Tout effacer",
    "invalidFileType": "Veuillez sélectionner un GIF valide",
    "duplicateFile": "Ce fichier est déjà ajouté",
    "optionsTitle": "Options de conversion",
    "scaleLabel": "Échelle (%)",
    "scaleHint": "Redimensionne les images par pourcentage.",
    "speedLabel": "Multiplicateur de vitesse",
    "speedHint": "1 = vitesse d'origine, 2 = deux fois plus rapide.",
    "loopLabel": "Boucle",
    "loopHint": "Suivre le GIF, 1 par défaut si manquant.",
    "loopCountLabel": "Nombre de boucles",
    "loopInherit": "Suivre le GIF",
    "loopInfinite": "Infini",
    "loopCustom": "Personnalisé",
    "optimizeLabel": "Optimiser avec Oxipng",
    "optimizeLevelLabel": "Niveau d’optimisation",
    "optimizeHint": "0 = plus rapide, 6 = taille minimale.",
    "convert": "Convertir en APNG",
    "converting": "Conversion...",
    "resultsTitle": "Résultats",
    "resultCount": "{count} fichiers convertis",
    "downloadPng": "Télécharger PNG",
    "downloadZip": "Télécharger ZIP",
    "original": "Original",
    "output": "Sortie",
    "saved": "Économie",
    "dimensions": "Dimensions",
    "fileSize": "Taille",
    "totalSaved": "Économie totale",
    "note": "Les APNG sont enregistrés en .png. Si le GIF n'a pas de boucle, 1 lecture est utilisée.",
    "convertSuccess": "Conversion terminée !",
    "convertFailed": "Échec de la conversion des GIF. Veuillez réessayer.",
    "partialFailed": "{count} fichiers n'ont pas été convertis.",
    "invalidGif": "Fichier GIF invalide.",
    "emptyGif": "Le GIF ne contient aucune image.",
    "invalidFrame": "Impossible de décoder les images du GIF.",
    "canvasUnavailable": "Le canvas n’est pas disponible.",
    "zipFailed": "Échec de la création du ZIP."
  },
  "de": {
    "uploadTitle": "GIF hochladen",
    "dragDropOrClick": "Klicken oder ziehen, um GIFs hochzuladen",
    "supportedFormats": "Unterstützt GIF-Dateien",
    "selectedCount": "{count} GIF ausgewählt",
    "removeFile": "Entfernen",
    "clearAll": "Alles löschen",
    "invalidFileType": "Bitte eine gültige GIF-Datei auswählen",
    "duplicateFile": "Diese Datei ist bereits hinzugefügt",
    "optionsTitle": "Konvertierungsoptionen",
    "scaleLabel": "Skalierung (%)",
    "scaleHint": "Rahmen prozentual skalieren.",
    "speedLabel": "Geschwindigkeitsfaktor",
    "speedHint": "1 = Originalgeschwindigkeit, 2 = doppelt so schnell.",
    "loopLabel": "Schleife",
    "loopHint": "GIF folgen, fehlt → Standard 1.",
    "loopCountLabel": "Schleifendurchläufe",
    "loopInherit": "GIF folgen",
    "loopInfinite": "Unendlich",
    "loopCustom": "Benutzerdefiniert",
    "optimizeLabel": "Mit Oxipng optimieren",
    "optimizeLevelLabel": "Optimierungsstufe",
    "optimizeHint": "0 = am schnellsten, 6 = kleinste Größe.",
    "convert": "In APNG konvertieren",
    "converting": "Wird konvertiert...",
    "resultsTitle": "Ergebnisse",
    "resultCount": "{count} Dateien konvertiert",
    "downloadPng": "PNG herunterladen",
    "downloadZip": "ZIP herunterladen",
    "original": "Original",
    "output": "Ausgabe",
    "saved": "Ersparnis",
    "dimensions": "Abmessungen",
    "fileSize": "Dateigröße",
    "totalSaved": "Gesamtersparnis",
    "note": "APNG-Ausgaben werden als .png gespeichert. Wenn das GIF keine Schleife angibt, wird 1 Durchlauf verwendet.",
    "convertSuccess": "Konvertierung abgeschlossen!",
    "convertFailed": "GIFs konnten nicht konvertiert werden. Bitte erneut versuchen.",
    "partialFailed": "{count} Dateien konnten nicht konvertiert werden.",
    "invalidGif": "Ungültige GIF-Datei.",
    "emptyGif": "Das GIF enthält keine Frames.",
    "invalidFrame": "GIF-Frames konnten nicht dekodiert werden.",
    "canvasUnavailable": "Canvas ist nicht verfügbar.",
    "zipFailed": "ZIP konnte nicht erstellt werden."
  },
  "it": {
    "uploadTitle": "Carica GIF",
    "dragDropOrClick": "Fai clic o trascina per caricare GIF",
    "supportedFormats": "Supporta file GIF",
    "selectedCount": "Selezionati {count} GIF",
    "removeFile": "Rimuovi",
    "clearAll": "Cancella tutto",
    "invalidFileType": "Seleziona un GIF valido",
    "duplicateFile": "Questo file è già stato aggiunto",
    "optionsTitle": "Opzioni di conversione",
    "scaleLabel": "Scala (%)",
    "scaleHint": "Ridimensiona i fotogrammi in percentuale.",
    "speedLabel": "Moltiplicatore velocità",
    "speedHint": "1 = velocità originale, 2 = due volte più veloce.",
    "loopLabel": "Loop",
    "loopHint": "Segui il GIF, predefinito 1 se assente.",
    "loopCountLabel": "Numero di loop",
    "loopInherit": "Segui il GIF",
    "loopInfinite": "Infinito",
    "loopCustom": "Personalizzato",
    "optimizeLabel": "Ottimizza con Oxipng",
    "optimizeLevelLabel": "Livello di ottimizzazione",
    "optimizeHint": "0 = più veloce, 6 = dimensione minore.",
    "convert": "Converti in APNG",
    "converting": "Conversione...",
    "resultsTitle": "Risultati",
    "resultCount": "{count} file convertiti",
    "downloadPng": "Scarica PNG",
    "downloadZip": "Scarica ZIP",
    "original": "Originale",
    "output": "Output",
    "saved": "Risparmio",
    "dimensions": "Dimensioni",
    "fileSize": "Dimensione file",
    "totalSaved": "Risparmio totale",
    "note": "Gli APNG vengono salvati come .png. Se il GIF non specifica il loop, usa 1 riproduzione.",
    "convertSuccess": "Conversione completata!",
    "convertFailed": "Conversione GIF non riuscita. Riprova.",
    "partialFailed": "{count} file non sono stati convertiti.",
    "invalidGif": "File GIF non valido.",
    "emptyGif": "Il GIF non contiene fotogrammi.",
    "invalidFrame": "Impossibile decodificare i fotogrammi del GIF.",
    "canvasUnavailable": "Canvas non disponibile.",
    "zipFailed": "Creazione ZIP non riuscita."
  },
  "ja": {
    "uploadTitle": "GIFをアップロード",
    "dragDropOrClick": "クリックまたはドラッグでGIFをアップロード",
    "supportedFormats": "GIFファイルに対応",
    "selectedCount": "{count} 個のGIFを選択",
    "removeFile": "削除",
    "clearAll": "すべてクリア",
    "invalidFileType": "有効なGIFファイルを選択してください",
    "duplicateFile": "このファイルは既に追加されています",
    "optionsTitle": "変換オプション",
    "scaleLabel": "倍率 (%)",
    "scaleHint": "フレームを割合で拡大縮小します。",
    "speedLabel": "速度倍率",
    "speedHint": "1 = 元の速度、2 = 2倍速。",
    "loopLabel": "ループ",
    "loopHint": "GIFに従う（未指定なら1回）。",
    "loopCountLabel": "ループ回数",
    "loopInherit": "GIFに従う",
    "loopInfinite": "無限",
    "loopCustom": "カスタム",
    "optimizeLabel": "Oxipngで最適化",
    "optimizeLevelLabel": "最適化レベル",
    "optimizeHint": "0 = 最速、6 = 最小サイズ。",
    "convert": "APNGに変換",
    "converting": "変換中...",
    "resultsTitle": "結果",
    "resultCount": "{count} 件を変換",
    "downloadPng": "PNGをダウンロード",
    "downloadZip": "ZIPをダウンロード",
    "original": "元",
    "output": "出力",
    "saved": "削減",
    "dimensions": "サイズ",
    "fileSize": "ファイルサイズ",
    "totalSaved": "合計削減",
    "note": "APNGは .png として保存されます。GIFにループ情報がない場合は1回再生します。",
    "convertSuccess": "変換が完了しました！",
    "convertFailed": "GIFの変換に失敗しました。再試行してください。",
    "partialFailed": "{count} 件のファイルで失敗しました。",
    "invalidGif": "無効なGIFファイルです。",
    "emptyGif": "GIFにフレームがありません。",
    "invalidFrame": "GIFフレームのデコードに失敗しました。",
    "canvasUnavailable": "キャンバスが使用できません。",
    "zipFailed": "ZIPの作成に失敗しました。"
  },
  "ko": {
    "uploadTitle": "GIF 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 GIF 업로드",
    "supportedFormats": "GIF 파일 지원",
    "selectedCount": "{count}개의 GIF 선택됨",
    "removeFile": "제거",
    "clearAll": "모두 지우기",
    "invalidFileType": "유효한 GIF 파일을 선택하세요",
    "duplicateFile": "이미 추가된 파일입니다",
    "optionsTitle": "변환 옵션",
    "scaleLabel": "크기 (%)",
    "scaleHint": "프레임을 퍼센트로 조절합니다.",
    "speedLabel": "속도 배수",
    "speedHint": "1 = 원본 속도, 2 = 2배 빠름.",
    "loopLabel": "루프",
    "loopHint": "GIF를 따름(없으면 1회).",
    "loopCountLabel": "루프 횟수",
    "loopInherit": "GIF 따르기",
    "loopInfinite": "무한",
    "loopCustom": "사용자 지정",
    "optimizeLabel": "Oxipng로 최적화",
    "optimizeLevelLabel": "최적화 수준",
    "optimizeHint": "0 = 가장 빠름, 6 = 가장 작은 크기.",
    "convert": "APNG로 변환",
    "converting": "변환 중...",
    "resultsTitle": "결과",
    "resultCount": "{count}개 파일 변환됨",
    "downloadPng": "PNG 다운로드",
    "downloadZip": "ZIP 다운로드",
    "original": "원본",
    "output": "출력",
    "saved": "절감",
    "dimensions": "크기",
    "fileSize": "파일 크기",
    "totalSaved": "총 절감",
    "note": "APNG는 .png로 저장됩니다. GIF에 루프 정보가 없으면 1회 재생합니다.",
    "convertSuccess": "변환 완료!",
    "convertFailed": "GIF 변환에 실패했습니다. 다시 시도하세요.",
    "partialFailed": "{count}개 파일 변환 실패.",
    "invalidGif": "유효하지 않은 GIF 파일입니다.",
    "emptyGif": "GIF에 프레임이 없습니다.",
    "invalidFrame": "GIF 프레임을 디코딩하지 못했습니다.",
    "canvasUnavailable": "캔버스를 사용할 수 없습니다.",
    "zipFailed": "ZIP 생성 실패."
  },
  "ru": {
    "uploadTitle": "Загрузить GIF",
    "dragDropOrClick": "Нажмите или перетащите, чтобы загрузить GIF",
    "supportedFormats": "Поддерживаются файлы GIF",
    "selectedCount": "Выбрано {count} GIF",
    "removeFile": "Удалить",
    "clearAll": "Очистить все",
    "invalidFileType": "Выберите корректный GIF файл",
    "duplicateFile": "Этот файл уже добавлен",
    "optionsTitle": "Параметры конвертации",
    "scaleLabel": "Масштаб (%)",
    "scaleHint": "Масштабировать кадры в процентах.",
    "speedLabel": "Множитель скорости",
    "speedHint": "1 = исходная скорость, 2 = вдвое быстрее.",
    "loopLabel": "Цикл",
    "loopHint": "Следовать GIF, по умолчанию 1 при отсутствии.",
    "loopCountLabel": "Количество повторов",
    "loopInherit": "Следовать GIF",
    "loopInfinite": "Бесконечно",
    "loopCustom": "Пользовательский",
    "optimizeLabel": "Оптимизировать с Oxipng",
    "optimizeLevelLabel": "Уровень оптимизации",
    "optimizeHint": "0 = быстрее всего, 6 = минимальный размер.",
    "convert": "Конвертировать в APNG",
    "converting": "Конвертация...",
    "resultsTitle": "Результаты",
    "resultCount": "Конвертировано файлов: {count}",
    "downloadPng": "Скачать PNG",
    "downloadZip": "Скачать ZIP",
    "original": "Оригинал",
    "output": "Результат",
    "saved": "Экономия",
    "dimensions": "Размеры",
    "fileSize": "Размер файла",
    "totalSaved": "Общая экономия",
    "note": "APNG сохраняются как .png. Если GIF не содержит данных цикла, используется 1 повтор.",
    "convertSuccess": "Конвертация завершена!",
    "convertFailed": "Не удалось конвертировать GIF. Попробуйте снова.",
    "partialFailed": "Не удалось конвертировать файлов: {count}.",
    "invalidGif": "Некорректный GIF файл.",
    "emptyGif": "GIF не содержит кадров.",
    "invalidFrame": "Не удалось декодировать кадры GIF.",
    "canvasUnavailable": "Canvas недоступен.",
    "zipFailed": "Не удалось создать ZIP."
  },
  "pt": {
    "uploadTitle": "Enviar GIF",
    "dragDropOrClick": "Clique ou arraste para enviar GIFs",
    "supportedFormats": "Suporta arquivos GIF",
    "selectedCount": "{count} GIF selecionados",
    "removeFile": "Remover",
    "clearAll": "Limpar tudo",
    "invalidFileType": "Selecione um GIF válido",
    "duplicateFile": "Este arquivo já foi adicionado",
    "optionsTitle": "Opções de conversão",
    "scaleLabel": "Escala (%)",
    "scaleHint": "Redimensiona os quadros por porcentagem.",
    "speedLabel": "Multiplicador de velocidade",
    "speedHint": "1 = velocidade original, 2 = duas vezes mais rápido.",
    "loopLabel": "Loop",
    "loopHint": "Seguir GIF, padrão 1 se ausente.",
    "loopCountLabel": "Quantidade de loops",
    "loopInherit": "Seguir GIF",
    "loopInfinite": "Infinito",
    "loopCustom": "Personalizado",
    "optimizeLabel": "Otimizar com Oxipng",
    "optimizeLevelLabel": "Nível de otimização",
    "optimizeHint": "0 = mais rápido, 6 = menor tamanho.",
    "convert": "Converter para APNG",
    "converting": "Convertendo...",
    "resultsTitle": "Resultados",
    "resultCount": "{count} arquivos convertidos",
    "downloadPng": "Baixar PNG",
    "downloadZip": "Baixar ZIP",
    "original": "Original",
    "output": "Saída",
    "saved": "Economia",
    "dimensions": "Dimensões",
    "fileSize": "Tamanho do arquivo",
    "totalSaved": "Economia total",
    "note": "Os APNGs são salvos como .png. Se o GIF não tiver loop, usa 1 repetição.",
    "convertSuccess": "Conversão concluída!",
    "convertFailed": "Falha ao converter GIFs. Tente novamente.",
    "partialFailed": "{count} arquivos falharam na conversão.",
    "invalidGif": "Arquivo GIF inválido.",
    "emptyGif": "O GIF não contém quadros.",
    "invalidFrame": "Falha ao decodificar quadros do GIF.",
    "canvasUnavailable": "Canvas indisponível.",
    "zipFailed": "Falha ao criar ZIP."
  },
  "ar": {
    "uploadTitle": "رفع ملفات GIF",
    "dragDropOrClick": "انقر أو اسحب لرفع ملفات GIF",
    "supportedFormats": "يدعم ملفات GIF",
    "selectedCount": "تم اختيار {count} ملف GIF",
    "removeFile": "إزالة",
    "clearAll": "مسح الكل",
    "invalidFileType": "يرجى اختيار ملف GIF صالح",
    "duplicateFile": "تمت إضافة هذا الملف بالفعل",
    "optionsTitle": "خيارات التحويل",
    "scaleLabel": "المقياس (%)",
    "scaleHint": "تغيير حجم الإطارات كنسبة مئوية.",
    "speedLabel": "مضاعف السرعة",
    "speedHint": "1 = السرعة الأصلية، 2 = أسرع بمرتين.",
    "loopLabel": "التكرار",
    "loopHint": "اتباع GIF، الافتراضي 1 إذا لم يوجد.",
    "loopCountLabel": "عدد التكرارات",
    "loopInherit": "اتباع GIF",
    "loopInfinite": "لا نهائي",
    "loopCustom": "مخصص",
    "optimizeLabel": "تحسين باستخدام Oxipng",
    "optimizeLevelLabel": "مستوى التحسين",
    "optimizeHint": "0 = الأسرع، 6 = أصغر حجم.",
    "convert": "تحويل إلى APNG",
    "converting": "جارٍ التحويل...",
    "resultsTitle": "النتائج",
    "resultCount": "تم تحويل {count} ملفات",
    "downloadPng": "تنزيل PNG",
    "downloadZip": "تنزيل ZIP",
    "original": "الأصل",
    "output": "الناتج",
    "saved": "التوفير",
    "dimensions": "الأبعاد",
    "fileSize": "حجم الملف",
    "totalSaved": "إجمالي التوفير",
    "note": "يتم حفظ APNG كملفات .png. إذا لم يحدد GIF التكرار فالإعداد الافتراضي 1 مرة.",
    "convertSuccess": "تمت عملية التحويل!",
    "convertFailed": "فشل تحويل GIF. حاول مرة أخرى.",
    "partialFailed": "تعذر تحويل {count} ملفات.",
    "invalidGif": "ملف GIF غير صالح.",
    "emptyGif": "لا يحتوي GIF على إطارات.",
    "invalidFrame": "تعذر فك ترميز إطارات GIF.",
    "canvasUnavailable": "اللوحة غير متاحة.",
    "zipFailed": "فشل إنشاء ZIP."
  },
  "hi": {
    "uploadTitle": "GIF अपलोड करें",
    "dragDropOrClick": "GIF अपलोड करने के लिए क्लिक या ड्रैग करें",
    "supportedFormats": "GIF फाइलें समर्थित",
    "selectedCount": "{count} GIF चुने गए",
    "removeFile": "हटाएं",
    "clearAll": "सब हटाएं",
    "invalidFileType": "कृपया एक मान्य GIF चुनें",
    "duplicateFile": "यह फ़ाइल पहले से जोड़ी गई है",
    "optionsTitle": "कन्वर्ज़न विकल्प",
    "scaleLabel": "स्केल (%)",
    "scaleHint": "फ्रेम्स को प्रतिशत से बदलें।",
    "speedLabel": "स्पीड मल्टीप्लायर",
    "speedHint": "1 = मूल गति, 2 = दोगुनी तेज।",
    "loopLabel": "लूप",
    "loopHint": "GIF का पालन करें, नहीं होने पर 1 डिफॉल्ट।",
    "loopCountLabel": "लूप काउंट",
    "loopInherit": "GIF का पालन करें",
    "loopInfinite": "अनंत",
    "loopCustom": "कस्टम",
    "optimizeLabel": "Oxipng से ऑप्टिमाइज़ करें",
    "optimizeLevelLabel": "ऑप्टिमाइज़ेशन स्तर",
    "optimizeHint": "0 = सबसे तेज, 6 = सबसे छोटा आकार।",
    "convert": "APNG में बदलें",
    "converting": "कन्वर्ट हो रहा है...",
    "resultsTitle": "परिणाम",
    "resultCount": "{count} फाइलें कन्वर्ट हुईं",
    "downloadPng": "PNG डाउनलोड करें",
    "downloadZip": "ZIP डाउनलोड करें",
    "original": "मूल",
    "output": "आउटपुट",
    "saved": "बचत",
    "dimensions": "आयाम",
    "fileSize": "फ़ाइल आकार",
    "totalSaved": "कुल बचत",
    "note": "APNG आउटपुट .png के रूप में सेव होते हैं। यदि GIF में लूप जानकारी नहीं है, तो डिफॉल्ट 1 प्ले है।",
    "convertSuccess": "कन्वर्ज़न पूरा हुआ!",
    "convertFailed": "GIF कन्वर्ज़न विफल। कृपया फिर से प्रयास करें।",
    "partialFailed": "{count} फाइलें कन्वर्ट नहीं हो सकीं।",
    "invalidGif": "अमान्य GIF फ़ाइल।",
    "emptyGif": "GIF में कोई फ्रेम नहीं है।",
    "invalidFrame": "GIF फ्रेम डिकोड नहीं हो सके।",
    "canvasUnavailable": "कैनवास उपलब्ध नहीं है।",
    "zipFailed": "ZIP बनाना विफल रहा।"
  },
  "tr": {
    "uploadTitle": "GIF yükle",
    "dragDropOrClick": "GIF yüklemek için tıkla veya sürükle",
    "supportedFormats": "GIF dosyalarını destekler",
    "selectedCount": "{count} GIF seçildi",
    "removeFile": "Kaldır",
    "clearAll": "Hepsini temizle",
    "invalidFileType": "Lütfen geçerli bir GIF seçin",
    "duplicateFile": "Bu dosya zaten eklendi",
    "optionsTitle": "Dönüştürme seçenekleri",
    "scaleLabel": "Ölçek (%)",
    "scaleHint": "Kareleri yüzdeyle yeniden boyutlandırır.",
    "speedLabel": "Hız çarpanı",
    "speedHint": "1 = orijinal hız, 2 = iki kat hızlı.",
    "loopLabel": "Döngü",
    "loopHint": "GIF'i izle, yoksa varsayılan 1.",
    "loopCountLabel": "Döngü sayısı",
    "loopInherit": "GIF'i izle",
    "loopInfinite": "Sonsuz",
    "loopCustom": "Özel",
    "optimizeLabel": "Oxipng ile optimize et",
    "optimizeLevelLabel": "Optimizasyon seviyesi",
    "optimizeHint": "0 = en hızlı, 6 = en küçük boyut.",
    "convert": "APNG'ye dönüştür",
    "converting": "Dönüştürülüyor...",
    "resultsTitle": "Sonuçlar",
    "resultCount": "{count} dosya dönüştürüldü",
    "downloadPng": "PNG indir",
    "downloadZip": "ZIP indir",
    "original": "Orijinal",
    "output": "Çıktı",
    "saved": "Tasarruf",
    "dimensions": "Boyutlar",
    "fileSize": "Dosya boyutu",
    "totalSaved": "Toplam tasarruf",
    "note": "APNG çıktıları .png olarak kaydedilir. GIF döngüsü yoksa varsayılan 1 oynatmadır.",
    "convertSuccess": "Dönüştürme tamamlandı!",
    "convertFailed": "GIF dönüştürme başarısız oldu. Lütfen tekrar deneyin.",
    "partialFailed": "{count} dosya dönüştürülemedi.",
    "invalidGif": "Geçersiz GIF dosyası.",
    "emptyGif": "GIF kare içermiyor.",
    "invalidFrame": "GIF kareleri çözümlenemedi.",
    "canvasUnavailable": "Canvas kullanılamıyor.",
    "zipFailed": "ZIP oluşturulamadı."
  },
  "nl": {
    "uploadTitle": "GIF uploaden",
    "dragDropOrClick": "Klik of sleep om GIFs te uploaden",
    "supportedFormats": "Ondersteunt GIF-bestanden",
    "selectedCount": "{count} GIF geselecteerd",
    "removeFile": "Verwijderen",
    "clearAll": "Alles wissen",
    "invalidFileType": "Selecteer een geldig GIF-bestand",
    "duplicateFile": "Dit bestand is al toegevoegd",
    "optionsTitle": "Conversieopties",
    "scaleLabel": "Schaal (%)",
    "scaleHint": "Schaal frames op percentage.",
    "speedLabel": "Snelheidsfactor",
    "speedHint": "1 = originele snelheid, 2 = twee keer zo snel.",
    "loopLabel": "Lus",
    "loopHint": "Volg GIF, standaard 1 als ontbreekt.",
    "loopCountLabel": "Aantal lussen",
    "loopInherit": "Volg GIF",
    "loopInfinite": "Oneindig",
    "loopCustom": "Aangepast",
    "optimizeLabel": "Optimaliseer met Oxipng",
    "optimizeLevelLabel": "Optimalisatieniveau",
    "optimizeHint": "0 = snelst, 6 = kleinste grootte.",
    "convert": "Converteren naar APNG",
    "converting": "Converteren...",
    "resultsTitle": "Resultaten",
    "resultCount": "{count} bestanden geconverteerd",
    "downloadPng": "PNG downloaden",
    "downloadZip": "ZIP downloaden",
    "original": "Origineel",
    "output": "Uitvoer",
    "saved": "Bespaard",
    "dimensions": "Afmetingen",
    "fileSize": "Bestandsgrootte",
    "totalSaved": "Totaal bespaard",
    "note": "APNG-uitvoer wordt opgeslagen als .png. Als GIF geen lus bevat, is de standaard 1 keer.",
    "convertSuccess": "Conversie voltooid!",
    "convertFailed": "GIFs konden niet worden geconverteerd. Probeer opnieuw.",
    "partialFailed": "{count} bestanden konden niet worden geconverteerd.",
    "invalidGif": "Ongeldig GIF-bestand.",
    "emptyGif": "GIF bevat geen frames.",
    "invalidFrame": "GIF-frames konden niet worden gedecodeerd.",
    "canvasUnavailable": "Canvas is niet beschikbaar.",
    "zipFailed": "ZIP maken mislukt."
  },
  "sv": {
    "uploadTitle": "Ladda upp GIF",
    "dragDropOrClick": "Klicka eller dra för att ladda upp GIF",
    "supportedFormats": "Stöder GIF-filer",
    "selectedCount": "{count} GIF valda",
    "removeFile": "Ta bort",
    "clearAll": "Rensa allt",
    "invalidFileType": "Välj en giltig GIF",
    "duplicateFile": "Den här filen är redan tillagd",
    "optionsTitle": "Konverteringsalternativ",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Skalar ramar i procent.",
    "speedLabel": "Hastighetsmultiplikator",
    "speedHint": "1 = originalhastighet, 2 = dubbelt så snabbt.",
    "loopLabel": "Loop",
    "loopHint": "Följ GIF, standard 1 om saknas.",
    "loopCountLabel": "Antal loopar",
    "loopInherit": "Följ GIF",
    "loopInfinite": "Oändlig",
    "loopCustom": "Anpassad",
    "optimizeLabel": "Optimera med Oxipng",
    "optimizeLevelLabel": "Optimeringsnivå",
    "optimizeHint": "0 = snabbast, 6 = minsta storlek.",
    "convert": "Konvertera till APNG",
    "converting": "Konverterar...",
    "resultsTitle": "Resultat",
    "resultCount": "{count} filer konverterade",
    "downloadPng": "Ladda ner PNG",
    "downloadZip": "Ladda ner ZIP",
    "original": "Original",
    "output": "Utdata",
    "saved": "Sparat",
    "dimensions": "Dimensioner",
    "fileSize": "Filstorlek",
    "totalSaved": "Totalt sparat",
    "note": "APNG sparas som .png. Om GIF saknar loopinfo används 1 uppspelning.",
    "convertSuccess": "Konvertering klar!",
    "convertFailed": "Det gick inte att konvertera GIF. Försök igen.",
    "partialFailed": "{count} filer kunde inte konverteras.",
    "invalidGif": "Ogiltig GIF-fil.",
    "emptyGif": "GIF innehåller inga bildrutor.",
    "invalidFrame": "GIF-bildrutor kunde inte avkodas.",
    "canvasUnavailable": "Canvas är inte tillgängligt.",
    "zipFailed": "Kunde inte skapa ZIP."
  },
  "pl": {
    "uploadTitle": "Prześlij GIF",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać GIF",
    "supportedFormats": "Obsługuje pliki GIF",
    "selectedCount": "Wybrano {count} GIF",
    "removeFile": "Usuń",
    "clearAll": "Wyczyść wszystko",
    "invalidFileType": "Wybierz prawidłowy GIF",
    "duplicateFile": "Ten plik jest już dodany",
    "optionsTitle": "Opcje konwersji",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Skaluje klatki procentowo.",
    "speedLabel": "Mnożnik prędkości",
    "speedHint": "1 = prędkość oryginalna, 2 = dwa razy szybciej.",
    "loopLabel": "Pętla",
    "loopHint": "Zgodnie z GIF, domyślnie 1 jeśli brak.",
    "loopCountLabel": "Liczba pętli",
    "loopInherit": "Zgodnie z GIF",
    "loopInfinite": "Nieskończona",
    "loopCustom": "Niestandardowa",
    "optimizeLabel": "Optymalizuj z Oxipng",
    "optimizeLevelLabel": "Poziom optymalizacji",
    "optimizeHint": "0 = najszybciej, 6 = najmniejszy rozmiar.",
    "convert": "Konwertuj do APNG",
    "converting": "Konwertowanie...",
    "resultsTitle": "Wyniki",
    "resultCount": "Przekonwertowano {count} plików",
    "downloadPng": "Pobierz PNG",
    "downloadZip": "Pobierz ZIP",
    "original": "Oryginał",
    "output": "Wyjście",
    "saved": "Oszczędność",
    "dimensions": "Wymiary",
    "fileSize": "Rozmiar pliku",
    "totalSaved": "Łączna oszczędność",
    "note": "APNG zapisywane są jako .png. Jeśli GIF nie ma pętli, domyślnie 1 odtworzenie.",
    "convertSuccess": "Konwersja zakończona!",
    "convertFailed": "Nie udało się przekonwertować GIF. Spróbuj ponownie.",
    "partialFailed": "Nie udało się przekonwertować {count} plików.",
    "invalidGif": "Nieprawidłowy plik GIF.",
    "emptyGif": "GIF nie zawiera klatek.",
    "invalidFrame": "Nie udało się zdekodować klatek GIF.",
    "canvasUnavailable": "Canvas niedostępny.",
    "zipFailed": "Nie udało się utworzyć ZIP."
  },
  "vi": {
    "uploadTitle": "Tải GIF",
    "dragDropOrClick": "Nhấp hoặc kéo để tải GIF",
    "supportedFormats": "Hỗ trợ tệp GIF",
    "selectedCount": "Đã chọn {count} GIF",
    "removeFile": "Xóa",
    "clearAll": "Xóa tất cả",
    "invalidFileType": "Vui lòng chọn GIF hợp lệ",
    "duplicateFile": "Tệp này đã được thêm",
    "optionsTitle": "Tùy chọn chuyển đổi",
    "scaleLabel": "Tỷ lệ (%)",
    "scaleHint": "Thay đổi kích thước khung hình theo phần trăm.",
    "speedLabel": "Hệ số tốc độ",
    "speedHint": "1 = tốc độ gốc, 2 = nhanh gấp đôi.",
    "loopLabel": "Vòng lặp",
    "loopHint": "Theo GIF, mặc định 1 nếu thiếu.",
    "loopCountLabel": "Số lần lặp",
    "loopInherit": "Theo GIF",
    "loopInfinite": "Vô hạn",
    "loopCustom": "Tùy chỉnh",
    "optimizeLabel": "Tối ưu với Oxipng",
    "optimizeLevelLabel": "Mức tối ưu",
    "optimizeHint": "0 = nhanh nhất, 6 = nhỏ nhất.",
    "convert": "Chuyển sang APNG",
    "converting": "Đang chuyển...",
    "resultsTitle": "Kết quả",
    "resultCount": "Đã chuyển {count} tệp",
    "downloadPng": "Tải PNG",
    "downloadZip": "Tải ZIP",
    "original": "Gốc",
    "output": "Đầu ra",
    "saved": "Tiết kiệm",
    "dimensions": "Kích thước",
    "fileSize": "Dung lượng",
    "totalSaved": "Tổng tiết kiệm",
    "note": "APNG được lưu dưới dạng .png. Nếu GIF không có thông tin lặp, mặc định 1 lần.",
    "convertSuccess": "Chuyển đổi hoàn tất!",
    "convertFailed": "Không thể chuyển đổi GIF. Vui lòng thử lại.",
    "partialFailed": "{count} tệp không thể chuyển đổi.",
    "invalidGif": "Tệp GIF không hợp lệ.",
    "emptyGif": "GIF không có khung hình.",
    "invalidFrame": "Không thể giải mã khung GIF.",
    "canvasUnavailable": "Canvas không khả dụng.",
    "zipFailed": "Không thể tạo ZIP."
  },
  "th": {
    "uploadTitle": "อัปโหลด GIF",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลด GIF",
    "supportedFormats": "รองรับไฟล์ GIF",
    "selectedCount": "เลือก {count} GIF",
    "removeFile": "ลบ",
    "clearAll": "ล้างทั้งหมด",
    "invalidFileType": "โปรดเลือกไฟล์ GIF ที่ถูกต้อง",
    "duplicateFile": "ไฟล์นี้ถูกเพิ่มแล้ว",
    "optionsTitle": "ตัวเลือกการแปลง",
    "scaleLabel": "สเกล (%)",
    "scaleHint": "ปรับขนาดเฟรมเป็นเปอร์เซ็นต์",
    "speedLabel": "ตัวคูณความเร็ว",
    "speedHint": "1 = ความเร็วเดิม, 2 = เร็วขึ้นสองเท่า",
    "loopLabel": "ลูป",
    "loopHint": "ตาม GIF, ถ้าไม่มีใช้ค่าเริ่มต้น 1",
    "loopCountLabel": "จำนวนครั้งของลูป",
    "loopInherit": "ตาม GIF",
    "loopInfinite": "ไม่สิ้นสุด",
    "loopCustom": "กำหนดเอง",
    "optimizeLabel": "ปรับให้เหมาะสมด้วย Oxipng",
    "optimizeLevelLabel": "ระดับการปรับแต่ง",
    "optimizeHint": "0 = เร็วที่สุด, 6 = เล็กที่สุด",
    "convert": "แปลงเป็น APNG",
    "converting": "กำลังแปลง...",
    "resultsTitle": "ผลลัพธ์",
    "resultCount": "แปลงแล้ว {count} ไฟล์",
    "downloadPng": "ดาวน์โหลด PNG",
    "downloadZip": "ดาวน์โหลด ZIP",
    "original": "ต้นฉบับ",
    "output": "ผลลัพธ์",
    "saved": "ประหยัด",
    "dimensions": "ขนาด",
    "fileSize": "ขนาดไฟล์",
    "totalSaved": "ประหยัดรวม",
    "note": "APNG จะถูกบันทึกเป็น .png หาก GIF ไม่มีข้อมูลลูป จะใช้ค่าเริ่มต้น 1 ครั้ง",
    "convertSuccess": "แปลงเสร็จสิ้น!",
    "convertFailed": "แปลง GIF ไม่สำเร็จ โปรดลองอีกครั้ง",
    "partialFailed": "แปลงไม่สำเร็จ {count} ไฟล์",
    "invalidGif": "ไฟล์ GIF ไม่ถูกต้อง",
    "emptyGif": "GIF ไม่มีเฟรม",
    "invalidFrame": "ถอดรหัสเฟรม GIF ไม่สำเร็จ",
    "canvasUnavailable": "ไม่สามารถใช้แคนวาสได้",
    "zipFailed": "สร้าง ZIP ไม่สำเร็จ"
  },
  "id": {
    "uploadTitle": "Unggah GIF",
    "dragDropOrClick": "Klik atau seret untuk mengunggah GIF",
    "supportedFormats": "Mendukung file GIF",
    "selectedCount": "{count} GIF dipilih",
    "removeFile": "Hapus",
    "clearAll": "Hapus semua",
    "invalidFileType": "Silakan pilih GIF yang valid",
    "duplicateFile": "File ini sudah ditambahkan",
    "optionsTitle": "Opsi konversi",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Ubah ukuran frame berdasarkan persentase.",
    "speedLabel": "Pengali kecepatan",
    "speedHint": "1 = kecepatan asli, 2 = dua kali lebih cepat.",
    "loopLabel": "Loop",
    "loopHint": "Ikuti GIF, default 1 jika tidak ada.",
    "loopCountLabel": "Jumlah loop",
    "loopInherit": "Ikuti GIF",
    "loopInfinite": "Tak terbatas",
    "loopCustom": "Kustom",
    "optimizeLabel": "Optimalkan dengan Oxipng",
    "optimizeLevelLabel": "Level optimasi",
    "optimizeHint": "0 = paling cepat, 6 = ukuran terkecil.",
    "convert": "Konversi ke APNG",
    "converting": "Mengonversi...",
    "resultsTitle": "Hasil",
    "resultCount": "{count} file dikonversi",
    "downloadPng": "Unduh PNG",
    "downloadZip": "Unduh ZIP",
    "original": "Asli",
    "output": "Output",
    "saved": "Hemat",
    "dimensions": "Dimensi",
    "fileSize": "Ukuran file",
    "totalSaved": "Total hemat",
    "note": "APNG disimpan sebagai .png. Jika GIF tidak memiliki info loop, defaultnya 1 kali.",
    "convertSuccess": "Konversi selesai!",
    "convertFailed": "Gagal mengonversi GIF. Silakan coba lagi.",
    "partialFailed": "{count} file gagal dikonversi.",
    "invalidGif": "File GIF tidak valid.",
    "emptyGif": "GIF tidak memiliki frame.",
    "invalidFrame": "Gagal mendekode frame GIF.",
    "canvasUnavailable": "Canvas tidak tersedia.",
    "zipFailed": "Gagal membuat ZIP."
  },
  "he": {
    "uploadTitle": "העלאת GIF",
    "dragDropOrClick": "לחץ או גרור כדי להעלות GIF",
    "supportedFormats": "תומך בקבצי GIF",
    "selectedCount": "נבחרו {count} קובצי GIF",
    "removeFile": "הסר",
    "clearAll": "נקה הכל",
    "invalidFileType": "אנא בחר קובץ GIF תקין",
    "duplicateFile": "הקובץ כבר נוסף",
    "optionsTitle": "אפשרויות המרה",
    "scaleLabel": "קנה מידה (%)",
    "scaleHint": "שינוי גודל מסגרות באחוזים.",
    "speedLabel": "כפולת מהירות",
    "speedHint": "1 = מהירות מקורית, 2 = מהיר פי שניים.",
    "loopLabel": "לולאה",
    "loopHint": "עקוב אחר GIF, ברירת מחדל 1 אם חסר.",
    "loopCountLabel": "מספר לולאות",
    "loopInherit": "עקוב אחר GIF",
    "loopInfinite": "אינסופי",
    "loopCustom": "מותאם אישית",
    "optimizeLabel": "אופטימיזציה עם Oxipng",
    "optimizeLevelLabel": "רמת אופטימיזציה",
    "optimizeHint": "0 = הכי מהיר, 6 = הכי קטן.",
    "convert": "המר ל-APNG",
    "converting": "ממיר...",
    "resultsTitle": "תוצאות",
    "resultCount": "הומרו {count} קבצים",
    "downloadPng": "הורד PNG",
    "downloadZip": "הורד ZIP",
    "original": "מקור",
    "output": "פלט",
    "saved": "חיסכון",
    "dimensions": "ממדים",
    "fileSize": "גודל קובץ",
    "totalSaved": "חיסכון כולל",
    "note": "פלט APNG נשמר כ־.png. אם ל-GIF אין לולאה, ברירת המחדל היא פעם אחת.",
    "convertSuccess": "ההמרה הושלמה!",
    "convertFailed": "ההמרה נכשלה. נסה שוב.",
    "partialFailed": "{count} קבצים נכשלו בהמרה.",
    "invalidGif": "קובץ GIF לא תקין.",
    "emptyGif": "ל-GIF אין מסגרות.",
    "invalidFrame": "פענוח מסגרות GIF נכשל.",
    "canvasUnavailable": "Canvas אינו זמין.",
    "zipFailed": "יצירת ZIP נכשלה."
  },
  "ms": {
    "uploadTitle": "Muat naik GIF",
    "dragDropOrClick": "Klik atau seret untuk memuat naik GIF",
    "supportedFormats": "Menyokong fail GIF",
    "selectedCount": "{count} GIF dipilih",
    "removeFile": "Buang",
    "clearAll": "Kosongkan semua",
    "invalidFileType": "Sila pilih fail GIF yang sah",
    "duplicateFile": "Fail ini sudah ditambah",
    "optionsTitle": "Pilihan penukaran",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Ubah saiz bingkai mengikut peratus.",
    "speedLabel": "Pengganda kelajuan",
    "speedHint": "1 = kelajuan asal, 2 = dua kali lebih laju.",
    "loopLabel": "Gelung",
    "loopHint": "Ikut GIF, lalai 1 jika tiada.",
    "loopCountLabel": "Bilangan gelung",
    "loopInherit": "Ikut GIF",
    "loopInfinite": "Tanpa had",
    "loopCustom": "Tersuai",
    "optimizeLabel": "Optimumkan dengan Oxipng",
    "optimizeLevelLabel": "Tahap pengoptimuman",
    "optimizeHint": "0 = paling pantas, 6 = saiz paling kecil.",
    "convert": "Tukar ke APNG",
    "converting": "Menukar...",
    "resultsTitle": "Keputusan",
    "resultCount": "{count} fail ditukar",
    "downloadPng": "Muat turun PNG",
    "downloadZip": "Muat turun ZIP",
    "original": "Asal",
    "output": "Keluaran",
    "saved": "Jimat",
    "dimensions": "Dimensi",
    "fileSize": "Saiz fail",
    "totalSaved": "Jumlah jimat",
    "note": "APNG disimpan sebagai .png. Jika GIF tiada info gelung, lalai 1 kali.",
    "convertSuccess": "Penukaran selesai!",
    "convertFailed": "Gagal menukar GIF. Sila cuba lagi.",
    "partialFailed": "{count} fail gagal ditukar.",
    "invalidGif": "Fail GIF tidak sah.",
    "emptyGif": "GIF tidak mempunyai bingkai.",
    "invalidFrame": "Gagal menyahkod bingkai GIF.",
    "canvasUnavailable": "Canvas tidak tersedia.",
    "zipFailed": "Gagal mencipta ZIP."
  },
  "no": {
    "uploadTitle": "Last opp GIF",
    "dragDropOrClick": "Klikk eller dra for å laste opp GIF",
    "supportedFormats": "Støtter GIF-filer",
    "selectedCount": "{count} GIF valgt",
    "removeFile": "Fjern",
    "clearAll": "Tøm alle",
    "invalidFileType": "Velg en gyldig GIF",
    "duplicateFile": "Denne filen er allerede lagt til",
    "optionsTitle": "Konverteringsvalg",
    "scaleLabel": "Skalering (%)",
    "scaleHint": "Skaler rammer i prosent.",
    "speedLabel": "Hastighetsmultiplikator",
    "speedHint": "1 = original hastighet, 2 = dobbelt så rask.",
    "loopLabel": "Løkke",
    "loopHint": "Følg GIF, standard 1 hvis mangler.",
    "loopCountLabel": "Antall løkker",
    "loopInherit": "Følg GIF",
    "loopInfinite": "Uendelig",
    "loopCustom": "Tilpasset",
    "optimizeLabel": "Optimaliser med Oxipng",
    "optimizeLevelLabel": "Optimaliseringsnivå",
    "optimizeHint": "0 = raskest, 6 = minst størrelse.",
    "convert": "Konverter til APNG",
    "converting": "Konverterer...",
    "resultsTitle": "Resultater",
    "resultCount": "{count} filer konvertert",
    "downloadPng": "Last ned PNG",
    "downloadZip": "Last ned ZIP",
    "original": "Original",
    "output": "Utdata",
    "saved": "Spart",
    "dimensions": "Dimensjoner",
    "fileSize": "Filstørrelse",
    "totalSaved": "Totalt spart",
    "note": "APNG lagres som .png. Hvis GIF ikke har loopinfo, brukes 1 avspilling.",
    "convertSuccess": "Konvertering fullført!",
    "convertFailed": "Kunne ikke konvertere GIF. Prøv igjen.",
    "partialFailed": "{count} filer kunne ikke konverteres.",
    "invalidGif": "Ugyldig GIF-fil.",
    "emptyGif": "GIF inneholder ingen rammer.",
    "invalidFrame": "Kunne ikke dekode GIF-rammer.",
    "canvasUnavailable": "Canvas er ikke tilgjengelig.",
    "zipFailed": "Kunne ikke lage ZIP."
  }
}
</i18n>
