<template>
  <n-gi>
    <BaseInput
      :label="t('binary')"
      :model-value="binary"
      :status="binaryStatus"
      :placeholder="t('enterBinary')"
      @update:model-value="onInput('binary', $event)"
    />
  </n-gi>
  <n-gi>
    <BaseInput
      :label="t('octal')"
      :model-value="octal"
      :status="octalStatus"
      :placeholder="t('enterOctal')"
      @update:model-value="onInput('octal', $event)"
    />
  </n-gi>
  <n-gi>
    <BaseInput
      :label="t('decimal')"
      :model-value="decimal"
      :status="decimalStatus"
      :placeholder="t('enterDecimal')"
      @update:model-value="onInput('decimal', $event)"
    />
  </n-gi>
  <n-gi>
    <BaseInput
      :label="t('hex')"
      :model-value="hex"
      :status="hexStatus"
      :placeholder="t('enterHex')"
      @update:model-value="onInput('hex', $event)"
    />
  </n-gi>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NGi } from 'naive-ui'
import BaseInput from './BaseInput.vue'

defineProps<{
  binary: string
  binaryStatus?: 'success' | 'warning' | 'error'
  octal: string
  octalStatus?: 'success' | 'warning' | 'error'
  decimal: string
  decimalStatus?: 'success' | 'warning' | 'error'
  hex: string
  hexStatus?: 'success' | 'warning' | 'error'
  onInput: (source: 'binary' | 'octal' | 'decimal' | 'hex', value: string) => void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "binary": "Binary (Base 2)",
    "octal": "Octal (Base 8)",
    "decimal": "Decimal (Base 10)",
    "hex": "Hexadecimal (Base 16)",
    "enterBinary": "Enter binary...",
    "enterOctal": "Enter octal...",
    "enterDecimal": "Enter decimal...",
    "enterHex": "Enter hex..."
  },
  "zh": {
    "binary": "二进制 (Base 2)",
    "octal": "八进制 (Base 8)",
    "decimal": "十进制 (Base 10)",
    "hex": "十六进制 (Base 16)",
    "enterBinary": "输入二进制...",
    "enterOctal": "输入八进制...",
    "enterDecimal": "输入十进制...",
    "enterHex": "输入十六进制..."
  },
  "zh-CN": {
    "binary": "二进制 (Base 2)",
    "octal": "八进制 (Base 8)",
    "decimal": "十进制 (Base 10)",
    "hex": "十六进制 (Base 16)",
    "enterBinary": "输入二进制...",
    "enterOctal": "输入八进制...",
    "enterDecimal": "输入十进制...",
    "enterHex": "输入十六进制..."
  },
  "zh-TW": {
    "binary": "二進制 (Base 2)",
    "octal": "八進制 (Base 8)",
    "decimal": "十進制 (Base 10)",
    "hex": "十六進制 (Base 16)",
    "enterBinary": "輸入二進制...",
    "enterOctal": "輸入八進制...",
    "enterDecimal": "輸入十進制...",
    "enterHex": "輸入十六進制..."
  },
  "zh-HK": {
    "binary": "二進制 (Base 2)",
    "octal": "八進制 (Base 8)",
    "decimal": "十進制 (Base 10)",
    "hex": "十六進制 (Base 16)",
    "enterBinary": "輸入二進制...",
    "enterOctal": "輸入八進制...",
    "enterDecimal": "輸入十進制...",
    "enterHex": "輸入十六進制..."
  },
  "es": {
    "binary": "Binario (Base 2)",
    "octal": "Octal (Base 8)",
    "decimal": "Decimal (Base 10)",
    "hex": "Hexadecimal (Base 16)",
    "enterBinary": "Ingrese binario...",
    "enterOctal": "Ingrese octal...",
    "enterDecimal": "Ingrese decimal...",
    "enterHex": "Ingrese hexadecimal..."
  },
  "fr": {
    "binary": "Binaire (Base 2)",
    "octal": "Octal (Base 8)",
    "decimal": "Decimal (Base 10)",
    "hex": "Hexadecimal (Base 16)",
    "enterBinary": "Entrez binaire...",
    "enterOctal": "Entrez octal...",
    "enterDecimal": "Entrez decimal...",
    "enterHex": "Entrez hexadecimal..."
  },
  "de": {
    "binary": "Binar (Basis 2)",
    "octal": "Oktal (Basis 8)",
    "decimal": "Dezimal (Basis 10)",
    "hex": "Hexadezimal (Basis 16)",
    "enterBinary": "Binar eingeben...",
    "enterOctal": "Oktal eingeben...",
    "enterDecimal": "Dezimal eingeben...",
    "enterHex": "Hexadezimal eingeben..."
  },
  "it": {
    "binary": "Binario (Base 2)",
    "octal": "Ottale (Base 8)",
    "decimal": "Decimale (Base 10)",
    "hex": "Esadecimale (Base 16)",
    "enterBinary": "Inserisci binario...",
    "enterOctal": "Inserisci ottale...",
    "enterDecimal": "Inserisci decimale...",
    "enterHex": "Inserisci esadecimale..."
  },
  "ja": {
    "binary": "2進数 (Base 2)",
    "octal": "8進数 (Base 8)",
    "decimal": "10進数 (Base 10)",
    "hex": "16進数 (Base 16)",
    "enterBinary": "2進数を入力...",
    "enterOctal": "8進数を入力...",
    "enterDecimal": "10進数を入力...",
    "enterHex": "16進数を入力..."
  },
  "ko": {
    "binary": "2진수 (Base 2)",
    "octal": "8진수 (Base 8)",
    "decimal": "10진수 (Base 10)",
    "hex": "16진수 (Base 16)",
    "enterBinary": "2진수 입력...",
    "enterOctal": "8진수 입력...",
    "enterDecimal": "10진수 입력...",
    "enterHex": "16진수 입력..."
  },
  "ru": {
    "binary": "Двоичная (Base 2)",
    "octal": "Восьмеричная (Base 8)",
    "decimal": "Десятичная (Base 10)",
    "hex": "Шестнадцатеричная (Base 16)",
    "enterBinary": "Введите двоичное...",
    "enterOctal": "Введите восьмеричное...",
    "enterDecimal": "Введите десятичное...",
    "enterHex": "Введите шестнадцатеричное..."
  },
  "pt": {
    "binary": "Binario (Base 2)",
    "octal": "Octal (Base 8)",
    "decimal": "Decimal (Base 10)",
    "hex": "Hexadecimal (Base 16)",
    "enterBinary": "Digite binario...",
    "enterOctal": "Digite octal...",
    "enterDecimal": "Digite decimal...",
    "enterHex": "Digite hexadecimal..."
  },
  "ar": {
    "binary": "ثنائي (Base 2)",
    "octal": "ثماني (Base 8)",
    "decimal": "عشري (Base 10)",
    "hex": "سداسي عشر (Base 16)",
    "enterBinary": "ادخل ثنائي...",
    "enterOctal": "ادخل ثماني...",
    "enterDecimal": "ادخل عشري...",
    "enterHex": "ادخل سداسي عشر..."
  },
  "hi": {
    "binary": "बाइनरी (Base 2)",
    "octal": "ऑक्टल (Base 8)",
    "decimal": "दशमलव (Base 10)",
    "hex": "हेक्साडेसिमल (Base 16)",
    "enterBinary": "बाइनरी दर्ज करें...",
    "enterOctal": "ऑक्टल दर्ज करें...",
    "enterDecimal": "दशमलव दर्ज करें...",
    "enterHex": "हेक्साडेसिमल दर्ज करें..."
  },
  "tr": {
    "binary": "Ikili (Base 2)",
    "octal": "Sekizli (Base 8)",
    "decimal": "Onlu (Base 10)",
    "hex": "Onaltilik (Base 16)",
    "enterBinary": "Ikili girin...",
    "enterOctal": "Sekizli girin...",
    "enterDecimal": "Onlu girin...",
    "enterHex": "Onaltilik girin..."
  },
  "nl": {
    "binary": "Binair (Base 2)",
    "octal": "Octaal (Base 8)",
    "decimal": "Decimaal (Base 10)",
    "hex": "Hexadecimaal (Base 16)",
    "enterBinary": "Voer binair in...",
    "enterOctal": "Voer octaal in...",
    "enterDecimal": "Voer decimaal in...",
    "enterHex": "Voer hexadecimaal in..."
  },
  "sv": {
    "binary": "Binar (Bas 2)",
    "octal": "Oktal (Bas 8)",
    "decimal": "Decimal (Bas 10)",
    "hex": "Hexadecimal (Bas 16)",
    "enterBinary": "Ange binar...",
    "enterOctal": "Ange oktal...",
    "enterDecimal": "Ange decimal...",
    "enterHex": "Ange hexadecimal..."
  },
  "pl": {
    "binary": "Binarny (Base 2)",
    "octal": "Osemkowy (Base 8)",
    "decimal": "Dziesietny (Base 10)",
    "hex": "Szesnastkowy (Base 16)",
    "enterBinary": "Wprowadz binarny...",
    "enterOctal": "Wprowadz osemkowy...",
    "enterDecimal": "Wprowadz dziesietny...",
    "enterHex": "Wprowadz szesnastkowy..."
  },
  "vi": {
    "binary": "Nhi phan (Base 2)",
    "octal": "Bat phan (Base 8)",
    "decimal": "Thap phan (Base 10)",
    "hex": "Thap luc phan (Base 16)",
    "enterBinary": "Nhap nhi phan...",
    "enterOctal": "Nhap bat phan...",
    "enterDecimal": "Nhap thap phan...",
    "enterHex": "Nhap thap luc phan..."
  },
  "th": {
    "binary": "เลขฐานสอง (Base 2)",
    "octal": "เลขฐานแปด (Base 8)",
    "decimal": "เลขฐานสิบ (Base 10)",
    "hex": "เลขฐานสิบหก (Base 16)",
    "enterBinary": "ป้อนเลขฐานสอง...",
    "enterOctal": "ป้อนเลขฐานแปด...",
    "enterDecimal": "ป้อนเลขฐานสิบ...",
    "enterHex": "ป้อนเลขฐานสิบหก..."
  },
  "id": {
    "binary": "Biner (Base 2)",
    "octal": "Oktal (Base 8)",
    "decimal": "Desimal (Base 10)",
    "hex": "Heksadesimal (Base 16)",
    "enterBinary": "Masukkan biner...",
    "enterOctal": "Masukkan oktal...",
    "enterDecimal": "Masukkan desimal...",
    "enterHex": "Masukkan heksadesimal..."
  },
  "he": {
    "binary": "בינארי (Base 2)",
    "octal": "אוקטלי (Base 8)",
    "decimal": "עשרוני (Base 10)",
    "hex": "הקסדצימלי (Base 16)",
    "enterBinary": "הזן בינארי...",
    "enterOctal": "הזן אוקטלי...",
    "enterDecimal": "הזן עשרוני...",
    "enterHex": "הזן הקסדצימלי..."
  },
  "ms": {
    "binary": "Perduaan (Base 2)",
    "octal": "Perlapanan (Base 8)",
    "decimal": "Perpuluhan (Base 10)",
    "hex": "Perenambelasan (Base 16)",
    "enterBinary": "Masukkan perduaan...",
    "enterOctal": "Masukkan perlapanan...",
    "enterDecimal": "Masukkan perpuluhan...",
    "enterHex": "Masukkan perenambelasan..."
  },
  "no": {
    "binary": "Binar (Base 2)",
    "octal": "Oktal (Base 8)",
    "decimal": "Desimal (Base 10)",
    "hex": "Heksadesimal (Base 16)",
    "enterBinary": "Skriv inn binar...",
    "enterOctal": "Skriv inn oktal...",
    "enterDecimal": "Skriv inn desimal...",
    "enterHex": "Skriv inn heksadesimal..."
  }
}
</i18n>
