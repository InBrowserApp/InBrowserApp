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
import { toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import type { UploadFileInfo } from 'naive-ui'
import { NUpload, NUploadDragger, NIcon, NText, NP, NFlex, NButton, NImage } from 'naive-ui'
import { Image24Regular, Delete20Regular } from '@shared/icons/fluent'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
const message = useMessage()

const accept = 'image/png,image/jpeg,image/svg+xml,image/webp'
const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'])
const allowedExtensions = ['png', 'jpg', 'jpeg', 'svg', 'webp']

const props = defineProps<{
  file: File | null
}>()

const emit = defineEmits<{
  'update:file': [file: File | null]
}>()

const file = toRef(props, 'file')
const imagePreview = useObjectUrl(file)

function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const selectedFile = data.file.file
  if (!selectedFile) return false

  if (data.fileList.length > 1) {
    message.error(t('onlyOneFile'))
    return false
  }

  const ext = selectedFile.name.split('.').pop()?.toLowerCase()
  const isValidType = allowedTypes.has(selectedFile.type)
  const isValidExt = ext ? allowedExtensions.includes(ext) : false

  if (!isValidType && !isValidExt) {
    message.error(t('invalidFileType'))
    return false
  }

  emit('update:file', selectedFile)
  return false
}

function handleClearFile() {
  emit('update:file', null)
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadImage": "Upload Image",
    "dragDropOrClick": "Click or drag to upload an image",
    "supportedFormats": "Supports PNG, JPEG, SVG, WebP",
    "removeFile": "Remove File",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid PNG, JPEG, SVG, or WebP image"
  },
  "zh": {
    "uploadImage": "上传图片",
    "dragDropOrClick": "点击或拖拽上传图片",
    "supportedFormats": "支持 PNG、JPEG、SVG、WebP",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的 PNG、JPEG、SVG 或 WebP 图片"
  },
  "zh-CN": {
    "uploadImage": "上传图片",
    "dragDropOrClick": "点击或拖拽上传图片",
    "supportedFormats": "支持 PNG、JPEG、SVG、WebP",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的 PNG、JPEG、SVG 或 WebP 图片"
  },
  "zh-TW": {
    "uploadImage": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳上傳圖片",
    "supportedFormats": "支援 PNG、JPEG、SVG、WebP",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的 PNG、JPEG、SVG 或 WebP 圖片"
  },
  "zh-HK": {
    "uploadImage": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳上傳圖片",
    "supportedFormats": "支援 PNG、JPEG、SVG、WebP",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的 PNG、JPEG、SVG 或 WebP 圖片"
  },
  "es": {
    "uploadImage": "Subir imagen",
    "dragDropOrClick": "Haz clic o arrastra para subir una imagen",
    "supportedFormats": "Soporta PNG, JPEG, SVG, WebP",
    "removeFile": "Eliminar archivo",
    "onlyOneFile": "Solo se puede subir un archivo",
    "invalidFileType": "Por favor selecciona una imagen PNG, JPEG, SVG o WebP válida"
  },
  "fr": {
    "uploadImage": "Télécharger une image",
    "dragDropOrClick": "Cliquez ou glissez pour télécharger une image",
    "supportedFormats": "Prend en charge PNG, JPEG, SVG, WebP",
    "removeFile": "Supprimer le fichier",
    "onlyOneFile": "Un seul fichier peut être téléchargé",
    "invalidFileType": "Veuillez sélectionner une image PNG, JPEG, SVG ou WebP valide"
  },
  "de": {
    "uploadImage": "Bild hochladen",
    "dragDropOrClick": "Klicken oder ziehen Sie, um ein Bild hochzuladen",
    "supportedFormats": "Unterstützt PNG, JPEG, SVG, WebP",
    "removeFile": "Datei entfernen",
    "onlyOneFile": "Es kann nur eine Datei hochgeladen werden",
    "invalidFileType": "Bitte wählen Sie ein gültiges PNG-, JPEG-, SVG- oder WebP-Bild"
  },
  "it": {
    "uploadImage": "Carica immagine",
    "dragDropOrClick": "Clicca o trascina per caricare un'immagine",
    "supportedFormats": "Supporta PNG, JPEG, SVG, WebP",
    "removeFile": "Rimuovi file",
    "onlyOneFile": "È possibile caricare solo un file",
    "invalidFileType": "Seleziona un'immagine PNG, JPEG, SVG o WebP valida"
  },
  "ja": {
    "uploadImage": "画像をアップロード",
    "dragDropOrClick": "クリックまたはドラッグして画像をアップロード",
    "supportedFormats": "PNG、JPEG、SVG、WebP に対応",
    "removeFile": "ファイルを削除",
    "onlyOneFile": "アップロードできるファイルは 1 つだけです",
    "invalidFileType": "有効な PNG、JPEG、SVG、WebP 画像を選択してください"
  },
  "ko": {
    "uploadImage": "이미지 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 이미지 업로드",
    "supportedFormats": "PNG, JPEG, SVG, WebP 지원",
    "removeFile": "파일 제거",
    "onlyOneFile": "하나의 파일만 업로드할 수 있습니다",
    "invalidFileType": "유효한 PNG, JPEG, SVG 또는 WebP 이미지를 선택하세요"
  },
  "ru": {
    "uploadImage": "Загрузить изображение",
    "dragDropOrClick": "Нажмите или перетащите, чтобы загрузить изображение",
    "supportedFormats": "Поддерживает PNG, JPEG, SVG, WebP",
    "removeFile": "Удалить файл",
    "onlyOneFile": "Можно загрузить только один файл",
    "invalidFileType": "Пожалуйста, выберите действительное изображение PNG, JPEG, SVG или WebP"
  },
  "pt": {
    "uploadImage": "Enviar imagem",
    "dragDropOrClick": "Clique ou arraste para enviar uma imagem",
    "supportedFormats": "Suporta PNG, JPEG, SVG, WebP",
    "removeFile": "Remover arquivo",
    "onlyOneFile": "Apenas um arquivo pode ser enviado",
    "invalidFileType": "Selecione uma imagem PNG, JPEG, SVG ou WebP válida"
  },
  "ar": {
    "uploadImage": "تحميل صورة",
    "dragDropOrClick": "انقر أو اسحب لتحميل صورة",
    "supportedFormats": "يدعم PNG وJPEG وSVG وWebP",
    "removeFile": "إزالة الملف",
    "onlyOneFile": "يمكن تحميل ملف واحد فقط",
    "invalidFileType": "يرجى اختيار صورة PNG أو JPEG أو SVG أو WebP صالحة"
  },
  "hi": {
    "uploadImage": "चित्र अपलोड करें",
    "dragDropOrClick": "अपलोड करने के लिए क्लिक करें या खींचें",
    "supportedFormats": "PNG, JPEG, SVG, WebP समर्थित",
    "removeFile": "फ़ाइल हटाएं",
    "onlyOneFile": "केवल एक फ़ाइल अपलोड की जा सकती है",
    "invalidFileType": "कृपया मान्य PNG, JPEG, SVG या WebP छवि चुनें"
  },
  "tr": {
    "uploadImage": "Görsel yükle",
    "dragDropOrClick": "Yüklemek için tıklayın veya sürükleyin",
    "supportedFormats": "PNG, JPEG, SVG, WebP desteklenir",
    "removeFile": "Dosyayı kaldır",
    "onlyOneFile": "Yalnızca bir dosya yüklenebilir",
    "invalidFileType": "Lütfen geçerli bir PNG, JPEG, SVG veya WebP görseli seçin"
  },
  "nl": {
    "uploadImage": "Afbeelding uploaden",
    "dragDropOrClick": "Klik of sleep om een afbeelding te uploaden",
    "supportedFormats": "Ondersteunt PNG, JPEG, SVG, WebP",
    "removeFile": "Bestand verwijderen",
    "onlyOneFile": "Er kan slechts één bestand worden geüpload",
    "invalidFileType": "Selecteer een geldige PNG-, JPEG-, SVG- of WebP-afbeelding"
  },
  "sv": {
    "uploadImage": "Ladda upp bild",
    "dragDropOrClick": "Klicka eller dra för att ladda upp en bild",
    "supportedFormats": "Stöder PNG, JPEG, SVG, WebP",
    "removeFile": "Ta bort fil",
    "onlyOneFile": "Endast en fil kan laddas upp",
    "invalidFileType": "Välj en giltig PNG-, JPEG-, SVG- eller WebP-bild"
  },
  "pl": {
    "uploadImage": "Prześlij obraz",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać obraz",
    "supportedFormats": "Obsługuje PNG, JPEG, SVG, WebP",
    "removeFile": "Usuń plik",
    "onlyOneFile": "Można przesłać tylko jeden plik",
    "invalidFileType": "Wybierz prawidłowy obraz PNG, JPEG, SVG lub WebP"
  },
  "vi": {
    "uploadImage": "Tải ảnh lên",
    "dragDropOrClick": "Nhấp hoặc kéo để tải ảnh lên",
    "supportedFormats": "Hỗ trợ PNG, JPEG, SVG, WebP",
    "removeFile": "Xóa tệp",
    "onlyOneFile": "Chỉ có thể tải lên một tệp",
    "invalidFileType": "Vui lòng chọn ảnh PNG, JPEG, SVG hoặc WebP hợp lệ"
  },
  "th": {
    "uploadImage": "อัปโหลดรูปภาพ",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลดรูปภาพ",
    "supportedFormats": "รองรับ PNG, JPEG, SVG, WebP",
    "removeFile": "ลบไฟล์",
    "onlyOneFile": "อัปโหลดได้เพียงไฟล์เดียว",
    "invalidFileType": "โปรดเลือกภาพ PNG, JPEG, SVG หรือ WebP ที่ถูกต้อง"
  },
  "id": {
    "uploadImage": "Unggah gambar",
    "dragDropOrClick": "Klik atau seret untuk mengunggah gambar",
    "supportedFormats": "Mendukung PNG, JPEG, SVG, WebP",
    "removeFile": "Hapus file",
    "onlyOneFile": "Hanya satu file yang dapat diunggah",
    "invalidFileType": "Silakan pilih gambar PNG, JPEG, SVG, atau WebP yang valid"
  },
  "he": {
    "uploadImage": "העלאת תמונה",
    "dragDropOrClick": "לחץ או גרור כדי להעלות תמונה",
    "supportedFormats": "תומך ב‑PNG, JPEG, SVG, WebP",
    "removeFile": "הסר קובץ",
    "onlyOneFile": "ניתן להעלות קובץ אחד בלבד",
    "invalidFileType": "בחר תמונת PNG, JPEG, SVG או WebP תקפה"
  },
  "ms": {
    "uploadImage": "Muat naik imej",
    "dragDropOrClick": "Klik atau seret untuk memuat naik imej",
    "supportedFormats": "Menyokong PNG, JPEG, SVG, WebP",
    "removeFile": "Buang fail",
    "onlyOneFile": "Hanya satu fail boleh dimuat naik",
    "invalidFileType": "Sila pilih imej PNG, JPEG, SVG atau WebP yang sah"
  },
  "no": {
    "uploadImage": "Last opp bilde",
    "dragDropOrClick": "Klikk eller dra for å laste opp et bilde",
    "supportedFormats": "Støtter PNG, JPEG, SVG, WebP",
    "removeFile": "Fjern fil",
    "onlyOneFile": "Kun én fil kan lastes opp",
    "invalidFileType": "Velg et gyldig PNG-, JPEG-, SVG- eller WebP-bilde"
  }
}
</i18n>
