<template>
  <InfoStatistic :label="t('primary-language')" :value="browserLanguage" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const browserLanguage = computed(() => navigator.language)
</script>

<i18n lang="json">
{
  "en": {
    "primary-language": "Primary Language"
  },
  "zh": {
    "primary-language": "主要语言"
  },
  "zh-CN": {
    "primary-language": "主要语言"
  },
  "zh-TW": {
    "primary-language": "主要語言"
  },
  "zh-HK": {
    "primary-language": "主要語言"
  },
  "es": {
    "primary-language": "Idioma Principal"
  },
  "fr": {
    "primary-language": "Langue Principale"
  },
  "de": {
    "primary-language": "Hauptsprache"
  },
  "it": {
    "primary-language": "Lingua Principale"
  },
  "ja": {
    "primary-language": "主要言語"
  },
  "ko": {
    "primary-language": "기본 언어"
  },
  "ru": {
    "primary-language": "Основной Язык"
  },
  "pt": {
    "primary-language": "Idioma Principal"
  },
  "ar": {
    "primary-language": "اللغة الرئيسية"
  },
  "hi": {
    "primary-language": "प्राथमिक भाषा"
  },
  "tr": {
    "primary-language": "Ana Dil"
  },
  "nl": {
    "primary-language": "Primaire Taal"
  },
  "sv": {
    "primary-language": "Primart Sprak"
  },
  "pl": {
    "primary-language": "Jezyk Glowny"
  },
  "vi": {
    "primary-language": "Ngon Ngu Chinh"
  },
  "th": {
    "primary-language": "ภาษาหลัก"
  },
  "id": {
    "primary-language": "Bahasa Utama"
  },
  "he": {
    "primary-language": "שפה ראשית"
  },
  "ms": {
    "primary-language": "Bahasa Utama"
  },
  "no": {
    "primary-language": "Hovedsprak"
  }
}
</i18n>
