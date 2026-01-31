<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('uploadImage') }}</ToolSectionHeader>

    <template v-if="!file">
      <n-upload
        :show-file-list="false"
        accept="image/*"
        :max="1"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <ImageIcon />
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
      <n-flex align="center" :size="16" :wrap="true">
        <n-image
          v-if="imagePreview"
          :src="imagePreview"
          height="120"
          preview-disabled
          style="border-radius: 6px; flex-shrink: 0"
        />
        <n-flex vertical :size="4" style="min-width: 220px">
          <n-text strong style="word-break: break-all">{{ file.name }}</n-text>
          <n-text depth="3">{{ formattedSize }}</n-text>
          <n-text v-if="dimensions" depth="3">
            {{ t('dimensions', { width: dimensions.width, height: dimensions.height }) }}
          </n-text>
        </n-flex>
        <n-button size="small" @click="clearFile">
          <template #icon>
            <n-icon><DeleteIcon /></n-icon>
          </template>
          {{ t('removeFile') }}
        </n-button>
      </n-flex>
    </template>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import { NUpload, NUploadDragger, NIcon, NText, NP, NFlex, NButton, NImage } from 'naive-ui'
import ImageIcon from '@vicons/fluent/Image24Regular'
import DeleteIcon from '@vicons/fluent/Delete24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  dimensions?: { width: number; height: number } | null
}>()

const { t } = useI18n()
const message = useMessage()

const file = defineModel<File | null>('file', { required: true })
const imagePreview = useObjectUrl(file)

const formattedSize = computed(() => (file.value ? (filesize(file.value.size) as string) : ''))

function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const selectedFile = data.file.file
  if (!selectedFile) return false

  if (data.fileList.length > 1) {
    message.error(t('onlyOneFile'))
    return false
  }

  if (!selectedFile.type.startsWith('image/')) {
    message.error(t('invalidFileType'))
    return false
  }

  file.value = selectedFile
  return false
}

function clearFile() {
  file.value = null
}

defineExpose({ handleBeforeUpload })
</script>

