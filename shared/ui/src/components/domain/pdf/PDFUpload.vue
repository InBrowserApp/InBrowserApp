<template>
  <n-upload @before-upload="beforeUpload" accept="application/pdf">
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <n-icon size="48" :depth="3">
          <ArchiveOutline />
        </n-icon>
      </div>
      <n-text style="font-size: 16px">{{ t('upload_text') }}</n-text>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup lang="ts">
import { NUpload, NUploadDragger, NIcon, NText } from 'naive-ui'
import ArchiveOutline from '@vicons/ionicons5/ArchiveOutline'
import type { UploadFileInfo } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const message = useMessage()
const { t } = useI18n()

const emit = defineEmits<{
  (event: 'upload:file', file: File): void
}>()

async function beforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.file.file?.type !== 'application/pdf') {
    message.error(t('error_only_pdf'))
    return false
  } else {
    emit('upload:file', data.file.file)
    return false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "upload_text": "Click or drag to upload PDF",
    "error_only_pdf": "Only PDF files are allowed"
  },
  "zh": {
    "upload_text": "点击或拖拽上传 PDF",
    "error_only_pdf": "仅允许 PDF 文件"
  },
  "zh-CN": {
    "upload_text": "点击或拖拽上传 PDF",
    "error_only_pdf": "仅允许 PDF 文件"
  },
  "zh-TW": {
    "upload_text": "點擊或拖拽上傳 PDF",
    "error_only_pdf": "僅允許 PDF 檔案"
  },
  "zh-HK": {
    "upload_text": "點擊或拖拽上傳 PDF",
    "error_only_pdf": "僅允許 PDF 檔案"
  },
  "es": {
    "upload_text": "Haz clic o arrastra para subir PDF",
    "error_only_pdf": "Solo se permiten archivos PDF"
  },
  "fr": {
    "upload_text": "Cliquez ou glissez pour télécharger un PDF",
    "error_only_pdf": "Seuls les fichiers PDF sont autorisés"
  },
  "de": {
    "upload_text": "Klicken oder ziehen Sie eine PDF-Datei",
    "error_only_pdf": "Nur PDF-Dateien sind erlaubt"
  },
  "it": {
    "upload_text": "Clicca o trascina per caricare PDF",
    "error_only_pdf": "Solo file PDF sono consentiti"
  },
  "ja": {
    "upload_text": "クリックまたはドラッグして PDF をアップロード",
    "error_only_pdf": "PDF ファイルのみ許可されています"
  },
  "ko": {
    "upload_text": "클릭하거나 드래그하여 PDF 업로드",
    "error_only_pdf": "PDF 파일만 허용됩니다"
  },
  "ru": {
    "upload_text": "Нажмите или перетащите для загрузки PDF",
    "error_only_pdf": "Разрешены только PDF-файлы"
  },
  "pt": {
    "upload_text": "Clique ou arraste para enviar PDF",
    "error_only_pdf": "Apenas arquivos PDF são permitidos"
  },
  "ar": {
    "upload_text": "انقر أو اسحب لرفع ملف PDF",
    "error_only_pdf": "ملفات PDF فقط مسموحة"
  },
  "hi": {
    "upload_text": "PDF अपलोड करने के लिए क्लिक करें या खींचें",
    "error_only_pdf": "केवल PDF फाइलों की अनुमति है"
  },
  "tr": {
    "upload_text": "PDF yüklemek için tıklayın veya sürükleyin",
    "error_only_pdf": "Sadece PDF dosyalarına izin verilir"
  },
  "nl": {
    "upload_text": "Klik of sleep om PDF te uploaden",
    "error_only_pdf": "Alleen PDF-bestanden zijn toegestaan"
  },
  "sv": {
    "upload_text": "Klicka eller dra för att ladda upp PDF",
    "error_only_pdf": "Endast PDF-filer är tillåtna"
  },
  "pl": {
    "upload_text": "Kliknij lub przeciągnij, aby przesłać PDF",
    "error_only_pdf": "Dozwolone są tylko pliki PDF"
  },
  "vi": {
    "upload_text": "Nhấp hoặc kéo để tải lên PDF",
    "error_only_pdf": "Chỉ cho phép tệp PDF"
  },
  "th": {
    "upload_text": "คลิกหรือลากเพื่ออัปโหลด PDF",
    "error_only_pdf": "อนุญาตเฉพาะไฟล์ PDF เท่านั้น"
  },
  "id": {
    "upload_text": "Klik atau seret untuk mengunggah PDF",
    "error_only_pdf": "Hanya file PDF yang diizinkan"
  },
  "he": {
    "upload_text": "לחץ או גרור כדי להעלות PDF",
    "error_only_pdf": "רק קבצי PDF מותרים"
  },
  "ms": {
    "upload_text": "Klik atau seret untuk muat naik PDF",
    "error_only_pdf": "Hanya fail PDF dibenarkan"
  },
  "no": {
    "upload_text": "Klikk eller dra for å laste opp PDF",
    "error_only_pdf": "Kun PDF-filer er tillatt"
  }
}
</i18n>
