<template>
  <n-gi>
    <BaseInput
      :label="t('base32')"
      :model-value="base32"
      :status="base32Status"
      :placeholder="t('enterBase32')"
      @update:model-value="onInput('base32', $event)"
    />
  </n-gi>
  <n-gi>
    <BaseInput
      :label="t('base36')"
      :model-value="base36"
      :status="base36Status"
      :placeholder="t('enterBase36')"
      @update:model-value="onInput('base36', $event)"
    />
  </n-gi>
  <n-gi>
    <BaseInput
      :label="t('base62')"
      :model-value="base62"
      :status="base62Status"
      :placeholder="t('enterBase62')"
      @update:model-value="onInput('base62', $event)"
    />
  </n-gi>
  <n-gi>
    <BaseInput
      :label="t('base64')"
      :model-value="base64"
      :status="base64Status"
      :placeholder="t('enterBase64')"
      @update:model-value="onInput('base64', $event)"
    />
  </n-gi>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NGi } from 'naive-ui'
import BaseInput from './BaseInput.vue'

defineProps<{
  base32: string
  base32Status?: 'success' | 'warning' | 'error'
  base36: string
  base36Status?: 'success' | 'warning' | 'error'
  base62: string
  base62Status?: 'success' | 'warning' | 'error'
  base64: string
  base64Status?: 'success' | 'warning' | 'error'
  onInput: (source: 'base32' | 'base36' | 'base62' | 'base64', value: string) => void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Enter base32...",
    "enterBase36": "Enter base36...",
    "enterBase62": "Enter base62...",
    "enterBase64": "Enter base64..."
  },
  "zh": {
    "base32": "32 进制",
    "base36": "36 进制",
    "base62": "62 进制",
    "base64": "64 进制",
    "enterBase32": "输入 32 进制...",
    "enterBase36": "输入 36 进制...",
    "enterBase62": "输入 62 进制...",
    "enterBase64": "输入 64 进制..."
  },
  "zh-CN": {
    "base32": "32 进制",
    "base36": "36 进制",
    "base62": "62 进制",
    "base64": "64 进制",
    "enterBase32": "输入 32 进制...",
    "enterBase36": "输入 36 进制...",
    "enterBase62": "输入 62 进制...",
    "enterBase64": "输入 64 进制..."
  },
  "zh-TW": {
    "base32": "32 進制",
    "base36": "36 進制",
    "base62": "62 進制",
    "base64": "64 進制",
    "enterBase32": "輸入 32 進制...",
    "enterBase36": "輸入 36 進制...",
    "enterBase62": "輸入 62 進制...",
    "enterBase64": "輸入 64 進制..."
  },
  "zh-HK": {
    "base32": "32 進制",
    "base36": "36 進制",
    "base62": "62 進制",
    "base64": "64 進制",
    "enterBase32": "輸入 32 進制...",
    "enterBase36": "輸入 36 進制...",
    "enterBase62": "輸入 62 進制...",
    "enterBase64": "輸入 64 進制..."
  },
  "es": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Ingrese base32...",
    "enterBase36": "Ingrese base36...",
    "enterBase62": "Ingrese base62...",
    "enterBase64": "Ingrese base64..."
  },
  "fr": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Entrez base32...",
    "enterBase36": "Entrez base36...",
    "enterBase62": "Entrez base62...",
    "enterBase64": "Entrez base64..."
  },
  "de": {
    "base32": "Basis 32",
    "base36": "Basis 36",
    "base62": "Basis 62",
    "base64": "Basis 64",
    "enterBase32": "Base32 eingeben...",
    "enterBase36": "Base36 eingeben...",
    "enterBase62": "Base62 eingeben...",
    "enterBase64": "Base64 eingeben..."
  },
  "it": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Inserisci base32...",
    "enterBase36": "Inserisci base36...",
    "enterBase62": "Inserisci base62...",
    "enterBase64": "Inserisci base64..."
  },
  "ja": {
    "base32": "32進数",
    "base36": "36進数",
    "base62": "62進数",
    "base64": "64進数",
    "enterBase32": "32進数を入力...",
    "enterBase36": "36進数を入力...",
    "enterBase62": "62進数を入力...",
    "enterBase64": "64進数を入力..."
  },
  "ko": {
    "base32": "32진수",
    "base36": "36진수",
    "base62": "62진수",
    "base64": "64진수",
    "enterBase32": "32진수 입력...",
    "enterBase36": "36진수 입력...",
    "enterBase62": "62진수 입력...",
    "enterBase64": "64진수 입력..."
  },
  "ru": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Введите base32...",
    "enterBase36": "Введите base36...",
    "enterBase62": "Введите base62...",
    "enterBase64": "Введите base64..."
  },
  "pt": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Digite base32...",
    "enterBase36": "Digite base36...",
    "enterBase62": "Digite base62...",
    "enterBase64": "Digite base64..."
  },
  "ar": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "ادخل base32...",
    "enterBase36": "ادخل base36...",
    "enterBase62": "ادخل base62...",
    "enterBase64": "ادخل base64..."
  },
  "hi": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Base32 दर्ज करें...",
    "enterBase36": "Base36 दर्ज करें...",
    "enterBase62": "Base62 दर्ज करें...",
    "enterBase64": "Base64 दर्ज करें..."
  },
  "tr": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Base32 girin...",
    "enterBase36": "Base36 girin...",
    "enterBase62": "Base62 girin...",
    "enterBase64": "Base64 girin..."
  },
  "nl": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Voer base32 in...",
    "enterBase36": "Voer base36 in...",
    "enterBase62": "Voer base62 in...",
    "enterBase64": "Voer base64 in..."
  },
  "sv": {
    "base32": "Bas 32",
    "base36": "Bas 36",
    "base62": "Bas 62",
    "base64": "Bas 64",
    "enterBase32": "Ange base32...",
    "enterBase36": "Ange base36...",
    "enterBase62": "Ange base62...",
    "enterBase64": "Ange base64..."
  },
  "pl": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Wprowadz base32...",
    "enterBase36": "Wprowadz base36...",
    "enterBase62": "Wprowadz base62...",
    "enterBase64": "Wprowadz base64..."
  },
  "vi": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Nhap base32...",
    "enterBase36": "Nhap base36...",
    "enterBase62": "Nhap base62...",
    "enterBase64": "Nhap base64..."
  },
  "th": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "ป้อน base32...",
    "enterBase36": "ป้อน base36...",
    "enterBase62": "ป้อน base62...",
    "enterBase64": "ป้อน base64..."
  },
  "id": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Masukkan base32...",
    "enterBase36": "Masukkan base36...",
    "enterBase62": "Masukkan base62...",
    "enterBase64": "Masukkan base64..."
  },
  "he": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "הזן base32...",
    "enterBase36": "הזן base36...",
    "enterBase62": "הזן base62...",
    "enterBase64": "הזן base64..."
  },
  "ms": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Masukkan base32...",
    "enterBase36": "Masukkan base36...",
    "enterBase62": "Masukkan base62...",
    "enterBase64": "Masukkan base64..."
  },
  "no": {
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "enterBase32": "Skriv inn base32...",
    "enterBase36": "Skriv inn base36...",
    "enterBase62": "Skriv inn base62...",
    "enterBase64": "Skriv inn base64..."
  }
}
</i18n>
