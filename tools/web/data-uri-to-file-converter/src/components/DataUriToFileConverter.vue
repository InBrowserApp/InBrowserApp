<template>
  <div>
    <ToolSectionHeader>{{ t('data-uri-input') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="dataUri"
        class="data-uri-input"
        type="textarea"
        :placeholder="t('data-uri-placeholder')"
        :autosize="{ minRows: 4, maxRows: 12 }"
      />
    </ToolSection>
    <ToolSection v-if="error">
      <n-text type="error">{{ error }}</n-text>
    </ToolSection>

    <template v-if="parsed && decodedBlob">
      <ToolSectionHeader>{{ t('details') }}</ToolSectionHeader>
      <ToolSection>
        <n-descriptions :column="1" label-placement="left">
          <n-descriptions-item :label="t('mime-type')">
            <n-text code>{{ parsed.mimeType }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item :label="t('encoding')">
            {{ parsed.isBase64 ? t('base64') : t('url-encoded') }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('size')">
            {{ formatBytes(decodedBlob.size) }}
          </n-descriptions-item>
        </n-descriptions>
      </ToolSection>

      <ToolSection>
        <n-form-item :label="t('file-name')" :show-feedback="false">
          <n-input v-model:value="fileName" :placeholder="t('file-name-placeholder')" />
        </n-form-item>
      </ToolSection>

      <ToolSection>
        <n-flex justify="flex-end">
          <n-button type="primary" @click="downloadFile">
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('download-file') }}
          </n-button>
        </n-flex>
      </ToolSection>

      <template v-if="previewKind && previewKind !== 'text'">
        <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
        <ToolSection>
          <n-card size="small" v-if="previewKind === 'image'">
            <img :src="previewUrl" alt="Preview" style="max-width: 100%" />
          </n-card>
          <audio
            v-else-if="previewKind === 'audio'"
            :src="previewUrl"
            controls
            style="width: 100%"
          />
          <video
            v-else-if="previewKind === 'video'"
            :src="previewUrl"
            controls
            style="width: 100%"
          />
        </ToolSection>
      </template>

      <template v-if="previewKind === 'text' && textPreview">
        <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
        <ToolSection>
          <n-card size="small">
            <n-code :code="textPreview" word-wrap />
          </n-card>
        </ToolSection>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NInput,
  NText,
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NIcon,
  NFlex,
  NFormItem,
  NCard,
  NCode,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { ArrowDownload16Regular } from '@shared/icons/fluent'
import { extension as mimeExtension } from 'mime-types'

const { t } = useI18n()

type ParsedDataUri = {
  mimeType: string
  isBase64: boolean
  data: string
}

const dataUri = ref<string>('')
const fileName = ref<string>('')
const parsed = ref<ParsedDataUri | null>(null)
const decodedBlob = ref<Blob | null>(null)
const textPreview = ref<string>('')
const error = ref<string>('')
const previewUrl = ref<string>('')

const previewKind = computed(() => {
  if (!parsed.value) return null
  const mime = parsed.value.mimeType.split(';')[0]?.trim().toLowerCase()
  if (!mime) return null
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime.startsWith('video/')) return 'video'
  if (
    mime.startsWith('text/') ||
    mime.includes('json') ||
    mime.includes('xml') ||
    mime.includes('svg')
  ) {
    return 'text'
  }
  return null
})

watch(dataUri, () => parseAndDecode(), { immediate: true })

watch([decodedBlob, previewKind], ([blob, kind]) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''

  if (blob && (kind === 'image' || kind === 'audio' || kind === 'video')) {
    previewUrl.value = URL.createObjectURL(blob)
  }
})

watch(parsed, (value) => {
  if (!value) {
    if (!dataUri.value.trim()) {
      fileName.value = ''
    }
    return
  }
  const currentName = fileName.value.trim()
  if (!currentName) {
    fileName.value = buildFileName(value.mimeType)
    return
  }

  const suggestedExt = extensionForMime(value.mimeType)
  if (!suggestedExt) return

  const currentExt = extractExtension(currentName)
  if (currentExt && currentExt.toLowerCase() === suggestedExt.toLowerCase()) {
    return
  }

  const dotIndex = currentName.lastIndexOf('.')
  const baseName = dotIndex > 0 ? currentName.slice(0, dotIndex) : currentName
  fileName.value = `${baseName || 'data'}.${suggestedExt}`
})

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

