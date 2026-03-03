<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="8">
      <n-upload
        accept=".pdf,application/pdf"
        :show-file-list="false"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <DocumentPdf24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ t('dragHint') }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">{{ t('localOnly') }}</n-p>
        </n-upload-dragger>
      </n-upload>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NFlex,
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  useMessage,
  type UploadFileInfo,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import DocumentPdf24Regular from '@vicons/fluent/DocumentPdf24Regular'
import { isPdfFile } from '../inspect-pdf'

const emit = defineEmits<{
  (event: 'upload', file: File): void
}>()

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()

const handleBeforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  const selectedFile = data.file.file
  if (!selectedFile) {
    return false
  }

  if (!isPdfFile(selectedFile)) {
    message.error(t('onlyPdf'))
    return false
  }

  emit('upload', selectedFile)
  return false
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Upload PDF",
    "dragHint": "Click or drag to add a PDF file",
    "localOnly": "Files are processed locally in your browser.",
    "onlyPdf": "Only PDF files are allowed."
  },
  "zh": {
    "title": "上传 PDF",
    "dragHint": "点击或拖拽添加 PDF 文件",
    "localOnly": "文件仅在浏览器本地处理。",
    "onlyPdf": "仅允许 PDF 文件。"
  },
  "zh-CN": {
    "title": "上传 PDF",
    "dragHint": "点击或拖拽添加 PDF 文件",
    "localOnly": "文件仅在浏览器本地处理。",
    "onlyPdf": "仅允许 PDF 文件。"
  },
  "zh-TW": {
    "title": "上傳 PDF",
    "dragHint": "點擊或拖曳新增 PDF 檔案",
    "localOnly": "檔案僅在瀏覽器本機處理。",
    "onlyPdf": "僅允許 PDF 檔案。"
  },
  "zh-HK": {
    "title": "上傳 PDF",
    "dragHint": "點擊或拖曳新增 PDF 檔案",
    "localOnly": "檔案僅在瀏覽器本機處理。",
    "onlyPdf": "僅允許 PDF 檔案。"
  },
  "es": {
    "title": "Subir PDF",
    "dragHint": "Haz clic o arrastra para agregar un archivo PDF",
    "localOnly": "Los archivos se procesan localmente en tu navegador.",
    "onlyPdf": "Solo se permiten archivos PDF."
  },
  "fr": {
    "title": "Importer un PDF",
    "dragHint": "Cliquez ou glissez pour ajouter un fichier PDF",
    "localOnly": "Les fichiers sont traités localement dans votre navigateur.",
    "onlyPdf": "Seuls les fichiers PDF sont autorisés."
  },
  "de": {
    "title": "PDF hochladen",
    "dragHint": "Klicken oder ziehen, um eine PDF-Datei hinzuzufügen",
    "localOnly": "Dateien werden lokal in Ihrem Browser verarbeitet.",
    "onlyPdf": "Nur PDF-Dateien sind erlaubt."
  },
  "it": {
    "title": "Carica PDF",
    "dragHint": "Fai clic o trascina per aggiungere un file PDF",
    "localOnly": "I file vengono elaborati localmente nel browser.",
    "onlyPdf": "Sono consentiti solo file PDF."
  },
  "ja": {
    "title": "PDF をアップロード",
    "dragHint": "クリックまたはドラッグして PDF ファイルを追加",
    "localOnly": "ファイルはブラウザ内でローカル処理されます。",
    "onlyPdf": "PDF ファイルのみ許可されています。"
  },
  "ko": {
    "title": "PDF 업로드",
    "dragHint": "클릭하거나 드래그해 PDF 파일 추가",
    "localOnly": "파일은 브라우저에서 로컬로 처리됩니다.",
    "onlyPdf": "PDF 파일만 허용됩니다."
  },
  "ru": {
    "title": "Загрузить PDF",
    "dragHint": "Нажмите или перетащите, чтобы добавить PDF-файл",
    "localOnly": "Файлы обрабатываются локально в вашем браузере.",
    "onlyPdf": "Разрешены только PDF-файлы."
  },
  "pt": {
    "title": "Enviar PDF",
    "dragHint": "Clique ou arraste para adicionar um arquivo PDF",
    "localOnly": "Os arquivos são processados localmente no navegador.",
    "onlyPdf": "Apenas arquivos PDF são permitidos."
  },
  "ar": {
    "title": "رفع PDF",
    "dragHint": "انقر أو اسحب لإضافة ملف PDF",
    "localOnly": "تتم معالجة الملفات محليًا داخل المتصفح.",
    "onlyPdf": "يسمح بملفات PDF فقط."
  },
  "hi": {
    "title": "PDF अपलोड करें",
    "dragHint": "PDF फ़ाइल जोड़ने के लिए क्लिक करें या खींचें",
    "localOnly": "फ़ाइलें आपके ब्राउज़र में लोकल रूप से प्रोसेस होती हैं।",
    "onlyPdf": "केवल PDF फाइलों की अनुमति है।"
  },
  "tr": {
    "title": "PDF Yükle",
    "dragHint": "PDF dosyası eklemek için tıklayın veya sürükleyin",
    "localOnly": "Dosyalar tarayıcınızda yerel olarak işlenir.",
    "onlyPdf": "Sadece PDF dosyalarına izin verilir."
  },
  "nl": {
    "title": "PDF uploaden",
    "dragHint": "Klik of sleep om een PDF-bestand toe te voegen",
    "localOnly": "Bestanden worden lokaal in je browser verwerkt.",
    "onlyPdf": "Alleen PDF-bestanden zijn toegestaan."
  },
  "sv": {
    "title": "Ladda upp PDF",
    "dragHint": "Klicka eller dra för att lägga till en PDF-fil",
    "localOnly": "Filer behandlas lokalt i din webbläsare.",
    "onlyPdf": "Endast PDF-filer tillåts."
  },
  "pl": {
    "title": "Prześlij PDF",
    "dragHint": "Kliknij lub przeciągnij, aby dodać plik PDF",
    "localOnly": "Pliki są przetwarzane lokalnie w przeglądarce.",
    "onlyPdf": "Dozwolone są tylko pliki PDF."
  },
  "vi": {
    "title": "Tải lên PDF",
    "dragHint": "Nhấp hoặc kéo thả để thêm tệp PDF",
    "localOnly": "Tệp được xử lý cục bộ trong trình duyệt của bạn.",
    "onlyPdf": "Chỉ cho phép tệp PDF."
  },
  "th": {
    "title": "อัปโหลด PDF",
    "dragHint": "คลิกหรือลากเพื่อเพิ่มไฟล์ PDF",
    "localOnly": "ไฟล์จะถูกประมวลผลในเบราว์เซอร์ของคุณเท่านั้น",
    "onlyPdf": "อนุญาตเฉพาะไฟล์ PDF เท่านั้น"
  },
  "id": {
    "title": "Unggah PDF",
    "dragHint": "Klik atau seret untuk menambahkan file PDF",
    "localOnly": "File diproses secara lokal di browser Anda.",
    "onlyPdf": "Hanya file PDF yang diizinkan."
  },
  "he": {
    "title": "העלאת PDF",
    "dragHint": "לחץ או גרור כדי להוסיף קובץ PDF",
    "localOnly": "הקבצים מעובדים מקומית בדפדפן שלך.",
    "onlyPdf": "מותר להעלות קבצי PDF בלבד."
  },
  "ms": {
    "title": "Muat Naik PDF",
    "dragHint": "Klik atau seret untuk menambah fail PDF",
    "localOnly": "Fail diproses secara setempat dalam pelayar anda.",
    "onlyPdf": "Hanya fail PDF dibenarkan."
  },
  "no": {
    "title": "Last opp PDF",
    "dragHint": "Klikk eller dra for å legge til en PDF-fil",
    "localOnly": "Filer behandles lokalt i nettleseren din.",
    "onlyPdf": "Kun PDF-filer er tillatt."
  }
}
</i18n>
