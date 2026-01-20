<template>
  <div>
    <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
    <ToolSection>
      <TextOrFileInput
        v-model:value="textOrFile"
        :placeholder="t('input-placeholder')"
        accept="text/*,.txt,.log,.md,.json,.csv,.yaml,.yml,.b32,.base32"
      />
    </ToolSection>

    <ToolSectionHeader>{{ t('output-title') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        :value="previewText"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 12 }"
        :placeholder="t('output-placeholder')"
        readonly
      />
      <n-text v-if="isTruncated" depth="3" class="preview-note">{{
        t('preview-truncated')
      }}</n-text>
    </ToolSection>
    <ToolSection>
      <n-flex align="center" justify="space-between">
        <n-flex align="center" :size="8">
          <CopyToClipboardButton :content="decodedText" />
          <n-button
            tag="a"
            text
            :href="downloadUrl ?? undefined"
            :download="downloadName"
            :disabled="!decodedBytes"
          >
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('download') }}
          </n-button>
        </n-flex>
        <n-text v-if="error" type="error">{{ error }}</n-text>
      </n-flex>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NInput, NText } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { CopyToClipboardButton, TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { decodeBase32 } from '@utils/base32'

const { t } = useI18n()

const storedText = useStorage('tools:base32-decoder:text', 'MZXW6===')
const textOrFile = ref<string | File>(storedText.value)
const decodedBytes = ref<Uint8Array | null>(null)
const decodedText = ref('')
const error = ref('')

watch(textOrFile, (value) => {
  if (typeof value === 'string') {
    storedText.value = value
  }
})

watch(storedText, (value) => {
  if (typeof textOrFile.value === 'string') {
    textOrFile.value = value
  }
})

let requestId = 0
watch(
  textOrFile,
  async (value) => {
    const currentId = (requestId += 1)
    error.value = ''
    decodedBytes.value = null
    decodedText.value = ''

    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return
    }

    let content = ''
    try {
      content = typeof value === 'string' ? value : await value.text()
    } catch {
      if (currentId !== requestId) return
      error.value = t('read-failed')
      return
    }

    if (currentId !== requestId) return

    try {
      const bytes = decodeBase32(content)
      decodedBytes.value = bytes
      decodedText.value = new TextDecoder().decode(bytes)
    } catch {
      decodedBytes.value = null
      decodedText.value = ''
      error.value = t('invalid-base32')
    }
  },
  { immediate: true },
)

const previewText = computed(() => {
  if (!decodedText.value) return ''
  if (decodedText.value.length <= 2000) return decodedText.value
  return decodedText.value.slice(0, 2000) + '...'
})

const isTruncated = computed(() => decodedText.value.length > 2000)

const downloadBlob = computed(() => {
  if (!decodedBytes.value) return null
  const bytes = decodedBytes.value
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
  return new Blob([buffer], { type: 'application/octet-stream' })
})
const downloadUrl = useObjectUrl(downloadBlob)

const downloadName = computed(() => {
  const input = textOrFile.value
  if (typeof input === 'string') return 'decoded.bin'

  const fileName = input?.name ?? 'decoded'
  const baseName = fileName.replace(/\.[^/.]+$/, '')
  return `${baseName || 'decoded'}.bin`
})
</script>