function parseAndDecode() {
  error.value = ''
  parsed.value = null
  decodedBlob.value = null
  textPreview.value = ''

  const input = dataUri.value.trim()
  if (!input) return

  try {
    const parsedResult = parseDataUri(input)
    parsed.value = parsedResult
    const decoded = decodeData(parsedResult)
    decodedBlob.value = decoded.blob
    textPreview.value = decoded.textPreview
  } catch {
    error.value = t('invalid-data-uri')
  }
}

function parseDataUri(value: string): ParsedDataUri {
  if (!value.startsWith('data:')) {
    throw new Error('invalid-data-uri')
  }

  const commaIndex = value.indexOf(',')
  if (commaIndex === -1) {
    throw new Error('invalid-data-uri')
  }

  const meta = value.slice(5, commaIndex)
  const data = value.slice(commaIndex + 1)

  const metaParts = meta.split(';')
  const rest = metaParts.slice(1)
  let rawMime = metaParts[0] || ''
  let isBase64 = rest.some((part) => part.toLowerCase() === 'base64')
  if (rawMime.toLowerCase() === 'base64') {
    rawMime = ''
    isBase64 = true
  }
  const params = rest.filter((part) => part && part.toLowerCase() !== 'base64')

  const hasMime = rawMime !== ''
  let mimeType = hasMime ? rawMime : 'text/plain'

  const hasCharset = params.some((param) => param.toLowerCase().startsWith('charset='))
  if (!hasMime && !hasCharset) {
    params.unshift('charset=US-ASCII')
  }

  if (params.length > 0) {
    mimeType = `${mimeType};${params.join(';')}`
  }

  return {
    mimeType,
    isBase64,
    data,
  }
}

function decodeData(parsedValue: ParsedDataUri) {
  const bytes = parsedValue.isBase64
    ? base64ToBytes(parsedValue.data)
    : new TextEncoder().encode(decodeURIComponent(parsedValue.data))

  const blob = new Blob([bytes], { type: parsedValue.mimeType })

  let text = ''
  if (previewKind.value === 'text') {
    text = new TextDecoder().decode(bytes)
    if (text.length > 2000) {
      text = text.slice(0, 2000) + '...'
    }
  }

  return { blob, textPreview: text }
}

function base64ToBytes(base64: string): Uint8Array {
  const normalized = base64.replace(/\s+/g, '')
  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function buildFileName(mimeType: string): string {
  const baseMime = mimeType.split(';')[0]?.trim().toLowerCase()
  const ext = extensionForMime(baseMime)
  return ext ? `data.${ext}` : 'data.bin'
}

function extensionForMime(mimeType: string): string | null {
  const normalized = mimeType.split(';')[0]?.trim().toLowerCase() ?? ''
  if (!normalized) return null

  const inferred = mimeExtension(normalized)
  if (typeof inferred === 'string' && inferred.trim() !== '') {
    return inferred
  }

  const fallback: Record<string, string> = {
    'text/plain': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'application/json': 'json',
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'video/mp4': 'mp4',
  }
  return fallback[normalized] ?? null
}

function extractExtension(name: string): string {
  const trimmed = name.trim()
  const dotIndex = trimmed.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === trimmed.length - 1) return ''
  return trimmed.slice(dotIndex + 1)
}

