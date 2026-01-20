<template>
  <div>
    <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
    <ToolSection>
      <TextOrFileInput
        v-model:value="textOrFile"
        :placeholder="t('input-placeholder')"
        accept="text/*,.txt,.log,.md,.json,.csv,.yaml,.yml,.hex,.base16"
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
import { decodeBase16 } from '@utils/base16'

const { t } = useI18n()

const storedText = useStorage('tools:base16-decoder:text', '')
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
      const bytes = decodeBase16(content)
      decodedBytes.value = bytes
      decodedText.value = new TextDecoder().decode(bytes)
    } catch {
      decodedBytes.value = null
      decodedText.value = ''
      error.value = t('invalid-base16')
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
    "input-title": "Hex Input",
    "input-placeholder": "Enter Hex text...",
    "output-title": "Decoded Output",
    "output-placeholder": "Decoded text will appear here...",
    "download": "Download file",
    "invalid-base16": "Invalid Hex text",
    "read-failed": "Failed to read file",
    "preview-truncated": "Preview truncated"
  },
  "zh": {
    "input-title": "Hex 输入",
    "input-placeholder": "输入 Hex 文本...",
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "invalid-base16": "无效的 Hex 文本",
    "read-failed": "读取文件失败",
    "preview-truncated": "预览已截断"
  },
  "zh-CN": {
    "input-title": "Hex 输入",
    "input-placeholder": "输入 Hex 文本...",
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "invalid-base16": "无效的 Hex 文本",
    "read-failed": "读取文件失败",
    "preview-truncated": "预览已截断"
  },
  "zh-TW": {
    "input-title": "Hex 輸入",
    "input-placeholder": "輸入 Hex 文字...",
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "invalid-base16": "無效的 Hex 文字",
    "read-failed": "讀取檔案失敗",
    "preview-truncated": "預覽已截斷"
  },
  "zh-HK": {
    "input-title": "Hex 輸入",
    "input-placeholder": "輸入 Hex 文字...",
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "invalid-base16": "無效的 Hex 文字",
    "read-failed": "讀取檔案失敗",
    "preview-truncated": "預覽已截斷"
  },
  "es": {
    "input-title": "Entrada Hex",
    "input-placeholder": "Introduce texto Hex...",
    "output-title": "Salida decodificada",
    "output-placeholder": "El texto decodificado aparecerá aquí...",
    "download": "Descargar archivo",
    "invalid-base16": "Texto Hex inválido",
    "read-failed": "No se pudo leer el archivo",
    "preview-truncated": "Vista previa truncada"
  },
  "fr": {
    "input-title": "Entrée Hex",
    "input-placeholder": "Entrez le texte Hex...",
    "output-title": "Sortie décodée",
    "output-placeholder": "Le texte décodé apparaîtra ici...",
    "download": "Télécharger le fichier",
    "invalid-base16": "Texte Hex invalide",
    "read-failed": "Échec de la lecture du fichier",
    "preview-truncated": "Aperçu tronqué"
  },
  "de": {
    "input-title": "Hex-Eingabe",
    "input-placeholder": "Hex-Text eingeben...",
    "output-title": "Dekodierte Ausgabe",
    "output-placeholder": "Dekodierter Text erscheint hier...",
    "download": "Datei herunterladen",
    "invalid-base16": "Ungültiger Hex-Text",
    "read-failed": "Datei konnte nicht gelesen werden",
    "preview-truncated": "Vorschau abgeschnitten"
  },
  "it": {
    "input-title": "Input Hex",
    "input-placeholder": "Inserisci testo Hex...",
    "output-title": "Output decodificato",
    "output-placeholder": "Il testo decodificato apparirà qui...",
    "download": "Scarica file",
    "invalid-base16": "Testo Hex non valido",
    "read-failed": "Impossibile leggere il file",
    "preview-truncated": "Anteprima troncata"
  },
  "ja": {
    "input-title": "Hex 入力",
    "input-placeholder": "Hex テキストを入力...",
    "output-title": "デコード結果",
    "output-placeholder": "デコードされたテキストがここに表示されます...",
    "download": "ファイルをダウンロード",
    "invalid-base16": "無効な Hex テキスト",
    "read-failed": "ファイルの読み取りに失敗しました",
    "preview-truncated": "プレビューは切り詰められました"
  },
  "ko": {
    "input-title": "Hex 입력",
    "input-placeholder": "Hex 텍스트 입력...",
    "output-title": "디코딩 결과",
    "output-placeholder": "디코딩된 텍스트가 여기에 표시됩니다...",
    "download": "파일 다운로드",
    "invalid-base16": "유효하지 않은 Hex 텍스트",
    "read-failed": "파일을 읽지 못했습니다",
    "preview-truncated": "미리보기가 잘렸습니다"
  },
  "ru": {
    "input-title": "Ввод Hex",
    "input-placeholder": "Введите Hex текст...",
    "output-title": "Декодированный результат",
    "output-placeholder": "Декодированный текст появится здесь...",
    "download": "Скачать файл",
    "invalid-base16": "Неверный Hex текст",
    "read-failed": "Не удалось прочитать файл",
    "preview-truncated": "Предпросмотр усечен"
  },
  "pt": {
    "input-title": "Entrada Hex",
    "input-placeholder": "Digite texto Hex...",
    "output-title": "Saída decodificada",
    "output-placeholder": "O texto decodificado aparecerá aqui...",
    "download": "Baixar arquivo",
    "invalid-base16": "Texto Hex inválido",
    "read-failed": "Falha ao ler o arquivo",
    "preview-truncated": "Pré-visualização truncada"
  },
  "ar": {
    "input-title": "إدخال Hex",
    "input-placeholder": "أدخل نص Hex...",
    "output-title": "المخرجات المفككة",
    "output-placeholder": "سيظهر النص المفكك هنا...",
    "download": "تنزيل الملف",
    "invalid-base16": "نص Hex غير صالح",
    "read-failed": "فشل في قراءة الملف",
    "preview-truncated": "تم اقتطاع المعاينة"
  },
  "hi": {
    "input-title": "Hex इनपुट",
    "input-placeholder": "Hex पाठ दर्ज करें...",
    "output-title": "डिकोड किया गया आउटपुट",
    "output-placeholder": "डिकोड किया गया टेक्स्ट यहां दिखाई देगा...",
    "download": "फ़ाइल डाउनलोड करें",
    "invalid-base16": "अमान्य Hex पाठ",
    "read-failed": "फ़ाइल पढ़ने में विफल",
    "preview-truncated": "पूर्वावलोकन छोटा किया गया"
  },
  "tr": {
    "input-title": "Hex Girişi",
    "input-placeholder": "Hex metni girin...",
    "output-title": "Çözülen çıktı",
    "output-placeholder": "Çözülen metin burada görünecek...",
    "download": "Dosyayı indir",
    "invalid-base16": "Geçersiz Hex metni",
    "read-failed": "Dosya okunamadı",
    "preview-truncated": "Önizleme kırpıldı"
  },
  "nl": {
    "input-title": "Hex-invoer",
    "input-placeholder": "Voer Hex-tekst in...",
    "output-title": "Gedecodeerde output",
    "output-placeholder": "Gedecodeerde tekst verschijnt hier...",
    "download": "Bestand downloaden",
    "invalid-base16": "Ongeldige Hex-tekst",
    "read-failed": "Bestand kon niet worden gelezen",
    "preview-truncated": "Voorbeeld ingekort"
  },
  "sv": {
    "input-title": "Hex-indata",
    "input-placeholder": "Ange Hex-text...",
    "output-title": "Avkodad output",
    "output-placeholder": "Avkodad text visas här...",
    "download": "Ladda ner fil",
    "invalid-base16": "Ogiltig Hex-text",
    "read-failed": "Kunde inte läsa filen",
    "preview-truncated": "Förhandsvisning avkortad"
  },
  "pl": {
    "input-title": "Wejście Hex",
    "input-placeholder": "Wpisz tekst Hex...",
    "output-title": "Zdekodowane wyjście",
    "output-placeholder": "Zdekodowany tekst pojawi się tutaj...",
    "download": "Pobierz plik",
    "invalid-base16": "Nieprawidłowy tekst Hex",
    "read-failed": "Nie udało się odczytać pliku",
    "preview-truncated": "Podgląd został skrócony"
  },
  "vi": {
    "input-title": "Đầu vào Hex",
    "input-placeholder": "Nhập văn bản Hex...",
    "output-title": "Đầu ra đã giải mã",
    "output-placeholder": "Văn bản đã giải mã sẽ xuất hiện ở đây...",
    "download": "Tải tệp",
    "invalid-base16": "Văn bản Hex không hợp lệ",
    "read-failed": "Không thể đọc tệp",
    "preview-truncated": "Bản xem trước đã bị cắt"
  },
  "th": {
    "input-title": "อินพุต Hex",
    "input-placeholder": "ป้อนข้อความ Hex...",
    "output-title": "ผลลัพธ์ที่ถอดรหัส",
    "output-placeholder": "ข้อความที่ถอดรหัสจะแสดงที่นี่...",
    "download": "ดาวน์โหลดไฟล์",
    "invalid-base16": "ข้อความ Hex ไม่ถูกต้อง",
    "read-failed": "ไม่สามารถอ่านไฟล์ได้",
    "preview-truncated": "ตัวอย่างถูกตัดทอน"
  },
  "id": {
    "input-title": "Input Hex",
    "input-placeholder": "Masukkan teks Hex...",
    "output-title": "Output terurai",
    "output-placeholder": "Teks terurai akan muncul di sini...",
    "download": "Unduh file",
    "invalid-base16": "Teks Hex tidak valid",
    "read-failed": "Gagal membaca file",
    "preview-truncated": "Pratinjau dipotong"
  },
  "he": {
    "input-title": "קלט Hex",
    "input-placeholder": "הזן טקסט Hex...",
    "output-title": "פלט מפוענח",
    "output-placeholder": "הטקסט המפוענח יופיע כאן...",
    "download": "הורד קובץ",
    "invalid-base16": "טקסט Hex לא תקין",
    "read-failed": "קריאת הקובץ נכשלה",
    "preview-truncated": "התצוגה המקדימה קוצרה"
  },
  "ms": {
    "input-title": "Input Hex",
    "input-placeholder": "Masukkan teks Hex...",
    "output-title": "Output dinyahkod",
    "output-placeholder": "Teks dinyahkod akan muncul di sini...",
    "download": "Muat turun fail",
    "invalid-base16": "Teks Hex tidak sah",
    "read-failed": "Gagal membaca fail",
    "preview-truncated": "Pratonton dipendekkan"
  },
  "no": {
    "input-title": "Hex-inndata",
    "input-placeholder": "Skriv inn Hex-tekst...",
    "output-title": "Dekodet utdata",
    "output-placeholder": "Dekodet tekst vises her...",
    "download": "Last ned fil",
    "invalid-base16": "Ugyldig Hex-tekst",
    "read-failed": "Kunne ikke lese filen",
    "preview-truncated": "Forhåndsvisning avkortet"
  }
}
</i18n>
