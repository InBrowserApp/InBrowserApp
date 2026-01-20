<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-tabs v-model:value="inputMode" type="segment" @update:value="handleTabChange">
      <n-tab-pane name="file" :tab="t('fileTab')">
        <template v-if="!currentFile">
          <n-upload
            accept=".svg,image/svg+xml"
            :max="1"
            :default-upload="false"
            @change="handleFileChange"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <CloudArrowUp24Regular />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">{{ t('dropzone') }}</n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">{{ t('dropzoneHint') }}</n-p>
            </n-upload-dragger>
          </n-upload>
        </template>
        <template v-else>
          <SvgFilePreview
            :preview-url="previewUrl"
            :file-name="currentFile.name"
            :size="currentFile.size"
            @delete="clearFile"
          />
        </template>
      </n-tab-pane>
      <n-tab-pane name="text" :tab="t('textTab')">
        <n-input
          v-model:value="textInput"
          type="textarea"
          :placeholder="t('textPlaceholder')"
          :rows="8"
          :status="textInputStatus"
        />
        <n-text v-if="textInputError" type="error" style="display: block; margin-top: 8px">
          {{ textInputError }}
        </n-text>
        <SvgFilePreview
          v-if="textParsedOk"
          style="margin-top: 12px"
          :preview-url="textPreviewUrl"
          file-name="pasted.svg"
          :size="textBlob?.size ?? 0"
          @delete="clearText"
        />
      </n-tab-pane>
    </n-tabs>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NUpload, NUploadDragger, NIcon, NText, NP, NTabs, NTabPane, NInput } from 'naive-ui'
import CloudArrowUp24Regular from '@vicons/fluent/CloudArrowUp24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import SvgFilePreview from './SvgFilePreview.vue'
import type { UploadFileInfo } from 'naive-ui'

const { t } = useI18n()

const svgString = defineModel<string>('svgString', { default: '' })
const fileName = defineModel<string>('fileName', { default: '' })

const inputMode = ref<'file' | 'text'>('file')
const textInput = ref('')
const textInputError = ref('')
const currentFile = ref<File | null>(null)
const textBlob = ref<Blob | null>(null)

const previewUrl = useObjectUrl(currentFile)
const textPreviewUrl = useObjectUrl(textBlob)

const textParsedOk = computed(() => {
  return textInput.value && !textInputError.value && svgString.value
})

const textInputStatus = computed(() => {
  if (!textInput.value) return undefined
  return textInputError.value ? 'error' : 'success'
})

function isSvgContent(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')
}

function clearFile() {
  currentFile.value = null
  svgString.value = ''
  fileName.value = ''
  textInputError.value = ''
}

function clearText() {
  textInput.value = ''
  textBlob.value = null
  svgString.value = ''
  fileName.value = ''
  textInputError.value = ''
}

function handleTabChange() {
  clearFile()
  clearText()
}

async function handleFileChange(options: { fileList: UploadFileInfo[] }) {
  const file = options.fileList[0]?.file
  if (!file) {
    clearFile()
    return
  }

  try {
    const content = await file.text()
    if (!isSvgContent(content)) {
      textInputError.value = t('invalidSvg')
      return
    }
    currentFile.value = file
    svgString.value = content
    fileName.value = file.name
    textInputError.value = ''
  } catch {
    textInputError.value = t('readError')
  }
}

watch(textInput, (value) => {
  if (!value) {
    svgString.value = ''
    fileName.value = ''
    textInputError.value = ''
    textBlob.value = null
    return
  }

  if (!isSvgContent(value)) {
    textInputError.value = t('invalidSvg')
    svgString.value = ''
    textBlob.value = null
    return
  }

  svgString.value = value
  fileName.value = 'pasted.svg'
  textInputError.value = ''
  textBlob.value = new Blob([value], { type: 'image/svg+xml' })
})
</script>

