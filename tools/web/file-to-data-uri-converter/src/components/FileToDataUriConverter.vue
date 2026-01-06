<template>
  <div>
    <ToolSectionHeader>{{ t('file') }}</ToolSectionHeader>
    <ToolSection>
      <template v-if="!selectedFile">
        <n-upload @before-upload="handleBeforeUpload" :show-file-list="false">
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <DocumentArrowUp20Regular />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">{{ t('drag-or-click') }}</n-text>
          </n-upload-dragger>
        </n-upload>
      </template>
      <template v-else>
        <n-flex vertical :size="8">
          <n-text strong>{{ selectedFile.name }}</n-text>
          <n-text depth="3">{{ fileSummary }}</n-text>
          <n-flex justify="flex-start">
            <n-button size="small" text @click="clearFile">
              <template #icon>
                <n-icon :component="Delete16Regular" />
              </template>
              {{ t('clear-file') }}
            </n-button>
          </n-flex>
        </n-flex>
      </template>
    </ToolSection>

    <ToolSection v-if="error">
      <n-text type="error">{{ error }}</n-text>
    </ToolSection>

    <template v-if="selectedFile">
      <ToolSectionHeader>{{ t('data-uri') }}</ToolSectionHeader>
      <ToolSection>
        <n-flex justify="flex-start" align="center">
          <CopyToClipboardButton v-if="dataUri" :content="dataUri" />
        </n-flex>
      </ToolSection>
      <ToolSection>
        <n-card size="small">
          <n-scrollbar v-if="dataUri" class="data-uri-output" style="max-height: 120px">
            <n-code :code="dataUri" word-wrap />
          </n-scrollbar>
          <n-text v-else depth="3">{{ t('data-uri-placeholder') }}</n-text>
        </n-card>
      </ToolSection>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NButton,
  NFlex,
  NCard,
  NCode,
  NScrollbar,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { DocumentArrowUp20Regular, Delete16Regular } from '@shared/icons/fluent'
import type { UploadFileInfo } from 'naive-ui'

const { t } = useI18n()

const selectedFile = ref<File | null>(null)
const dataUri = ref<string>('')
const error = ref<string>('')

const fileSummary = computed(() => {
  if (!selectedFile.value) return ''
  const type = selectedFile.value.type || t('unknown-type')
  return `${formatBytes(selectedFile.value.size)} · ${type}`
})

async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.fileList.length > 1) {
    error.value = t('only-one-file')
    return false
  }

  const file = data.file.file
  if (!file) return false

  selectedFile.value = file
  error.value = ''
  dataUri.value = ''

  try {
    dataUri.value = await fileToDataUri(file)
  } catch {
    error.value = t('read-failed')
  }

  return false
}

function clearFile() {
  selectedFile.value = null
  dataUri.value = ''
  error.value = ''
}

defineExpose({
  handleBeforeUpload,
  clearFile,
})

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('read-failed'))
    reader.readAsDataURL(file)
  })
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.data-uri-output :deep(pre),
.data-uri-output :deep(code) {
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: anywhere;
}
</style>

