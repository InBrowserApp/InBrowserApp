<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="8">
      <n-upload
        accept=".pdf,application/pdf"
        multiple
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
          <n-p depth="3" style="margin: 8px 0 0 0">{{ t('uploadSubHint') }}</n-p>
        </n-upload-dragger>
      </n-upload>
      <n-text depth="3">{{ t('localOnlyNote') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMessage, NUpload, NUploadDragger, NIcon, NText, NP, NFlex } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import DocumentPdf24Regular from '@vicons/fluent/DocumentPdf24Regular'
import { isPdfFile } from '../inspect-pdf'

const emit = defineEmits<{
  (event: 'add-file', file: File): void
}>()

const { t } = useI18n()
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

  emit('add-file', selectedFile)
  return false
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload PDF files",
    "dragHint": "Click or drag to add PDF files",
    "uploadSubHint": "You can add files multiple times",
    "localOnlyNote": "Runs locally in your browser. No uploads.",
    "onlyPdf": "Only PDF files are allowed"
  },
  "zh": {
    "uploadTitle": "上传 PDF 文件",
    "dragHint": "点击或拖拽添加 PDF 文件",
    "uploadSubHint": "可多次添加文件",
    "localOnlyNote": "在浏览器本地处理，不会上传文件。",
    "onlyPdf": "仅允许 PDF 文件"
  },
  "zh-CN": {
    "uploadTitle": "上传 PDF 文件",
    "dragHint": "点击或拖拽添加 PDF 文件",
    "uploadSubHint": "可多次添加文件",
    "localOnlyNote": "在浏览器本地处理，不会上传文件。",
    "onlyPdf": "仅允许 PDF 文件"
  },
  "zh-TW": {
    "uploadTitle": "上傳 PDF 檔案",
    "dragHint": "點擊或拖曳新增 PDF 檔案",
    "uploadSubHint": "可多次新增檔案",
    "localOnlyNote": "在瀏覽器本機處理，不會上傳檔案。",
    "onlyPdf": "僅允許 PDF 檔案"
  },
  "zh-HK": {
    "uploadTitle": "上傳 PDF 檔案",
    "dragHint": "點擊或拖曳新增 PDF 檔案",
    "uploadSubHint": "可多次新增檔案",
    "localOnlyNote": "在瀏覽器本機處理，不會上傳檔案。",
    "onlyPdf": "僅允許 PDF 檔案"
  },
  "es": {
    "uploadTitle": "Subir archivos PDF",
    "dragHint": "Haz clic o arrastra para agregar PDF",
    "uploadSubHint": "Puedes agregar archivos varias veces",
    "localOnlyNote": "Se ejecuta localmente en tu navegador. No se suben archivos.",
    "onlyPdf": "Solo se permiten archivos PDF"
  },
  "fr": {
    "uploadTitle": "Importer des PDF",
    "dragHint": "Cliquez ou glissez pour ajouter des PDF",
    "uploadSubHint": "Vous pouvez ajouter des fichiers plusieurs fois",
    "localOnlyNote": "Exécution locale dans votre navigateur. Aucun envoi de fichier.",
    "onlyPdf": "Seuls les fichiers PDF sont autorisés"
  },
  "de": {
    "uploadTitle": "PDF-Dateien hochladen",
    "dragHint": "Klicken oder ziehen, um PDFs hinzuzufügen",
    "uploadSubHint": "Dateien können mehrfach hinzugefügt werden",
    "localOnlyNote": "Läuft lokal im Browser. Keine Uploads.",
    "onlyPdf": "Nur PDF-Dateien sind erlaubt"
  },
  "it": {
    "uploadTitle": "Carica file PDF",
    "dragHint": "Clicca o trascina per aggiungere PDF",
    "uploadSubHint": "Puoi aggiungere file più volte",
    "localOnlyNote": "Esecuzione locale nel browser. Nessun caricamento.",
    "onlyPdf": "Sono consentiti solo file PDF"
  },
  "ja": {
    "uploadTitle": "PDF ファイルを追加",
    "dragHint": "クリックまたはドラッグして PDF を追加",
    "uploadSubHint": "複数回に分けて追加できます",
    "localOnlyNote": "ブラウザ内でローカル実行されます。アップロードされません。",
    "onlyPdf": "PDF ファイルのみ許可されています"
  },
  "ko": {
    "uploadTitle": "PDF 파일 업로드",
    "dragHint": "클릭하거나 드래그해 PDF 추가",
    "uploadSubHint": "파일을 여러 번 추가할 수 있습니다",
    "localOnlyNote": "브라우저에서 로컬로 처리됩니다. 업로드되지 않습니다.",
    "onlyPdf": "PDF 파일만 허용됩니다"
  },
  "ru": {
    "uploadTitle": "Загрузить PDF-файлы",
    "dragHint": "Нажмите или перетащите для добавления PDF",
    "uploadSubHint": "Файлы можно добавлять несколько раз",
    "localOnlyNote": "Выполняется локально в браузере. Файлы не загружаются.",
    "onlyPdf": "Разрешены только PDF-файлы"
  },
  "pt": {
    "uploadTitle": "Enviar arquivos PDF",
    "dragHint": "Clique ou arraste para adicionar PDFs",
    "uploadSubHint": "Você pode adicionar arquivos várias vezes",
    "localOnlyNote": "Executa localmente no navegador. Nenhum upload.",
    "onlyPdf": "Apenas arquivos PDF são permitidos"
  },
  "ar": {
    "uploadTitle": "رفع ملفات PDF",
    "dragHint": "انقر أو اسحب لإضافة ملفات PDF",
    "uploadSubHint": "يمكنك إضافة الملفات عدة مرات",
    "localOnlyNote": "يعمل محليًا في المتصفح. لا يتم رفع الملفات.",
    "onlyPdf": "ملفات PDF فقط مسموحة"
  },
  "hi": {
    "uploadTitle": "PDF फ़ाइलें अपलोड करें",
    "dragHint": "PDF जोड़ने के लिए क्लिक करें या खींचें",
    "uploadSubHint": "आप फ़ाइलें कई बार जोड़ सकते हैं",
    "localOnlyNote": "यह ब्राउज़र में लोकल रूप से चलता है। कोई अपलोड नहीं होता।",
    "onlyPdf": "केवल PDF फाइलों की अनुमति है"
  },
  "tr": {
    "uploadTitle": "PDF dosyalarını yükle",
    "dragHint": "PDF eklemek için tıklayın veya sürükleyin",
    "uploadSubHint": "Dosyaları birden çok kez ekleyebilirsiniz",
    "localOnlyNote": "Tarayıcıda yerel olarak çalışır. Yükleme yapılmaz.",
    "onlyPdf": "Sadece PDF dosyalarına izin verilir"
  },
  "nl": {
    "uploadTitle": "PDF-bestanden uploaden",
    "dragHint": "Klik of sleep om PDF's toe te voegen",
    "uploadSubHint": "Je kunt bestanden meerdere keren toevoegen",
    "localOnlyNote": "Draait lokaal in je browser. Geen uploads.",
    "onlyPdf": "Alleen PDF-bestanden zijn toegestaan"
  },
  "sv": {
    "uploadTitle": "Ladda upp PDF-filer",
    "dragHint": "Klicka eller dra för att lägga till PDF",
    "uploadSubHint": "Du kan lägga till filer flera gånger",
    "localOnlyNote": "Körs lokalt i webbläsaren. Inga uppladdningar.",
    "onlyPdf": "Endast PDF-filer är tillåtna"
  },
  "pl": {
    "uploadTitle": "Prześlij pliki PDF",
    "dragHint": "Kliknij lub przeciągnij, aby dodać PDF",
    "uploadSubHint": "Możesz dodawać pliki wiele razy",
    "localOnlyNote": "Działa lokalnie w przeglądarce. Brak wysyłania plików.",
    "onlyPdf": "Dozwolone są tylko pliki PDF"
  },
  "vi": {
    "uploadTitle": "Tải lên tệp PDF",
    "dragHint": "Nhấp hoặc kéo để thêm tệp PDF",
    "uploadSubHint": "Bạn có thể thêm tệp nhiều lần",
    "localOnlyNote": "Chạy cục bộ trong trình duyệt. Không tải lên.",
    "onlyPdf": "Chỉ cho phép tệp PDF"
  },
  "th": {
    "uploadTitle": "อัปโหลดไฟล์ PDF",
    "dragHint": "คลิกหรือลากเพื่อเพิ่มไฟล์ PDF",
    "uploadSubHint": "คุณสามารถเพิ่มไฟล์ได้หลายครั้ง",
    "localOnlyNote": "ทำงานในเบราว์เซอร์แบบโลคัล ไม่มีการอัปโหลดไฟล์",
    "onlyPdf": "อนุญาตเฉพาะไฟล์ PDF เท่านั้น"
  },
  "id": {
    "uploadTitle": "Unggah file PDF",
    "dragHint": "Klik atau seret untuk menambah PDF",
    "uploadSubHint": "Anda dapat menambah file beberapa kali",
    "localOnlyNote": "Berjalan secara lokal di browser. Tidak ada unggahan.",
    "onlyPdf": "Hanya file PDF yang diizinkan"
  },
  "he": {
    "uploadTitle": "העלה קובצי PDF",
    "dragHint": "לחץ או גרור כדי להוסיף PDF",
    "uploadSubHint": "אפשר להוסיף קבצים כמה פעמים",
    "localOnlyNote": "רץ מקומית בדפדפן. ללא העלאות.",
    "onlyPdf": "רק קובצי PDF מותרים"
  },
  "ms": {
    "uploadTitle": "Muat naik fail PDF",
    "dragHint": "Klik atau seret untuk tambah PDF",
    "uploadSubHint": "Anda boleh tambah fail beberapa kali",
    "localOnlyNote": "Berjalan secara lokal dalam pelayar. Tiada muat naik.",
    "onlyPdf": "Hanya fail PDF dibenarkan"
  },
  "no": {
    "uploadTitle": "Last opp PDF-filer",
    "dragHint": "Klikk eller dra for å legge til PDF",
    "uploadSubHint": "Du kan legge til filer flere ganger",
    "localOnlyNote": "Kjører lokalt i nettleseren. Ingen opplastinger.",
    "onlyPdf": "Kun PDF-filer er tillatt"
  }
}
</i18n>
