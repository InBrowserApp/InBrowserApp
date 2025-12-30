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

    <ToolSectionHeader>{{ t('escape-format') }}</ToolSectionHeader>
    <ToolSection>
      <n-select v-model:value="escapeFormat" :options="formatOptions" />
    </ToolSection>

    <ToolSectionHeader>{{ t('escaped-text') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="escapedText"
        type="textarea"
        :placeholder="t('escaped-text-placeholder')"
        :autosize="{ minRows: 4, maxRows: 12 }"
      />
    </ToolSection>
    <ToolSection>
      <CopyToClipboardButton :content="escapedText" />
    </ToolSection>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { NInput, NSelect } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useStorage } from '@vueuse/core'
import { escapeUnicode, unescapeUnicode, escapeFormats, type EscapeFormat } from '../utils'

const { t } = useI18n()

const formatOptions = computed(() =>
  escapeFormats.map((f) => ({
    label: `${f.label} (${f.example})`,
    value: f.value,
  })),
)

const escapeFormat = useStorage<EscapeFormat>('tools:unicode-escape-unescape:escape-format', 'js')
const plainText = useStorage<string>('tools:unicode-escape-unescape:plain-text', 'Hello 你好 🎉')
const escapedText = ref<string>(escapeUnicode(plainText.value, escapeFormat.value))

let isUpdatingFromPlain = false
let isUpdatingFromEscaped = false

watch(plainText, (newValue) => {
  if (isUpdatingFromEscaped) return
  isUpdatingFromPlain = true
  escapedText.value = escapeUnicode(newValue, escapeFormat.value)
  isUpdatingFromPlain = false
})

watch(escapedText, (newValue) => {
  if (isUpdatingFromPlain) return
  isUpdatingFromEscaped = true
  plainText.value = unescapeUnicode(newValue)
  isUpdatingFromEscaped = false
})

watch(escapeFormat, (newFormat) => {
  escapedText.value = escapeUnicode(plainText.value, newFormat)
})
</script>

<i18n lang="json">
{
  "en": {
    "plain-text": "Plain Text",
    "plain-text-placeholder": "Enter text to escape...",
    "escape-format": "Escape Format",
    "escaped-text": "Escaped Text",
    "escaped-text-placeholder": "Enter escaped text to unescape..."
  },
  "zh": {
    "plain-text": "纯文本",
    "plain-text-placeholder": "输入要转义的文本...",
    "escape-format": "转义格式",
    "escaped-text": "转义后文本",
    "escaped-text-placeholder": "输入要反转义的文本..."
  },
  "zh-CN": {
    "plain-text": "纯文本",
    "plain-text-placeholder": "输入要转义的文本...",
    "escape-format": "转义格式",
    "escaped-text": "转义后文本",
    "escaped-text-placeholder": "输入要反转义的文本..."
  },
  "zh-TW": {
    "plain-text": "純文字",
    "plain-text-placeholder": "輸入要轉義的文字...",
    "escape-format": "轉義格式",
    "escaped-text": "轉義後文字",
    "escaped-text-placeholder": "輸入要反轉義的文字..."
  },
  "zh-HK": {
    "plain-text": "純文字",
    "plain-text-placeholder": "輸入要轉義的文字...",
    "escape-format": "轉義格式",
    "escaped-text": "轉義後文字",
    "escaped-text-placeholder": "輸入要反轉義的文字..."
  },
  "es": {
    "plain-text": "Texto Plano",
    "plain-text-placeholder": "Introduce texto para escapar...",
    "escape-format": "Formato de Escape",
    "escaped-text": "Texto Escapado",
    "escaped-text-placeholder": "Introduce texto escapado para desescapar..."
  },
  "fr": {
    "plain-text": "Texte Brut",
    "plain-text-placeholder": "Entrez le texte à échapper...",
    "escape-format": "Format d'Échappement",
    "escaped-text": "Texte Échappé",
    "escaped-text-placeholder": "Entrez le texte échappé à désechapper..."
  },
  "de": {
    "plain-text": "Klartext",
    "plain-text-placeholder": "Text zum Escapen eingeben...",
    "escape-format": "Escape-Format",
    "escaped-text": "Escapeter Text",
    "escaped-text-placeholder": "Escapeten Text zum Unescapen eingeben..."
  },
  "it": {
    "plain-text": "Testo Semplice",
    "plain-text-placeholder": "Inserisci testo da escapare...",
    "escape-format": "Formato Escape",
    "escaped-text": "Testo Escapato",
    "escaped-text-placeholder": "Inserisci testo escapato da unescapare..."
  },
  "ja": {
    "plain-text": "プレーンテキスト",
    "plain-text-placeholder": "エスケープするテキストを入力...",
    "escape-format": "エスケープ形式",
    "escaped-text": "エスケープ済みテキスト",
    "escaped-text-placeholder": "アンエスケープするテキストを入力..."
  },
  "ko": {
    "plain-text": "일반 텍스트",
    "plain-text-placeholder": "이스케이프할 텍스트 입력...",
    "escape-format": "이스케이프 형식",
    "escaped-text": "이스케이프된 텍스트",
    "escaped-text-placeholder": "언이스케이프할 텍스트 입력..."
  },
  "ru": {
    "plain-text": "Обычный текст",
    "plain-text-placeholder": "Введите текст для экранирования...",
    "escape-format": "Формат экранирования",
    "escaped-text": "Экранированный текст",
    "escaped-text-placeholder": "Введите текст для деэкранирования..."
  },
  "pt": {
    "plain-text": "Texto Simples",
    "plain-text-placeholder": "Digite texto para escapar...",
    "escape-format": "Formato de Escape",
    "escaped-text": "Texto Escapado",
    "escaped-text-placeholder": "Digite texto escapado para desescapar..."
  },
  "ar": {
    "plain-text": "نص عادي",
    "plain-text-placeholder": "أدخل النص للتحويل...",
    "escape-format": "صيغة التحويل",
    "escaped-text": "نص محول",
    "escaped-text-placeholder": "أدخل النص المحول لعكس التحويل..."
  },
  "hi": {
    "plain-text": "सादा पाठ",
    "plain-text-placeholder": "एस्केप करने के लिए पाठ दर्ज करें...",
    "escape-format": "एस्केप प्रारूप",
    "escaped-text": "एस्केप किया हुआ पाठ",
    "escaped-text-placeholder": "अनएस्केप करने के लिए पाठ दर्ज करें..."
  },
  "tr": {
    "plain-text": "Düz Metin",
    "plain-text-placeholder": "Kaçış için metin girin...",
    "escape-format": "Kaçış Formatı",
    "escaped-text": "Kaçırılmış Metin",
    "escaped-text-placeholder": "Kaçış geri alınacak metin girin..."
  },
  "nl": {
    "plain-text": "Platte Tekst",
    "plain-text-placeholder": "Voer tekst in om te escapen...",
    "escape-format": "Escape-formaat",
    "escaped-text": "Ge-escapete Tekst",
    "escaped-text-placeholder": "Voer ge-escapete tekst in om te unescapen..."
  },
  "sv": {
    "plain-text": "Vanlig Text",
    "plain-text-placeholder": "Ange text att escapa...",
    "escape-format": "Escape-format",
    "escaped-text": "Escapad Text",
    "escaped-text-placeholder": "Ange escapad text att unescapa..."
  },
  "pl": {
    "plain-text": "Zwykły Tekst",
    "plain-text-placeholder": "Wprowadź tekst do zakodowania...",
    "escape-format": "Format kodowania",
    "escaped-text": "Zakodowany Tekst",
    "escaped-text-placeholder": "Wprowadź tekst do odkodowania..."
  },
  "vi": {
    "plain-text": "Văn Bản Thô",
    "plain-text-placeholder": "Nhập văn bản để chuyển đổi...",
    "escape-format": "Định dạng chuyển đổi",
    "escaped-text": "Văn Bản Đã Chuyển Đổi",
    "escaped-text-placeholder": "Nhập văn bản đã chuyển đổi để giải mã..."
  },
  "th": {
    "plain-text": "ข้อความธรรมดา",
    "plain-text-placeholder": "ป้อนข้อความเพื่อแปลง...",
    "escape-format": "รูปแบบการแปลง",
    "escaped-text": "ข้อความที่แปลงแล้ว",
    "escaped-text-placeholder": "ป้อนข้อความที่แปลงแล้วเพื่อถอดรหัส..."
  },
  "id": {
    "plain-text": "Teks Biasa",
    "plain-text-placeholder": "Masukkan teks untuk di-escape...",
    "escape-format": "Format Escape",
    "escaped-text": "Teks Ter-escape",
    "escaped-text-placeholder": "Masukkan teks ter-escape untuk di-unescape..."
  },
  "he": {
    "plain-text": "טקסט רגיל",
    "plain-text-placeholder": "הזן טקסט להמרה...",
    "escape-format": "פורמט המרה",
    "escaped-text": "טקסט מומר",
    "escaped-text-placeholder": "הזן טקסט מומר להמרה חוזרת..."
  },
  "ms": {
    "plain-text": "Teks Biasa",
    "plain-text-placeholder": "Masukkan teks untuk escape...",
    "escape-format": "Format Escape",
    "escaped-text": "Teks Ter-escape",
    "escaped-text-placeholder": "Masukkan teks ter-escape untuk unescape..."
  },
  "no": {
    "plain-text": "Vanlig Tekst",
    "plain-text-placeholder": "Skriv inn tekst for escape...",
    "escape-format": "Escape-format",
    "escaped-text": "Escapet Tekst",
    "escaped-text-placeholder": "Skriv inn escapet tekst for unescape..."
  }
}
</i18n>
