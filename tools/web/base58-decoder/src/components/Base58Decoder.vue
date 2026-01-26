<template>
  <div>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('alphabet')" label-placement="left">
        <n-select v-model:value="alphabetKey" :options="alphabetOptions" style="width: 220px" />
      </n-form-item>
    </ToolSection>

    <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
    <ToolSection>
      <TextOrFileInput
        v-model:value="textOrFile"
        :placeholder="t('input-placeholder')"
        accept="text/*,.txt,.log,.md,.json,.csv,.yaml,.yml,.b58,.base58"
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
      <n-text v-show="isTruncated" depth="3" class="preview-note">{{
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
        <n-text v-show="error" type="error">{{ error }}</n-text>
      </n-flex>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NFormItem, NIcon, NInput, NSelect, NText } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { CopyToClipboardButton, TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { BASE58_ALPHABETS, type Base58AlphabetKey, decodeBase58 } from '@utils/base58'

const { t } = useI18n()

const storedText = useStorage('tools:base58-decoder:text', 'StV1DL6CwTryKyV')
const alphabetKey = useStorage<Base58AlphabetKey>('tools:base58-decoder:alphabet', 'bitcoin')
const alphabetOptions = computed(() => [
  { label: t('alphabet-bitcoin'), value: 'bitcoin' as Base58AlphabetKey },
  { label: t('alphabet-flickr'), value: 'flickr' as Base58AlphabetKey },
  { label: t('alphabet-ripple'), value: 'ripple' as Base58AlphabetKey },
])
const alphabet = computed(() => BASE58_ALPHABETS[alphabetKey.value])
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
  [textOrFile, alphabetKey],
  async ([value]) => {
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
      const bytes = decodeBase58(content, { alphabet: alphabet.value })
      decodedBytes.value = bytes
      decodedText.value = new TextDecoder().decode(bytes)
    } catch {
      decodedBytes.value = null
      decodedText.value = ''
      error.value = t('invalid-base58')
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
    "input-title": "Base58 Input",
    "input-placeholder": "Enter Base58 text...",
    "output-title": "Decoded Output",
    "output-placeholder": "Decoded text will appear here...",
    "download": "Download file",
    "invalid-base58": "Invalid Base58 text",
    "read-failed": "Failed to read file",
    "preview-truncated": "Preview truncated",
    "options": "Options",
    "alphabet": "Alphabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "zh": {
    "input-title": "Base58 输入",
    "input-placeholder": "输入 Base58 文本...",
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "invalid-base58": "无效的 Base58 文本",
    "read-failed": "读取文件失败",
    "preview-truncated": "预览已截断",
    "options": "选项",
    "alphabet": "字母表",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "zh-CN": {
    "input-title": "Base58 输入",
    "input-placeholder": "输入 Base58 文本...",
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "invalid-base58": "无效的 Base58 文本",
    "read-failed": "读取文件失败",
    "preview-truncated": "预览已截断",
    "options": "选项",
    "alphabet": "字母表",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "zh-TW": {
    "input-title": "Base58 輸入",
    "input-placeholder": "輸入 Base58 文字...",
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "invalid-base58": "無效的 Base58 文字",
    "read-failed": "讀取檔案失敗",
    "preview-truncated": "預覽已截斷",
    "options": "選項",
    "alphabet": "字母表",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "zh-HK": {
    "input-title": "Base58 輸入",
    "input-placeholder": "輸入 Base58 文字...",
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "invalid-base58": "無效的 Base58 文字",
    "read-failed": "讀取檔案失敗",
    "preview-truncated": "預覽已截斷",
    "options": "選項",
    "alphabet": "字母表",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "es": {
    "input-title": "Entrada Base58",
    "input-placeholder": "Introduce texto Base58...",
    "output-title": "Salida Decodificada",
    "output-placeholder": "El texto decodificado aparecerá aquí...",
    "download": "Descargar archivo",
    "invalid-base58": "Texto Base58 inválido",
    "read-failed": "No se pudo leer el archivo",
    "preview-truncated": "Vista previa truncada",
    "options": "Opciones",
    "alphabet": "Alfabeto",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "fr": {
    "input-title": "Entrée Base58",
    "input-placeholder": "Entrez le texte Base58...",
    "output-title": "Sortie décodée",
    "output-placeholder": "Le texte décodé apparaîtra ici...",
    "download": "Télécharger le fichier",
    "invalid-base58": "Texte Base58 invalide",
    "read-failed": "Échec de la lecture du fichier",
    "preview-truncated": "Aperçu tronqué",
    "options": "Options",
    "alphabet": "Alphabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "de": {
    "input-title": "Base58-Eingabe",
    "input-placeholder": "Base58-Text eingeben...",
    "output-title": "Dekodierte Ausgabe",
    "output-placeholder": "Der decodierte Text erscheint hier...",
    "download": "Datei herunterladen",
    "invalid-base58": "Ungültiger Base58-Text",
    "read-failed": "Datei konnte nicht gelesen werden",
    "preview-truncated": "Vorschau gekürzt",
    "options": "Optionen",
    "alphabet": "Alphabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "it": {
    "input-title": "Input Base58",
    "input-placeholder": "Inserisci testo Base58...",
    "output-title": "Output decodificato",
    "output-placeholder": "Il testo decodificato apparirà qui...",
    "download": "Scarica file",
    "invalid-base58": "Testo Base58 non valido",
    "read-failed": "Impossibile leggere il file",
    "preview-truncated": "Anteprima troncata",
    "options": "Opzioni",
    "alphabet": "Alfabeto",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ja": {
    "input-title": "Base58 入力",
    "input-placeholder": "Base58テキストを入力...",
    "output-title": "デコード結果",
    "output-placeholder": "デコードされたテキストがここに表示されます...",
    "download": "ファイルをダウンロード",
    "invalid-base58": "無効なBase58テキスト",
    "read-failed": "ファイルの読み取りに失敗しました",
    "preview-truncated": "プレビューは切り詰められました",
    "options": "オプション",
    "alphabet": "アルファベット",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ko": {
    "input-title": "Base58 입력",
    "input-placeholder": "Base58 텍스트 입력...",
    "output-title": "디코딩된 출력",
    "output-placeholder": "디코딩된 텍스트가 여기에 표시됩니다...",
    "download": "파일 다운로드",
    "invalid-base58": "유효하지 않은 Base58 텍스트",
    "read-failed": "파일 읽기에 실패했습니다",
    "preview-truncated": "미리보기 잘림",
    "options": "옵션",
    "alphabet": "알파벳",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ru": {
    "input-title": "Ввод Base58",
    "input-placeholder": "Введите текст Base58...",
    "output-title": "Декодированный вывод",
    "output-placeholder": "Декодированный текст появится здесь...",
    "download": "Скачать файл",
    "invalid-base58": "Неверный текст Base58",
    "read-failed": "Не удалось прочитать файл",
    "preview-truncated": "Предпросмотр обрезан",
    "options": "Параметры",
    "alphabet": "Алфавит",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "pt": {
    "input-title": "Entrada Base58",
    "input-placeholder": "Digite texto Base58...",
    "output-title": "Saída decodificada",
    "output-placeholder": "O texto decodificado aparecerá aqui...",
    "download": "Baixar arquivo",
    "invalid-base58": "Texto Base58 inválido",
    "read-failed": "Falha ao ler o arquivo",
    "preview-truncated": "Pré-visualização truncada",
    "options": "Opções",
    "alphabet": "Alfabeto",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ar": {
    "input-title": "إدخال Base58",
    "input-placeholder": "أدخل نص Base58...",
    "output-title": "المخرجات المفككة",
    "output-placeholder": "سيظهر النص المفكك هنا...",
    "download": "تنزيل الملف",
    "invalid-base58": "نص Base58 غير صالح",
    "read-failed": "فشل في قراءة الملف",
    "preview-truncated": "تم اقتطاع المعاينة",
    "options": "الخيارات",
    "alphabet": "الأبجدية",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "hi": {
    "input-title": "Base58 इनपुट",
    "input-placeholder": "Base58 पाठ दर्ज करें...",
    "output-title": "डिकोडेड आउटपुट",
    "output-placeholder": "डिकोड किया गया पाठ यहां दिखाई देगा...",
    "download": "फ़ाइल डाउनलोड करें",
    "invalid-base58": "अमान्य Base58 पाठ",
    "read-failed": "फ़ाइल पढ़ने में विफल",
    "preview-truncated": "प्रीव्यू संक्षिप्त किया गया",
    "options": "विकल्प",
    "alphabet": "वर्णमाला",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "tr": {
    "input-title": "Base58 Girişi",
    "input-placeholder": "Base58 metni girin...",
    "output-title": "Çözümlenen Çıktı",
    "output-placeholder": "Çözümlenen metin burada görünecek...",
    "download": "Dosyayı indir",
    "invalid-base58": "Geçersiz Base58 metni",
    "read-failed": "Dosya okunamadı",
    "preview-truncated": "Önizleme kısaltıldı",
    "options": "Seçenekler",
    "alphabet": "Alfabe",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "nl": {
    "input-title": "Base58-invoer",
    "input-placeholder": "Voer Base58-tekst in...",
    "output-title": "Gedecodeerde uitvoer",
    "output-placeholder": "Gedecodeerde tekst verschijnt hier...",
    "download": "Bestand downloaden",
    "invalid-base58": "Ongeldige Base58-tekst",
    "read-failed": "Bestand kon niet worden gelezen",
    "preview-truncated": "Voorbeeld ingekort",
    "options": "Opties",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "sv": {
    "input-title": "Base58-inmatning",
    "input-placeholder": "Ange Base58-text...",
    "output-title": "Avkodad utdata",
    "output-placeholder": "Avkodad text visas här...",
    "download": "Ladda ner fil",
    "invalid-base58": "Ogiltig Base58-text",
    "read-failed": "Kunde inte läsa filen",
    "preview-truncated": "Förhandsvisning avkortad",
    "options": "Alternativ",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "pl": {
    "input-title": "Wejście Base58",
    "input-placeholder": "Wprowadź tekst Base58...",
    "output-title": "Zdekodowane dane",
    "output-placeholder": "Zdekodowany tekst pojawi się tutaj...",
    "download": "Pobierz plik",
    "invalid-base58": "Nieprawidłowy tekst Base58",
    "read-failed": "Nie udało się odczytać pliku",
    "preview-truncated": "Podgląd skrócony",
    "options": "Opcje",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "vi": {
    "input-title": "Đầu vào Base58",
    "input-placeholder": "Nhập văn bản Base58...",
    "output-title": "Đầu ra đã giải mã",
    "output-placeholder": "Văn bản đã giải mã sẽ xuất hiện ở đây...",
    "download": "Tải tệp",
    "invalid-base58": "Văn bản Base58 không hợp lệ",
    "read-failed": "Không thể đọc tệp",
    "preview-truncated": "Bản xem trước bị cắt",
    "options": "Tùy chọn",
    "alphabet": "Bảng chữ cái",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "th": {
    "input-title": "อินพุต Base58",
    "input-placeholder": "ป้อนข้อความ Base58...",
    "output-title": "ผลลัพธ์ที่ถอดรหัส",
    "output-placeholder": "ข้อความที่ถอดรหัสจะปรากฏที่นี่...",
    "download": "ดาวน์โหลดไฟล์",
    "invalid-base58": "ข้อความ Base58 ไม่ถูกต้อง",
    "read-failed": "อ่านไฟล์ไม่สำเร็จ",
    "preview-truncated": "ตัวอย่างถูกตัดทอน",
    "options": "ตัวเลือก",
    "alphabet": "อักษร",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "id": {
    "input-title": "Input Base58",
    "input-placeholder": "Masukkan teks Base58...",
    "output-title": "Output terdekode",
    "output-placeholder": "Teks yang didekodekan akan muncul di sini...",
    "download": "Unduh file",
    "invalid-base58": "Teks Base58 tidak valid",
    "read-failed": "Gagal membaca file",
    "preview-truncated": "Pratinjau dipotong",
    "options": "Opsi",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "he": {
    "input-title": "קלט Base58",
    "input-placeholder": "הזן טקסט Base58...",
    "output-title": "פלט מפוענח",
    "output-placeholder": "הטקסט המפוענח יוצג כאן...",
    "download": "הורד קובץ",
    "invalid-base58": "טקסט Base58 לא תקין",
    "read-failed": "קריאת הקובץ נכשלה",
    "preview-truncated": "התצוגה המקדימה קוצרה",
    "options": "אפשרויות",
    "alphabet": "אלפבית",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ms": {
    "input-title": "Input Base58",
    "input-placeholder": "Masukkan teks Base58...",
    "output-title": "Output dinyahkod",
    "output-placeholder": "Teks yang dinyahkod akan dipaparkan di sini...",
    "download": "Muat turun fail",
    "invalid-base58": "Teks Base58 tidak sah",
    "read-failed": "Gagal membaca fail",
    "preview-truncated": "Pratonton dipendekkan",
    "options": "Pilihan",
    "alphabet": "Abjad",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "no": {
    "input-title": "Base58-inndata",
    "input-placeholder": "Skriv inn Base58-tekst...",
    "output-title": "Dekodet output",
    "output-placeholder": "Dekodet tekst vises her...",
    "download": "Last ned fil",
    "invalid-base58": "Ugyldig Base58-tekst",
    "read-failed": "Kunne ikke lese filen",
    "preview-truncated": "Forhåndsvisning avkortet",
    "options": "Alternativer",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  }
}
</i18n>
