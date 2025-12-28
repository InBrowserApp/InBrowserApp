<template>
  <div>
    <ToolSectionHeader>{{ t('plain-text') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="plainText"
        type="textarea"
        :placeholder="t('plain-text-placeholder')"
        :autosize="{ minRows: 4, maxRows: 12 }"
      />
    </ToolSection>
    <ToolSection>
      <CopyToClipboardButton :content="plainText" />
    </ToolSection>

    <ToolSectionHeader>{{ t('base64-encoded') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="encodedText"
        type="textarea"
        :placeholder="t('base64-placeholder')"
        :autosize="{ minRows: 4, maxRows: 12 }"
        :status="encodedTextStatus"
      />
    </ToolSection>
    <ToolSection>
      <n-flex justify="space-between">
        <CopyToClipboardButton :content="encodedText" />
        <template v-if="encodedTextStatus === 'error'">
          <n-text type="error">
            {{ t('invalid-base64') }}
          </n-text>
        </template>
      </n-flex>
    </ToolSection>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { NInput, NFlex, NText } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useStorage } from '@vueuse/core'

const { t } = useI18n()

// Encode text to Base64 (supports Unicode)
function encodeBase64(text: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text)
  const binaryString = String.fromCharCode(...bytes)
  return btoa(binaryString)
}

// Decode Base64 to text (supports Unicode)
function decodeBase64(base64: string): string {
  const binaryString = atob(base64)
  const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0))
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

// Validate Base64 string
function isValidBase64(str: string): boolean {
  if (str === '') return true
  try {
    atob(str)
    return true
  } catch {
    return false
  }
}

const plainText = useStorage<string>('tools:base64-encoder-decoder:plain-text', 'Hello World!')
const encodedText = ref<string>(encodeBase64(plainText.value))

const encodedTextStatus = computed(() => {
  return isValidBase64(encodedText.value) ? 'success' : 'error'
})

watch(plainText, (newValue) => {
  encodedText.value = encodeBase64(newValue)
})

watch(encodedText, (newValue) => {
  if (isValidBase64(newValue)) {
    try {
      plainText.value = decodeBase64(newValue)
    } catch {
      // Decoding failed, keep current value
    }
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "plain-text": "Plain Text",
    "plain-text-placeholder": "Enter text to encode...",
    "base64-encoded": "Base64 Encoded",
    "base64-placeholder": "Enter Base64 text to decode...",
    "invalid-base64": "Invalid Base64 text"
  },
  "zh": {
    "plain-text": "纯文本",
    "plain-text-placeholder": "输入要编码的文本...",
    "base64-encoded": "Base64 编码",
    "base64-placeholder": "输入要解码的 Base64 文本...",
    "invalid-base64": "无效的 Base64 文本"
  },
  "zh-CN": {
    "plain-text": "纯文本",
    "plain-text-placeholder": "输入要编码的文本...",
    "base64-encoded": "Base64 编码",
    "base64-placeholder": "输入要解码的 Base64 文本...",
    "invalid-base64": "无效的 Base64 文本"
  },
  "zh-TW": {
    "plain-text": "純文字",
    "plain-text-placeholder": "輸入要編碼的文字...",
    "base64-encoded": "Base64 編碼",
    "base64-placeholder": "輸入要解碼的 Base64 文字...",
    "invalid-base64": "無效的 Base64 文字"
  },
  "zh-HK": {
    "plain-text": "純文字",
    "plain-text-placeholder": "輸入要編碼的文字...",
    "base64-encoded": "Base64 編碼",
    "base64-placeholder": "輸入要解碼的 Base64 文字...",
    "invalid-base64": "無效的 Base64 文字"
  },
  "es": {
    "plain-text": "Texto Plano",
    "plain-text-placeholder": "Introduce texto para codificar...",
    "base64-encoded": "Codificado Base64",
    "base64-placeholder": "Introduce texto Base64 para decodificar...",
    "invalid-base64": "Texto Base64 inválido"
  },
  "fr": {
    "plain-text": "Texte Brut",
    "plain-text-placeholder": "Entrez le texte à encoder...",
    "base64-encoded": "Encodé Base64",
    "base64-placeholder": "Entrez le texte Base64 à décoder...",
    "invalid-base64": "Texte Base64 invalide"
  },
  "de": {
    "plain-text": "Klartext",
    "plain-text-placeholder": "Text zum Kodieren eingeben...",
    "base64-encoded": "Base64-kodiert",
    "base64-placeholder": "Base64-Text zum Dekodieren eingeben...",
    "invalid-base64": "Ungültiger Base64-Text"
  },
  "it": {
    "plain-text": "Testo Semplice",
    "plain-text-placeholder": "Inserisci testo da codificare...",
    "base64-encoded": "Codificato Base64",
    "base64-placeholder": "Inserisci testo Base64 da decodificare...",
    "invalid-base64": "Testo Base64 non valido"
  },
  "ja": {
    "plain-text": "プレーンテキスト",
    "plain-text-placeholder": "エンコードするテキストを入力...",
    "base64-encoded": "Base64エンコード済み",
    "base64-placeholder": "デコードするBase64テキストを入力...",
    "invalid-base64": "無効なBase64テキスト"
  },
  "ko": {
    "plain-text": "일반 텍스트",
    "plain-text-placeholder": "인코딩할 텍스트 입력...",
    "base64-encoded": "Base64 인코딩됨",
    "base64-placeholder": "디코딩할 Base64 텍스트 입력...",
    "invalid-base64": "유효하지 않은 Base64 텍스트"
  },
  "ru": {
    "plain-text": "Обычный текст",
    "plain-text-placeholder": "Введите текст для кодирования...",
    "base64-encoded": "Кодировка Base64",
    "base64-placeholder": "Введите текст Base64 для декодирования...",
    "invalid-base64": "Неверный текст Base64"
  },
  "pt": {
    "plain-text": "Texto Simples",
    "plain-text-placeholder": "Digite texto para codificar...",
    "base64-encoded": "Codificado Base64",
    "base64-placeholder": "Digite texto Base64 para decodificar...",
    "invalid-base64": "Texto Base64 inválido"
  },
  "ar": {
    "plain-text": "نص عادي",
    "plain-text-placeholder": "أدخل النص للترميز...",
    "base64-encoded": "مُرمز Base64",
    "base64-placeholder": "أدخل نص Base64 لفك التشفير...",
    "invalid-base64": "نص Base64 غير صالح"
  },
  "hi": {
    "plain-text": "सादा पाठ",
    "plain-text-placeholder": "एन्कोड करने के लिए पाठ दर्ज करें...",
    "base64-encoded": "Base64 एन्कोडेड",
    "base64-placeholder": "डिकोड करने के लिए Base64 पाठ दर्ज करें...",
    "invalid-base64": "अमान्य Base64 पाठ"
  },
  "tr": {
    "plain-text": "Düz Metin",
    "plain-text-placeholder": "Kodlanacak metni girin...",
    "base64-encoded": "Base64 Kodlanmış",
    "base64-placeholder": "Kod çözülecek Base64 metni girin...",
    "invalid-base64": "Geçersiz Base64 metni"
  },
  "nl": {
    "plain-text": "Platte Tekst",
    "plain-text-placeholder": "Voer tekst in om te coderen...",
    "base64-encoded": "Base64 Gecodeerd",
    "base64-placeholder": "Voer Base64 tekst in om te decoderen...",
    "invalid-base64": "Ongeldige Base64 tekst"
  },
  "sv": {
    "plain-text": "Vanlig Text",
    "plain-text-placeholder": "Ange text att koda...",
    "base64-encoded": "Base64-kodad",
    "base64-placeholder": "Ange Base64-text att avkoda...",
    "invalid-base64": "Ogiltig Base64-text"
  },
  "pl": {
    "plain-text": "Zwykły Tekst",
    "plain-text-placeholder": "Wprowadź tekst do kodowania...",
    "base64-encoded": "Zakodowany Base64",
    "base64-placeholder": "Wprowadź tekst Base64 do dekodowania...",
    "invalid-base64": "Nieprawidłowy tekst Base64"
  },
  "vi": {
    "plain-text": "Văn Bản Thô",
    "plain-text-placeholder": "Nhập văn bản để mã hóa...",
    "base64-encoded": "Đã mã hóa Base64",
    "base64-placeholder": "Nhập văn bản Base64 để giải mã...",
    "invalid-base64": "Văn bản Base64 không hợp lệ"
  },
  "th": {
    "plain-text": "ข้อความธรรมดา",
    "plain-text-placeholder": "ป้อนข้อความเพื่อเข้ารหัส...",
    "base64-encoded": "เข้ารหัส Base64",
    "base64-placeholder": "ป้อนข้อความ Base64 เพื่อถอดรหัส...",
    "invalid-base64": "ข้อความ Base64 ไม่ถูกต้อง"
  },
  "id": {
    "plain-text": "Teks Biasa",
    "plain-text-placeholder": "Masukkan teks untuk dikodekan...",
    "base64-encoded": "Terkode Base64",
    "base64-placeholder": "Masukkan teks Base64 untuk didekodekan...",
    "invalid-base64": "Teks Base64 tidak valid"
  },
  "he": {
    "plain-text": "טקסט רגיל",
    "plain-text-placeholder": "הזן טקסט לקידוד...",
    "base64-encoded": "מקודד Base64",
    "base64-placeholder": "הזן טקסט Base64 לפענוח...",
    "invalid-base64": "טקסט Base64 לא תקין"
  },
  "ms": {
    "plain-text": "Teks Biasa",
    "plain-text-placeholder": "Masukkan teks untuk dikod...",
    "base64-encoded": "Berkod Base64",
    "base64-placeholder": "Masukkan teks Base64 untuk dinyahkod...",
    "invalid-base64": "Teks Base64 tidak sah"
  },
  "no": {
    "plain-text": "Vanlig Tekst",
    "plain-text-placeholder": "Skriv inn tekst for koding...",
    "base64-encoded": "Base64-kodet",
    "base64-placeholder": "Skriv inn Base64-tekst for dekoding...",
    "invalid-base64": "Ugyldig Base64-tekst"
  }
}
</i18n>
