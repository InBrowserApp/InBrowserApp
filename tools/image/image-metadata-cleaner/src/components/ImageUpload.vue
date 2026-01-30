<template>
  <ToolSection>
    <n-upload
      :show-file-list="false"
      accept="image/jpeg,image/png,image/webp"
      :max="1"
      @before-upload="handleBeforeUpload"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <ImageIcon />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          {{ t('dragDropOrClick') }}
        </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          {{ t('supportedFormats') }}
        </n-p>
      </n-upload-dragger>
    </n-upload>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { UploadFileInfo } from 'naive-ui'
import { NUpload, NUploadDragger, NIcon, NText, NP } from 'naive-ui'
import ImageIcon from '@vicons/fluent/Image24Regular'
import { ToolSection } from '@shared/ui/tool'

const fileModel = defineModel<File | null>('file', { required: true })

const { t } = useI18n()

function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const selectedFile = data.file.file
  if (!selectedFile) return false

  fileModel.value = selectedFile
  return false
}
</script>

<i18n lang="json">
{
  "en": {
    "dragDropOrClick": "Click or drag image to upload",
    "supportedFormats": "Supports JPEG, PNG, WebP"
  },
  "zh": {
    "dragDropOrClick": "点击或拖拽图片上传",
    "supportedFormats": "支持 JPEG、PNG、WebP"
  },
  "zh-CN": {
    "dragDropOrClick": "点击或拖拽图片上传",
    "supportedFormats": "支持 JPEG、PNG、WebP"
  },
  "zh-TW": {
    "dragDropOrClick": "點擊或拖曳圖片上傳",
    "supportedFormats": "支援 JPEG、PNG、WebP"
  },
  "zh-HK": {
    "dragDropOrClick": "點擊或拖曳圖片上傳",
    "supportedFormats": "支援 JPEG、PNG、WebP"
  },
  "es": {
    "dragDropOrClick": "Haga clic o arrastre la imagen para cargar",
    "supportedFormats": "Soporta JPEG, PNG, WebP"
  },
  "fr": {
    "dragDropOrClick": "Cliquez ou déposez l'image pour télécharger",
    "supportedFormats": "Prend en charge JPEG, PNG, WebP"
  },
  "de": {
    "dragDropOrClick": "Klicken oder Bild hierher ziehen",
    "supportedFormats": "Unterstützt JPEG, PNG, WebP"
  },
  "it": {
    "dragDropOrClick": "Clicca o trascina l'immagine per caricarla",
    "supportedFormats": "Supporta JPEG, PNG, WebP"
  },
  "ja": {
    "dragDropOrClick": "クリックまたは画像をドラッグしてアップロード",
    "supportedFormats": "JPEG、PNG、WebP をサポート"
  },
  "ko": {
    "dragDropOrClick": "클릭하거나 이미지를 드래그하여 업로드",
    "supportedFormats": "JPEG, PNG, WebP 지원"
  },
  "ru": {
    "dragDropOrClick": "Нажмите или перетащите изображение для загрузки",
    "supportedFormats": "Поддерживает JPEG, PNG, WebP"
  },
  "pt": {
    "dragDropOrClick": "Clique ou arraste a imagem para fazer upload",
    "supportedFormats": "Suporta JPEG, PNG, WebP"
  },
  "ar": {
    "dragDropOrClick": "انقر أو اسحب الصورة للتحميل",
    "supportedFormats": "يدعم JPEG وPNG وWebP"
  },
  "hi": {
    "dragDropOrClick": "अपलोड करने के लिए क्लिक करें या छवि खींचें",
    "supportedFormats": "JPEG, PNG, WebP समर्थित"
  },
  "tr": {
    "dragDropOrClick": "Yüklemek için tıklayın veya görüntüyü sürükleyin",
    "supportedFormats": "JPEG, PNG, WebP desteklenir"
  },
  "nl": {
    "dragDropOrClick": "Klik of sleep afbeelding om te uploaden",
    "supportedFormats": "Ondersteunt JPEG, PNG, WebP"
  },
  "sv": {
    "dragDropOrClick": "Klicka eller dra bild för att ladda upp",
    "supportedFormats": "Stöder JPEG, PNG, WebP"
  },
  "pl": {
    "dragDropOrClick": "Kliknij lub przeciągnij obraz, aby przesłać",
    "supportedFormats": "Obsługuje JPEG, PNG, WebP"
  },
  "vi": {
    "dragDropOrClick": "Nhấp hoặc kéo hình ảnh để tải lên",
    "supportedFormats": "Hỗ trợ JPEG, PNG, WebP"
  },
  "th": {
    "dragDropOrClick": "คลิกหรือลากภาพเพื่ออัปโหลด",
    "supportedFormats": "รองรับ JPEG, PNG, WebP"
  },
  "id": {
    "dragDropOrClick": "Klik atau seret gambar untuk mengunggah",
    "supportedFormats": "Mendukung JPEG, PNG, WebP"
  },
  "he": {
    "dragDropOrClick": "לחץ או גרור תמונה להעלאה",
    "supportedFormats": "תומך ב-JPEG, PNG, WebP"
  },
  "ms": {
    "dragDropOrClick": "Klik atau seret imej untuk muat naik",
    "supportedFormats": "Menyokong JPEG, PNG, WebP"
  },
  "no": {
    "dragDropOrClick": "Klikk eller dra bilde for å laste opp",
    "supportedFormats": "Støtter JPEG, PNG, WebP"
  }
}
</i18n>