<i18n lang="json">
{
  "en": {
    "uploadImage": "Upload Image",
    "dragDropOrClick": "Click or drag image to upload",
    "supportedFormats": "Supports JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Remove File",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid image file"
  },
  "zh": {
    "uploadImage": "上传图片",
    "dragDropOrClick": "点击或拖拽图片上传",
    "supportedFormats": "支持 JPEG、PNG、HEIC、TIFF、WebP、GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的图片文件"
  },
  "zh-CN": {
    "uploadImage": "上传图片",
    "dragDropOrClick": "点击或拖拽图片上传",
    "supportedFormats": "支持 JPEG、PNG、HEIC、TIFF、WebP、GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的图片文件"
  },
  "zh-TW": {
    "uploadImage": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳圖片上傳",
    "supportedFormats": "支援 JPEG、PNG、HEIC、TIFF、WebP、GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的圖片檔案"
  },
  "zh-HK": {
    "uploadImage": "上傳圖片",
    "dragDropOrClick": "點擊或拖曳圖片上傳",
    "supportedFormats": "支援 JPEG、PNG、HEIC、TIFF、WebP、GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的圖片檔案"
  },
  "es": {
    "uploadImage": "Subir imagen",
    "dragDropOrClick": "Haga clic o arrastre la imagen para cargar",
    "supportedFormats": "Soporta JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Eliminar archivo",
    "onlyOneFile": "Solo se puede subir un archivo",
    "invalidFileType": "Seleccione un archivo de imagen válido"
  },
  "fr": {
    "uploadImage": "Télécharger une image",
    "dragDropOrClick": "Cliquez ou déposez l'image pour télécharger",
    "supportedFormats": "Prend en charge JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Supprimer le fichier",
    "onlyOneFile": "Un seul fichier peut être téléchargé",
    "invalidFileType": "Veuillez sélectionner un fichier image valide"
  },
  "de": {
    "uploadImage": "Bild hochladen",
    "dragDropOrClick": "Klicken oder Bild hierher ziehen",
    "supportedFormats": "Unterstützt JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Datei entfernen",
    "onlyOneFile": "Es kann nur eine Datei hochgeladen werden",
    "invalidFileType": "Bitte wählen Sie eine gültige Bilddatei"
  },
  "it": {
    "uploadImage": "Carica immagine",
    "dragDropOrClick": "Clicca o trascina l'immagine per caricarla",
    "supportedFormats": "Supporta JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Rimuovi file",
    "onlyOneFile": "È possibile caricare un solo file",
    "invalidFileType": "Seleziona un file immagine valido"
  },
  "ja": {
    "uploadImage": "画像をアップロード",
    "dragDropOrClick": "クリックまたは画像をドラッグしてアップロード",
    "supportedFormats": "JPEG、PNG、HEIC、TIFF、WebP、GIF をサポート",
    "dimensions": "{width} x {height} px",
    "removeFile": "ファイルを削除",
    "onlyOneFile": "アップロードできるファイルは 1 つだけです",
    "invalidFileType": "有効な画像ファイルを選択してください"
  },
  "ko": {
    "uploadImage": "이미지 업로드",
    "dragDropOrClick": "클릭하거나 이미지를 드래그하여 업로드",
    "supportedFormats": "JPEG, PNG, HEIC, TIFF, WebP, GIF 지원",
    "dimensions": "{width} x {height} px",
    "removeFile": "파일 제거",
    "onlyOneFile": "하나의 파일만 업로드할 수 있습니다",
    "invalidFileType": "유효한 이미지 파일을 선택하세요"
  },
  "ru": {
    "uploadImage": "Загрузить изображение",
    "dragDropOrClick": "Нажмите или перетащите изображение для загрузки",
    "supportedFormats": "Поддерживает JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Удалить файл",
    "onlyOneFile": "Можно загрузить только один файл",
    "invalidFileType": "Пожалуйста, выберите действительный файл изображения"
  },
  "pt": {
    "uploadImage": "Enviar imagem",
    "dragDropOrClick": "Clique ou arraste a imagem para fazer upload",
    "supportedFormats": "Suporta JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Remover arquivo",
    "onlyOneFile": "Apenas um arquivo pode ser enviado",
    "invalidFileType": "Selecione um arquivo de imagem válido"
  },
  "ar": {
    "uploadImage": "تحميل صورة",
    "dragDropOrClick": "انقر أو اسحب الصورة للتحميل",
    "supportedFormats": "يدعم JPEG وPNG وHEIC وTIFF وWebP وGIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "إزالة الملف",
    "onlyOneFile": "يمكن تحميل ملف واحد فقط",
    "invalidFileType": "يرجى اختيار ملف صورة صالح"
  },
  "hi": {
    "uploadImage": "छवि अपलोड करें",
    "dragDropOrClick": "अपलोड करने के लिए क्लिक करें या छवि खींचें",
    "supportedFormats": "JPEG, PNG, HEIC, TIFF, WebP, GIF समर्थित",
    "dimensions": "{width} x {height} px",
    "removeFile": "फ़ाइल हटाएं",
    "onlyOneFile": "केवल एक फ़ाइल अपलोड की जा सकती है",
    "invalidFileType": "कृपया मान्य छवि फ़ाइल चुनें"
  },
  "tr": {
    "uploadImage": "Gorsel yukle",
    "dragDropOrClick": "Yuklemek icin tiklayin veya gorseli surukleyin",
    "supportedFormats": "JPEG, PNG, HEIC, TIFF, WebP, GIF desteklenir",
    "dimensions": "{width} x {height} px",
    "removeFile": "Dosyayi kaldir",
    "onlyOneFile": "Yalnizca bir dosya yuklenebilir",
    "invalidFileType": "Lutfen gecerli bir goruntu dosyasi secin"
  },
  "nl": {
    "uploadImage": "Afbeelding uploaden",
    "dragDropOrClick": "Klik of sleep afbeelding om te uploaden",
    "supportedFormats": "Ondersteunt JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Bestand verwijderen",
    "onlyOneFile": "Er kan slechts één bestand worden geüpload",
    "invalidFileType": "Selecteer een geldig afbeeldingsbestand"
  },
  "sv": {
    "uploadImage": "Ladda upp bild",
    "dragDropOrClick": "Klicka eller dra bild för att ladda upp",
    "supportedFormats": "Stöder JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Ta bort fil",
    "onlyOneFile": "Endast en fil kan laddas upp",
    "invalidFileType": "Välj en giltig bildfil"
  },
  "pl": {
    "uploadImage": "Prześlij obraz",
    "dragDropOrClick": "Kliknij lub przeciągnij obraz, aby przesłać",
    "supportedFormats": "Obsługuje JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Usuń plik",
    "onlyOneFile": "Można przesłać tylko jeden plik",
    "invalidFileType": "Wybierz prawidłowy plik obrazu"
  },
  "vi": {
    "uploadImage": "Tải ảnh lên",
    "dragDropOrClick": "Nhấp hoặc kéo hình ảnh để tải lên",
    "supportedFormats": "Hỗ trợ JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Xóa tệp",
    "onlyOneFile": "Chỉ có thể tải lên một tệp",
    "invalidFileType": "Vui lòng chọn tệp hình ảnh hợp lệ"
  },
  "th": {
    "uploadImage": "อัปโหลดรูปภาพ",
    "dragDropOrClick": "คลิกหรือลากภาพเพื่ออัปโหลด",
    "supportedFormats": "รองรับ JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "ลบไฟล์",
    "onlyOneFile": "อัปโหลดได้เพียงไฟล์เดียว",
    "invalidFileType": "โปรดเลือกไฟล์รูปภาพที่ถูกต้อง"
  },
  "id": {
    "uploadImage": "Unggah gambar",
    "dragDropOrClick": "Klik atau seret gambar untuk mengunggah",
    "supportedFormats": "Mendukung JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Hapus file",
    "onlyOneFile": "Hanya satu file yang dapat diunggah",
    "invalidFileType": "Silakan pilih file gambar yang valid"
  },
  "he": {
    "uploadImage": "העלה תמונה",
    "dragDropOrClick": "לחץ או גרור תמונה להעלאה",
    "supportedFormats": "תומך ב-JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "הסר קובץ",
    "onlyOneFile": "ניתן להעלות קובץ אחד בלבד",
    "invalidFileType": "אנא בחר קובץ תמונה תקין"
  },
  "ms": {
    "uploadImage": "Muat naik imej",
    "dragDropOrClick": "Klik atau seret imej untuk muat naik",
    "supportedFormats": "Menyokong JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Buang fail",
    "onlyOneFile": "Hanya satu fail boleh dimuat naik",
    "invalidFileType": "Sila pilih fail imej yang sah"
  },
  "no": {
    "uploadImage": "Last opp bilde",
    "dragDropOrClick": "Klikk eller dra bilde for å laste opp",
    "supportedFormats": "Støtter JPEG, PNG, HEIC, TIFF, WebP, GIF",
    "dimensions": "{width} x {height} px",
    "removeFile": "Fjern fil",
    "onlyOneFile": "Bare én fil kan lastes opp",
    "invalidFileType": "Velg en gyldig bildefil"
  }
}
</i18n>