<style scoped>
.preview-note {
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "input-title": "Base32 Input",
    "input-placeholder": "Enter Base32 text...",
    "output-title": "Decoded Output",
    "output-placeholder": "Decoded text will appear here...",
    "download": "Download file",
    "invalid-base32": "Invalid Base32 text",
    "read-failed": "Failed to read file",
    "preview-truncated": "Preview truncated"
  },
  "zh": {
    "input-title": "Base32 输入",
    "input-placeholder": "输入 Base32 文本...",
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "invalid-base32": "无效的 Base32 文本",
    "read-failed": "读取文件失败",
    "preview-truncated": "预览已截断"
  },
  "zh-CN": {
    "input-title": "Base32 输入",
    "input-placeholder": "输入 Base32 文本...",
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "invalid-base32": "无效的 Base32 文本",
    "read-failed": "读取文件失败",
    "preview-truncated": "预览已截断"
  },
  "zh-TW": {
    "input-title": "Base32 輸入",
    "input-placeholder": "輸入 Base32 文字...",
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "invalid-base32": "無效的 Base32 文字",
    "read-failed": "讀取檔案失敗",
    "preview-truncated": "預覽已截斷"
  },
  "zh-HK": {
    "input-title": "Base32 輸入",
    "input-placeholder": "輸入 Base32 文字...",
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "invalid-base32": "無效的 Base32 文字",
    "read-failed": "讀取檔案失敗",
    "preview-truncated": "預覽已截斷"
  },
  "es": {
    "input-title": "Entrada Base32",
    "input-placeholder": "Introduce texto Base32...",
    "output-title": "Salida Decodificada",
    "output-placeholder": "El texto decodificado aparecerá aquí...",
    "download": "Descargar archivo",
    "invalid-base32": "Texto Base32 inválido",
    "read-failed": "No se pudo leer el archivo",
    "preview-truncated": "Vista previa truncada"
  },
  "fr": {
    "input-title": "Entrée Base32",
    "input-placeholder": "Entrez le texte Base32...",
    "output-title": "Sortie décodée",
    "output-placeholder": "Le texte décodé apparaîtra ici...",
    "download": "Télécharger le fichier",
    "invalid-base32": "Texte Base32 invalide",
    "read-failed": "Échec de la lecture du fichier",
    "preview-truncated": "Aperçu tronqué"
  },
  "de": {
    "input-title": "Base32-Eingabe",
    "input-placeholder": "Base32-Text eingeben...",
    "output-title": "Dekodierte Ausgabe",
    "output-placeholder": "Der decodierte Text erscheint hier...",
    "download": "Datei herunterladen",
    "invalid-base32": "Ungültiger Base32-Text",
    "read-failed": "Datei konnte nicht gelesen werden",
    "preview-truncated": "Vorschau gekürzt"
  },
  "it": {
    "input-title": "Input Base32",
    "input-placeholder": "Inserisci testo Base32...",
    "output-title": "Output decodificato",
    "output-placeholder": "Il testo decodificato apparirà qui...",
    "download": "Scarica file",
    "invalid-base32": "Testo Base32 non valido",
    "read-failed": "Impossibile leggere il file",
    "preview-truncated": "Anteprima troncata"
  },
  "ja": {
    "input-title": "Base32 入力",
    "input-placeholder": "Base32テキストを入力...",
    "output-title": "デコード結果",
    "output-placeholder": "デコードされたテキストがここに表示されます...",
    "download": "ファイルをダウンロード",
    "invalid-base32": "無効なBase32テキスト",
    "read-failed": "ファイルの読み取りに失敗しました",
    "preview-truncated": "プレビューは切り詰められました"
  },
  "ko": {
    "input-title": "Base32 입력",
    "input-placeholder": "Base32 텍스트 입력...",
    "output-title": "디코딩된 출력",
    "output-placeholder": "디코딩된 텍스트가 여기에 표시됩니다...",
    "download": "파일 다운로드",
    "invalid-base32": "유효하지 않은 Base32 텍스트",
    "read-failed": "파일 읽기에 실패했습니다",
    "preview-truncated": "미리보기 잘림"
  },
  "ru": {
    "input-title": "Ввод Base32",
    "input-placeholder": "Введите текст Base32...",
    "output-title": "Декодированный вывод",
    "output-placeholder": "Декодированный текст появится здесь...",
    "download": "Скачать файл",
    "invalid-base32": "Неверный текст Base32",
    "read-failed": "Не удалось прочитать файл",
    "preview-truncated": "Предпросмотр обрезан"
  },
  "pt": {
    "input-title": "Entrada Base32",
    "input-placeholder": "Digite texto Base32...",
    "output-title": "Saída decodificada",
    "output-placeholder": "O texto decodificado aparecerá aqui...",
    "download": "Baixar arquivo",
    "invalid-base32": "Texto Base32 inválido",
    "read-failed": "Falha ao ler o arquivo",
    "preview-truncated": "Pré-visualização truncada"
  },
  "ar": {
    "input-title": "إدخال Base32",
    "input-placeholder": "أدخل نص Base32...",
    "output-title": "المخرجات المفككة",
    "output-placeholder": "سيظهر النص المفكك هنا...",
    "download": "تنزيل الملف",
    "invalid-base32": "نص Base32 غير صالح",
    "read-failed": "فشل في قراءة الملف",
    "preview-truncated": "تم اقتطاع المعاينة"
  },
  "hi": {
    "input-title": "Base32 इनपुट",
    "input-placeholder": "Base32 पाठ दर्ज करें...",
    "output-title": "डिकोडेड आउटपुट",
    "output-placeholder": "डिकोड किया गया पाठ यहां दिखाई देगा...",
    "download": "फ़ाइल डाउनलोड करें",
    "invalid-base32": "अमान्य Base32 पाठ",
    "read-failed": "फ़ाइल पढ़ने में विफल",
    "preview-truncated": "प्रीव्यू संक्षिप्त किया गया"
  },
  "tr": {
    "input-title": "Base32 Girişi",
    "input-placeholder": "Base32 metni girin...",
    "output-title": "Çözümlenen Çıktı",
    "output-placeholder": "Çözümlenen metin burada görünecek...",
    "download": "Dosyayı indir",
    "invalid-base32": "Geçersiz Base32 metni",
    "read-failed": "Dosya okunamadı",
    "preview-truncated": "Önizleme kısaltıldı"
  },
  "nl": {
    "input-title": "Base32-invoer",
    "input-placeholder": "Voer Base32-tekst in...",
    "output-title": "Gedecodeerde uitvoer",
    "output-placeholder": "Gedecodeerde tekst verschijnt hier...",
    "download": "Bestand downloaden",
    "invalid-base32": "Ongeldige Base32-tekst",
    "read-failed": "Bestand kon niet worden gelezen",
    "preview-truncated": "Voorbeeld ingekort"
  },
  "sv": {
    "input-title": "Base32-inmatning",
    "input-placeholder": "Ange Base32-text...",
    "output-title": "Avkodad utdata",
    "output-placeholder": "Avkodad text visas här...",
    "download": "Ladda ner fil",
    "invalid-base32": "Ogiltig Base32-text",
    "read-failed": "Kunde inte läsa filen",
    "preview-truncated": "Förhandsvisning avkortad"
  },
  "pl": {
    "input-title": "Wejście Base32",
    "input-placeholder": "Wprowadź tekst Base32...",
    "output-title": "Zdekodowane dane",
    "output-placeholder": "Zdekodowany tekst pojawi się tutaj...",
    "download": "Pobierz plik",
    "invalid-base32": "Nieprawidłowy tekst Base32",
    "read-failed": "Nie udało się odczytać pliku",
    "preview-truncated": "Podgląd skrócony"
  },
  "vi": {
    "input-title": "Đầu vào Base32",
    "input-placeholder": "Nhập văn bản Base32...",
    "output-title": "Đầu ra đã giải mã",
    "output-placeholder": "Văn bản đã giải mã sẽ xuất hiện ở đây...",
    "download": "Tải tệp",
    "invalid-base32": "Văn bản Base32 không hợp lệ",
    "read-failed": "Không thể đọc tệp",
    "preview-truncated": "Bản xem trước bị cắt"
  },
  "th": {
    "input-title": "อินพุต Base32",
    "input-placeholder": "ป้อนข้อความ Base32...",
    "output-title": "ผลลัพธ์ที่ถอดรหัส",
    "output-placeholder": "ข้อความที่ถอดรหัสจะปรากฏที่นี่...",
    "download": "ดาวน์โหลดไฟล์",
    "invalid-base32": "ข้อความ Base32 ไม่ถูกต้อง",
    "read-failed": "อ่านไฟล์ไม่สำเร็จ",
    "preview-truncated": "ตัวอย่างถูกตัดทอน"
  },
  "id": {
    "input-title": "Input Base32",
    "input-placeholder": "Masukkan teks Base32...",
    "output-title": "Output terdekode",
    "output-placeholder": "Teks yang didekodekan akan muncul di sini...",
    "download": "Unduh file",
    "invalid-base32": "Teks Base32 tidak valid",
    "read-failed": "Gagal membaca file",
    "preview-truncated": "Pratinjau dipotong"
  },
  "he": {
    "input-title": "קלט Base32",
    "input-placeholder": "הזן טקסט Base32...",
    "output-title": "פלט מפוענח",
    "output-placeholder": "הטקסט המפוענח יוצג כאן...",
    "download": "הורד קובץ",
    "invalid-base32": "טקסט Base32 לא תקין",
    "read-failed": "קריאת הקובץ נכשלה",
    "preview-truncated": "התצוגה המקדימה קוצרה"
  },
  "ms": {
    "input-title": "Input Base32",
    "input-placeholder": "Masukkan teks Base32...",
    "output-title": "Output dinyahkod",
    "output-placeholder": "Teks yang dinyahkod akan dipaparkan di sini...",
    "download": "Muat turun fail",
    "invalid-base32": "Teks Base32 tidak sah",
    "read-failed": "Gagal membaca fail",
    "preview-truncated": "Pratonton dipendekkan"
  },
  "no": {
    "input-title": "Base32-inndata",
    "input-placeholder": "Skriv inn Base32-tekst...",
    "output-title": "Dekodet output",
    "output-placeholder": "Dekodet tekst vises her...",
    "download": "Last ned fil",
    "invalid-base32": "Ugyldig Base32-tekst",
    "read-failed": "Kunne ikke lese filen",
    "preview-truncated": "Forhåndsvisning avkortet"
  }
}
</i18n>
