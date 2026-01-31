<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('uploadImage') }}</ToolSectionHeader>

    <template v-if="!file">
      <n-upload :accept="accept" @before-upload="handleBeforeUpload">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <Image24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ t('dragDropOrClick') }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ t('supportedFormats') }}
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </template>

    <template v-else>
      <n-flex vertical :size="16">
        <n-flex align="center" :size="16">
          <n-image :src="imagePreview || ''" alt="Preview" height="120" object-fit="contain" />
          <n-flex vertical :size="4">
            <n-text strong>{{ file.name }}</n-text>
            <n-text depth="3">{{ filesize(file.size) }}</n-text>
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import type { UploadFileInfo } from 'naive-ui'
import { NUpload, NUploadDragger, NIcon, NText, NP, NFlex, NButton, NImage } from 'naive-ui'
import Image24Regular from '@vicons/fluent/Image24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
const message = useMessage()

const accept = 'image/*'

const file = defineModel<File | null>('file', { required: true })
const imagePreview = useObjectUrl(file)

function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const selectedFile = data.file.file
  if (!selectedFile) return false

  if (data.fileList.length > 1) {
    message.error(t('onlyOneFile'))
    return false
  }

  const ext = selectedFile.name.split('.').pop()?.toLowerCase()
  const isImageType = selectedFile.type.startsWith('image/')
  const canFallbackToExtension = !selectedFile.type && Boolean(ext)

  if (!isImageType && !canFallbackToExtension) {
    message.error(t('invalidFileType'))
    return false
  }

  file.value = selectedFile
  return false
}