<i18n lang="json">
{
  "en": {
    "title": "SVG Input",
    "fileTab": "Upload File",
    "textTab": "Paste Code",
    "dropzone": "Click or drag SVG file here",
    "dropzoneHint": "Only .svg files are supported",
    "textPlaceholder": "Paste your SVG code here...",
    "invalidSvg": "Invalid SVG content",
    "readError": "Failed to read file"
  },
  "zh": {
    "title": "SVG 输入",
    "fileTab": "上传文件",
    "textTab": "粘贴代码",
    "dropzone": "点击或拖拽 SVG 文件到这里",
    "dropzoneHint": "仅支持 .svg 文件",
    "textPlaceholder": "在此粘贴 SVG 代码...",
    "invalidSvg": "无效的 SVG 内容",
    "readError": "读取文件失败"
  },
  "zh-CN": {
    "title": "SVG 输入",
    "fileTab": "上传文件",
    "textTab": "粘贴代码",
    "dropzone": "点击或拖拽 SVG 文件到这里",
    "dropzoneHint": "仅支持 .svg 文件",
    "textPlaceholder": "在此粘贴 SVG 代码...",
    "invalidSvg": "无效的 SVG 内容",
    "readError": "读取文件失败"
  },
  "zh-TW": {
    "title": "SVG 輸入",
    "fileTab": "上傳檔案",
    "textTab": "貼上程式碼",
    "dropzone": "點擊或拖曳 SVG 檔案到這裡",
    "dropzoneHint": "僅支援 .svg 檔案",
    "textPlaceholder": "在此貼上 SVG 程式碼...",
    "invalidSvg": "無效的 SVG 內容",
    "readError": "讀取檔案失敗"
  },
  "zh-HK": {
    "title": "SVG 輸入",
    "fileTab": "上傳檔案",
    "textTab": "貼上程式碼",
    "dropzone": "點擊或拖曳 SVG 檔案到這裡",
    "dropzoneHint": "僅支援 .svg 檔案",
    "textPlaceholder": "在此貼上 SVG 程式碼...",
    "invalidSvg": "無效的 SVG 內容",
    "readError": "讀取檔案失敗"
  },
  "es": {
    "title": "Entrada SVG",
    "fileTab": "Subir archivo",
    "textTab": "Pegar código",
    "dropzone": "Haga clic o arrastre el archivo SVG aquí",
    "dropzoneHint": "Solo se admiten archivos .svg",
    "textPlaceholder": "Pegue su código SVG aquí...",
    "invalidSvg": "Contenido SVG inválido",
    "readError": "Error al leer el archivo"
  },
  "fr": {
    "title": "Entrée SVG",
    "fileTab": "Téléverser un fichier",
    "textTab": "Coller le code",
    "dropzone": "Cliquez ou déposez le fichier SVG ici",
    "dropzoneHint": "Seuls les fichiers .svg sont pris en charge",
    "textPlaceholder": "Collez votre code SVG ici...",
    "invalidSvg": "Contenu SVG invalide",
    "readError": "Échec de la lecture du fichier"
  },
  "de": {
    "title": "SVG-Eingabe",
    "fileTab": "Datei hochladen",
    "textTab": "Code einfügen",
    "dropzone": "Klicken oder SVG-Datei hierher ziehen",
    "dropzoneHint": "Nur .svg-Dateien werden unterstützt",
    "textPlaceholder": "Fügen Sie Ihren SVG-Code hier ein...",
    "invalidSvg": "Ungültiger SVG-Inhalt",
    "readError": "Datei konnte nicht gelesen werden"
  },
  "it": {
    "title": "Input SVG",
    "fileTab": "Carica file",
    "textTab": "Incolla codice",
    "dropzone": "Clicca o trascina il file SVG qui",
    "dropzoneHint": "Sono supportati solo i file .svg",
    "textPlaceholder": "Incolla il tuo codice SVG qui...",
    "invalidSvg": "Contenuto SVG non valido",
    "readError": "Impossibile leggere il file"
  },
  "ja": {
    "title": "SVG 入力",
    "fileTab": "ファイルをアップロード",
    "textTab": "コードを貼り付け",
    "dropzone": "SVG ファイルをクリックまたはドラッグしてください",
    "dropzoneHint": ".svg ファイルのみサポートされています",
    "textPlaceholder": "SVG コードをここに貼り付けてください...",
    "invalidSvg": "無効な SVG コンテンツ",
    "readError": "ファイルの読み込みに失敗しました"
  },
  "ko": {
    "title": "SVG 입력",
    "fileTab": "파일 업로드",
    "textTab": "코드 붙여넣기",
    "dropzone": "SVG 파일을 클릭하거나 여기로 드래그하세요",
    "dropzoneHint": ".svg 파일만 지원됩니다",
    "textPlaceholder": "SVG 코드를 여기에 붙여넣으세요...",
    "invalidSvg": "잘못된 SVG 콘텐츠",
    "readError": "파일을 읽지 못했습니다"
  },
  "ru": {
    "title": "Ввод SVG",
    "fileTab": "Загрузить файл",
    "textTab": "Вставить код",
    "dropzone": "Нажмите или перетащите SVG-файл сюда",
    "dropzoneHint": "Поддерживаются только файлы .svg",
    "textPlaceholder": "Вставьте ваш SVG-код здесь...",
    "invalidSvg": "Недопустимое содержимое SVG",
    "readError": "Не удалось прочитать файл"
  },
  "pt": {
    "title": "Entrada SVG",
    "fileTab": "Carregar arquivo",
    "textTab": "Colar código",
    "dropzone": "Clique ou arraste o arquivo SVG aqui",
    "dropzoneHint": "Apenas arquivos .svg são suportados",
    "textPlaceholder": "Cole seu código SVG aqui...",
    "invalidSvg": "Conteúdo SVG inválido",
    "readError": "Falha ao ler o arquivo"
  },
  "ar": {
    "title": "إدخال SVG",
    "fileTab": "تحميل ملف",
    "textTab": "لصق الكود",
    "dropzone": "انقر أو اسحب ملف SVG هنا",
    "dropzoneHint": "يتم دعم ملفات .svg فقط",
    "textPlaceholder": "الصق كود SVG هنا...",
    "invalidSvg": "محتوى SVG غير صالح",
    "readError": "فشل في قراءة الملف"
  },
  "hi": {
    "title": "SVG इनपुट",
    "fileTab": "फ़ाइल अपलोड करें",
    "textTab": "कोड चिपकाएं",
    "dropzone": "SVG फ़ाइल यहां क्लिक करें या खींचें",
    "dropzoneHint": "केवल .svg फ़ाइलें समर्थित हैं",
    "textPlaceholder": "अपना SVG कोड यहां चिपकाएं...",
    "invalidSvg": "अमान्य SVG सामग्री",
    "readError": "फ़ाइल पढ़ने में विफल"
  },
  "tr": {
    "title": "SVG Girişi",
    "fileTab": "Dosya Yükle",
    "textTab": "Kod Yapıştır",
    "dropzone": "SVG dosyasını tıklayın veya buraya sürükleyin",
    "dropzoneHint": "Yalnızca .svg dosyaları desteklenir",
    "textPlaceholder": "SVG kodunuzu buraya yapıştırın...",
    "invalidSvg": "Geçersiz SVG içeriği",
    "readError": "Dosya okunamadı"
  },
  "nl": {
    "title": "SVG-invoer",
    "fileTab": "Bestand uploaden",
    "textTab": "Code plakken",
    "dropzone": "Klik of sleep SVG-bestand hierheen",
    "dropzoneHint": "Alleen .svg-bestanden worden ondersteund",
    "textPlaceholder": "Plak hier uw SVG-code...",
    "invalidSvg": "Ongeldige SVG-inhoud",
    "readError": "Kan bestand niet lezen"
  },
  "sv": {
    "title": "SVG-indata",
    "fileTab": "Ladda upp fil",
    "textTab": "Klistra in kod",
    "dropzone": "Klicka eller dra SVG-fil hit",
    "dropzoneHint": "Endast .svg-filer stöds",
    "textPlaceholder": "Klistra in din SVG-kod här...",
    "invalidSvg": "Ogiltigt SVG-innehåll",
    "readError": "Kunde inte läsa filen"
  },
  "pl": {
    "title": "Wejście SVG",
    "fileTab": "Prześlij plik",
    "textTab": "Wklej kod",
    "dropzone": "Kliknij lub przeciągnij plik SVG tutaj",
    "dropzoneHint": "Obsługiwane są tylko pliki .svg",
    "textPlaceholder": "Wklej swój kod SVG tutaj...",
    "invalidSvg": "Nieprawidłowa zawartość SVG",
    "readError": "Nie udało się odczytać pliku"
  },
  "vi": {
    "title": "Nhập SVG",
    "fileTab": "Tải lên tệp",
    "textTab": "Dán mã",
    "dropzone": "Nhấp hoặc kéo tệp SVG vào đây",
    "dropzoneHint": "Chỉ hỗ trợ tệp .svg",
    "textPlaceholder": "Dán mã SVG của bạn vào đây...",
    "invalidSvg": "Nội dung SVG không hợp lệ",
    "readError": "Không thể đọc tệp"
  },
  "th": {
    "title": "อินพุต SVG",
    "fileTab": "อัปโหลดไฟล์",
    "textTab": "วางโค้ด",
    "dropzone": "คลิกหรือลากไฟล์ SVG มาที่นี่",
    "dropzoneHint": "รองรับเฉพาะไฟล์ .svg เท่านั้น",
    "textPlaceholder": "วางโค้ด SVG ของคุณที่นี่...",
    "invalidSvg": "เนื้อหา SVG ไม่ถูกต้อง",
    "readError": "ไม่สามารถอ่านไฟล์ได้"
  },
  "id": {
    "title": "Input SVG",
    "fileTab": "Unggah File",
    "textTab": "Tempel Kode",
    "dropzone": "Klik atau seret file SVG ke sini",
    "dropzoneHint": "Hanya file .svg yang didukung",
    "textPlaceholder": "Tempel kode SVG Anda di sini...",
    "invalidSvg": "Konten SVG tidak valid",
    "readError": "Gagal membaca file"
  },
  "he": {
    "title": "קלט SVG",
    "fileTab": "העלה קובץ",
    "textTab": "הדבק קוד",
    "dropzone": "לחץ או גרור קובץ SVG לכאן",
    "dropzoneHint": "רק קבצי .svg נתמכים",
    "textPlaceholder": "הדבק את קוד ה-SVG שלך כאן...",
    "invalidSvg": "תוכן SVG לא חוקי",
    "readError": "נכשל בקריאת הקובץ"
  },
  "ms": {
    "title": "Input SVG",
    "fileTab": "Muat naik Fail",
    "textTab": "Tampal Kod",
    "dropzone": "Klik atau seret fail SVG ke sini",
    "dropzoneHint": "Hanya fail .svg disokong",
    "textPlaceholder": "Tampal kod SVG anda di sini...",
    "invalidSvg": "Kandungan SVG tidak sah",
    "readError": "Gagal membaca fail"
  },
  "no": {
    "title": "SVG-inndata",
    "fileTab": "Last opp fil",
    "textTab": "Lim inn kode",
    "dropzone": "Klikk eller dra SVG-fil hit",
    "dropzoneHint": "Bare .svg-filer støttes",
    "textPlaceholder": "Lim inn SVG-koden din her...",
    "invalidSvg": "Ugyldig SVG-innhold",
    "readError": "Kunne ikke lese filen"
  }
}
</i18n>
