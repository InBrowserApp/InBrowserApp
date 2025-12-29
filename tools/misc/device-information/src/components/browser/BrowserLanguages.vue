<template>
  <InfoStatistic :label="t('browser-languages')" :value="browserLanguages" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const browserLanguages = computed(() => navigator.languages.join(', '))
</script>

<i18n lang="json">
{
  "en": {
    "browser-languages": "Supported Languages"
  },
  "zh": {
    "browser-languages": "支持语言"
  },
  "zh-CN": {
    "browser-languages": "支持语言"
  },
  "zh-TW": {
    "browser-languages": "支援語言"
  },
  "zh-HK": {
    "browser-languages": "支援語言"
  },
  "es": {
    "browser-languages": "Idiomas Soportados"
  },
  "fr": {
    "browser-languages": "Langues Prises en Charge"
  },
  "de": {
    "browser-languages": "Unterstutzte Sprachen"
  },
  "it": {
    "browser-languages": "Lingue Supportate"
  },
  "ja": {
    "browser-languages": "対応言語"
  },
  "ko": {
    "browser-languages": "지원 언어"
  },
  "ru": {
    "browser-languages": "Поддерживаемые Языки"
  },
  "pt": {
    "browser-languages": "Idiomas Suportados"
  },
  "ar": {
    "browser-languages": "اللغات المدعومة"
  },
  "hi": {
    "browser-languages": "समर्थित भाषाएं"
  },
  "tr": {
    "browser-languages": "Desteklenen Diller"
  },
  "nl": {
    "browser-languages": "Ondersteunde Talen"
  },
  "sv": {
    "browser-languages": "Sprak som Stods"
  },
  "pl": {
    "browser-languages": "Obslugiwane Jezyki"
  },
  "vi": {
    "browser-languages": "Ngon Ngu Ho Tro"
  },
  "th": {
    "browser-languages": "ภาษาที่รองรับ"
  },
  "id": {
    "browser-languages": "Bahasa yang Didukung"
  },
  "he": {
    "browser-languages": "שפות נתמכות"
  },
  "ms": {
    "browser-languages": "Bahasa yang Disokong"
  },
  "no": {
    "browser-languages": "Stottede Sprak"
  }
}
</i18n>
