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
      :title="t('optionsTitle')"
      :scale-label="t('scaleLabel')"
      :scale-hint="t('scaleHint')"
      :reset-label="t('resetScale')"
      :convert-label="t('convert')"
      :converting-label="t('converting')"
      :min-scale="minScale"
      :max-scale="maxScale"
      :is-converting="isConverting"
      :can-convert="canConvert"
      @convert="convertImages"
      @reset="resetScale"
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
      :dimensions-label="t('dimensions')"
      :file-size-label="t('fileSize')"
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
import type { WebpConversionResult } from './types'

const { t } = useI18n()
const message = useMessage()

const files = ref<File[]>([])
const scale = ref(100)
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

watch([files, scale], () => {
  runId += 1
  results.value = []
  zipBlob.value = null
  error.value = ''
  isConverting.value = false
  isZipping.value = false
})

function resetScale() {
  scale.value = 100
}

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
        const result = await convertImageToWebp(file, { scale: scale.value }, outputName)
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
    "resetScale": "Reset to 100%",
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
    "resetScale": "重置为 100%",
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
    "resetScale": "重置为 100%",
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
    "resetScale": "重設為 100%",
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
    "resetScale": "重設為 100%",
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
    "resetScale": "Restablecer a 100%",
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
    "resetScale": "Réinitialiser à 100%",
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
    "resetScale": "Auf 100% zurücksetzen",
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
    "resetScale": "Reimposta a 100%",
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
    "resetScale": "100% にリセット",
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
    "resetScale": "100%로 재설정",
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
    "resetScale": "Сбросить до 100%",
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
    "resetScale": "Redefinir para 100%",
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
    "resetScale": "إعادة الضبط إلى 100%",
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
    "resetScale": "100% पर रीसेट करें",
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
    "resetScale": "100% olarak sıfırla",
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
    "resetScale": "Reset naar 100%",
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
    "resetScale": "Återställ till 100%",
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
    "resetScale": "Resetuj do 100%",
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
    "resetScale": "Đặt lại 100%",
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
    "resetScale": "รีเซ็ตเป็น 100%",
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
    "resetScale": "Setel ulang ke 100%",
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
    "resetScale": "איפוס ל-100%",
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
    "resetScale": "Tetapkan semula ke 100%",
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
    "resetScale": "Tilbakestill til 100%",
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
