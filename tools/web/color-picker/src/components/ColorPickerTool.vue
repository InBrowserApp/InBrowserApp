<template>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :wrap="true" class="section-row">
        <div class="section-copy">
          <div class="section-title">{{ t('screenTitle') }}</div>
          <div class="section-subtitle">{{ t('screenDescription') }}</div>
        </div>
        <n-button type="primary" :disabled="!isEyeDropperSupported" @click="handleScreenPick">
          <template #icon>
            <n-icon>
              <EyedropperIcon />
            </n-icon>
          </template>
          {{ t('screenButton') }}
        </n-button>
      </n-flex>
      <n-alert v-if="!isEyeDropperSupported" type="warning" :show-icon="false">
        {{ t('screenUnsupported') }}
      </n-alert>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :wrap="true" class="section-row">
        <div class="section-copy">
          <div class="section-title">{{ t('imageTitle') }}</div>
          <div class="section-subtitle">{{ t('imageDescription') }}</div>
        </div>
        <div class="image-actions">
          <input
            ref="fileInputRef"
            class="file-input"
            type="file"
            accept="image/*,image/svg+xml"
            @change="handleFileChange"
          />
          <n-button type="primary" @click="handleImagePick">
            <template #icon>
              <n-icon>
                <ImagePickIcon />
              </n-icon>
            </template>
            {{ t('imageButton') }}
          </n-button>
        </div>
      </n-flex>
      <n-text depth="3">{{ t('uploadFormats') }}</n-text>
      <n-alert v-if="imageError" type="error" :show-icon="false">
        {{ imageError }}
      </n-alert>
      <div v-if="hasImage" ref="canvasWrapperRef" class="canvas-wrapper">
        <div class="canvas-hint">{{ t('imageHint') }}</div>
        <canvas
          ref="canvasRef"
          class="image-canvas"
          :style="canvasStyle"
          @click="handleCanvasClick"
        />
      </div>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :wrap="true" class="section-row">
        <n-flex align="center" :size="12">
          <div class="color-swatch" :style="{ backgroundColor: cssColor }" />
          <div>
            <div class="section-title">{{ t('pickedTitle') }}</div>
            <div class="section-subtitle">{{ t('sourceLabel') }}: {{ sourceLabel }}</div>
          </div>
        </n-flex>
        <n-flex align="center" :size="8">
          <span class="section-subtitle">{{ t('showAlpha') }}</span>
          <n-switch v-model:value="showAlpha" size="small" />
        </n-flex>
      </n-flex>
      <n-grid cols="1 s:2 l:3" :x-gap="16" :y-gap="16" responsive="screen">
        <n-gi v-for="field in outputFields" :key="field.key">
          <div class="output-card">
            <div class="output-header">
              <span class="output-label">{{ field.label }}</span>
              <CopyToClipboardButton :content="field.value" size="small" />
            </div>
            <div class="output-value">{{ field.value }}</div>
          </div>
        </n-gi>
      </n-grid>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useElementSize, useStorage } from '@vueuse/core'
import { NAlert, NButton, NFlex, NGrid, NGi, NIcon, NText, NSwitch } from 'naive-ui'
import {
  Eyedropper24Filled as EyedropperIcon,
  TabDesktopImage16Regular as ImagePickIcon,
} from '@shared/icons/fluent'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { RGBA } from '../types'
import {
  formatAlphaPercent,
  formatCmyk,
  formatHsl,
  formatHsv,
  formatRgb,
  parseHexToRgba,
  rgbaToHex,
  toCssRgba,
} from '../utils/color'

const { t } = useI18n()

type EyeDropperResult = { sRGBHex: string }

type EyeDropperConstructor = new () => {
  open: () => Promise<EyeDropperResult>
}

const eyeDropperConstructor = (
  globalThis as typeof globalThis & {
    EyeDropper?: EyeDropperConstructor
  }
).EyeDropper

const isEyeDropperSupported = Boolean(eyeDropperConstructor)

const showAlpha = useStorage('tools:color-picker:show-alpha', true)
const pickedColor = useStorage<RGBA>('tools:color-picker:rgba', {
  r: 52,
  g: 152,
  b: 219,
  a: 1,
})
const pickedSource = ref<'screen' | 'image' | null>(null)

const fileInputRef = ref<HTMLInputElement | null>(null)
const imageInfo = ref<{ width: number; height: number } | null>(null)
const hasImage = ref(false)
const imageError = ref<string | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapperRef = ref<HTMLDivElement | null>(null)
const objectUrl = ref<string | null>(null)

