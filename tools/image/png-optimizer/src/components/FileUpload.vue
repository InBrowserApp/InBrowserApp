<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('uploadImage') }}</ToolSectionHeader>

    <template v-if="!file">
      <n-upload accept=".png,image/png" @before-upload="handleBeforeUpload">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <Image24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ t('dragDropOrClick') }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ t('pngFilesOnly') }}
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </template>

    <template v-else>
      <n-flex vertical :size="16">
        <n-flex align="center" :size="16">
          <n-image :src="imagePreview || ''" alt="Preview" height="120" />
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
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { NUpload, NUploadDragger, NIcon, NText, NP, NFlex, NButton } from 'naive-ui'
import Image24Regular from '@vicons/fluent/Image24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import type { UploadFileInfo } from 'naive-ui'
import { toRef } from 'vue'
import { filesize } from 'filesize'
import { NImage } from 'naive-ui'

// Props
const props = defineProps<{
  file: File | null
}>()
// Emits
const emit = defineEmits<{
  'update:file': [file: File | null]
}>()
const { t } = useI18n()
const message = useMessage()

const file = toRef(props, 'file')

// Use object URL for efficient image preview
const imagePreview = useObjectUrl(file)

// File handling
async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  const file = data.file.file
  if (!file) return false

  if (data.fileList.length > 1) {
    message.error(t('onlyOneFile'))
    return false
  }

  if (!file.type.includes('png')) {
    message.error(t('invalidFileType'))
    return false
  }

  emit('update:file', file)

  return false // Prevent default upload
}

