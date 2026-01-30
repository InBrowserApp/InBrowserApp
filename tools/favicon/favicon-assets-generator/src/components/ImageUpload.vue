<template>
  <n-upload accept="image/*" @before-upload="beforeUpload">
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <n-icon size="48" :depth="3">
          <ImageEdit24Regular />
        </n-icon>
      </div>
      <n-text style="font-size: 16px">{{ t('clickOrDragToSelectImage') }}</n-text>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup lang="ts">
import { NUpload, NUploadDragger, NIcon, NText } from 'naive-ui'
import ImageEdit24Regular from '@vicons/fluent/ImageEdit24Regular'
import type { UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (event: 'update:file', file: File): void
}>()
const { t } = useI18n()
const message = useMessage()

async function beforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.fileList.length > 1) {
    message.error(t('onlyOneFileCanBeUploaded'))
    return false
  } else if (data.file.file?.type.startsWith('image/') !== true) {
    message.error(t('onlyImageFilesAreAllowed'))
    return false
  } else {
    emit('update:file', data.file.file)
    return false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "clickOrDragToSelectImage": "Click or drag to select image",
    "onlyOneFileCanBeUploaded": "Only one file can be uploaded",
    "onlyImageFilesAreAllowed": "Only image files are allowed"
  },
  "zh": {
    "clickOrDragToSelectImage": "点击或拖拽选择图片",
    "onlyOneFileCanBeUploaded": "只能上传一个文件",
    "onlyImageFilesAreAllowed": "只允许图片文件"
  },
  "zh-CN": {
    "clickOrDragToSelectImage": "点击或拖拽选择图片",
    "onlyOneFileCanBeUploaded": "只能上传一个文件",
    "onlyImageFilesAreAllowed": "只允许图片文件"
  },
  "zh-TW": {
    "clickOrDragToSelectImage": "點擊或拖拽選擇圖片",
    "onlyOneFileCanBeUploaded": "只能上傳一個文件",
    "onlyImageFilesAreAllowed": "只允許圖片文件"
  },
  "zh-HK": {
    "clickOrDragToSelectImage": "點擊或拖拽選擇圖片",
    "onlyOneFileCanBeUploaded": "只能上傳一個文件",
    "onlyImageFilesAreAllowed": "只允許圖片文件"
  },
  "es": {
    "clickOrDragToSelectImage": "Haga clic o arrastre para seleccionar una imagen",
    "onlyOneFileCanBeUploaded": "Solo se puede subir un archivo",
    "onlyImageFilesAreAllowed": "Solo se permiten archivos de imagen"
  },
  "fr": {
    "clickOrDragToSelectImage": "Cliquez ou faites glisser pour sélectionner une image",
    "onlyOneFileCanBeUploaded": "Un seul fichier peut être téléchargé",
    "onlyImageFilesAreAllowed": "Seuls les fichiers image sont autorisés"
  },
  "de": {
    "clickOrDragToSelectImage": "Klicken oder ziehen Sie, um ein Bild auszuwählen",
    "onlyOneFileCanBeUploaded": "Es kann nur eine Datei hochgeladen werden",
    "onlyImageFilesAreAllowed": "Nur Bilddateien sind erlaubt"
  },
  "it": {
    "clickOrDragToSelectImage": "Clicca o trascina per selezionare un'immagine",
    "onlyOneFileCanBeUploaded": "Può essere caricato un solo file",
    "onlyImageFilesAreAllowed": "Sono consentiti solo file immagine"
  },
  "ja": {
    "clickOrDragToSelectImage": "クリックまたはドラッグして画像を選択",
    "onlyOneFileCanBeUploaded": "アップロードできるファイルは1つだけです",
    "onlyImageFilesAreAllowed": "画像ファイルのみ許可されています"
  },
  "ko": {
    "clickOrDragToSelectImage": "클릭하거나 드래그하여 이미지 선택",
    "onlyOneFileCanBeUploaded": "하나의 파일만 업로드할 수 있습니다",
    "onlyImageFilesAreAllowed": "이미지 파일만 허용됩니다"
  },
  "ru": {
    "clickOrDragToSelectImage": "Нажмите или перетащите для выбора изображения",
    "onlyOneFileCanBeUploaded": "Можно загрузить только один файл",
    "onlyImageFilesAreAllowed": "Разрешены только файлы изображений"
  },
  "pt": {
    "clickOrDragToSelectImage": "Clique ou arraste para selecionar uma imagem",
    "onlyOneFileCanBeUploaded": "Apenas um arquivo pode ser enviado",
    "onlyImageFilesAreAllowed": "Apenas arquivos de imagem são permitidos"
  },
  "ar": {
    "clickOrDragToSelectImage": "انقر أو اسحب لتحديد صورة",
    "onlyOneFileCanBeUploaded": "يمكن تحميل ملف واحد فقط",
    "onlyImageFilesAreAllowed": "يُسمح فقط بملفات الصور"
  },
  "hi": {
    "clickOrDragToSelectImage": "छवि चुनने के लिए क्लिक करें या खींचें",
    "onlyOneFileCanBeUploaded": "केवल एक फ़ाइल अपलोड की जा सकती है",
    "onlyImageFilesAreAllowed": "केवल छवि फ़ाइलें अनुमत हैं"
  },
  "tr": {
    "clickOrDragToSelectImage": "Resim seçmek için tıklayın veya sürükleyin",
    "onlyOneFileCanBeUploaded": "Yalnızca bir dosya yüklenebilir",
    "onlyImageFilesAreAllowed": "Yalnızca resim dosyalarına izin verilir"
  },
  "nl": {
    "clickOrDragToSelectImage": "Klik of sleep om een afbeelding te selecteren",
    "onlyOneFileCanBeUploaded": "Er kan slechts één bestand worden geüpload",
    "onlyImageFilesAreAllowed": "Alleen afbeeldingsbestanden zijn toegestaan"
  },
  "sv": {
    "clickOrDragToSelectImage": "Klicka eller dra för att välja en bild",
    "onlyOneFileCanBeUploaded": "Endast en fil kan laddas upp",
    "onlyImageFilesAreAllowed": "Endast bildfiler är tillåtna"
  },
  "pl": {
    "clickOrDragToSelectImage": "Kliknij lub przeciągnij, aby wybrać obraz",
    "onlyOneFileCanBeUploaded": "Można przesłać tylko jeden plik",
    "onlyImageFilesAreAllowed": "Dozwolone są tylko pliki obrazów"
  },
  "vi": {
    "clickOrDragToSelectImage": "Nhấp hoặc kéo để chọn hình ảnh",
    "onlyOneFileCanBeUploaded": "Chỉ có thể tải lên một tệp",
    "onlyImageFilesAreAllowed": "Chỉ cho phép tệp hình ảnh"
  },
  "th": {
    "clickOrDragToSelectImage": "คลิกหรือลากเพื่อเลือกรูปภาพ",
    "onlyOneFileCanBeUploaded": "สามารถอัปโหลดได้เพียงหนึ่งไฟล์เท่านั้น",
    "onlyImageFilesAreAllowed": "อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น"
  },
  "id": {
    "clickOrDragToSelectImage": "Klik atau seret untuk memilih gambar",
    "onlyOneFileCanBeUploaded": "Hanya satu file yang dapat diunggah",
    "onlyImageFilesAreAllowed": "Hanya file gambar yang diizinkan"
  },
  "he": {
    "clickOrDragToSelectImage": "לחץ או גרור כדי לבחור תמונה",
    "onlyOneFileCanBeUploaded": "ניתן להעלות קובץ אחד בלבד",
    "onlyImageFilesAreAllowed": "מותרים רק קבצי תמונה"
  },
  "ms": {
    "clickOrDragToSelectImage": "Klik atau seret untuk memilih imej",
    "onlyOneFileCanBeUploaded": "Hanya satu fail boleh dimuat naik",
    "onlyImageFilesAreAllowed": "Hanya fail imej dibenarkan"
  },
  "no": {
    "clickOrDragToSelectImage": "Klikk eller dra for å velge et bilde",
    "onlyOneFileCanBeUploaded": "Kun én fil kan lastes opp",
    "onlyImageFilesAreAllowed": "Kun bildefiler er tillatt"
  }
}
</i18n>