function handleClearFile() {
  file.value = null
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadImage": "Upload Image",
    "dragDropOrClick": "Click or drag to upload an image",
    "supportedFormats": "Supports various image formats",
    "removeFile": "Remove File",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file"
  },
  "zh": {
    "uploadImage": "上传图片",
    "dragDropOrClick": "点击或拖拽上传图片",
    "supportedFormats": "支持多种图片格式",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的图片文件"
  },
  "zh-CN": {
    "uploadImage": "上传图片",
    "dragDropOrClick": "点击或拖拽上传图片",
    "supportedFormats": "支持多种图片格式",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的图片文件"
  },
  "zh-TW": {
    "uploadImage": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳上傳圖片",
    "supportedFormats": "支援多種圖片格式",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的圖片檔案"
  },
  "zh-HK": {
    "uploadImage": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳上傳圖片",
    "supportedFormats": "支援多種圖片格式",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的圖片檔案"
  },
  "es": {
    "uploadImage": "Subir imagen",
    "dragDropOrClick": "Haz clic o arrastra para subir una imagen",
    "supportedFormats": "Admite varios formatos de imagen",
    "removeFile": "Eliminar archivo",
    "onlyOneFile": "Solo se puede subir un archivo",
    "invalidFileType": "Por favor selecciona una imagen válida"
  },
  "fr": {
    "uploadImage": "Télécharger une image",
    "dragDropOrClick": "Cliquez ou glissez pour télécharger une image",
    "supportedFormats": "Prend en charge divers formats d'image",
    "removeFile": "Supprimer le fichier",
    "onlyOneFile": "Un seul fichier peut être téléchargé",
    "invalidFileType": "Veuillez sélectionner une image valide"
  },
  "de": {
    "uploadImage": "Bild hochladen",
    "dragDropOrClick": "Klicken oder ziehen Sie, um ein Bild hochzuladen",
    "supportedFormats": "Unterstützt verschiedene Bildformate",
    "removeFile": "Datei entfernen",
    "onlyOneFile": "Es kann nur eine Datei hochgeladen werden",
    "invalidFileType": "Bitte wählen Sie eine gültige Bilddatei"
  },
  "it": {
    "uploadImage": "Carica immagine",
    "dragDropOrClick": "Clicca o trascina per caricare un'immagine",
    "supportedFormats": "Supporta vari formati di immagine",
    "removeFile": "Rimuovi file",
    "onlyOneFile": "È possibile caricare solo un file",
    "invalidFileType": "Seleziona un'immagine valida"
  },
  "ja": {
    "uploadImage": "画像をアップロード",
    "dragDropOrClick": "クリックまたはドラッグして画像をアップロード",
    "supportedFormats": "さまざまな画像形式に対応",
    "removeFile": "ファイルを削除",
    "onlyOneFile": "アップロードできるファイルは 1 つだけです",
    "invalidFileType": "有効な画像ファイルを選択してください"
  },
  "ko": {
    "uploadImage": "이미지 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 이미지 업로드",
    "supportedFormats": "다양한 이미지 형식 지원",
    "removeFile": "파일 제거",
    "onlyOneFile": "하나의 파일만 업로드할 수 있습니다",
    "invalidFileType": "유효한 이미지 파일을 선택하세요"
  },
  "ru": {
    "uploadImage": "Загрузить изображение",
    "dragDropOrClick": "Нажмите или перетащите, чтобы загрузить изображение",
    "supportedFormats": "Поддерживает различные форматы изображений",
    "removeFile": "Удалить файл",
    "onlyOneFile": "Можно загрузить только один файл",
    "invalidFileType": "Пожалуйста, выберите действительный файл изображения"
  },
  "pt": {
    "uploadImage": "Enviar imagem",
    "dragDropOrClick": "Clique ou arraste para enviar uma imagem",
    "supportedFormats": "Suporta vários formatos de imagem",
    "removeFile": "Remover arquivo",
    "onlyOneFile": "Apenas um arquivo pode ser enviado",
    "invalidFileType": "Selecione um arquivo de imagem válido"
  },
  "ar": {
    "uploadImage": "تحميل صورة",
    "dragDropOrClick": "انقر أو اسحب لتحميل صورة",
    "supportedFormats": "يدعم صيغ صور متعددة",
    "removeFile": "إزالة الملف",
    "onlyOneFile": "يمكن تحميل ملف واحد فقط",
    "invalidFileType": "يرجى اختيار ملف صورة صالح"
  },
  "hi": {
    "uploadImage": "चित्र अपलोड करें",
    "dragDropOrClick": "अपलोड करने के लिए क्लिक करें या खींचें",
    "supportedFormats": "विभिन्न छवि प्रारूप समर्थित",
    "removeFile": "फ़ाइल हटाएं",
    "onlyOneFile": "केवल एक फ़ाइल अपलोड की जा सकती है",
    "invalidFileType": "कृपया एक मान्य छवि फ़ाइल चुनें"
  },
  "tr": {
    "uploadImage": "Görsel yükle",
    "dragDropOrClick": "Yüklemek için tıklayın veya sürükleyin",
    "supportedFormats": "Çeşitli görüntü formatlarını destekler",
    "removeFile": "Dosyayı kaldır",
    "onlyOneFile": "Yalnızca bir dosya yüklenebilir",
    "invalidFileType": "Lütfen geçerli bir görüntü dosyası seçin"
  },
  "nl": {
    "uploadImage": "Afbeelding uploaden",
    "dragDropOrClick": "Klik of sleep om een afbeelding te uploaden",
    "supportedFormats": "Ondersteunt verschillende afbeeldingsformaten",
    "removeFile": "Bestand verwijderen",
    "onlyOneFile": "Er kan slechts één bestand worden geüpload",
    "invalidFileType": "Selecteer een geldig afbeeldingsbestand"
  },
  "sv": {
    "uploadImage": "Ladda upp bild",
    "dragDropOrClick": "Klicka eller dra för att ladda upp en bild",
    "supportedFormats": "Stöder olika bildformat",
    "removeFile": "Ta bort fil",
    "onlyOneFile": "Endast en fil kan laddas upp",
    "invalidFileType": "Välj en giltig bildfil"
  },
  "pl": {
    "uploadImage": "Prześlij obraz",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać obraz",
    "supportedFormats": "Obsługuje różne formaty obrazów",
    "removeFile": "Usuń plik",
    "onlyOneFile": "Można przesłać tylko jeden plik",
    "invalidFileType": "Wybierz prawidłowy plik obrazu"
  },
  "vi": {
    "uploadImage": "Tải ảnh lên",
    "dragDropOrClick": "Nhấp hoặc kéo để tải ảnh lên",
    "supportedFormats": "Hỗ trợ nhiều định dạng hình ảnh",
    "removeFile": "Xóa tệp",
    "onlyOneFile": "Chỉ có thể tải lên một tệp",
    "invalidFileType": "Vui lòng chọn tệp hình ảnh hợp lệ"
  },
  "th": {
    "uploadImage": "อัปโหลดรูปภาพ",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลดรูปภาพ",
    "supportedFormats": "รองรับรูปแบบภาพหลากหลาย",
    "removeFile": "ลบไฟล์",
    "onlyOneFile": "อัปโหลดได้เพียงไฟล์เดียว",
    "invalidFileType": "โปรดเลือกไฟล์รูปภาพที่ถูกต้อง"
  },
  "id": {
    "uploadImage": "Unggah gambar",
    "dragDropOrClick": "Klik atau seret untuk mengunggah gambar",
    "supportedFormats": "Mendukung berbagai format gambar",
    "removeFile": "Hapus file",
    "onlyOneFile": "Hanya satu file yang dapat diunggah",
    "invalidFileType": "Silakan pilih file gambar yang valid"
  },
  "he": {
    "uploadImage": "העלאת תמונה",
    "dragDropOrClick": "לחץ או גרור כדי להעלות תמונה",
    "supportedFormats": "תומך במגוון פורמטי תמונה",
    "removeFile": "הסר קובץ",
    "onlyOneFile": "ניתן להעלות קובץ אחד בלבד",
    "invalidFileType": "בחר קובץ תמונה תקין"
  },
  "ms": {
    "uploadImage": "Muat naik imej",
    "dragDropOrClick": "Klik atau seret untuk memuat naik imej",
    "supportedFormats": "Menyokong pelbagai format imej",
    "removeFile": "Buang fail",
    "onlyOneFile": "Hanya satu fail boleh dimuat naik",
    "invalidFileType": "Sila pilih fail imej yang sah"
  },
  "no": {
    "uploadImage": "Last opp bilde",
    "dragDropOrClick": "Klikk eller dra for å laste opp et bilde",
    "supportedFormats": "Støtter ulike bildeformater",
    "removeFile": "Fjern fil",
    "onlyOneFile": "Kun én fil kan lastes opp",
    "invalidFileType": "Velg en gyldig bildefil"
  }
}
</i18n>
