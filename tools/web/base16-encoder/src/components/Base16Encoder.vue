<template>
  <div>
    <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
    <ToolSection>
      <TextOrFileInput
        v-model:value="textOrFile"
        :placeholder="t('input-placeholder')"
        accept="*/*"
      />
    </ToolSection>

    <ToolSectionHeader>{{ t('output-title') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        :value="encodedText"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 12 }"
        :placeholder="t('output-placeholder')"
        readonly
      />
    </ToolSection>
    <ToolSection>
      <n-flex align="center" justify="space-between">
        <n-flex align="center" :size="8">
          <CopyToClipboardButton :content="encodedText" />
          <n-button
            tag="a"
            text
            :href="downloadUrl ?? undefined"
            :download="downloadName"
            :disabled="!encodedText"
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
import { encodeBase16 } from '@utils/base16'

const { t } = useI18n()

const storedText = useStorage('tools:base16-encoder:text', '')
const textOrFile = ref<string | File>(storedText.value)
const encodedText = ref('')
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

    if (!value || (typeof value === 'string' && value.length === 0)) {
      encodedText.value = ''
      return
    }

    try {
      const bytes =
        typeof value === 'string'
          ? new TextEncoder().encode(value)
          : new Uint8Array(await value.arrayBuffer())

      if (currentId !== requestId) return
      encodedText.value = encodeBase16(bytes)
    } catch {
      if (currentId !== requestId) return
      encodedText.value = ''
      error.value = t('read-failed')
    }
  },
  { immediate: true },
)