<i18n lang="json">
{
  "en": {
    "file": "File",
    "drag-or-click": "Click or drag to upload a file",
    "clear-file": "Clear file",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Generated Data URI will appear here...",
    "only-one-file": "Only one file can be uploaded",
    "read-failed": "Failed to read file",
    "unknown-type": "Unknown type"
  },
  "zh": {
    "file": "文件",
    "drag-or-click": "点击或拖拽上传文件",
    "clear-file": "清除文件",
    "data-uri": "Data URI",
    "data-uri-placeholder": "生成的 Data URI 将显示在这里...",
    "only-one-file": "只能上传一个文件",
    "read-failed": "读取文件失败",
    "unknown-type": "未知类型"
  },
  "zh-CN": {
    "file": "文件",
    "drag-or-click": "点击或拖拽上传文件",
    "clear-file": "清除文件",
    "data-uri": "Data URI",
    "data-uri-placeholder": "生成的 Data URI 将显示在这里...",
    "only-one-file": "只能上传一个文件",
    "read-failed": "读取文件失败",
    "unknown-type": "未知类型"
  },
  "zh-TW": {
    "file": "檔案",
    "drag-or-click": "點擊或拖拽上傳檔案",
    "clear-file": "清除檔案",
    "data-uri": "Data URI",
    "data-uri-placeholder": "產生的 Data URI 會顯示在這裡...",
    "only-one-file": "只能上傳一個檔案",
    "read-failed": "讀取檔案失敗",
    "unknown-type": "未知類型"
  },
  "zh-HK": {
    "file": "檔案",
    "drag-or-click": "點擊或拖拽上傳檔案",
    "clear-file": "清除檔案",
    "data-uri": "Data URI",
    "data-uri-placeholder": "產生的 Data URI 會顯示在這裡...",
    "only-one-file": "只能上傳一個檔案",
    "read-failed": "讀取檔案失敗",
    "unknown-type": "未知類型"
  },
  "es": {
    "file": "Archivo",
    "drag-or-click": "Haz clic o arrastra para subir un archivo",
    "clear-file": "Limpiar archivo",
    "data-uri": "Data URI",
    "data-uri-placeholder": "El Data URI generado aparecerá aquí...",
    "only-one-file": "Solo se puede subir un archivo",
    "read-failed": "No se pudo leer el archivo",
    "unknown-type": "Tipo desconocido"
  },
  "fr": {
    "file": "Fichier",
    "drag-or-click": "Cliquez ou glissez pour téléverser un fichier",
    "clear-file": "Effacer le fichier",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Le Data URI généré apparaîtra ici...",
    "only-one-file": "Un seul fichier peut être téléchargé",
    "read-failed": "Échec de la lecture du fichier",
    "unknown-type": "Type inconnu"
  },
  "de": {
    "file": "Datei",
    "drag-or-click": "Klicken oder ziehen Sie, um eine Datei hochzuladen",
    "clear-file": "Datei löschen",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Der erzeugte Data URI erscheint hier...",
    "only-one-file": "Es kann nur eine Datei hochgeladen werden",
    "read-failed": "Datei konnte nicht gelesen werden",
    "unknown-type": "Unbekannter Typ"
  },
  "it": {
    "file": "File",
    "drag-or-click": "Clicca o trascina per caricare un file",
    "clear-file": "Cancella file",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Il Data URI generato apparirà qui...",
    "only-one-file": "È possibile caricare solo un file",
    "read-failed": "Impossibile leggere il file",
    "unknown-type": "Tipo sconosciuto"
  },
  "ja": {
    "file": "ファイル",
    "drag-or-click": "クリックまたはドラッグしてファイルをアップロード",
    "clear-file": "ファイルをクリア",
    "data-uri": "Data URI",
    "data-uri-placeholder": "生成された Data URI がここに表示されます...",
    "only-one-file": "アップロードできるファイルは1つだけです",
    "read-failed": "ファイルの読み取りに失敗しました",
    "unknown-type": "不明な種類"
  },
  "ko": {
    "file": "파일",
    "drag-or-click": "클릭하거나 드래그하여 파일 업로드",
    "clear-file": "파일 지우기",
    "data-uri": "Data URI",
    "data-uri-placeholder": "생성된 Data URI가 여기에 표시됩니다...",
    "only-one-file": "하나의 파일만 업로드할 수 있습니다",
    "read-failed": "파일을 읽지 못했습니다",
    "unknown-type": "알 수 없는 유형"
  },
  "ru": {
    "file": "Файл",
    "drag-or-click": "Нажмите или перетащите, чтобы загрузить файл",
    "clear-file": "Очистить файл",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Сгенерированный Data URI появится здесь...",
    "only-one-file": "Можно загрузить только один файл",
    "read-failed": "Не удалось прочитать файл",
    "unknown-type": "Неизвестный тип"
  },
  "pt": {
    "file": "Arquivo",
    "drag-or-click": "Clique ou arraste para enviar um arquivo",
    "clear-file": "Limpar arquivo",
    "data-uri": "Data URI",
    "data-uri-placeholder": "O Data URI gerado aparecerá aqui...",
    "only-one-file": "Apenas um arquivo pode ser enviado",
    "read-failed": "Falha ao ler o arquivo",
    "unknown-type": "Tipo desconhecido"
  },
  "ar": {
    "file": "ملف",
    "drag-or-click": "انقر أو اسحب لتحميل ملف",
    "clear-file": "مسح الملف",
    "data-uri": "Data URI",
    "data-uri-placeholder": "سيظهر Data URI المُنشأ هنا...",
    "only-one-file": "يمكن تحميل ملف واحد فقط",
    "read-failed": "فشل في قراءة الملف",
    "unknown-type": "نوع غير معروف"
  },
  "hi": {
    "file": "फ़ाइल",
    "drag-or-click": "फ़ाइल अपलोड करने के लिए क्लिक करें या खींचें",
    "clear-file": "फ़ाइल साफ़ करें",
    "data-uri": "Data URI",
    "data-uri-placeholder": "जनरेट किया गया Data URI यहाँ दिखाई देगा...",
    "only-one-file": "केवल एक फ़ाइल अपलोड की जा सकती है",
    "read-failed": "फ़ाइल पढ़ने में विफल",
    "unknown-type": "अज्ञात प्रकार"
  },
  "tr": {
    "file": "Dosya",
    "drag-or-click": "Dosya yüklemek için tıklayın veya sürükleyin",
    "clear-file": "Dosyayı temizle",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Oluşturulan Data URI burada görünecek...",
    "only-one-file": "Yalnızca bir dosya yüklenebilir",
    "read-failed": "Dosya okunamadı",
    "unknown-type": "Bilinmeyen tür"
  },
  "nl": {
    "file": "Bestand",
    "drag-or-click": "Klik of sleep om een bestand te uploaden",
    "clear-file": "Bestand wissen",
    "data-uri": "Data URI",
    "data-uri-placeholder": "De gegenereerde Data URI verschijnt hier...",
    "only-one-file": "Er kan slechts één bestand worden geüpload",
    "read-failed": "Bestand lezen mislukt",
    "unknown-type": "Onbekend type"
  },
  "sv": {
    "file": "Fil",
    "drag-or-click": "Klicka eller dra för att ladda upp en fil",
    "clear-file": "Rensa fil",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Den genererade Data URI visas här...",
    "only-one-file": "Endast en fil kan laddas upp",
    "read-failed": "Misslyckades med att läsa filen",
    "unknown-type": "Okänd typ"
  },
  "pl": {
    "file": "Plik",
    "drag-or-click": "Kliknij lub przeciągnij, aby przesłać plik",
    "clear-file": "Wyczyść plik",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Wygenerowany Data URI pojawi się tutaj...",
    "only-one-file": "Można przesłać tylko jeden plik",
    "read-failed": "Nie udało się odczytać pliku",
    "unknown-type": "Nieznany typ"
  },
  "vi": {
    "file": "Tệp",
    "drag-or-click": "Nhấp hoặc kéo để tải lên tệp",
    "clear-file": "Xóa tệp",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Data URI đã tạo sẽ xuất hiện ở đây...",
    "only-one-file": "Chỉ có thể tải lên một tệp",
    "read-failed": "Không thể đọc tệp",
    "unknown-type": "Loại không xác định"
  },
  "th": {
    "file": "ไฟล์",
    "drag-or-click": "คลิกหรือลากเพื่ออัปโหลดไฟล์",
    "clear-file": "ล้างไฟล์",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Data URI ที่สร้างจะปรากฏที่นี่...",
    "only-one-file": "สามารถอัปโหลดได้เพียงหนึ่งไฟล์เท่านั้น",
    "read-failed": "ไม่สามารถอ่านไฟล์ได้",
    "unknown-type": "ไม่ทราบประเภท"
  },
  "id": {
    "file": "File",
    "drag-or-click": "Klik atau seret untuk mengunggah file",
    "clear-file": "Hapus file",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Data URI yang dihasilkan akan muncul di sini...",
    "only-one-file": "Hanya satu file yang dapat diunggah",
    "read-failed": "Gagal membaca file",
    "unknown-type": "Jenis tidak dikenal"
  },
  "he": {
    "file": "קובץ",
    "drag-or-click": "לחץ או גרור כדי להעלות קובץ",
    "clear-file": "נקה קובץ",
    "data-uri": "Data URI",
    "data-uri-placeholder": "ה־Data URI שנוצר יופיע כאן...",
    "only-one-file": "ניתן להעלות קובץ אחד בלבד",
    "read-failed": "קריאת הקובץ נכשלה",
    "unknown-type": "סוג לא ידוע"
  },
  "ms": {
    "file": "Fail",
    "drag-or-click": "Klik atau seret untuk muat naik fail",
    "clear-file": "Kosongkan fail",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Data URI yang dijana akan dipaparkan di sini...",
    "only-one-file": "Hanya satu fail boleh dimuat naik",
    "read-failed": "Gagal membaca fail",
    "unknown-type": "Jenis tidak diketahui"
  },
  "no": {
    "file": "Fil",
    "drag-or-click": "Klikk eller dra for å laste opp en fil",
    "clear-file": "Tøm fil",
    "data-uri": "Data URI",
    "data-uri-placeholder": "Den genererte Data URI vises her...",
    "only-one-file": "Kun én fil kan lastes opp",
    "read-failed": "Kunne ikke lese filen",
    "unknown-type": "Ukjent type"
  }
}
</i18n>
