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
        accept="text/*,.txt,.log,.md,.json,.csv,.yaml,.yml,.b85,.a85,.ascii85,.z85"
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
import { type Base85Variant, decodeBase85 } from '@utils/base85'

const { t } = useI18n()

const storedText = useStorage('tools:base85-decoder:text', 'BOu!rD]j7BEbo7')
const alphabetKey = useStorage<Base85Variant>('tools:base85-decoder:alphabet', 'ascii85')
const alphabetOptions = computed(() => [
  { label: t('alphabet-ascii85'), value: 'ascii85' as Base85Variant },
  { label: t('alphabet-z85'), value: 'z85' as Base85Variant },
])
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
  async ([value, variant]) => {
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
      const bytes = decodeBase85(content, { variant })
      decodedBytes.value = bytes
      decodedText.value = new TextDecoder().decode(bytes)
    } catch {
      decodedBytes.value = null
      decodedText.value = ''
      error.value = t('invalid-base85')
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
    "input-title": "Base85 Input",
    "input-placeholder": "Enter Base85 text...",
    "output-title": "Decoded Output",
    "output-placeholder": "Decoded text will appear here...",
    "download": "Download file",
    "invalid-base85": "Invalid Base85 text",
    "read-failed": "Failed to read file",
    "preview-truncated": "Preview truncated",
    "options": "Options",
    "alphabet": "Alphabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "zh": {
    "input-title": "Base85 输入",
    "input-placeholder": "输入 Base85 文本...",
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "invalid-base85": "无效的 Base85 文本",
    "read-failed": "读取文件失败",
    "preview-truncated": "预览已截断",
    "options": "选项",
    "alphabet": "字母表",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "zh-CN": {
    "input-title": "Base85 输入",
    "input-placeholder": "输入 Base85 文本...",
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "invalid-base85": "无效的 Base85 文本",
    "read-failed": "读取文件失败",
    "preview-truncated": "预览已截断",
    "options": "选项",
    "alphabet": "字母表",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "zh-TW": {
    "input-title": "Base85 輸入",
    "input-placeholder": "輸入 Base85 文字...",
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "invalid-base85": "無效的 Base85 文字",
    "read-failed": "讀取檔案失敗",
    "preview-truncated": "預覽已截斷",
    "options": "選項",
    "alphabet": "字母表",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "zh-HK": {
    "input-title": "Base85 輸入",
    "input-placeholder": "輸入 Base85 文字...",
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "invalid-base85": "無效的 Base85 文字",
    "read-failed": "讀取檔案失敗",
    "preview-truncated": "預覽已截斷",
    "options": "選項",
    "alphabet": "字母表",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "es": {
    "input-title": "Entrada Base85",
    "input-placeholder": "Introduce texto Base85...",
    "output-title": "Salida Decodificada",
    "output-placeholder": "El texto decodificado aparecerá aquí...",
    "download": "Descargar archivo",
    "invalid-base85": "Texto Base85 inválido",
    "read-failed": "No se pudo leer el archivo",
    "preview-truncated": "Vista previa truncada",
    "options": "Opciones",
    "alphabet": "Alfabeto",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "fr": {
    "input-title": "Entrée Base85",
    "input-placeholder": "Entrez le texte Base85...",
    "output-title": "Sortie décodée",
    "output-placeholder": "Le texte décodé apparaîtra ici...",
    "download": "Télécharger le fichier",
    "invalid-base85": "Texte Base85 invalide",
    "read-failed": "Échec de la lecture du fichier",
    "preview-truncated": "Aperçu tronqué",
    "options": "Options",
    "alphabet": "Alphabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "de": {
    "input-title": "Base85-Eingabe",
    "input-placeholder": "Base85-Text eingeben...",
    "output-title": "Dekodierte Ausgabe",
    "output-placeholder": "Der decodierte Text erscheint hier...",
    "download": "Datei herunterladen",
    "invalid-base85": "Ungültiger Base85-Text",
    "read-failed": "Datei konnte nicht gelesen werden",
    "preview-truncated": "Vorschau gekürzt",
    "options": "Optionen",
    "alphabet": "Alphabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "it": {
    "input-title": "Input Base85",
    "input-placeholder": "Inserisci testo Base85...",
    "output-title": "Output decodificato",
    "output-placeholder": "Il testo decodificato apparirà qui...",
    "download": "Scarica file",
    "invalid-base85": "Testo Base85 non valido",
    "read-failed": "Impossibile leggere il file",
    "preview-truncated": "Anteprima troncata",
    "options": "Opzioni",
    "alphabet": "Alfabeto",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "ja": {
    "input-title": "Base85 入力",
    "input-placeholder": "Base85テキストを入力...",
    "output-title": "デコード結果",
    "output-placeholder": "デコードされたテキストがここに表示されます...",
    "download": "ファイルをダウンロード",
    "invalid-base85": "無効なBase85テキスト",
    "read-failed": "ファイルの読み取りに失敗しました",
    "preview-truncated": "プレビューは切り詰められました",
    "options": "オプション",
    "alphabet": "アルファベット",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "ko": {
    "input-title": "Base85 입력",
    "input-placeholder": "Base85 텍스트 입력...",
    "output-title": "디코딩된 출력",
    "output-placeholder": "디코딩된 텍스트가 여기에 표시됩니다...",
    "download": "파일 다운로드",
    "invalid-base85": "유효하지 않은 Base85 텍스트",
    "read-failed": "파일 읽기에 실패했습니다",
    "preview-truncated": "미리보기 잘림",
    "options": "옵션",
    "alphabet": "알파벳",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "ru": {
    "input-title": "Ввод Base85",
    "input-placeholder": "Введите текст Base85...",
    "output-title": "Декодированный вывод",
    "output-placeholder": "Декодированный текст появится здесь...",
    "download": "Скачать файл",
    "invalid-base85": "Неверный текст Base85",
    "read-failed": "Не удалось прочитать файл",
    "preview-truncated": "Предпросмотр обрезан",
    "options": "Параметры",
    "alphabet": "Алфавит",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "pt": {
    "input-title": "Entrada Base85",
    "input-placeholder": "Digite texto Base85...",
    "output-title": "Saída decodificada",
    "output-placeholder": "O texto decodificado aparecerá aqui...",
    "download": "Baixar arquivo",
    "invalid-base85": "Texto Base85 inválido",
    "read-failed": "Falha ao ler o arquivo",
    "preview-truncated": "Pré-visualização truncada",
    "options": "Opções",
    "alphabet": "Alfabeto",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "ar": {
    "input-title": "إدخال Base85",
    "input-placeholder": "أدخل نص Base85...",
    "output-title": "المخرجات المفككة",
    "output-placeholder": "سيظهر النص المفكك هنا...",
    "download": "تنزيل الملف",
    "invalid-base85": "نص Base85 غير صالح",
    "read-failed": "فشل في قراءة الملف",
    "preview-truncated": "تم اقتطاع المعاينة",
    "options": "الخيارات",
    "alphabet": "الأبجدية",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "hi": {
    "input-title": "Base85 इनपुट",
    "input-placeholder": "Base85 पाठ दर्ज करें...",
    "output-title": "डिकोडेड आउटपुट",
    "output-placeholder": "डिकोड किया गया पाठ यहां दिखाई देगा...",
    "download": "फ़ाइल डाउनलोड करें",
    "invalid-base85": "अमान्य Base85 पाठ",
    "read-failed": "फ़ाइल पढ़ने में विफल",
    "preview-truncated": "प्रीव्यू संक्षिप्त किया गया",
    "options": "विकल्प",
    "alphabet": "वर्णमाला",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "tr": {
    "input-title": "Base85 Girişi",
    "input-placeholder": "Base85 metni girin...",
    "output-title": "Çözümlenen Çıktı",
    "output-placeholder": "Çözümlenen metin burada görünecek...",
    "download": "Dosyayı indir",
    "invalid-base85": "Geçersiz Base85 metni",
    "read-failed": "Dosya okunamadı",
    "preview-truncated": "Önizleme kısaltıldı",
    "options": "Seçenekler",
    "alphabet": "Alfabe",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "nl": {
    "input-title": "Base85-invoer",
    "input-placeholder": "Voer Base85-tekst in...",
    "output-title": "Gedecodeerde uitvoer",
    "output-placeholder": "Gedecodeerde tekst verschijnt hier...",
    "download": "Bestand downloaden",
    "invalid-base85": "Ongeldige Base85-tekst",
    "read-failed": "Bestand kon niet worden gelezen",
    "preview-truncated": "Voorbeeld ingekort",
    "options": "Opties",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "sv": {
    "input-title": "Base85-inmatning",
    "input-placeholder": "Ange Base85-text...",
    "output-title": "Avkodad utdata",
    "output-placeholder": "Avkodad text visas här...",
    "download": "Ladda ner fil",
    "invalid-base85": "Ogiltig Base85-text",
    "read-failed": "Kunde inte läsa filen",
    "preview-truncated": "Förhandsvisning avkortad",
    "options": "Alternativ",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "pl": {
    "input-title": "Wejście Base85",
    "input-placeholder": "Wprowadź tekst Base85...",
    "output-title": "Zdekodowane dane",
    "output-placeholder": "Zdekodowany tekst pojawi się tutaj...",
    "download": "Pobierz plik",
    "invalid-base85": "Nieprawidłowy tekst Base85",
    "read-failed": "Nie udało się odczytać pliku",
    "preview-truncated": "Podgląd skrócony",
    "options": "Opcje",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "vi": {
    "input-title": "Đầu vào Base85",
    "input-placeholder": "Nhập văn bản Base85...",
    "output-title": "Đầu ra đã giải mã",
    "output-placeholder": "Văn bản đã giải mã sẽ xuất hiện ở đây...",
    "download": "Tải tệp",
    "invalid-base85": "Văn bản Base85 không hợp lệ",
    "read-failed": "Không thể đọc tệp",
    "preview-truncated": "Bản xem trước bị cắt",
    "options": "Tùy chọn",
    "alphabet": "Bảng chữ cái",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "th": {
    "input-title": "อินพุต Base85",
    "input-placeholder": "ป้อนข้อความ Base85...",
    "output-title": "ผลลัพธ์ที่ถอดรหัส",
    "output-placeholder": "ข้อความที่ถอดรหัสจะปรากฏที่นี่...",
    "download": "ดาวน์โหลดไฟล์",
    "invalid-base85": "ข้อความ Base85 ไม่ถูกต้อง",
    "read-failed": "อ่านไฟล์ไม่สำเร็จ",
    "preview-truncated": "ตัวอย่างถูกตัดทอน",
    "options": "ตัวเลือก",
    "alphabet": "อักษร",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "id": {
    "input-title": "Input Base85",
    "input-placeholder": "Masukkan teks Base85...",
    "output-title": "Output terdekode",
    "output-placeholder": "Teks yang didekodekan akan muncul di sini...",
    "download": "Unduh file",
    "invalid-base85": "Teks Base85 tidak valid",
    "read-failed": "Gagal membaca file",
    "preview-truncated": "Pratinjau dipotong",
    "options": "Opsi",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "he": {
    "input-title": "קלט Base85",
    "input-placeholder": "הזן טקסט Base85...",
    "output-title": "פלט מפוענח",
    "output-placeholder": "הטקסט המפוענח יוצג כאן...",
    "download": "הורד קובץ",
    "invalid-base85": "טקסט Base85 לא תקין",
    "read-failed": "קריאת הקובץ נכשלה",
    "preview-truncated": "התצוגה המקדימה קוצרה",
    "options": "אפשרויות",
    "alphabet": "אלפבית",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "ms": {
    "input-title": "Input Base85",
    "input-placeholder": "Masukkan teks Base85...",
    "output-title": "Output dinyahkod",
    "output-placeholder": "Teks yang dinyahkod akan dipaparkan di sini...",
    "download": "Muat turun fail",
    "invalid-base85": "Teks Base85 tidak sah",
    "read-failed": "Gagal membaca fail",
    "preview-truncated": "Pratonton dipendekkan",
    "options": "Pilihan",
    "alphabet": "Abjad",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  },
  "no": {
    "input-title": "Base85-inndata",
    "input-placeholder": "Skriv inn Base85-tekst...",
    "output-title": "Dekodet output",
    "output-placeholder": "Dekodet tekst vises her...",
    "download": "Last ned fil",
    "invalid-base85": "Ugyldig Base85-tekst",
    "read-failed": "Kunne ikke lese filen",
    "preview-truncated": "Forhåndsvisning avkortet",
    "options": "Alternativer",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85"
  }
}
</i18n>
