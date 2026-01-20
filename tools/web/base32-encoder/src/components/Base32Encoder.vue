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
import { encodeBase32 } from '@utils/base32'

const { t } = useI18n()

const storedText = useStorage('tools:base32-encoder:text', '')
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
      encodedText.value = encodeBase32(bytes)
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
  if (typeof input === 'string') return 'encoded.base32.txt'

  const fileName = input?.name ?? 'file'
  const baseName = fileName.replace(/\.[^/.]+$/, '')
  return `${baseName || 'file'}.b32`
})
</script>

<i18n lang="json">
{
  "en": {
    "input-title": "Input",
    "input-placeholder": "Enter text to encode...",
    "output-title": "Base32 Encoded",
    "output-placeholder": "Base32 output will appear here...",
    "download": "Download Base32",
    "read-failed": "Failed to read file"
  },
  "zh": {
    "input-title": "输入",
    "input-placeholder": "输入要编码的文本...",
    "output-title": "Base32 编码",
    "output-placeholder": "Base32 输出将显示在这里...",
    "download": "下载 Base32",
    "read-failed": "读取文件失败"
  },
  "zh-CN": {
    "input-title": "输入",
    "input-placeholder": "输入要编码的文本...",
    "output-title": "Base32 编码",
    "output-placeholder": "Base32 输出将显示在这里...",
    "download": "下载 Base32",
    "read-failed": "读取文件失败"
  },
  "zh-TW": {
    "input-title": "輸入",
    "input-placeholder": "輸入要編碼的文字...",
    "output-title": "Base32 編碼",
    "output-placeholder": "Base32 輸出會顯示在這裡...",
    "download": "下載 Base32",
    "read-failed": "讀取檔案失敗"
  },
  "zh-HK": {
    "input-title": "輸入",
    "input-placeholder": "輸入要編碼的文字...",
    "output-title": "Base32 編碼",
    "output-placeholder": "Base32 輸出會顯示在這裡...",
    "download": "下載 Base32",
    "read-failed": "讀取檔案失敗"
  },
  "es": {
    "input-title": "Entrada",
    "input-placeholder": "Introduce texto para codificar...",
    "output-title": "Codificado Base32",
    "output-placeholder": "La salida Base32 aparecerá aquí...",
    "download": "Descargar Base32",
    "read-failed": "No se pudo leer el archivo"
  },
  "fr": {
    "input-title": "Entrée",
    "input-placeholder": "Entrez le texte à encoder...",
    "output-title": "Encodé Base32",
    "output-placeholder": "La sortie Base32 apparaîtra ici...",
    "download": "Télécharger Base32",
    "read-failed": "Échec de la lecture du fichier"
  },
  "de": {
    "input-title": "Eingabe",
    "input-placeholder": "Text zum Kodieren eingeben...",
    "output-title": "Base32-kodiert",
    "output-placeholder": "Base32-Ausgabe erscheint hier...",
    "download": "Base32 herunterladen",
    "read-failed": "Datei konnte nicht gelesen werden"
  },
  "it": {
    "input-title": "Input",
    "input-placeholder": "Inserisci testo da codificare...",
    "output-title": "Codificato Base32",
    "output-placeholder": "L'output Base32 apparirà qui...",
    "download": "Scarica Base32",
    "read-failed": "Impossibile leggere il file"
  },
  "ja": {
    "input-title": "入力",
    "input-placeholder": "エンコードするテキストを入力...",
    "output-title": "Base32エンコード済み",
    "output-placeholder": "Base32 出力がここに表示されます...",
    "download": "Base32 をダウンロード",
    "read-failed": "ファイルの読み取りに失敗しました"
  },
  "ko": {
    "input-title": "입력",
    "input-placeholder": "인코딩할 텍스트 입력...",
    "output-title": "Base32 인코딩됨",
    "output-placeholder": "Base32 출력이 여기에 표시됩니다...",
    "download": "Base32 다운로드",
    "read-failed": "파일 읽기에 실패했습니다"
  },
  "ru": {
    "input-title": "Ввод",
    "input-placeholder": "Введите текст для кодирования...",
    "output-title": "Кодировка Base32",
    "output-placeholder": "Вывод Base32 появится здесь...",
    "download": "Скачать Base32",
    "read-failed": "Не удалось прочитать файл"
  },
  "pt": {
    "input-title": "Entrada",
    "input-placeholder": "Digite texto para codificar...",
    "output-title": "Codificado Base32",
    "output-placeholder": "A saída Base32 aparecerá aqui...",
    "download": "Baixar Base32",
    "read-failed": "Falha ao ler o arquivo"
  },
  "ar": {
    "input-title": "الإدخال",
    "input-placeholder": "أدخل النص للترميز...",
    "output-title": "مُرمز Base32",
    "output-placeholder": "سيظهر إخراج Base32 هنا...",
    "download": "تنزيل Base32",
    "read-failed": "فشل في قراءة الملف"
  },
  "hi": {
    "input-title": "इनपुट",
    "input-placeholder": "एन्कोड करने के लिए पाठ दर्ज करें...",
    "output-title": "Base32 एन्कोडेड",
    "output-placeholder": "Base32 आउटपुट यहां दिखाई देगा...",
    "download": "Base32 डाउनलोड करें",
    "read-failed": "फ़ाइल पढ़ने में विफल"
  },
  "tr": {
    "input-title": "Giriş",
    "input-placeholder": "Kodlanacak metni girin...",
    "output-title": "Base32 Kodlanmış",
    "output-placeholder": "Base32 çıktısı burada görünecek...",
    "download": "Base32 İndir",
    "read-failed": "Dosya okunamadı"
  },
  "nl": {
    "input-title": "Invoer",
    "input-placeholder": "Voer tekst in om te coderen...",
    "output-title": "Base32 Gecodeerd",
    "output-placeholder": "Base32-uitvoer verschijnt hier...",
    "download": "Base32 downloaden",
    "read-failed": "Bestand kon niet worden gelezen"
  },
  "sv": {
    "input-title": "Inmatning",
    "input-placeholder": "Ange text att koda...",
    "output-title": "Base32-kodad",
    "output-placeholder": "Base32-utdata visas här...",
    "download": "Ladda ner Base32",
    "read-failed": "Kunde inte läsa filen"
  },
  "pl": {
    "input-title": "Wejście",
    "input-placeholder": "Wprowadź tekst do kodowania...",
    "output-title": "Zakodowany Base32",
    "output-placeholder": "Wyjście Base32 pojawi się tutaj...",
    "download": "Pobierz Base32",
    "read-failed": "Nie udało się odczytać pliku"
  },
  "vi": {
    "input-title": "Đầu vào",
    "input-placeholder": "Nhập văn bản để mã hóa...",
    "output-title": "Đã mã hóa Base32",
    "output-placeholder": "Kết quả Base32 sẽ xuất hiện ở đây...",
    "download": "Tải Base32",
    "read-failed": "Không thể đọc tệp"
  },
  "th": {
    "input-title": "ข้อมูลเข้า",
    "input-placeholder": "ป้อนข้อความเพื่อเข้ารหัส...",
    "output-title": "เข้ารหัส Base32",
    "output-placeholder": "ผลลัพธ์ Base32 จะปรากฏที่นี่...",
    "download": "ดาวน์โหลด Base32",
    "read-failed": "อ่านไฟล์ไม่สำเร็จ"
  },
  "id": {
    "input-title": "Input",
    "input-placeholder": "Masukkan teks untuk dikodekan...",
    "output-title": "Terkode Base32",
    "output-placeholder": "Output Base32 akan muncul di sini...",
    "download": "Unduh Base32",
    "read-failed": "Gagal membaca file"
  },
  "he": {
    "input-title": "קלט",
    "input-placeholder": "הזן טקסט לקידוד...",
    "output-title": "מקודד Base32",
    "output-placeholder": "פלט Base32 יוצג כאן...",
    "download": "הורד Base32",
    "read-failed": "קריאת הקובץ נכשלה"
  },
  "ms": {
    "input-title": "Input",
    "input-placeholder": "Masukkan teks untuk dikod...",
    "output-title": "Berkod Base32",
    "output-placeholder": "Output Base32 akan dipaparkan di sini...",
    "download": "Muat turun Base32",
    "read-failed": "Gagal membaca fail"
  },
  "no": {
    "input-title": "Inndata",
    "input-placeholder": "Skriv inn tekst for koding...",
    "output-title": "Base32-kodet",
    "output-placeholder": "Base32-utdata vises her...",
    "download": "Last ned Base32",
    "read-failed": "Kunne ikke lese filen"
  }
}
</i18n>