const { width: canvasWrapperWidth } = useElementSize(canvasWrapperRef)

const MAX_PREVIEW_WIDTH = 720
const MAX_PREVIEW_HEIGHT = 420

const canvasStyle = computed(() => {
  if (!imageInfo.value) return {}

  const { width, height } = imageInfo.value
  const containerWidth = canvasWrapperWidth.value || width
  let displayWidth = Math.min(containerWidth, width, MAX_PREVIEW_WIDTH)
  let displayHeight = Math.round((displayWidth / width) * height)

  if (displayHeight > MAX_PREVIEW_HEIGHT) {
    const scale = MAX_PREVIEW_HEIGHT / displayHeight
    displayWidth = Math.round(displayWidth * scale)
    displayHeight = Math.round(displayHeight * scale)
  }

  return {
    width: `${displayWidth}px`,
    height: `${displayHeight}px`,
  }
})

const sourceLabel = computed(() => {
  if (pickedSource.value === 'screen') return t('sourceScreen')
  if (pickedSource.value === 'image') return t('sourceImage')
  return t('sourceUnknown')
})

const hexValue = computed(() => rgbaToHex(pickedColor.value, showAlpha.value))
const rgbValue = computed(() => formatRgb(pickedColor.value, showAlpha.value))
const hslValue = computed(() => formatHsl(pickedColor.value, showAlpha.value))
const hsvValue = computed(() => formatHsv(pickedColor.value, showAlpha.value))
const cmykValue = computed(() => formatCmyk(pickedColor.value))
const alphaValue = computed(() => formatAlphaPercent(pickedColor.value.a))
const cssColor = computed(() => toCssRgba(pickedColor.value))

const outputFields = computed(() => {
  const fields = [
    { key: 'hex', label: t('hex'), value: hexValue.value },
    {
      key: 'rgb',
      label: showAlpha.value ? t('rgba') : t('rgb'),
      value: rgbValue.value,
    },
    {
      key: 'hsl',
      label: showAlpha.value ? t('hsla') : t('hsl'),
      value: hslValue.value,
    },
    {
      key: 'hsv',
      label: showAlpha.value ? t('hsva') : t('hsv'),
      value: hsvValue.value,
    },
    { key: 'cmyk', label: t('cmyk'), value: cmykValue.value },
  ]

  if (showAlpha.value) {
    fields.push({ key: 'alpha', label: t('alpha'), value: alphaValue.value })
  }

  return fields
})

function revokeObjectUrl() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = null
  }
}

function loadImage(file: File) {
  imageError.value = null
  imageInfo.value = null
  hasImage.value = true
  revokeObjectUrl()

  const url = URL.createObjectURL(file)
  objectUrl.value = url

  const image = new Image()
  image.onload = () => {
    const canvas = canvasRef.value
    if (!canvas) {
      imageError.value = t('imageError')
      hasImage.value = false
      revokeObjectUrl()
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      imageError.value = t('imageError')
      hasImage.value = false
      revokeObjectUrl()
      return
    }

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    ctx.drawImage(image, 0, 0)
    imageInfo.value = { width: image.naturalWidth, height: image.naturalHeight }
    revokeObjectUrl()
  }
  image.onerror = () => {
    imageError.value = t('imageError')
    hasImage.value = false
    revokeObjectUrl()
  }
  image.src = url
}

async function handleScreenPick() {
  if (!eyeDropperConstructor) return

  try {
    const eyeDropper = new eyeDropperConstructor()
    const result = await eyeDropper.open()
    const rgba = parseHexToRgba(result.sRGBHex)
    if (!rgba) return

    pickedColor.value = rgba
    pickedSource.value = 'screen'
  } catch (error) {
    if ((error as DOMException).name === 'AbortError') return
  }
}

function handleImagePick() {
  fileInputRef.value?.click()
}

function handleFilePick(file: File | null) {
  if (!file) return false
  loadImage(file)
  return true
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0] ?? null
  handleFilePick(file)
  if (input) {
    input.value = ''
  }
}

function handleCanvasClick(event: MouseEvent) {
  if (!imageInfo.value) return

  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  const rawX = (event.clientX - rect.left) * scaleX
  const rawY = (event.clientY - rect.top) * scaleY

  const x = Math.max(0, Math.min(Math.floor(rawX), canvas.width - 1))
  const y = Math.max(0, Math.min(Math.floor(rawY), canvas.height - 1))

  const data = ctx.getImageData(x, y, 1, 1).data
  const r = data[0] ?? 0
  const g = data[1] ?? 0
  const b = data[2] ?? 0
  const a = data[3] ?? 255
  pickedColor.value = { r, g, b, a: a / 255 }
  pickedSource.value = 'image'
}

