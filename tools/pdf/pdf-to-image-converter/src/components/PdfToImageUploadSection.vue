<template>
  <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <PDFUpload v-if="!uploadedFileName" @upload-file="emit('upload-file', $event)" />
      <n-upload
        v-else
        accept="application/pdf"
        :show-file-list="false"
        @before-upload="beforeUploadNewFile"
      >
        <n-button secondary>{{ t('uploadNewOne') }}</n-button>
      </n-upload>

      <n-text depth="3">{{ t('localNote') }}</n-text>
      <n-text v-if="isLoadingDocument" depth="3">{{ t('loadingDocument') }}</n-text>

      <n-descriptions
        v-if="uploadedFileName"
        bordered
        size="small"
        :column="fileInfoColumns"
        label-placement="top"
      >
        <n-descriptions-item :label="t('fileName')">
          <n-text style="word-break: break-all">{{ uploadedFileName }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('fileSize')">
          <n-text>{{ formattedUploadedFileSize }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item v-if="numPages > 0" :label="t('pageCount')">
          <n-text>{{ numPages }}</n-text>
        </n-descriptions-item>
      </n-descriptions>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize } from 'filesize'
import {
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NFlex,
  NText,
  NUpload,
  type UploadFileInfo,
  useMessage,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  isLoadingDocument: boolean
  uploadedFileName: string
  uploadedFileSize: number
  numPages: number
}>()

const emit = defineEmits<{
  (event: 'upload-file', file: File): void
}>()

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()

const formattedUploadedFileSize = computed(() => filesize(props.uploadedFileSize) as string)
const fileInfoColumns = computed(() => (props.numPages > 0 ? 3 : 2))

function beforeUploadNewFile(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.file.file?.type !== 'application/pdf') {
    message.error(t('errorOnlyPdf'))
    return false
  }

  emit('upload-file', data.file.file)
  return false
}
</script>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload PDF",
    "localNote": "Runs locally in your browser. No uploads.",
    "loadingDocument": "Loading PDF pages...",
    "uploadNewOne": "Upload a new one",
    "errorOnlyPdf": "Only PDF files are allowed",
    "fileName": "File name",
    "fileSize": "File size",
    "pageCount": "Page count"
  },
  "zh": {
    "uploadTitle": "上传 PDF",
    "localNote": "在浏览器本地处理，不会上传文件。",
    "loadingDocument": "正在加载 PDF 页面...",
    "uploadNewOne": "上传新的文件",
    "errorOnlyPdf": "仅支持 PDF 文件",
    "fileName": "文件名",
    "fileSize": "文件大小",
    "pageCount": "页数"
  },
  "zh-CN": {
    "uploadTitle": "上传 PDF",
    "localNote": "在浏览器本地处理，不会上传文件。",
    "loadingDocument": "正在加载 PDF 页面...",
    "uploadNewOne": "上传新的文件",
    "errorOnlyPdf": "仅支持 PDF 文件",
    "fileName": "文件名",
    "fileSize": "文件大小",
    "pageCount": "页数"
  },
  "zh-TW": {
    "uploadTitle": "上傳 PDF",
    "localNote": "在瀏覽器本機處理，不會上傳檔案。",
    "loadingDocument": "正在載入 PDF 頁面...",
    "uploadNewOne": "上傳新的檔案",
    "errorOnlyPdf": "僅支援 PDF 檔案",
    "fileName": "檔案名稱",
    "fileSize": "檔案大小",
    "pageCount": "頁數"
  },
  "zh-HK": {
    "uploadTitle": "上傳 PDF",
    "localNote": "在瀏覽器本機處理，不會上傳檔案。",
    "loadingDocument": "正在載入 PDF 頁面...",
    "uploadNewOne": "上傳新的檔案",
    "errorOnlyPdf": "僅支援 PDF 檔案",
    "fileName": "檔案名稱",
    "fileSize": "檔案大小",
    "pageCount": "頁數"
  },
  "es": {
    "uploadTitle": "Subir PDF",
    "localNote": "Se ejecuta localmente en tu navegador. No se suben archivos.",
    "loadingDocument": "Cargando páginas del PDF...",
    "uploadNewOne": "Subir otro archivo",
    "errorOnlyPdf": "Solo se permiten archivos PDF",
    "fileName": "Nombre del archivo",
    "fileSize": "Tamaño del archivo",
    "pageCount": "Número de páginas"
  },
  "fr": {
    "uploadTitle": "Importer un PDF",
    "localNote": "Exécution locale dans votre navigateur. Aucun envoi de fichier.",
    "loadingDocument": "Chargement des pages PDF...",
    "uploadNewOne": "Importer un nouveau fichier",
    "errorOnlyPdf": "Seuls les fichiers PDF sont autorisés",
    "fileName": "Nom du fichier",
    "fileSize": "Taille du fichier",
    "pageCount": "Nombre de pages"
  },
  "de": {
    "uploadTitle": "PDF hochladen",
    "localNote": "Läuft lokal im Browser. Keine Uploads.",
    "loadingDocument": "PDF-Seiten werden geladen...",
    "uploadNewOne": "Neue Datei hochladen",
    "errorOnlyPdf": "Nur PDF-Dateien sind erlaubt",
    "fileName": "Dateiname",
    "fileSize": "Dateigröße",
    "pageCount": "Seitenzahl"
  },
  "it": {
    "uploadTitle": "Carica PDF",
    "localNote": "Esecuzione locale nel browser. Nessun caricamento.",
    "loadingDocument": "Caricamento pagine PDF...",
    "uploadNewOne": "Carica un nuovo file",
    "errorOnlyPdf": "Sono consentiti solo file PDF",
    "fileName": "Nome file",
    "fileSize": "Dimensione file",
    "pageCount": "Numero di pagine"
  },
  "ja": {
    "uploadTitle": "PDF をアップロード",
    "localNote": "ブラウザ内でローカル実行されます。アップロードされません。",
    "loadingDocument": "PDF ページを読み込んでいます...",
    "uploadNewOne": "新しいファイルをアップロード",
    "errorOnlyPdf": "PDF ファイルのみアップロードできます",
    "fileName": "ファイル名",
    "fileSize": "ファイルサイズ",
    "pageCount": "ページ数"
  },
  "ko": {
    "uploadTitle": "PDF 업로드",
    "localNote": "브라우저에서 로컬로 처리됩니다. 업로드되지 않습니다.",
    "loadingDocument": "PDF 페이지를 불러오는 중...",
    "uploadNewOne": "새 파일 업로드",
    "errorOnlyPdf": "PDF 파일만 허용됩니다",
    "fileName": "파일 이름",
    "fileSize": "파일 크기",
    "pageCount": "페이지 수"
  },
  "ru": {
    "uploadTitle": "Загрузить PDF",
    "localNote": "Выполняется локально в браузере. Файлы не загружаются.",
    "loadingDocument": "Загрузка страниц PDF...",
    "uploadNewOne": "Загрузить новый файл",
    "errorOnlyPdf": "Разрешены только PDF-файлы",
    "fileName": "Имя файла",
    "fileSize": "Размер файла",
    "pageCount": "Количество страниц"
  },
  "pt": {
    "uploadTitle": "Enviar PDF",
    "localNote": "Executa localmente no navegador. Nenhum upload.",
    "loadingDocument": "Carregando páginas do PDF...",
    "uploadNewOne": "Enviar outro arquivo",
    "errorOnlyPdf": "Apenas arquivos PDF são permitidos",
    "fileName": "Nome do arquivo",
    "fileSize": "Tamanho do arquivo",
    "pageCount": "Número de páginas"
  },
  "ar": {
    "uploadTitle": "رفع PDF",
    "localNote": "يعمل محليًا في المتصفح. لا يتم رفع الملفات.",
    "loadingDocument": "جارٍ تحميل صفحات PDF...",
    "uploadNewOne": "رفع ملف جديد",
    "errorOnlyPdf": "يُسمح فقط بملفات PDF",
    "fileName": "اسم الملف",
    "fileSize": "حجم الملف",
    "pageCount": "عدد الصفحات"
  },
  "hi": {
    "uploadTitle": "PDF अपलोड करें",
    "localNote": "यह ब्राउज़र में लोकल रूप से चलता है। कोई अपलोड नहीं होता।",
    "loadingDocument": "PDF पेज लोड हो रहे हैं...",
    "uploadNewOne": "नई फ़ाइल अपलोड करें",
    "errorOnlyPdf": "केवल PDF फ़ाइलें समर्थित हैं",
    "fileName": "फ़ाइल नाम",
    "fileSize": "फ़ाइल आकार",
    "pageCount": "पृष्ठ संख्या"
  },
  "tr": {
    "uploadTitle": "PDF yükle",
    "localNote": "Tarayıcıda yerel olarak çalışır. Yükleme yapılmaz.",
    "loadingDocument": "PDF sayfaları yükleniyor...",
    "uploadNewOne": "Yeni bir dosya yükle",
    "errorOnlyPdf": "Yalnızca PDF dosyalarına izin verilir",
    "fileName": "Dosya adı",
    "fileSize": "Dosya boyutu",
    "pageCount": "Sayfa sayısı"
  },
  "nl": {
    "uploadTitle": "PDF uploaden",
    "localNote": "Draait lokaal in je browser. Geen uploads.",
    "loadingDocument": "PDF-pagina's worden geladen...",
    "uploadNewOne": "Nieuw bestand uploaden",
    "errorOnlyPdf": "Alleen PDF-bestanden zijn toegestaan",
    "fileName": "Bestandsnaam",
    "fileSize": "Bestandsgrootte",
    "pageCount": "Aantal pagina's"
  },
  "sv": {
    "uploadTitle": "Ladda upp PDF",
    "localNote": "Körs lokalt i webbläsaren. Inga uppladdningar.",
    "loadingDocument": "Laddar PDF-sidor...",
    "uploadNewOne": "Ladda upp en ny fil",
    "errorOnlyPdf": "Endast PDF-filer tillåts",
    "fileName": "Filnamn",
    "fileSize": "Filstorlek",
    "pageCount": "Antal sidor"
  },
  "pl": {
    "uploadTitle": "Prześlij PDF",
    "localNote": "Działa lokalnie w przeglądarce. Brak wysyłania plików.",
    "loadingDocument": "Ładowanie stron PDF...",
    "uploadNewOne": "Prześlij nowy plik",
    "errorOnlyPdf": "Dozwolone są tylko pliki PDF",
    "fileName": "Nazwa pliku",
    "fileSize": "Rozmiar pliku",
    "pageCount": "Liczba stron"
  },
  "vi": {
    "uploadTitle": "Tải lên PDF",
    "localNote": "Chạy cục bộ trong trình duyệt. Không tải lên.",
    "loadingDocument": "Đang tải các trang PDF...",
    "uploadNewOne": "Tải lên tệp mới",
    "errorOnlyPdf": "Chỉ cho phép tệp PDF",
    "fileName": "Tên tệp",
    "fileSize": "Kích thước tệp",
    "pageCount": "Số trang"
  },
  "th": {
    "uploadTitle": "อัปโหลด PDF",
    "localNote": "ทำงานในเบราว์เซอร์แบบโลคัล ไม่มีการอัปโหลดไฟล์",
    "loadingDocument": "กำลังโหลดหน้า PDF...",
    "uploadNewOne": "อัปโหลดไฟล์ใหม่",
    "errorOnlyPdf": "อนุญาตเฉพาะไฟล์ PDF เท่านั้น",
    "fileName": "ชื่อไฟล์",
    "fileSize": "ขนาดไฟล์",
    "pageCount": "จำนวนหน้า"
  },
  "id": {
    "uploadTitle": "Unggah PDF",
    "localNote": "Berjalan secara lokal di browser. Tidak ada unggahan.",
    "loadingDocument": "Memuat halaman PDF...",
    "uploadNewOne": "Unggah file baru",
    "errorOnlyPdf": "Hanya file PDF yang diizinkan",
    "fileName": "Nama file",
    "fileSize": "Ukuran file",
    "pageCount": "Jumlah halaman"
  },
  "he": {
    "uploadTitle": "העלה PDF",
    "localNote": "רץ מקומית בדפדפן. ללא העלאות.",
    "loadingDocument": "טוען עמודי PDF...",
    "uploadNewOne": "העלה קובץ חדש",
    "errorOnlyPdf": "מותר להעלות קבצי PDF בלבד",
    "fileName": "שם הקובץ",
    "fileSize": "גודל הקובץ",
    "pageCount": "מספר עמודים"
  },
  "ms": {
    "uploadTitle": "Muat naik PDF",
    "localNote": "Berjalan secara lokal dalam pelayar. Tiada muat naik.",
    "loadingDocument": "Memuatkan halaman PDF...",
    "uploadNewOne": "Muat naik fail baharu",
    "errorOnlyPdf": "Hanya fail PDF dibenarkan",
    "fileName": "Nama fail",
    "fileSize": "Saiz fail",
    "pageCount": "Bilangan halaman"
  },
  "no": {
    "uploadTitle": "Last opp PDF",
    "localNote": "Kjører lokalt i nettleseren. Ingen opplastinger.",
    "loadingDocument": "Laster inn PDF-sider...",
    "uploadNewOne": "Last opp en ny fil",
    "errorOnlyPdf": "Kun PDF-filer er tillatt",
    "fileName": "Filnavn",
    "fileSize": "Filstørrelse",
    "pageCount": "Antall sider"
  }
}
</i18n>