function downloadFile() {
  if (!decodedBlob.value) return

  const name = fileName.value.trim() || buildFileName(parsed.value?.mimeType || '')
  const url = URL.createObjectURL(decodedBlob.value)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
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
.data-uri-input :deep(textarea) {
  white-space: pre-wrap !important;
  word-break: break-all !important;
  overflow-wrap: anywhere;
}
</style>

<i18n lang="json">
{
  "en": {
    "data-uri-input": "Data URI Input",
    "data-uri-placeholder": "Paste Data URI here...",
    "invalid-data-uri": "Invalid Data URI",
    "details": "Details",
    "mime-type": "MIME Type",
    "encoding": "Encoding",
    "base64": "Base64",
    "url-encoded": "URL-encoded",
    "size": "Size",
    "file-name": "File name",
    "file-name-placeholder": "e.g. data.png",
    "download-file": "Download file",
    "preview": "Preview"
  },
  "zh": {
    "data-uri-input": "Data URI 输入",
    "data-uri-placeholder": "在此粘贴 Data URI...",
    "invalid-data-uri": "无效的 Data URI",
    "details": "详情",
    "mime-type": "MIME 类型",
    "encoding": "编码",
    "base64": "Base64",
    "url-encoded": "URL 编码",
    "size": "大小",
    "file-name": "文件名",
    "file-name-placeholder": "例如 data.png",
    "download-file": "下载文件",
    "preview": "预览"
  },
  "zh-CN": {
    "data-uri-input": "Data URI 输入",
    "data-uri-placeholder": "在此粘贴 Data URI...",
    "invalid-data-uri": "无效的 Data URI",
    "details": "详情",
    "mime-type": "MIME 类型",
    "encoding": "编码",
    "base64": "Base64",
    "url-encoded": "URL 编码",
    "size": "大小",
    "file-name": "文件名",
    "file-name-placeholder": "例如 data.png",
    "download-file": "下载文件",
    "preview": "预览"
  },
  "zh-TW": {
    "data-uri-input": "Data URI 輸入",
    "data-uri-placeholder": "在此貼上 Data URI...",
    "invalid-data-uri": "無效的 Data URI",
    "details": "詳細資訊",
    "mime-type": "MIME 類型",
    "encoding": "編碼",
    "base64": "Base64",
    "url-encoded": "URL 編碼",
    "size": "大小",
    "file-name": "檔案名稱",
    "file-name-placeholder": "例如 data.png",
    "download-file": "下載檔案",
    "preview": "預覽"
  },
  "zh-HK": {
    "data-uri-input": "Data URI 輸入",
    "data-uri-placeholder": "在此貼上 Data URI...",
    "invalid-data-uri": "無效的 Data URI",
    "details": "詳細資訊",
    "mime-type": "MIME 類型",
    "encoding": "編碼",
    "base64": "Base64",
    "url-encoded": "URL 編碼",
    "size": "大小",
    "file-name": "檔案名稱",
    "file-name-placeholder": "例如 data.png",
    "download-file": "下載檔案",
    "preview": "預覽"
  },
  "es": {
    "data-uri-input": "Entrada Data URI",
    "data-uri-placeholder": "Pega Data URI aquí...",
    "invalid-data-uri": "Data URI inválido",
    "details": "Detalles",
    "mime-type": "Tipo MIME",
    "encoding": "Codificación",
    "base64": "Base64",
    "url-encoded": "Codificado URL",
    "size": "Tamaño",
    "file-name": "Nombre de archivo",
    "file-name-placeholder": "p. ej. data.png",
    "download-file": "Descargar archivo",
    "preview": "Vista previa"
  },
  "fr": {
    "data-uri-input": "Entrée Data URI",
    "data-uri-placeholder": "Collez le Data URI ici...",
    "invalid-data-uri": "Data URI invalide",
    "details": "Détails",
    "mime-type": "Type MIME",
    "encoding": "Encodage",
    "base64": "Base64",
    "url-encoded": "Encodé URL",
    "size": "Taille",
    "file-name": "Nom de fichier",
    "file-name-placeholder": "ex. data.png",
    "download-file": "Télécharger le fichier",
    "preview": "Aperçu"
  },
  "de": {
    "data-uri-input": "Data-URI-Eingabe",
    "data-uri-placeholder": "Data URI hier einfügen...",
    "invalid-data-uri": "Ungültiger Data URI",
    "details": "Details",
    "mime-type": "MIME-Typ",
    "encoding": "Kodierung",
    "base64": "Base64",
    "url-encoded": "URL-kodiert",
    "size": "Größe",
    "file-name": "Dateiname",
    "file-name-placeholder": "z. B. data.png",
    "download-file": "Datei herunterladen",
    "preview": "Vorschau"
  },
  "it": {
    "data-uri-input": "Input Data URI",
    "data-uri-placeholder": "Incolla Data URI qui...",
    "invalid-data-uri": "Data URI non valido",
    "details": "Dettagli",
    "mime-type": "Tipo MIME",
    "encoding": "Codifica",
    "base64": "Base64",
    "url-encoded": "Codificato URL",
    "size": "Dimensione",
    "file-name": "Nome file",
    "file-name-placeholder": "es. data.png",
    "download-file": "Scarica file",
    "preview": "Anteprima"
  },
  "ja": {
    "data-uri-input": "Data URI 入力",
    "data-uri-placeholder": "ここに Data URI を貼り付け...",
    "invalid-data-uri": "無効な Data URI",
    "details": "詳細",
    "mime-type": "MIME タイプ",
    "encoding": "エンコード",
    "base64": "Base64",
    "url-encoded": "URL エンコード",
    "size": "サイズ",
    "file-name": "ファイル名",
    "file-name-placeholder": "例: data.png",
    "download-file": "ファイルをダウンロード",
    "preview": "プレビュー"
  },
  "ko": {
    "data-uri-input": "Data URI 입력",
    "data-uri-placeholder": "여기에 Data URI를 붙여넣기...",
    "invalid-data-uri": "유효하지 않은 Data URI",
    "details": "세부 정보",
    "mime-type": "MIME 유형",
    "encoding": "인코딩",
    "base64": "Base64",
    "url-encoded": "URL 인코딩",
    "size": "크기",
    "file-name": "파일 이름",
    "file-name-placeholder": "예: data.png",
    "download-file": "파일 다운로드",
    "preview": "미리보기"
  },
  "ru": {
    "data-uri-input": "Ввод Data URI",
    "data-uri-placeholder": "Вставьте Data URI здесь...",
    "invalid-data-uri": "Неверный Data URI",
    "details": "Детали",
    "mime-type": "Тип MIME",
    "encoding": "Кодировка",
    "base64": "Base64",
    "url-encoded": "URL-кодирование",
    "size": "Размер",
    "file-name": "Имя файла",
    "file-name-placeholder": "например, data.png",
    "download-file": "Скачать файл",
    "preview": "Предпросмотр"
  },
  "pt": {
    "data-uri-input": "Entrada Data URI",
    "data-uri-placeholder": "Cole o Data URI aqui...",
    "invalid-data-uri": "Data URI inválido",
    "details": "Detalhes",
    "mime-type": "Tipo MIME",
    "encoding": "Codificação",
    "base64": "Base64",
    "url-encoded": "Codificado URL",
    "size": "Tamanho",
    "file-name": "Nome do arquivo",
    "file-name-placeholder": "ex.: data.png",
    "download-file": "Baixar arquivo",
    "preview": "Pré-visualização"
  },
  "ar": {
    "data-uri-input": "إدخال Data URI",
    "data-uri-placeholder": "الصق Data URI هنا...",
    "invalid-data-uri": "Data URI غير صالح",
    "details": "التفاصيل",
    "mime-type": "نوع MIME",
    "encoding": "الترميز",
    "base64": "Base64",
    "url-encoded": "مرمز URL",
    "size": "الحجم",
    "file-name": "اسم الملف",
    "file-name-placeholder": "مثل data.png",
    "download-file": "تنزيل الملف",
    "preview": "معاينة"
  },
  "hi": {
    "data-uri-input": "Data URI इनपुट",
    "data-uri-placeholder": "यहाँ Data URI पेस्ट करें...",
    "invalid-data-uri": "अमान्य Data URI",
    "details": "विवरण",
    "mime-type": "MIME प्रकार",
    "encoding": "एन्कोडिंग",
    "base64": "Base64",
    "url-encoded": "URL एन्कोडेड",
    "size": "आकार",
    "file-name": "फ़ाइल नाम",
    "file-name-placeholder": "जैसे data.png",
    "download-file": "फ़ाइल डाउनलोड करें",
    "preview": "पूर्वावलोकन"
  },
  "tr": {
    "data-uri-input": "Data URI Girişi",
    "data-uri-placeholder": "Data URI'yi buraya yapıştırın...",
    "invalid-data-uri": "Geçersiz Data URI",
    "details": "Ayrıntılar",
    "mime-type": "MIME Türü",
    "encoding": "Kodlama",
    "base64": "Base64",
    "url-encoded": "URL kodlu",
    "size": "Boyut",
    "file-name": "Dosya adı",
    "file-name-placeholder": "örn. data.png",
    "download-file": "Dosyayı indir",
    "preview": "Önizleme"
  },
  "nl": {
    "data-uri-input": "Data URI-invoer",
    "data-uri-placeholder": "Plak Data URI hier...",
    "invalid-data-uri": "Ongeldige Data URI",
    "details": "Details",
    "mime-type": "MIME-type",
    "encoding": "Codering",
    "base64": "Base64",
    "url-encoded": "URL-gecodeerd",
    "size": "Grootte",
    "file-name": "Bestandsnaam",
    "file-name-placeholder": "bijv. data.png",
    "download-file": "Bestand downloaden",
    "preview": "Voorbeeld"
  },
  "sv": {
    "data-uri-input": "Data URI-indata",
    "data-uri-placeholder": "Klistra in Data URI här...",
    "invalid-data-uri": "Ogiltig Data URI",
    "details": "Detaljer",
    "mime-type": "MIME-typ",
    "encoding": "Kodning",
    "base64": "Base64",
    "url-encoded": "URL-kodad",
    "size": "Storlek",
    "file-name": "Filnamn",
    "file-name-placeholder": "t.ex. data.png",
    "download-file": "Ladda ner fil",
    "preview": "Förhandsvisning"
  },
  "pl": {
    "data-uri-input": "Wejście Data URI",
    "data-uri-placeholder": "Wklej Data URI tutaj...",
    "invalid-data-uri": "Nieprawidłowy Data URI",
    "details": "Szczegóły",
    "mime-type": "Typ MIME",
    "encoding": "Kodowanie",
    "base64": "Base64",
    "url-encoded": "Kodowane URL",
    "size": "Rozmiar",
    "file-name": "Nazwa pliku",
    "file-name-placeholder": "np. data.png",
    "download-file": "Pobierz plik",
    "preview": "Podgląd"
  },
  "vi": {
    "data-uri-input": "Nhập Data URI",
    "data-uri-placeholder": "Dán Data URI vào đây...",
    "invalid-data-uri": "Data URI không hợp lệ",
    "details": "Chi tiết",
    "mime-type": "Loại MIME",
    "encoding": "Mã hóa",
    "base64": "Base64",
    "url-encoded": "Mã hóa URL",
    "size": "Kích thước",
    "file-name": "Tên tệp",
    "file-name-placeholder": "vd. data.png",
    "download-file": "Tải tệp xuống",
    "preview": "Xem trước"
  },
  "th": {
    "data-uri-input": "อินพุต Data URI",
    "data-uri-placeholder": "วาง Data URI ที่นี่...",
    "invalid-data-uri": "Data URI ไม่ถูกต้อง",
    "details": "รายละเอียด",
    "mime-type": "ชนิด MIME",
    "encoding": "การเข้ารหัส",
    "base64": "Base64",
    "url-encoded": "เข้ารหัส URL",
    "size": "ขนาด",
    "file-name": "ชื่อไฟล์",
    "file-name-placeholder": "เช่น data.png",
    "download-file": "ดาวน์โหลดไฟล์",
    "preview": "ตัวอย่าง"
  },
  "id": {
    "data-uri-input": "Masukan Data URI",
    "data-uri-placeholder": "Tempel Data URI di sini...",
    "invalid-data-uri": "Data URI tidak valid",
    "details": "Detail",
    "mime-type": "Tipe MIME",
    "encoding": "Enkode",
    "base64": "Base64",
    "url-encoded": "Di-encode URL",
    "size": "Ukuran",
    "file-name": "Nama file",
    "file-name-placeholder": "mis. data.png",
    "download-file": "Unduh file",
    "preview": "Pratinjau"
  },
  "he": {
    "data-uri-input": "קלט Data URI",
    "data-uri-placeholder": "הדבק Data URI כאן...",
    "invalid-data-uri": "Data URI לא תקין",
    "details": "פרטים",
    "mime-type": "סוג MIME",
    "encoding": "קידוד",
    "base64": "Base64",
    "url-encoded": "בקידוד URL",
    "size": "גודל",
    "file-name": "שם קובץ",
    "file-name-placeholder": "למשל data.png",
    "download-file": "הורדת קובץ",
    "preview": "תצוגה מקדימה"
  },
  "ms": {
    "data-uri-input": "Input Data URI",
    "data-uri-placeholder": "Tampal Data URI di sini...",
    "invalid-data-uri": "Data URI tidak sah",
    "details": "Butiran",
    "mime-type": "Jenis MIME",
    "encoding": "Pengekodan",
    "base64": "Base64",
    "url-encoded": "URL dikodkan",
    "size": "Saiz",
    "file-name": "Nama fail",
    "file-name-placeholder": "cth. data.png",
    "download-file": "Muat turun fail",
    "preview": "Pratonton"
  },
  "no": {
    "data-uri-input": "Data URI-inndata",
    "data-uri-placeholder": "Lim inn Data URI her...",
    "invalid-data-uri": "Ugyldig Data URI",
    "details": "Detaljer",
    "mime-type": "MIME-type",
    "encoding": "Koding",
    "base64": "Base64",
    "url-encoded": "URL-kodet",
    "size": "Størrelse",
    "file-name": "Filnavn",
    "file-name-placeholder": "f.eks. data.png",
    "download-file": "Last ned fil",
    "preview": "Forhåndsvisning"
  }
}
</i18n>