defineExpose({
  handleFilePick,
  handleCanvasClick,
  handleScreenPick,
})

onBeforeUnmount(() => {
  revokeObjectUrl()
})
</script>

<style scoped>
.section-row {
  gap: 16px;
}

.section-copy {
  max-width: 520px;
}

.section-title {
  font-weight: 600;
  font-size: 16px;
}

.section-subtitle {
  font-size: 13px;
  color: var(--n-text-color-3);
}

.canvas-wrapper {
  margin-top: 8px;
}

.file-input {
  display: none;
}

.canvas-hint {
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--n-text-color-3);
}

.image-canvas {
  display: block;
  border-radius: 10px;
  border: 1px solid var(--n-border-color);
  cursor: crosshair;
  max-width: 100%;
}

.color-swatch {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.output-card {
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  padding: 12px;
  background: var(--n-color);
}

.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.output-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.output-value {
  font-family:
    ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 13px;
}
</style>

<i18n lang="json">
{
  "en": {
    "screenTitle": "Screen Color Picker",
    "screenDescription": "Use the browser eyedropper to sample any pixel on your screen.",
    "screenButton": "Pick Screen Color",
    "screenUnsupported": "Screen color picking is not supported in this browser.",
    "imageTitle": "Image Color Picker",
    "imageDescription": "Upload an image and click to sample a pixel.",
    "imageButton": "Select Image",
    "imageHint": "Click the image to pick a color.",
    "imageError": "Failed to load the image.",
    "uploadHint": "Click or drag image to upload",
    "uploadFormats": "Supports JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Picked Color",
    "sourceLabel": "Source",
    "sourceScreen": "Screen",
    "sourceImage": "Image",
    "sourceUnknown": "Not picked yet",
    "showAlpha": "Enable Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "zh": {
    "screenTitle": "屏幕取色",
    "screenDescription": "使用浏览器取色器采样屏幕上的任意像素。",
    "screenButton": "取屏幕颜色",
    "screenUnsupported": "当前浏览器不支持屏幕取色。",
    "imageTitle": "图片取色",
    "imageDescription": "上传图片并点击以采样像素。",
    "imageButton": "选择图片",
    "imageHint": "点击图片取色。",
    "imageError": "图片加载失败。",
    "uploadHint": "点击或拖拽图片上传",
    "uploadFormats": "支持 JPEG、PNG、HEIC、TIFF、WebP、GIF、SVG",
    "pickedTitle": "已取颜色",
    "sourceLabel": "来源",
    "sourceScreen": "屏幕",
    "sourceImage": "图片",
    "sourceUnknown": "尚未取色",
    "showAlpha": "启用透明度",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "透明度"
  },
  "zh-CN": {
    "screenTitle": "屏幕取色",
    "screenDescription": "使用浏览器取色器采样屏幕上的任意像素。",
    "screenButton": "取屏幕颜色",
    "screenUnsupported": "当前浏览器不支持屏幕取色。",
    "imageTitle": "图片取色",
    "imageDescription": "上传图片并点击以采样像素。",
    "imageButton": "选择图片",
    "imageHint": "点击图片取色。",
    "imageError": "图片加载失败。",
    "uploadHint": "点击或拖拽图片上传",
    "uploadFormats": "支持 JPEG、PNG、HEIC、TIFF、WebP、GIF、SVG",
    "pickedTitle": "已取颜色",
    "sourceLabel": "来源",
    "sourceScreen": "屏幕",
    "sourceImage": "图片",
    "sourceUnknown": "尚未取色",
    "showAlpha": "启用透明度",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "透明度"
  },
  "zh-TW": {
    "screenTitle": "螢幕取色",
    "screenDescription": "使用瀏覽器取色器取樣螢幕上的任何像素。",
    "screenButton": "取螢幕顏色",
    "screenUnsupported": "此瀏覽器不支援螢幕取色。",
    "imageTitle": "圖片取色",
    "imageDescription": "上傳圖片並點擊以取樣像素。",
    "imageButton": "選擇圖片",
    "imageHint": "點擊圖片取色。",
    "imageError": "圖片載入失敗。",
    "uploadHint": "點擊或拖曳圖片上傳",
    "uploadFormats": "支援 JPEG、PNG、HEIC、TIFF、WebP、GIF、SVG",
    "pickedTitle": "已取顏色",
    "sourceLabel": "來源",
    "sourceScreen": "螢幕",
    "sourceImage": "圖片",
    "sourceUnknown": "尚未取色",
    "showAlpha": "啟用透明度",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "透明度"
  },
  "zh-HK": {
    "screenTitle": "螢幕取色",
    "screenDescription": "使用瀏覽器取色器取樣螢幕上的任何像素。",
    "screenButton": "取螢幕顏色",
    "screenUnsupported": "此瀏覽器不支援螢幕取色。",
    "imageTitle": "圖片取色",
    "imageDescription": "上傳圖片並點擊以取樣像素。",
    "imageButton": "選擇圖片",
    "imageHint": "點擊圖片取色。",
    "imageError": "圖片載入失敗。",
    "uploadHint": "點擊或拖曳圖片上傳",
    "uploadFormats": "支援 JPEG、PNG、HEIC、TIFF、WebP、GIF、SVG",
    "pickedTitle": "已取顏色",
    "sourceLabel": "來源",
    "sourceScreen": "螢幕",
    "sourceImage": "圖片",
    "sourceUnknown": "尚未取色",
    "showAlpha": "啟用透明度",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "透明度"
  },
  "es": {
    "screenTitle": "Selector de color de pantalla",
    "screenDescription": "Usa la pipeta del navegador para muestrear cualquier píxel de la pantalla.",
    "screenButton": "Tomar color de pantalla",
    "screenUnsupported": "La selección de color de pantalla no es compatible con este navegador.",
    "imageTitle": "Selector de color de imagen",
    "imageDescription": "Sube una imagen y haz clic para muestrear un píxel.",
    "imageButton": "Seleccionar imagen",
    "imageHint": "Haz clic en la imagen para tomar un color.",
    "imageError": "No se pudo cargar la imagen.",
    "uploadHint": "Haga clic o arrastre la imagen para cargar",
    "uploadFormats": "Soporta JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Color seleccionado",
    "sourceLabel": "Origen",
    "sourceScreen": "Pantalla",
    "sourceImage": "Imagen",
    "sourceUnknown": "Aún no seleccionado",
    "showAlpha": "Habilitar Alfa",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "fr": {
    "screenTitle": "Pipette de couleur d’écran",
    "screenDescription": "Utilisez la pipette du navigateur pour échantillonner n’importe quel pixel de l’écran.",
    "screenButton": "Prendre la couleur de l’écran",
    "screenUnsupported": "La sélection de couleur à l’écran n’est pas prise en charge dans ce navigateur.",
    "imageTitle": "Pipette de couleur d’image",
    "imageDescription": "Téléchargez une image et cliquez pour échantillonner un pixel.",
    "imageButton": "Sélectionner une image",
    "imageHint": "Cliquez sur l’image pour choisir une couleur.",
    "imageError": "Échec du chargement de l’image.",
    "uploadHint": "Cliquez ou déposez l'image pour télécharger",
    "uploadFormats": "Prend en charge JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Couleur sélectionnée",
    "sourceLabel": "Source",
    "sourceScreen": "Écran",
    "sourceImage": "Image",
    "sourceUnknown": "Pas encore sélectionnée",
    "showAlpha": "Activer Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "de": {
    "screenTitle": "Bildschirm-Farbpipette",
    "screenDescription": "Verwenden Sie die Browser-Pipette, um beliebige Pixel auf dem Bildschirm zu erfassen.",
    "screenButton": "Bildschirmfarbe wählen",
    "screenUnsupported": "Bildschirm-Farbaufnahme wird in diesem Browser nicht unterstützt.",
    "imageTitle": "Bild-Farbpipette",
    "imageDescription": "Laden Sie ein Bild hoch und klicken Sie, um ein Pixel zu sampeln.",
    "imageButton": "Bild auswählen",
    "imageHint": "Klicken Sie auf das Bild, um eine Farbe zu wählen.",
    "imageError": "Bild konnte nicht geladen werden.",
    "uploadHint": "Klicken oder Bild hierher ziehen",
    "uploadFormats": "Unterstützt JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Ausgewählte Farbe",
    "sourceLabel": "Quelle",
    "sourceScreen": "Bildschirm",
    "sourceImage": "Bild",
    "sourceUnknown": "Noch nicht ausgewählt",
    "showAlpha": "Alpha aktivieren",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "it": {
    "screenTitle": "Contagocce schermo",
    "screenDescription": "Usa il contagocce del browser per campionare qualsiasi pixel sullo schermo.",
    "screenButton": "Scegli colore dallo schermo",
    "screenUnsupported": "Il prelievo colore dallo schermo non è supportato in questo browser.",
    "imageTitle": "Contagocce immagine",
    "imageDescription": "Carica un'immagine e fai clic per campionare un pixel.",
    "imageButton": "Seleziona immagine",
    "imageHint": "Fai clic sull'immagine per scegliere un colore.",
    "imageError": "Impossibile caricare l'immagine.",
    "uploadHint": "Clicca o trascina l'immagine per caricarla",
    "uploadFormats": "Supporta JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Colore selezionato",
    "sourceLabel": "Fonte",
    "sourceScreen": "Schermo",
    "sourceImage": "Immagine",
    "sourceUnknown": "Non ancora selezionato",
    "showAlpha": "Abilita Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "ja": {
    "screenTitle": "画面カラーピッカー",
    "screenDescription": "ブラウザのスポイトで画面上の任意のピクセルをサンプルします。",
    "screenButton": "画面の色を取得",
    "screenUnsupported": "このブラウザでは画面の色取得はサポートされていません。",
    "imageTitle": "画像カラーピッカー",
    "imageDescription": "画像をアップロードしてクリックし、ピクセルをサンプルします。",
    "imageButton": "画像を選択",
    "imageHint": "画像をクリックして色を取得します。",
    "imageError": "画像の読み込みに失敗しました。",
    "uploadHint": "クリックまたは画像をドラッグしてアップロード",
    "uploadFormats": "JPEG、PNG、HEIC、TIFF、WebP、GIF、SVG をサポート",
    "pickedTitle": "取得した色",
    "sourceLabel": "ソース",
    "sourceScreen": "画面",
    "sourceImage": "画像",
    "sourceUnknown": "まだ取得していません",
    "showAlpha": "アルファを有効化",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "アルファ"
  },
  "ko": {
    "screenTitle": "화면 색상 선택기",
    "screenDescription": "브라우저 스포이드를 사용해 화면의 모든 픽셀을 샘플링합니다.",
    "screenButton": "화면 색상 선택",
    "screenUnsupported": "이 브라우저는 화면 색상 선택을 지원하지 않습니다.",
    "imageTitle": "이미지 색상 선택기",
    "imageDescription": "이미지를 업로드하고 클릭해 픽셀을 샘플링하세요.",
    "imageButton": "이미지 선택",
    "imageHint": "이미지를 클릭해 색상을 선택하세요.",
    "imageError": "이미지를 불러오지 못했습니다.",
    "uploadHint": "클릭하거나 이미지를 드래그하여 업로드",
    "uploadFormats": "JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG 지원",
    "pickedTitle": "선택된 색상",
    "sourceLabel": "출처",
    "sourceScreen": "화면",
    "sourceImage": "이미지",
    "sourceUnknown": "아직 선택되지 않음",
    "showAlpha": "알파 활성화",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "알파"
  },
  "ru": {
    "screenTitle": "Пипетка экрана",
    "screenDescription": "Используйте пипетку браузера, чтобы выбрать любой пиксель на экране.",
    "screenButton": "Выбрать цвет с экрана",
    "screenUnsupported": "Выбор цвета с экрана не поддерживается в этом браузере.",
    "imageTitle": "Пипетка изображения",
    "imageDescription": "Загрузите изображение и щёлкните, чтобы выбрать пиксель.",
    "imageButton": "Выбрать изображение",
    "imageHint": "Нажмите на изображение, чтобы выбрать цвет.",
    "imageError": "Не удалось загрузить изображение.",
    "uploadHint": "Нажмите или перетащите изображение для загрузки",
    "uploadFormats": "Поддерживает JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Выбранный цвет",
    "sourceLabel": "Источник",
    "sourceScreen": "Экран",
    "sourceImage": "Изображение",
    "sourceUnknown": "Пока не выбрано",
    "showAlpha": "Включить альфа",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Альфа"
  },
  "pt": {
    "screenTitle": "Seletor de cor da tela",
    "screenDescription": "Use o conta-gotas do navegador para amostrar qualquer pixel da tela.",
    "screenButton": "Capturar cor da tela",
    "screenUnsupported": "A captura de cor da tela não é suportada neste navegador.",
    "imageTitle": "Seletor de cor da imagem",
    "imageDescription": "Envie uma imagem e clique para amostrar um pixel.",
    "imageButton": "Selecionar imagem",
    "imageHint": "Clique na imagem para escolher uma cor.",
    "imageError": "Falha ao carregar a imagem.",
    "uploadHint": "Clique ou arraste a imagem para fazer upload",
    "uploadFormats": "Suporta JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Cor selecionada",
    "sourceLabel": "Origem",
    "sourceScreen": "Tela",
    "sourceImage": "Imagem",
    "sourceUnknown": "Ainda não selecionada",
    "showAlpha": "Ativar Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "ar": {
    "screenTitle": "منتقي ألوان الشاشة",
    "screenDescription": "استخدم القطّارة في المتصفح لالتقاط أي بكسل من الشاشة.",
    "screenButton": "التقاط لون الشاشة",
    "screenUnsupported": "التقاط ألوان الشاشة غير مدعوم في هذا المتصفح.",
    "imageTitle": "منتقي ألوان الصورة",
    "imageDescription": "ارفع صورة وانقر لأخذ عيّنة بكسل.",
    "imageButton": "اختر صورة",
    "imageHint": "انقر على الصورة لالتقاط لون.",
    "imageError": "تعذر تحميل الصورة.",
    "uploadHint": "انقر أو اسحب الصورة للتحميل",
    "uploadFormats": "يدعم JPEG، PNG، HEIC، TIFF، WebP، GIF، SVG",
    "pickedTitle": "اللون المختار",
    "sourceLabel": "المصدر",
    "sourceScreen": "الشاشة",
    "sourceImage": "الصورة",
    "sourceUnknown": "لم يتم الاختيار بعد",
    "showAlpha": "تفعيل ألفا",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "ألفا"
  },
  "hi": {
    "screenTitle": "स्क्रीन कलर पिकर",
    "screenDescription": "ब्राउज़र आईड्रॉपर से स्क्रीन पर किसी भी पिक्सेल को सैंपल करें।",
    "screenButton": "स्क्रीन रंग चुनें",
    "screenUnsupported": "इस ब्राउज़र में स्क्रीन रंग चुनना समर्थित नहीं है।",
    "imageTitle": "इमेज कलर पिकर",
    "imageDescription": "छवि अपलोड करें और पिक्सेल सैंपल करने के लिए क्लिक करें।",
    "imageButton": "चित्र चुनें",
    "imageHint": "रंग चुनने के लिए छवि पर क्लिक करें।",
    "imageError": "छवि लोड नहीं हो सकी।",
    "uploadHint": "अपलोड करने के लिए क्लिक करें या छवि खींचें",
    "uploadFormats": "JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG समर्थित",
    "pickedTitle": "चुना गया रंग",
    "sourceLabel": "स्रोत",
    "sourceScreen": "स्क्रीन",
    "sourceImage": "छवि",
    "sourceUnknown": "अभी चुना नहीं गया",
    "showAlpha": "अल्फा सक्षम करें",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "अल्फा"
  },
  "tr": {
    "screenTitle": "Ekran Renk Seçici",
    "screenDescription": "Tarayıcı damlalığını kullanarak ekrandaki herhangi bir pikseli örnekleyin.",
    "screenButton": "Ekran Rengi Seç",
    "screenUnsupported": "Bu tarayıcıda ekran renk seçimi desteklenmiyor.",
    "imageTitle": "Görsel Renk Seçici",
    "imageDescription": "Bir görsel yükleyin ve bir pikseli örneklemek için tıklayın.",
    "imageButton": "Görsel seç",
    "imageHint": "Renk seçmek için görsele tıklayın.",
    "imageError": "Görsel yüklenemedi.",
    "uploadHint": "Yüklemek için tıklayın veya görüntüyü sürükleyin",
    "uploadFormats": "JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG desteklenir",
    "pickedTitle": "Seçilen Renk",
    "sourceLabel": "Kaynak",
    "sourceScreen": "Ekran",
    "sourceImage": "Görsel",
    "sourceUnknown": "Henüz seçilmedi",
    "showAlpha": "Alfa Etkinleştir",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "nl": {
    "screenTitle": "Schermkleurpipet",
    "screenDescription": "Gebruik de browserpipet om een willekeurige pixel op het scherm te samplen.",
    "screenButton": "Schermkleur kiezen",
    "screenUnsupported": "Schermkleur kiezen wordt niet ondersteund in deze browser.",
    "imageTitle": "Afbeeldingskleurpipet",
    "imageDescription": "Upload een afbeelding en klik om een pixel te samplen.",
    "imageButton": "Afbeelding kiezen",
    "imageHint": "Klik op de afbeelding om een kleur te kiezen.",
    "imageError": "Afbeelding laden mislukt.",
    "uploadHint": "Klik of sleep afbeelding om te uploaden",
    "uploadFormats": "Ondersteunt JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Geselecteerde kleur",
    "sourceLabel": "Bron",
    "sourceScreen": "Scherm",
    "sourceImage": "Afbeelding",
    "sourceUnknown": "Nog niet gekozen",
    "showAlpha": "Alpha inschakelen",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "sv": {
    "screenTitle": "Skärmfärgväljare",
    "screenDescription": "Använd webbläsarens pipett för att sampla valfri pixel på skärmen.",
    "screenButton": "Välj skärmfärg",
    "screenUnsupported": "Skärmfärgväljning stöds inte i den här webbläsaren.",
    "imageTitle": "Bildfärgväljare",
    "imageDescription": "Ladda upp en bild och klicka för att sampla en pixel.",
    "imageButton": "Välj bild",
    "imageHint": "Klicka på bilden för att välja en färg.",
    "imageError": "Kunde inte läsa in bilden.",
    "uploadHint": "Klicka eller dra bild för att ladda upp",
    "uploadFormats": "Stöder JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Vald färg",
    "sourceLabel": "Källa",
    "sourceScreen": "Skärm",
    "sourceImage": "Bild",
    "sourceUnknown": "Inte vald än",
    "showAlpha": "Aktivera Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "pl": {
    "screenTitle": "Pipeta ekranu",
    "screenDescription": "Użyj pipety przeglądarki, aby pobrać dowolny piksel z ekranu.",
    "screenButton": "Pobierz kolor z ekranu",
    "screenUnsupported": "Pobieranie koloru z ekranu nie jest obsługiwane w tej przeglądarce.",
    "imageTitle": "Pipeta obrazu",
    "imageDescription": "Prześlij obraz i kliknij, aby pobrać piksel.",
    "imageButton": "Wybierz obraz",
    "imageHint": "Kliknij obraz, aby wybrać kolor.",
    "imageError": "Nie udało się wczytać obrazu.",
    "uploadHint": "Kliknij lub przeciągnij obraz, aby przesłać",
    "uploadFormats": "Obsługuje JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Wybrany kolor",
    "sourceLabel": "Źródło",
    "sourceScreen": "Ekran",
    "sourceImage": "Obraz",
    "sourceUnknown": "Jeszcze nie wybrano",
    "showAlpha": "Włącz kanał alfa",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "vi": {
    "screenTitle": "Bộ chọn màu màn hình",
    "screenDescription": "Dùng ống nhỏ giọt của trình duyệt để lấy mẫu bất kỳ pixel nào trên màn hình.",
    "screenButton": "Chọn màu màn hình",
    "screenUnsupported": "Trình duyệt này không hỗ trợ chọn màu màn hình.",
    "imageTitle": "Bộ chọn màu từ ảnh",
    "imageDescription": "Tải ảnh lên và nhấp để lấy mẫu pixel.",
    "imageButton": "Chọn ảnh",
    "imageHint": "Nhấp vào ảnh để chọn màu.",
    "imageError": "Không thể tải ảnh.",
    "uploadHint": "Nhấp hoặc kéo hình ảnh để tải lên",
    "uploadFormats": "Hỗ trợ JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Màu đã chọn",
    "sourceLabel": "Nguồn",
    "sourceScreen": "Màn hình",
    "sourceImage": "Ảnh",
    "sourceUnknown": "Chưa chọn",
    "showAlpha": "Bật Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "th": {
    "screenTitle": "ตัวเลือกสีจากหน้าจอ",
    "screenDescription": "ใช้หลอดดูดสีของเบราว์เซอร์เพื่อสุ่มตัวอย่างพิกเซลบนหน้าจอ",
    "screenButton": "เลือกสีจากหน้าจอ",
    "screenUnsupported": "เบราว์เซอร์นี้ไม่รองรับการเลือกสีจากหน้าจอ",
    "imageTitle": "ตัวเลือกสีจากภาพ",
    "imageDescription": "อัปโหลดภาพแล้วคลิกเพื่อสุ่มตัวอย่างพิกเซล",
    "imageButton": "เลือกภาพ",
    "imageHint": "คลิกที่ภาพเพื่อเลือกสี",
    "imageError": "โหลดภาพไม่สำเร็จ",
    "uploadHint": "คลิกหรือลากภาพเพื่ออัปโหลด",
    "uploadFormats": "รองรับ JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "สีที่เลือก",
    "sourceLabel": "แหล่งที่มา",
    "sourceScreen": "หน้าจอ",
    "sourceImage": "ภาพ",
    "sourceUnknown": "ยังไม่ได้เลือก",
    "showAlpha": "เปิดใช้งานอัลฟา",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "อัลฟา"
  },
  "id": {
    "screenTitle": "Pemilih warna layar",
    "screenDescription": "Gunakan eyedropper browser untuk mengambil sampel piksel di layar.",
    "screenButton": "Pilih warna layar",
    "screenUnsupported": "Pemilihan warna layar tidak didukung di browser ini.",
    "imageTitle": "Pemilih warna gambar",
    "imageDescription": "Unggah gambar dan klik untuk mengambil sampel piksel.",
    "imageButton": "Pilih gambar",
    "imageHint": "Klik gambar untuk memilih warna.",
    "imageError": "Gagal memuat gambar.",
    "uploadHint": "Klik atau seret gambar untuk mengunggah",
    "uploadFormats": "Mendukung JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Warna terpilih",
    "sourceLabel": "Sumber",
    "sourceScreen": "Layar",
    "sourceImage": "Gambar",
    "sourceUnknown": "Belum dipilih",
    "showAlpha": "Aktifkan Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "he": {
    "screenTitle": "בוחר צבע מהמסך",
    "screenDescription": "השתמש בטפטפת של הדפדפן כדי לדגום כל פיקסל על המסך.",
    "screenButton": "בחר צבע מהמסך",
    "screenUnsupported": "בחירת צבע מהמסך אינה נתמכת בדפדפן זה.",
    "imageTitle": "בוחר צבע מתמונה",
    "imageDescription": "העלה תמונה ולחץ כדי לדגום פיקסל.",
    "imageButton": "בחר תמונה",
    "imageHint": "לחץ על התמונה כדי לבחור צבע.",
    "imageError": "טעינת התמונה נכשלה.",
    "uploadHint": "לחץ או גרור תמונה להעלאה",
    "uploadFormats": "תומך ב-JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "צבע שנבחר",
    "sourceLabel": "מקור",
    "sourceScreen": "מסך",
    "sourceImage": "תמונה",
    "sourceUnknown": "לא נבחר עדיין",
    "showAlpha": "הפעל אלפא",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "אלפא"
  },
  "ms": {
    "screenTitle": "Pemilih warna skrin",
    "screenDescription": "Gunakan eyedropper pelayar untuk mengambil sampel mana-mana piksel pada skrin.",
    "screenButton": "Pilih warna skrin",
    "screenUnsupported": "Pemilihan warna skrin tidak disokong dalam pelayar ini.",
    "imageTitle": "Pemilih warna imej",
    "imageDescription": "Muat naik imej dan klik untuk mengambil sampel piksel.",
    "imageButton": "Pilih imej",
    "imageHint": "Klik imej untuk memilih warna.",
    "imageError": "Gagal memuatkan imej.",
    "uploadHint": "Klik atau seret imej untuk muat naik",
    "uploadFormats": "Menyokong JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Warna dipilih",
    "sourceLabel": "Sumber",
    "sourceScreen": "Skrin",
    "sourceImage": "Imej",
    "sourceUnknown": "Belum dipilih",
    "showAlpha": "Dayakan Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "no": {
    "screenTitle": "Skjermfargevelger",
    "screenDescription": "Bruk nettleserens pipette for å hente en piksel fra skjermen.",
    "screenButton": "Velg skjermfarge",
    "screenUnsupported": "Skjermfargevelging støttes ikke i denne nettleseren.",
    "imageTitle": "Bildefargevelger",
    "imageDescription": "Last opp et bilde og klikk for å prøve en piksel.",
    "imageButton": "Velg bilde",
    "imageHint": "Klikk på bildet for å velge en farge.",
    "imageError": "Kunne ikke laste bildet.",
    "uploadHint": "Klikk eller dra bilde for å laste opp",
    "uploadFormats": "Støtter JPEG, PNG, HEIC, TIFF, WebP, GIF, SVG",
    "pickedTitle": "Valgt farge",
    "sourceLabel": "Kilde",
    "sourceScreen": "Skjerm",
    "sourceImage": "Bilde",
    "sourceUnknown": "Ikke valgt ennå",
    "showAlpha": "Aktiver Alpha",
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  }
}
</i18n>