const downloadBlob = computed(
  () => new Blob([encodedText.value], { type: 'text/plain;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

const downloadName = computed(() => {
  const input = textOrFile.value
  if (typeof input === 'string') return 'encoded.hex.txt'

  const fileName = input?.name ?? 'file'
  const baseName = fileName.replace(/\.[^/.]+$/, '')
  return `${baseName || 'file'}.hex`
})
</script>

<i18n lang="json">
{
  "en": {
    "input-title": "Input",
    "input-placeholder": "Enter text to encode...",
    "output-title": "Hex Encoded",
    "output-placeholder": "Hex output will appear here...",
    "download": "Download Hex",
    "read-failed": "Failed to read file"
  },
  "zh": {
    "input-title": "输入",
    "input-placeholder": "输入要编码的文本...",
    "output-title": "Hex 编码",
    "output-placeholder": "Hex 输出将显示在这里...",
    "download": "下载 Hex",
    "read-failed": "读取文件失败"
  },
  "zh-CN": {
    "input-title": "输入",
    "input-placeholder": "输入要编码的文本...",
    "output-title": "Hex 编码",
    "output-placeholder": "Hex 输出将显示在这里...",
    "download": "下载 Hex",
    "read-failed": "读取文件失败"
  },
  "zh-TW": {
    "input-title": "輸入",
    "input-placeholder": "輸入要編碼的文字...",
    "output-title": "Hex 編碼",
    "output-placeholder": "Hex 輸出會顯示在這裡...",
    "download": "下載 Hex",
    "read-failed": "讀取檔案失敗"
  },
  "zh-HK": {
    "input-title": "輸入",
    "input-placeholder": "輸入要編碼的文字...",
    "output-title": "Hex 編碼",
    "output-placeholder": "Hex 輸出會顯示在這裡...",
    "download": "下載 Hex",
    "read-failed": "讀取檔案失敗"
  },
  "es": {
    "input-title": "Entrada",
    "input-placeholder": "Introduce texto para codificar...",
    "output-title": "Codificado Hex",
    "output-placeholder": "La salida Hex aparecerá aquí...",
    "download": "Descargar Hex",
    "read-failed": "No se pudo leer el archivo"
  },
  "fr": {
    "input-title": "Entrée",
    "input-placeholder": "Entrez le texte à encoder...",
    "output-title": "Encodé Hex",
    "output-placeholder": "La sortie Hex apparaîtra ici...",
    "download": "Télécharger Hex",
    "read-failed": "Échec de la lecture du fichier"
  },
  "de": {
    "input-title": "Eingabe",
    "input-placeholder": "Text zum Kodieren eingeben...",
    "output-title": "Hex-kodiert",
    "output-placeholder": "Hex-Ausgabe erscheint hier...",
    "download": "Hex herunterladen",
    "read-failed": "Datei konnte nicht gelesen werden"
  },
  "it": {
    "input-title": "Input",
    "input-placeholder": "Inserisci testo da codificare...",
    "output-title": "Codificato Hex",
    "output-placeholder": "L'output Hex apparirà qui...",
    "download": "Scarica Hex",
    "read-failed": "Impossibile leggere il file"
  },
  "ja": {
    "input-title": "入力",
    "input-placeholder": "エンコードするテキストを入力...",
    "output-title": "Hexエンコード済み",
    "output-placeholder": "Hex 出力がここに表示されます...",
    "download": "Hex をダウンロード",
    "read-failed": "ファイルの読み取りに失敗しました"
  },
  "ko": {
    "input-title": "입력",
    "input-placeholder": "인코딩할 텍스트 입력...",
    "output-title": "Hex 인코딩됨",
    "output-placeholder": "Hex 출력이 여기에 표시됩니다...",
    "download": "Hex 다운로드",
    "read-failed": "파일을 읽지 못했습니다"
  },
  "ru": {
    "input-title": "Ввод",
    "input-placeholder": "Введите текст для кодирования...",
    "output-title": "Hex-кодировка",
    "output-placeholder": "Hex вывод появится здесь...",
    "download": "Скачать Hex",
    "read-failed": "Не удалось прочитать файл"
  },
  "pt": {
    "input-title": "Entrada",
    "input-placeholder": "Digite texto para codificar...",
    "output-title": "Codificado Hex",
    "output-placeholder": "A saída Hex aparecerá aqui...",
    "download": "Baixar Hex",
    "read-failed": "Falha ao ler o arquivo"
  },
  "ar": {
    "input-title": "الإدخال",
    "input-placeholder": "أدخل النص للترميز...",
    "output-title": "مُرمز Hex",
    "output-placeholder": "سيظهر إخراج Hex هنا...",
    "download": "تنزيل Hex",
    "read-failed": "فشل في قراءة الملف"
  },
  "hi": {
    "input-title": "इनपुट",
    "input-placeholder": "एन्कोड करने के लिए पाठ दर्ज करें...",
    "output-title": "Hex एन्कोडेड",
    "output-placeholder": "Hex आउटपुट यहां दिखाई देगा...",
    "download": "Hex डाउनलोड करें",
    "read-failed": "फ़ाइल पढ़ने में विफल"
  },
  "tr": {
    "input-title": "Girdi",
    "input-placeholder": "Kodlamak için metin girin...",
    "output-title": "Hex Kodlandı",
    "output-placeholder": "Hex çıktısı burada görünecek...",
    "download": "Hex indir",
    "read-failed": "Dosya okunamadı"
  },
  "nl": {
    "input-title": "Invoer",
    "input-placeholder": "Voer tekst in om te coderen...",
    "output-title": "Hex-gecodeerd",
    "output-placeholder": "Hex-uitvoer verschijnt hier...",
    "download": "Hex downloaden",
    "read-failed": "Bestand kon niet worden gelezen"
  },
  "sv": {
    "input-title": "Indata",
    "input-placeholder": "Ange text för kodning...",
    "output-title": "Hex-kodad",
    "output-placeholder": "Hex-utdata visas här...",
    "download": "Ladda ner Hex",
    "read-failed": "Kunde inte läsa filen"
  },
  "pl": {
    "input-title": "Wejście",
    "input-placeholder": "Wpisz tekst do zakodowania...",
    "output-title": "Zakodowany Hex",
    "output-placeholder": "Wyjście Hex pojawi się tutaj...",
    "download": "Pobierz Hex",
    "read-failed": "Nie udało się odczytać pliku"
  },
  "vi": {
    "input-title": "Đầu vào",
    "input-placeholder": "Nhập văn bản để mã hóa...",
    "output-title": "Đã mã hóa Hex",
    "output-placeholder": "Đầu ra Hex sẽ xuất hiện ở đây...",
    "download": "Tải Hex",
    "read-failed": "Không thể đọc tệp"
  },
  "th": {
    "input-title": "อินพุต",
    "input-placeholder": "ป้อนข้อความเพื่อเข้ารหัส...",
    "output-title": "เข้ารหัส Hex",
    "output-placeholder": "ผลลัพธ์ Hex จะแสดงที่นี่...",
    "download": "ดาวน์โหลด Hex",
    "read-failed": "ไม่สามารถอ่านไฟล์ได้"
  },
  "id": {
    "input-title": "Input",
    "input-placeholder": "Masukkan teks untuk dikodekan...",
    "output-title": "Terenkode Hex",
    "output-placeholder": "Output Hex akan muncul di sini...",
    "download": "Unduh Hex",
    "read-failed": "Gagal membaca file"
  },
  "he": {
    "input-title": "קלט",
    "input-placeholder": "הזן טקסט לקידוד...",
    "output-title": "מקודד Hex",
    "output-placeholder": "פלט Hex יופיע כאן...",
    "download": "הורד Hex",
    "read-failed": "קריאת הקובץ נכשלה"
  },
  "ms": {
    "input-title": "Input",
    "input-placeholder": "Masukkan teks untuk dikodkan...",
    "output-title": "Dikod Hex",
    "output-placeholder": "Output Hex akan muncul di sini...",
    "download": "Muat turun Hex",
    "read-failed": "Gagal membaca fail"
  },
  "no": {
    "input-title": "Inndata",
    "input-placeholder": "Skriv inn tekst for å kode...",
    "output-title": "Hex-kodet",
    "output-placeholder": "Hex-utdata vises her...",
    "download": "Last ned Hex",
    "read-failed": "Kunne ikke lese filen"
  }
}
</i18n>
