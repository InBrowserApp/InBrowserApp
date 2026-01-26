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
import { type Base85Variant, encodeBase85 } from '@utils/base85'

const { t } = useI18n()

const storedText = useStorage('tools:base85-encoder:text', '')
const alphabetKey = useStorage<Base85Variant>('tools:base85-encoder:alphabet', 'ascii85')
const alphabetOptions = computed(() => [
  { label: t('alphabet-ascii85'), value: 'ascii85' as Base85Variant },
  { label: t('alphabet-z85'), value: 'z85' as Base85Variant },
])
const encodedExtension = computed(() => (alphabetKey.value === 'z85' ? 'z85' : 'a85'))
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
  [textOrFile, alphabetKey],
  async ([value, variant]) => {
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
      encodedText.value = encodeBase85(bytes, { variant })
    } catch (err) {
      if (currentId !== requestId) return
      encodedText.value = ''
      if (err instanceof Error && err.message === 'Invalid Base85 length') {
        error.value = t('invalid-base85')
      } else {
        error.value = t('read-failed')
      }
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
  if (typeof input === 'string') return `encoded.${encodedExtension.value}.txt`

  const fileName = input?.name ?? 'file'
  const baseName = fileName.replace(/\.[^/.]+$/, '')
  return `${baseName || 'file'}.${encodedExtension.value}`
})
</script>

