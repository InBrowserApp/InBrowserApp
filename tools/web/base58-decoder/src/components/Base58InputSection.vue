<template>
  <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
  <ToolSection>
    <TextOrFileInput v-model:value="text" :placeholder="t('input-placeholder')" :accept="accept" />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const text = defineModel<string | File>('value', { required: true })

const { t } = useI18n({ useScope: 'local' })

const accept = 'text/*,.txt,.log,.md,.json,.csv,.yaml,.yml,.b58,.base58'
</script>

<i18n lang="json">
{
  "en": {
    "input-title": "Base58 Input",
    "input-placeholder": "Enter Base58 text..."
  },
  "zh": {
    "input-title": "Base58 输入",
    "input-placeholder": "输入 Base58 文本..."
  },
  "zh-CN": {
    "input-title": "Base58 输入",
    "input-placeholder": "输入 Base58 文本..."
  },
  "zh-TW": {
    "input-title": "Base58 輸入",
    "input-placeholder": "輸入 Base58 文字..."
  },
  "zh-HK": {
    "input-title": "Base58 輸入",
    "input-placeholder": "輸入 Base58 文字..."
  },
  "es": {
    "input-title": "Entrada Base58",
    "input-placeholder": "Introduce texto Base58..."
  },
  "fr": {
    "input-title": "Entrée Base58",
    "input-placeholder": "Entrez le texte Base58..."
  },
  "de": {
    "input-title": "Base58-Eingabe",
    "input-placeholder": "Base58-Text eingeben..."
  },
  "it": {
    "input-title": "Input Base58",
    "input-placeholder": "Inserisci testo Base58..."
  },
  "ja": {
    "input-title": "Base58 入力",
    "input-placeholder": "Base58テキストを入力..."
  },
  "ko": {
    "input-title": "Base58 입력",
    "input-placeholder": "Base58 텍스트 입력..."
  },
  "ru": {
    "input-title": "Ввод Base58",
    "input-placeholder": "Введите текст Base58..."
  },
  "pt": {
    "input-title": "Entrada Base58",
    "input-placeholder": "Digite texto Base58..."
  },
  "ar": {
    "input-title": "إدخال Base58",
    "input-placeholder": "أدخل نص Base58..."
  },
  "hi": {
    "input-title": "Base58 इनपुट",
    "input-placeholder": "Base58 पाठ दर्ज करें..."
  },
  "tr": {
    "input-title": "Base58 Girişi",
    "input-placeholder": "Base58 metni girin..."
  },
  "nl": {
    "input-title": "Base58-invoer",
    "input-placeholder": "Voer Base58-tekst in..."
  },
  "sv": {
    "input-title": "Base58-inmatning",
    "input-placeholder": "Ange Base58-text..."
  },
  "pl": {
    "input-title": "Wejście Base58",
    "input-placeholder": "Wprowadź tekst Base58..."
  },
  "vi": {
    "input-title": "Đầu vào Base58",
    "input-placeholder": "Nhập văn bản Base58..."
  },
  "th": {
    "input-title": "อินพุต Base58",
    "input-placeholder": "ป้อนข้อความ Base58..."
  },
  "id": {
    "input-title": "Input Base58",
    "input-placeholder": "Masukkan teks Base58..."
  },
  "he": {
    "input-title": "קלט Base58",
    "input-placeholder": "הזן טקסט Base58..."
  },
  "ms": {
    "input-title": "Input Base58",
    "input-placeholder": "Masukkan teks Base58..."
  },
  "no": {
    "input-title": "Base58-inndata",
    "input-placeholder": "Skriv inn Base58-tekst..."
  }
}
</i18n>
