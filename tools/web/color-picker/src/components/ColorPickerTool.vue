<template>
  <ColorPickerScreenSection
    :is-eye-dropper-supported="isEyeDropperSupported"
    @pick="handleScreenPick"
  />
  <ColorPickerImageSection
    :image-error="imageError"
    :has-image="hasImage"
    :canvas-style="canvasStyle"
    :drop-overlay-active="dropOverlayActive"
    @pick-image="handleImagePick"
    @file-change="handleFileChange"
    @canvas-click="handleCanvasClick"
    @file-input-ready="handleFileInputReady"
    @canvas-ready="handleCanvasReady"
    @wrapper-ready="handleWrapperReady"
  />
  <ColorPickerOutputSection
    v-model:show-alpha="showAlpha"
    :css-color="cssColor"
    :picked-source="pickedSource"
    :hex-value="hexValue"
    :rgb-value="rgbValue"
    :hsl-value="hslValue"
    :hsv-value="hsvValue"
    :cmyk-value="cmykValue"
    :alpha-value="alphaValue"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDropZone, useElementSize, useStorage } from '@vueuse/core'
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
import ColorPickerImageSection from './ColorPickerImageSection.vue'
import ColorPickerOutputSection from './ColorPickerOutputSection.vue'
import ColorPickerScreenSection from './ColorPickerScreenSection.vue'

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

const dropZoneRef = ref<Document | null>(null)
const isDragging = ref(false)
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

const hexValue = computed(() => rgbaToHex(pickedColor.value, showAlpha.value))
const rgbValue = computed(() => formatRgb(pickedColor.value, showAlpha.value))
const hslValue = computed(() => formatHsl(pickedColor.value, showAlpha.value))
const hsvValue = computed(() => formatHsv(pickedColor.value, showAlpha.value))
const cmykValue = computed(() => formatCmyk(pickedColor.value))
const alphaValue = computed(() => formatAlphaPercent(pickedColor.value.a))
const cssColor = computed(() => toCssRgba(pickedColor.value))

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

function isImageFile(file: File | null): boolean {
  if (!file) return false
  if (file.type.startsWith('image/')) return true
  const name = file.name.toLowerCase()
  return [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.svg',
    '.bmp',
    '.tif',
    '.tiff',
    '.avif',
    '.heic',
    '.heif',
  ].some((ext) => name.endsWith(ext))
}

function pickImageFile(files: File[] | null): File | null {
  if (!files?.length) return null
  return files.find((file) => isImageFile(file)) ?? null
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

function handleFileInputReady(value: HTMLInputElement | null) {
  fileInputRef.value = value
}

function handleCanvasReady(value: HTMLCanvasElement | null) {
  canvasRef.value = value
}

function handleWrapperReady(value: HTMLDivElement | null) {
  canvasWrapperRef.value = value
}

function handleFilePick(file: File | null) {
  if (!file || !isImageFile(file)) {
    imageError.value = t('imageError')
    return false
  }
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

function checkDropItems(items: DataTransferItemList) {
  for (const item of Array.from(items)) {
    if (item.kind !== 'file') continue
    const file = item.getAsFile()
    if (!file) return true
    if (isImageFile(file)) return true
  }
  return false
}

function isFileDragEvent(event?: DragEvent | null) {
  if (!event?.dataTransfer?.types) return false
  return Array.from(event.dataTransfer.types).includes('Files')
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files) {
    isDragging.value = false
    handleFilePick(pickImageFile(files))
  },
  onEnter(_, event) {
    isDragging.value = isFileDragEvent(event)
  },
  onOver(_, event) {
    if (!isDragging.value) {
      isDragging.value = isFileDragEvent(event)
    }
  },
  onLeave() {
    isDragging.value = false
  },
  checkValidity: checkDropItems,
  multiple: false,
  preventDefaultForUnhandled: true,
})

const dropOverlayActive = computed(() => isDragging.value || isOverDropZone.value)

defineExpose({
  handleFilePick,
  handleCanvasClick,
  handleScreenPick,
})

onMounted(() => {
  dropZoneRef.value = document
})

onBeforeUnmount(() => {
  revokeObjectUrl()
})
</script>

<i18n lang="json">
{
  "en": {
    "imageError": "Failed to load the image."
  },
  "zh": {
    "imageError": "图片加载失败。"
  },
  "zh-CN": {
    "imageError": "图片加载失败。"
  },
  "zh-TW": {
    "imageError": "圖片載入失敗。"
  },
  "zh-HK": {
    "imageError": "圖片載入失敗。"
  },
  "es": {
    "imageError": "No se pudo cargar la imagen."
  },
  "fr": {
    "imageError": "Échec du chargement de l’image."
  },
  "de": {
    "imageError": "Bild konnte nicht geladen werden."
  },
  "it": {
    "imageError": "Impossibile caricare l'immagine."
  },
  "ja": {
    "imageError": "画像の読み込みに失敗しました。"
  },
  "ko": {
    "imageError": "이미지를 불러오지 못했습니다."
  },
  "ru": {
    "imageError": "Не удалось загрузить изображение."
  },
  "pt": {
    "imageError": "Falha ao carregar a imagem."
  },
  "ar": {
    "imageError": "تعذر تحميل الصورة."
  },
  "hi": {
    "imageError": "छवि लोड नहीं हो सकी।"
  },
  "tr": {
    "imageError": "Görsel yüklenemedi."
  },
  "nl": {
    "imageError": "Afbeelding laden mislukt."
  },
  "sv": {
    "imageError": "Kunde inte läsa in bilden."
  },
  "pl": {
    "imageError": "Nie udało się wczytać obrazu."
  },
  "vi": {
    "imageError": "Không thể tải ảnh."
  },
  "th": {
    "imageError": "โหลดภาพไม่สำเร็จ"
  },
  "id": {
    "imageError": "Gagal memuat gambar."
  },
  "he": {
    "imageError": "טעינת התמונה נכשלה."
  },
  "ms": {
    "imageError": "Gagal memuatkan imej."
  },
  "no": {
    "imageError": "Kunne ikke laste bildet."
  }
}
</i18n>
