<template>
  <ToolSectionHeader>{{ t('inputText') }}</ToolSectionHeader>
  <ToolSection>
    <NInput
      :value="modelValue"
      type="text"
      :placeholder="t('inputPlaceholder')"
      size="large"
      clearable
      @update:value="modelValue = $event"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NInput } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const modelValue = defineModel<string>({ required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "inputText": "Input Text",
    "inputPlaceholder": "Enter text to convert..."
  },
  "zh": {
    "inputText": "输入文本",
    "inputPlaceholder": "输入要转换的文本..."
  },
  "zh-CN": {
    "inputText": "输入文本",
    "inputPlaceholder": "输入要转换的文本..."
  },
  "zh-TW": {
    "inputText": "輸入文字",
    "inputPlaceholder": "輸入要轉換的文字..."
  },
  "zh-HK": {
    "inputText": "輸入文字",
    "inputPlaceholder": "輸入要轉換的文字..."
  },
  "es": {
    "inputText": "Texto de Entrada",
    "inputPlaceholder": "Ingrese el texto a convertir..."
  },
  "fr": {
    "inputText": "Texte d'Entree",
    "inputPlaceholder": "Entrez le texte a convertir..."
  },
  "de": {
    "inputText": "Eingabetext",
    "inputPlaceholder": "Text zum Konvertieren eingeben..."
  },
  "it": {
    "inputText": "Testo di Input",
    "inputPlaceholder": "Inserisci il testo da convertire..."
  },
  "ja": {
    "inputText": "入力テキスト",
    "inputPlaceholder": "変換するテキストを入力..."
  },
  "ko": {
    "inputText": "입력 텍스트",
    "inputPlaceholder": "변환할 텍스트를 입력하세요..."
  },
  "ru": {
    "inputText": "Входной текст",
    "inputPlaceholder": "Введите текст для преобразования..."
  },
  "pt": {
    "inputText": "Texto de Entrada",
    "inputPlaceholder": "Digite o texto para converter..."
  },
  "ar": {
    "inputText": "نص الادخال",
    "inputPlaceholder": "ادخل النص للتحويل..."
  },
  "hi": {
    "inputText": "इनपुट टेक्स्ट",
    "inputPlaceholder": "कनवर्ट करने के लिए टेक्स्ट दर्ज करें..."
  },
  "tr": {
    "inputText": "Giris Metni",
    "inputPlaceholder": "Donusturulecek metni girin..."
  },
  "nl": {
    "inputText": "Invoertekst",
    "inputPlaceholder": "Voer tekst in om te converteren..."
  },
  "sv": {
    "inputText": "Inmatningstext",
    "inputPlaceholder": "Ange text att konvertera..."
  },
  "pl": {
    "inputText": "Tekst Wejsciowy",
    "inputPlaceholder": "Wprowadz tekst do konwersji..."
  },
  "vi": {
    "inputText": "Van Ban Nhap",
    "inputPlaceholder": "Nhap van ban de chuyen doi..."
  },
  "th": {
    "inputText": "ข้อความนำเข้า",
    "inputPlaceholder": "ป้อนข้อความที่ต้องการแปลง..."
  },
  "id": {
    "inputText": "Teks Masukan",
    "inputPlaceholder": "Masukkan teks untuk dikonversi..."
  },
  "he": {
    "inputText": "טקסט קלט",
    "inputPlaceholder": "הזן טקסט להמרה..."
  },
  "ms": {
    "inputText": "Teks Input",
    "inputPlaceholder": "Masukkan teks untuk ditukar..."
  },
  "no": {
    "inputText": "Inndatatekst",
    "inputPlaceholder": "Skriv inn tekst som skal konverteres..."
  }
}
</i18n>