<i18n lang="json">
{
  "en": {
    "input-title": "Input",
    "input-placeholder": "Enter text to encode...",
    "output-title": "Base85 Encoded",
    "output-placeholder": "Base85 output will appear here...",
    "download": "Download Base85",
    "read-failed": "Failed to read file",
    "options": "Options",
    "alphabet": "Alphabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Invalid Base85 text"
  },
  "zh": {
    "input-title": "输入",
    "input-placeholder": "输入要编码的文本...",
    "output-title": "Base85 编码",
    "output-placeholder": "Base85 输出将显示在这里...",
    "download": "下载 Base85",
    "read-failed": "读取文件失败",
    "options": "选项",
    "alphabet": "字母表",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "无效的 Base85 文本"
  },
  "zh-CN": {
    "input-title": "输入",
    "input-placeholder": "输入要编码的文本...",
    "output-title": "Base85 编码",
    "output-placeholder": "Base85 输出将显示在这里...",
    "download": "下载 Base85",
    "read-failed": "读取文件失败",
    "options": "选项",
    "alphabet": "字母表",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "无效的 Base85 文本"
  },
  "zh-TW": {
    "input-title": "輸入",
    "input-placeholder": "輸入要編碼的文字...",
    "output-title": "Base85 編碼",
    "output-placeholder": "Base85 輸出會顯示在這裡...",
    "download": "下載 Base85",
    "read-failed": "讀取檔案失敗",
    "options": "選項",
    "alphabet": "字母表",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "無效的 Base85 文字"
  },
  "zh-HK": {
    "input-title": "輸入",
    "input-placeholder": "輸入要編碼的文字...",
    "output-title": "Base85 編碼",
    "output-placeholder": "Base85 輸出會顯示在這裡...",
    "download": "下載 Base85",
    "read-failed": "讀取檔案失敗",
    "options": "選項",
    "alphabet": "字母表",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "無效的 Base85 文字"
  },
  "es": {
    "input-title": "Entrada",
    "input-placeholder": "Introduce texto para codificar...",
    "output-title": "Codificado Base85",
    "output-placeholder": "La salida Base85 aparecerá aquí...",
    "download": "Descargar Base85",
    "read-failed": "No se pudo leer el archivo",
    "options": "Opciones",
    "alphabet": "Alfabeto",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Texto Base85 inválido"
  },
  "fr": {
    "input-title": "Entrée",
    "input-placeholder": "Entrez le texte à encoder...",
    "output-title": "Encodé Base85",
    "output-placeholder": "La sortie Base85 apparaîtra ici...",
    "download": "Télécharger Base85",
    "read-failed": "Échec de la lecture du fichier",
    "options": "Options",
    "alphabet": "Alphabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Texte Base85 invalide"
  },
  "de": {
    "input-title": "Eingabe",
    "input-placeholder": "Text zum Kodieren eingeben...",
    "output-title": "Base85-kodiert",
    "output-placeholder": "Base85-Ausgabe erscheint hier...",
    "download": "Base85 herunterladen",
    "read-failed": "Datei konnte nicht gelesen werden",
    "options": "Optionen",
    "alphabet": "Alphabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Ungültiger Base85-Text"
  },
  "it": {
    "input-title": "Input",
    "input-placeholder": "Inserisci testo da codificare...",
    "output-title": "Codificato Base85",
    "output-placeholder": "L'output Base85 apparirà qui...",
    "download": "Scarica Base85",
    "read-failed": "Impossibile leggere il file",
    "options": "Opzioni",
    "alphabet": "Alfabeto",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Testo Base85 non valido"
  },
  "ja": {
    "input-title": "入力",
    "input-placeholder": "エンコードするテキストを入力...",
    "output-title": "Base85エンコード済み",
    "output-placeholder": "Base85 出力がここに表示されます...",
    "download": "Base85 をダウンロード",
    "read-failed": "ファイルの読み取りに失敗しました",
    "options": "オプション",
    "alphabet": "アルファベット",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "無効なBase85テキスト"
  },
  "ko": {
    "input-title": "입력",
    "input-placeholder": "인코딩할 텍스트 입력...",
    "output-title": "Base85 인코딩됨",
    "output-placeholder": "Base85 출력이 여기에 표시됩니다...",
    "download": "Base85 다운로드",
    "read-failed": "파일 읽기에 실패했습니다",
    "options": "옵션",
    "alphabet": "알파벳",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "유효하지 않은 Base85 텍스트"
  },
  "ru": {
    "input-title": "Ввод",
    "input-placeholder": "Введите текст для кодирования...",
    "output-title": "Кодировка Base85",
    "output-placeholder": "Вывод Base85 появится здесь...",
    "download": "Скачать Base85",
    "read-failed": "Не удалось прочитать файл",
    "options": "Параметры",
    "alphabet": "Алфавит",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Неверный текст Base85"
  },
  "pt": {
    "input-title": "Entrada",
    "input-placeholder": "Digite texto para codificar...",
    "output-title": "Codificado Base85",
    "output-placeholder": "A saída Base85 aparecerá aqui...",
    "download": "Baixar Base85",
    "read-failed": "Falha ao ler o arquivo",
    "options": "Opções",
    "alphabet": "Alfabeto",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Texto Base85 inválido"
  },
  "ar": {
    "input-title": "الإدخال",
    "input-placeholder": "أدخل النص للترميز...",
    "output-title": "مُرمز Base85",
    "output-placeholder": "سيظهر إخراج Base85 هنا...",
    "download": "تنزيل Base85",
    "read-failed": "فشل في قراءة الملف",
    "options": "الخيارات",
    "alphabet": "الأبجدية",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "نص Base85 غير صالح"
  },
  "hi": {
    "input-title": "इनपुट",
    "input-placeholder": "एन्कोड करने के लिए पाठ दर्ज करें...",
    "output-title": "Base85 एन्कोडेड",
    "output-placeholder": "Base85 आउटपुट यहां दिखाई देगा...",
    "download": "Base85 डाउनलोड करें",
    "read-failed": "फ़ाइल पढ़ने में विफल",
    "options": "विकल्प",
    "alphabet": "वर्णमाला",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "अमान्य Base85 पाठ"
  },
  "tr": {
    "input-title": "Giriş",
    "input-placeholder": "Kodlanacak metni girin...",
    "output-title": "Base85 Kodlanmış",
    "output-placeholder": "Base85 çıktısı burada görünecek...",
    "download": "Base85 İndir",
    "read-failed": "Dosya okunamadı",
    "options": "Seçenekler",
    "alphabet": "Alfabe",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Geçersiz Base85 metni"
  },
  "nl": {
    "input-title": "Invoer",
    "input-placeholder": "Voer tekst in om te coderen...",
    "output-title": "Base85 Gecodeerd",
    "output-placeholder": "Base85-uitvoer verschijnt hier...",
    "download": "Base85 downloaden",
    "read-failed": "Bestand kon niet worden gelezen",
    "options": "Opties",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Ongeldige Base85-tekst"
  },
  "sv": {
    "input-title": "Inmatning",
    "input-placeholder": "Ange text att koda...",
    "output-title": "Base85-kodad",
    "output-placeholder": "Base85-utdata visas här...",
    "download": "Ladda ner Base85",
    "read-failed": "Kunde inte läsa filen",
    "options": "Alternativ",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Ogiltig Base85-text"
  },
  "pl": {
    "input-title": "Wejście",
    "input-placeholder": "Wprowadź tekst do kodowania...",
    "output-title": "Zakodowany Base85",
    "output-placeholder": "Wyjście Base85 pojawi się tutaj...",
    "download": "Pobierz Base85",
    "read-failed": "Nie udało się odczytać pliku",
    "options": "Opcje",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Nieprawidłowy tekst Base85"
  },
  "vi": {
    "input-title": "Đầu vào",
    "input-placeholder": "Nhập văn bản để mã hóa...",
    "output-title": "Đã mã hóa Base85",
    "output-placeholder": "Kết quả Base85 sẽ xuất hiện ở đây...",
    "download": "Tải Base85",
    "read-failed": "Không thể đọc tệp",
    "options": "Tùy chọn",
    "alphabet": "Bảng chữ cái",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Văn bản Base85 không hợp lệ"
  },
  "th": {
    "input-title": "ข้อมูลเข้า",
    "input-placeholder": "ป้อนข้อความเพื่อเข้ารหัส...",
    "output-title": "เข้ารหัส Base85",
    "output-placeholder": "ผลลัพธ์ Base85 จะปรากฏที่นี่...",
    "download": "ดาวน์โหลด Base85",
    "read-failed": "อ่านไฟล์ไม่สำเร็จ",
    "options": "ตัวเลือก",
    "alphabet": "อักษร",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "ข้อความ Base85 ไม่ถูกต้อง"
  },
  "id": {
    "input-title": "Input",
    "input-placeholder": "Masukkan teks untuk dikodekan...",
    "output-title": "Terkode Base85",
    "output-placeholder": "Output Base85 akan muncul di sini...",
    "download": "Unduh Base85",
    "read-failed": "Gagal membaca file",
    "options": "Opsi",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Teks Base85 tidak valid"
  },
  "he": {
    "input-title": "קלט",
    "input-placeholder": "הזן טקסט לקידוד...",
    "output-title": "מקודד Base85",
    "output-placeholder": "פלט Base85 יוצג כאן...",
    "download": "הורד Base85",
    "read-failed": "קריאת הקובץ נכשלה",
    "options": "אפשרויות",
    "alphabet": "אלפבית",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "טקסט Base85 לא תקין"
  },
  "ms": {
    "input-title": "Input",
    "input-placeholder": "Masukkan teks untuk dikod...",
    "output-title": "Berkod Base85",
    "output-placeholder": "Output Base85 akan dipaparkan di sini...",
    "download": "Muat turun Base85",
    "read-failed": "Gagal membaca fail",
    "options": "Pilihan",
    "alphabet": "Abjad",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Teks Base85 tidak sah"
  },
  "no": {
    "input-title": "Inndata",
    "input-placeholder": "Skriv inn tekst for koding...",
    "output-title": "Base85-kodet",
    "output-placeholder": "Base85-utdata vises her...",
    "download": "Last ned Base85",
    "read-failed": "Kunne ikke lese filen",
    "options": "Alternativer",
    "alphabet": "Alfabet",
    "alphabet-ascii85": "ASCII85",
    "alphabet-z85": "Z85",
    "invalid-base85": "Ugyldig Base85-tekst"
  }
}
</i18n>
