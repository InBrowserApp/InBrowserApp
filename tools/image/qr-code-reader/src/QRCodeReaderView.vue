<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSection>
      <NTabs v-model:value="mode" type="segment" animated>
        <NTabPane name="upload" :tab="t('uploadImage')">
          <ImageUpload v-model:file="file" @decoded="handleDecoded" @error="handleError" />
        </NTabPane>
        <NTabPane name="camera" :tab="t('useCamera')">
          <CameraCapture @decoded="handleDecoded" @error="handleError" />
        </NTabPane>
      </NTabs>
    </ToolSection>
    <QRResult :result="result" :error="error" />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NTabs, NTabPane } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import * as toolInfo from './info'
import ImageUpload from './components/ImageUpload.vue'
import CameraCapture from './components/CameraCapture.vue'
import QRResult from './components/QRResult.vue'

const { t } = useI18n()

const mode = ref<'upload' | 'camera'>('upload')
const file = ref<File | null>(null)
const result = ref<string | null>(null)
const error = ref<string | null>(null)

function handleDecoded(data: string) {
  result.value = data
  error.value = null
}

function handleError(msg: string) {
  error.value = msg
  result.value = null
}

// Clear result and file when switching modes
watch(mode, () => {
  result.value = null
  error.value = null
  file.value = null
})
</script>

<i18n lang="json">
{
  "en": {
    "uploadImage": "Upload Image",
    "useCamera": "Use Camera"
  },
  "zh": {
    "uploadImage": "上传图片",
    "useCamera": "使用摄像头"
  },
  "zh-CN": {
    "uploadImage": "上传图片",
    "useCamera": "使用摄像头"
  },
  "zh-TW": {
    "uploadImage": "上傳圖片",
    "useCamera": "使用攝影機"
  },
  "zh-HK": {
    "uploadImage": "上傳圖片",
    "useCamera": "使用攝影機"
  },
  "es": {
    "uploadImage": "Subir imagen",
    "useCamera": "Usar camara"
  },
  "fr": {
    "uploadImage": "Telecharger l'image",
    "useCamera": "Utiliser la camera"
  },
  "de": {
    "uploadImage": "Bild hochladen",
    "useCamera": "Kamera verwenden"
  },
  "it": {
    "uploadImage": "Carica immagine",
    "useCamera": "Usa fotocamera"
  },
  "ja": {
    "uploadImage": "画像をアップロード",
    "useCamera": "カメラを使用"
  },
  "ko": {
    "uploadImage": "이미지 업로드",
    "useCamera": "카메라 사용"
  },
  "ru": {
    "uploadImage": "Загрузить изображение",
    "useCamera": "Использовать камеру"
  },
  "pt": {
    "uploadImage": "Carregar imagem",
    "useCamera": "Usar camera"
  },
  "ar": {
    "uploadImage": "تحميل صورة",
    "useCamera": "استخدام الكاميرا"
  },
  "hi": {
    "uploadImage": "छवि अपलोड करें",
    "useCamera": "कैमरा का उपयोग करें"
  },
  "tr": {
    "uploadImage": "Gorsel yukle",
    "useCamera": "Kamera kullan"
  },
  "nl": {
    "uploadImage": "Afbeelding uploaden",
    "useCamera": "Camera gebruiken"
  },
  "sv": {
    "uploadImage": "Ladda upp bild",
    "useCamera": "Anvand kamera"
  },
  "pl": {
    "uploadImage": "Przeslij obraz",
    "useCamera": "Uzyj kamery"
  },
  "vi": {
    "uploadImage": "Tai anh len",
    "useCamera": "Su dung camera"
  },
  "th": {
    "uploadImage": "อัปโหลดรูปภาพ",
    "useCamera": "ใช้กล้อง"
  },
  "id": {
    "uploadImage": "Unggah gambar",
    "useCamera": "Gunakan kamera"
  },
  "he": {
    "uploadImage": "העלה תמונה",
    "useCamera": "השתמש במצלמה"
  },
  "ms": {
    "uploadImage": "Muat naik imej",
    "useCamera": "Gunakan kamera"
  },
  "no": {
    "uploadImage": "Last opp bilde",
    "useCamera": "Bruk kamera"
  }
}
</i18n>
