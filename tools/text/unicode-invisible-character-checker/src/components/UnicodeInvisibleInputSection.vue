<template>
  <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
  <ToolSection>
    <TextOrFileInput
      v-model:value="value"
      :placeholder="t('input-placeholder')"
      accept="text/*,.txt,.log,.md,.json,.csv,.yaml,.yml"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const value = defineModel<string | File>('value', { required: true })
const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "input-title": "Input",
    "input-placeholder": "Paste or type text to scan..."
  },
  "zh": {
    "input-title": "输入",
    "input-placeholder": "粘贴或输入要扫描的文本..."
  },
  "zh-CN": {
    "input-title": "输入",
    "input-placeholder": "粘贴或输入要扫描的文本..."
  },
  "zh-TW": {
    "input-title": "輸入",
    "input-placeholder": "貼上或輸入要掃描的文字..."
  },
  "zh-HK": {
    "input-title": "輸入",
    "input-placeholder": "貼上或輸入要掃描的文字..."
  },
  "es": {
    "input-title": "Entrada",
    "input-placeholder": "Pegue o escriba el texto para escanear..."
  },
  "fr": {
    "input-title": "Entrée",
    "input-placeholder": "Collez ou saisissez le texte à analyser..."
  },
  "de": {
    "input-title": "Eingabe",
    "input-placeholder": "Text zum Scannen einfügen oder eingeben..."
  },
  "it": {
    "input-title": "Input",
    "input-placeholder": "Incolla o digita il testo da analizzare..."
  },
  "ja": {
    "input-title": "入力",
    "input-placeholder": "スキャンするテキストを貼り付けまたは入力..."
  },
  "ko": {
    "input-title": "입력",
    "input-placeholder": "스캔할 텍스트를 붙여넣거나 입력하세요..."
  },
  "ru": {
    "input-title": "Ввод",
    "input-placeholder": "Вставьте или введите текст для проверки..."
  },
  "pt": {
    "input-title": "Entrada",
    "input-placeholder": "Cole ou digite o texto para analisar..."
  },
  "ar": {
    "input-title": "الإدخال",
    "input-placeholder": "الصق أو اكتب النص للفحص..."
  },
  "hi": {
    "input-title": "इनपुट",
    "input-placeholder": "स्कैन करने के लिए टेक्स्ट पेस्ट या टाइप करें..."
  },
  "tr": {
    "input-title": "Girdi",
    "input-placeholder": "Taranacak metni yapıştırın veya yazın..."
  },
  "nl": {
    "input-title": "Invoer",
    "input-placeholder": "Plak of typ tekst om te scannen..."
  },
  "sv": {
    "input-title": "Indata",
    "input-placeholder": "Klistra in eller skriv text att skanna..."
  },
  "pl": {
    "input-title": "Wejście",
    "input-placeholder": "Wklej lub wpisz tekst do skanowania..."
  },
  "vi": {
    "input-title": "Đầu vào",
    "input-placeholder": "Dán hoặc nhập văn bản để quét..."
  },
  "th": {
    "input-title": "อินพุต",
    "input-placeholder": "วางหรือพิมพ์ข้อความเพื่อสแกน..."
  },
  "id": {
    "input-title": "Masukan",
    "input-placeholder": "Tempel atau ketik teks untuk dipindai..."
  },
  "he": {
    "input-title": "קלט",
    "input-placeholder": "הדבק או הקלד טקסט לסריקה..."
  },
  "ms": {
    "input-title": "Input",
    "input-placeholder": "Tampal atau taip teks untuk diimbas..."
  },
  "no": {
    "input-title": "Inndata",
    "input-placeholder": "Lim inn eller skriv tekst som skal skannes..."
  }
}
</i18n>
