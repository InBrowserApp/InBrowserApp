<template>
  <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
  <n-text>{{ t(base) }}</n-text>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'

const { t } = useI18n()

defineProps<{
  base: 'decimal' | 'octal' | 'binary' | 'base64' | 'hex'
}>()
</script>

<i18n lang="json">
{
  "en": {
    "base64": "Base64",
    "decimal": "Decimal",
    "octal": "Octal",
    "binary": "Binary",
    "hex": "Hexadecimal"
  },
  "zh": {
    "base64": "Base64",
    "decimal": "十进制",
    "octal": "八进制",
    "binary": "二进制",
    "hex": "十六进制"
  },
  "zh-CN": {
    "base64": "Base64",
    "decimal": "十进制",
    "octal": "八进制",
    "binary": "二进制",
    "hex": "十六进制"
  },
  "zh-TW": {
    "base64": "Base64",
    "decimal": "十進制",
    "octal": "八進制",
    "binary": "二進制",
    "hex": "十六進制"
  },
  "zh-HK": {
    "base64": "Base64",
    "decimal": "十進制",
    "octal": "八進制",
    "binary": "二進制",
    "hex": "十六進制"
  },
  "es": {
    "base64": "Base64",
    "decimal": "Decimal",
    "octal": "Octal",
    "binary": "Binario",
    "hex": "Hexadecimal"
  },
  "fr": {
    "base64": "Base64",
    "decimal": "Décimal",
    "octal": "Octal",
    "binary": "Binaire",
    "hex": "Hexadécimal"
  },
  "de": {
    "base64": "Base64",
    "decimal": "Dezimal",
    "octal": "Oktal",
    "binary": "Binär",
    "hex": "Hexadezimal"
  },
  "it": {
    "base64": "Base64",
    "decimal": "Decimale",
    "octal": "Ottale",
    "binary": "Binario",
    "hex": "Esadecimale"
  },
  "ja": {
    "base64": "Base64",
    "decimal": "10進数",
    "octal": "8進数",
    "binary": "2進数",
    "hex": "16進数"
  },
  "ko": {
    "base64": "Base64",
    "decimal": "10진수",
    "octal": "8진수",
    "binary": "2진수",
    "hex": "16진수"
  },
  "ru": {
    "base64": "Base64",
    "decimal": "Десятичное",
    "octal": "Восьмеричное",
    "binary": "Двоичное",
    "hex": "Шестнадцатеричное"
  },
  "pt": {
    "base64": "Base64",
    "decimal": "Decimal",
    "octal": "Octal",
    "binary": "Binário",
    "hex": "Hexadecimal"
  },
  "ar": {
    "base64": "Base64",
    "decimal": "عشري",
    "octal": "ثماني",
    "binary": "ثنائي",
    "hex": "سداسي عشري"
  },
  "hi": {
    "base64": "Base64",
    "decimal": "दशमलव",
    "octal": "अष्टाधारी",
    "binary": "द्विआधारी",
    "hex": "हेक्साडेसिमल"
  },
  "tr": {
    "base64": "Base64",
    "decimal": "Ondalık",
    "octal": "Sekizli",
    "binary": "İkili",
    "hex": "Onaltılı"
  },
  "nl": {
    "base64": "Base64",
    "decimal": "Decimaal",
    "octal": "Octaal",
    "binary": "Binair",
    "hex": "Hexadecimaal"
  },
  "sv": {
    "base64": "Base64",
    "decimal": "Decimal",
    "octal": "Oktal",
    "binary": "Binär",
    "hex": "Hexadecimal"
  },
  "pl": {
    "base64": "Base64",
    "decimal": "Dziesiętny",
    "octal": "Ósemkowy",
    "binary": "Binarny",
    "hex": "Szesnastkowy"
  },
  "vi": {
    "base64": "Base64",
    "decimal": "Thập phân",
    "octal": "Bát phân",
    "binary": "Nhị phân",
    "hex": "Thập lục phân"
  },
  "th": {
    "base64": "Base64",
    "decimal": "ฐานสิบ",
    "octal": "ฐานแปด",
    "binary": "ฐานสอง",
    "hex": "ฐานสิบหก"
  },
  "id": {
    "base64": "Base64",
    "decimal": "Desimal",
    "octal": "Oktal",
    "binary": "Biner",
    "hex": "Heksadesimal"
  },
  "he": {
    "base64": "Base64",
    "decimal": "עשרוני",
    "octal": "אוקטלי",
    "binary": "בינארי",
    "hex": "הקסדצימלי"
  },
  "ms": {
    "base64": "Base64",
    "decimal": "Perpuluhan",
    "octal": "Perlapanan",
    "binary": "Perduaan",
    "hex": "Perenambelasan"
  },
  "no": {
    "base64": "Base64",
    "decimal": "Desimal",
    "octal": "Oktal",
    "binary": "Binær",
    "hex": "Heksadesimal"
  }
}
</i18n>