function handleClearFile() {
  emit('update:file', null)
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadImage": "Upload PNG Image",
    "dragDropOrClick": "Click or drag to upload PNG image",
    "pngFilesOnly": "PNG files only",
    "removeFile": "Remove File",
    "onlyOneFile": "Only one file can be uploaded",
    "invalidFileType": "Please select a valid PNG image file"
  },
  "zh": {
    "uploadImage": "上传 PNG 图片",
    "dragDropOrClick": "点击或拖拽上传 PNG 图片",
    "pngFilesOnly": "仅支持 PNG  文件",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的 PNG 图片文件"
  },
  "zh-CN": {
    "uploadImage": "上传 PNG 图片",
    "dragDropOrClick": "点击或拖拽上传 PNG 图片",
    "pngFilesOnly": "仅支持 PNG 文件",
    "removeFile": "移除文件",
    "onlyOneFile": "只能上传一个文件",
    "invalidFileType": "请选择有效的 PNG 图片文件"
  },
  "zh-TW": {
    "uploadImage": "上傳 PNG 圖片",
    "dragDropOrClick": "點擊或拖拽上傳 PNG 圖片",
    "pngFilesOnly": "僅支援 PNG 檔案",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的 PNG 圖片檔案"
  },
  "zh-HK": {
    "uploadImage": "上傳 PNG 圖片",
    "dragDropOrClick": "點擊或拖拽上傳 PNG 圖片",
    "pngFilesOnly": "僅支援 PNG 檔案",
    "removeFile": "移除檔案",
    "onlyOneFile": "只能上傳一個檔案",
    "invalidFileType": "請選擇有效的 PNG 圖片檔案"
  },
  "es": {
    "uploadImage": "Subir Imagen PNG",
    "dragDropOrClick": "Haz clic o arrastra para subir imagen PNG",
    "pngFilesOnly": "Solo archivos PNG",
    "removeFile": "Eliminar Archivo",
    "onlyOneFile": "Solo se puede subir un archivo",
    "invalidFileType": "Por favor selecciona un archivo PNG válido"
  },
  "fr": {
    "uploadImage": "Télécharger Image PNG",
    "dragDropOrClick": "Cliquez ou glissez pour télécharger l'image PNG",
    "pngFilesOnly": "Fichiers PNG uniquement",
    "removeFile": "Supprimer Fichier",
    "onlyOneFile": "Un seul fichier peut être téléchargé",
    "invalidFileType": "Veuillez sélectionner un fichier PNG valide"
  },
  "de": {
    "uploadImage": "PNG-Bild Hochladen",
    "dragDropOrClick": "Klicken oder ziehen Sie, um PNG-Bild hochzuladen",
    "pngFilesOnly": "Nur PNG-Dateien",
    "removeFile": "Datei Entfernen",
    "onlyOneFile": "Es kann nur eine Datei hochgeladen werden",
    "invalidFileType": "Bitte wählen Sie eine gültige PNG-Datei"
  },
  "it": {
    "uploadImage": "Carica Immagine PNG",
    "dragDropOrClick": "Clicca o trascina per caricare immagine PNG",
    "pngFilesOnly": "Solo file PNG",
    "removeFile": "Rimuovi File",
    "onlyOneFile": "Può essere caricato un solo file",
    "invalidFileType": "Seleziona un file PNG valido"
  },
  "ja": {
    "uploadImage": "PNG 画像をアップロード",
    "dragDropOrClick": "クリックまたはドラッグして PNG 画像をアップロード",
    "pngFilesOnly": "PNG ファイルのみ",
    "removeFile": "ファイルを削除",
    "onlyOneFile": "アップロードできるファイルは 1 つだけです",
    "invalidFileType": "有効な PNG ファイルを選択してください"
  },
  "ko": {
    "uploadImage": "PNG 이미지 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 PNG 이미지 업로드",
    "pngFilesOnly": "PNG 파일만",
    "removeFile": "파일 제거",
    "onlyOneFile": "하나의 파일만 업로드할 수 있습니다",
    "invalidFileType": "유효한 PNG 파일을 선택하세요"
  },
  "ru": {
    "uploadImage": "Загрузить PNG Изображение",
    "dragDropOrClick": "Нажмите или перетащите для загрузки PNG изображения",
    "pngFilesOnly": "Только PNG файлы",
    "removeFile": "Удалить Файл",
    "onlyOneFile": "Можно загрузить только один файл",
    "invalidFileType": "Пожалуйста, выберите действительный PNG файл"
  },
  "pt": {
    "uploadImage": "Enviar Imagem PNG",
    "dragDropOrClick": "Clique ou arraste para enviar imagem PNG",
    "pngFilesOnly": "Apenas arquivos PNG",
    "removeFile": "Remover Arquivo",
    "onlyOneFile": "Apenas um arquivo pode ser enviado",
    "invalidFileType": "Por favor selecione um arquivo PNG válido"
  },
  "ar": {
    "uploadImage": "رفع صورة PNG",
    "dragDropOrClick": "انقر أو اسحب لرفع صورة PNG",
    "pngFilesOnly": "ملفات PNG فقط",
    "removeFile": "إزالة الملف",
    "onlyOneFile": "يمكن رفع ملف واحد فقط",
    "invalidFileType": "يرجى اختيار ملف PNG صالح"
  },
  "hi": {
    "uploadImage": "PNG छवि अपलोड करें",
    "dragDropOrClick": "PNG छवि अपलोड करने के लिए क्लिक करें या खींचें",
    "pngFilesOnly": "केवल PNG फ़ाइलें",
    "removeFile": "फ़ाइल हटाएं",
    "onlyOneFile": "केवल एक फ़ाइल अपलोड की जा सकती है",
    "invalidFileType": "कृपया एक मान्य PNG फ़ाइल चुनें"
  },
  "tr": {
    "uploadImage": "PNG Resmi Yükle",
    "dragDropOrClick": "PNG resmi yüklemek için tıklayın veya sürükleyin",
    "pngFilesOnly": "Sadece PNG dosyaları",
    "removeFile": "Dosyayı Kaldır",
    "onlyOneFile": "Sadece bir dosya yüklenebilir",
    "invalidFileType": "Lütfen geçerli bir PNG dosyası seçin"
  },
  "nl": {
    "uploadImage": "PNG Afbeelding Uploaden",
    "dragDropOrClick": "Klik of sleep om PNG afbeelding te uploaden",
    "pngFilesOnly": "Alleen PNG bestanden",
    "removeFile": "Bestand Verwijderen",
    "onlyOneFile": "Er kan slechts één bestand worden geüpload",
    "invalidFileType": "Selecteer een geldig PNG bestand"
  },
  "sv": {
    "uploadImage": "Ladda upp PNG-bild",
    "dragDropOrClick": "Klicka eller dra för att ladda upp PNG-bild",
    "pngFilesOnly": "Endast PNG-filer",
    "removeFile": "Ta Bort Fil",
    "onlyOneFile": "Endast en fil kan laddas upp",
    "invalidFileType": "Välj en giltig PNG-fil"
  },
  "pl": {
    "uploadImage": "Prześlij Obraz PNG",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać obraz PNG",
    "pngFilesOnly": "Tylko pliki PNG",
    "removeFile": "Usuń Plik",
    "onlyOneFile": "Można przesłać tylko jeden plik",
    "invalidFileType": "Wybierz prawidłowy plik PNG"
  },
  "vi": {
    "uploadImage": "Tải lên Hình ảnh PNG",
    "dragDropOrClick": "Nhấp hoặc kéo để tải lên hình ảnh PNG",
    "pngFilesOnly": "Chỉ file PNG",
    "removeFile": "Xóa Tệp",
    "onlyOneFile": "Chỉ có thể tải lên một tệp",
    "invalidFileType": "Vui lòng chọn tệp PNG hợp lệ"
  },
  "th": {
    "uploadImage": "อัปโหลดภาพ PNG",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลดภาพ PNG",
    "pngFilesOnly": "ไฟล์ PNG เท่านั้น",
    "removeFile": "ลบไฟล์",
    "onlyOneFile": "สามารถอัปโหลดได้เพียงหนึ่งไฟล์",
    "invalidFileType": "กรุณาเลือกไฟล์ PNG ที่ถูกต้อง"
  },
  "id": {
    "uploadImage": "Unggah Gambar PNG",
    "dragDropOrClick": "Klik atau seret untuk mengunggah gambar PNG",
    "pngFilesOnly": "Hanya file PNG",
    "removeFile": "Hapus File",
    "onlyOneFile": "Hanya satu file yang dapat diunggah",
    "invalidFileType": "Silakan pilih file PNG yang valid"
  },
  "he": {
    "uploadImage": "העלה תמונת PNG",
    "dragDropOrClick": "לחץ או גרור להעלאת תמונת PNG",
    "pngFilesOnly": "קבצי PNG בלבד",
    "removeFile": "הסר קובץ",
    "onlyOneFile": "ניתן להעלות קובץ אחד בלבד",
    "invalidFileType": "אנא בחר קובץ PNG תקין"
  },
  "ms": {
    "uploadImage": "Muat Naik Imej PNG",
    "dragDropOrClick": "Klik atau seret untuk muat naik imej PNG",
    "pngFilesOnly": "Hanya fail PNG",
    "removeFile": "Buang Fail",
    "onlyOneFile": "Hanya satu fail boleh dimuat naik",
    "invalidFileType": "Sila pilih fail PNG yang sah"
  },
  "no": {
    "uploadImage": "Last opp PNG-bilde",
    "dragDropOrClick": "Klikk eller dra for å laste opp PNG-bilde",
    "pngFilesOnly": "Kun PNG-filer",
    "removeFile": "Fjern Fil",
    "onlyOneFile": "Kun én fil kan lastes opp",
    "invalidFileType": "Vennligst velg en gyldig PNG-fil"
  }
}
</i18n>
