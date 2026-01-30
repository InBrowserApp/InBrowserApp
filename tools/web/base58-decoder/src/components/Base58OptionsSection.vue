<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-form-item :label="t('alphabet')" label-placement="left">
      <n-select v-model:value="alphabet" :options="alphabetOptions" style="width: 220px" />
    </n-form-item>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItem, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { Base58AlphabetKey } from '@utils/base58'

const alphabet = defineModel<Base58AlphabetKey>('value', { required: true })

const { t } = useI18n({ useScope: 'local' })

const alphabetOptions = computed(() => [
  { label: t('alphabet-bitcoin'), value: 'bitcoin' as Base58AlphabetKey },
  { label: t('alphabet-flickr'), value: 'flickr' as Base58AlphabetKey },
  { label: t('alphabet-ripple'), value: 'ripple' as Base58AlphabetKey },
])
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "alphabet": "Alphabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "zh": {
    "options": "选项",
    "alphabet": "字母表",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "zh-CN": {
    "options": "选项",
    "alphabet": "字母表",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "zh-TW": {
    "options": "選項",
    "alphabet": "字母表",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "zh-HK": {
    "options": "選項",
    "alphabet": "字母表",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "es": {
    "options": "Opciones",
    "alphabet": "Alfabeto",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "fr": {
    "options": "Options",
    "alphabet": "Alphabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "de": {
    "options": "Optionen",
    "alphabet": "Alphabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "it": {
    "options": "Opzioni",
    "alphabet": "Alfabeto",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ja": {
    "options": "オプション",
    "alphabet": "アルファベット",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ko": {
    "options": "옵션",
    "alphabet": "알파벳",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ru": {
    "options": "Параметры",
    "alphabet": "Алфавит",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "pt": {
    "options": "Opções",
    "alphabet": "Alfabeto",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ar": {
    "options": "الخيارات",
    "alphabet": "الأبجدية",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "hi": {
    "options": "विकल्प",
    "alphabet": "वर्णमाला",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "tr": {
    "options": "Seçenekler",
    "alphabet": "Alfabe",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "nl": {
    "options": "Opties",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "sv": {
    "options": "Alternativ",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "pl": {
    "options": "Opcje",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "vi": {
    "options": "Tùy chọn",
    "alphabet": "Bảng chữ cái",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "th": {
    "options": "ตัวเลือก",
    "alphabet": "อักษร",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "id": {
    "options": "Opsi",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "he": {
    "options": "אפשרויות",
    "alphabet": "אלפבית",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "ms": {
    "options": "Pilihan",
    "alphabet": "Abjad",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  },
  "no": {
    "options": "Alternativer",
    "alphabet": "Alfabet",
    "alphabet-bitcoin": "Bitcoin",
    "alphabet-flickr": "Flickr",
    "alphabet-ripple": "Ripple (XRP)"
  }
}
</i18n>
