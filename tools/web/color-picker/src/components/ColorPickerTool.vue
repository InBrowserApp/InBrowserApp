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
import { useI18n } from 'vue-i18n'
import ColorPickerImageSection from './ColorPickerImageSection.vue'
import ColorPickerOutputSection from './ColorPickerOutputSection.vue'
import ColorPickerScreenSection from './ColorPickerScreenSection.vue'
import { useColorPickerTool } from '../composables/useColorPickerTool'

const { t } = useI18n()
const messages = {
  imageError: () => t('imageError'),
}

const {
  isEyeDropperSupported,
  showAlpha,
  pickedSource,
  imageError,
  hasImage,
  canvasStyle,
  dropOverlayActive,
  cssColor,
  hexValue,
  rgbValue,
  hslValue,
  hsvValue,
  cmykValue,
  alphaValue,
  handleScreenPick,
  handleImagePick,
  handleFileInputReady,
  handleCanvasReady,
  handleWrapperReady,
  handleFilePick,
  handleFileChange,
  handleCanvasClick,
} = useColorPickerTool(messages)

defineExpose({
  handleFilePick,
  handleCanvasClick,
  handleScreenPick,
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
