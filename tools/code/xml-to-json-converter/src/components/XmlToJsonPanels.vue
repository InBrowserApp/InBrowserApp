<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('xml')" :show-feedback="false">
      <n-input v-model:value="xml" type="textarea" autosize :placeholder="t('xml-placeholder')" />
    </n-form-item-gi>
    <n-form-item-gi :label="t('json')" :show-feedback="false">
      <n-card size="small">
        <n-code :code="renderedJson" language="json" :hljs="hljs" word-wrap></n-code>
      </n-card>
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NCard, NCode, NFormItemGi, NGrid, NInput } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', jsonLang)

defineProps<{
  renderedJson: string
}>()

const xml = defineModel<string>('xml', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "xml": "XML",
    "xml-placeholder": "Paste XML here...",
    "json": "JSON"
  },
  "zh": {
    "xml": "XML",
    "xml-placeholder": "在此粘贴 XML...",
    "json": "JSON"
  },
  "zh-CN": {
    "xml": "XML",
    "xml-placeholder": "在此粘贴 XML...",
    "json": "JSON"
  },
  "zh-TW": {
    "xml": "XML",
    "xml-placeholder": "在此貼上 XML...",
    "json": "JSON"
  },
  "zh-HK": {
    "xml": "XML",
    "xml-placeholder": "在此貼上 XML...",
    "json": "JSON"
  },
  "es": {
    "xml": "XML",
    "xml-placeholder": "Pega XML aquí...",
    "json": "JSON"
  },
  "fr": {
    "xml": "XML",
    "xml-placeholder": "Collez du XML ici...",
    "json": "JSON"
  },
  "de": {
    "xml": "XML",
    "xml-placeholder": "XML hier einfügen...",
    "json": "JSON"
  },
  "it": {
    "xml": "XML",
    "xml-placeholder": "Incolla XML qui...",
    "json": "JSON"
  },
  "ja": {
    "xml": "XML",
    "xml-placeholder": "ここにXMLを貼り付け...",
    "json": "JSON"
  },
  "ko": {
    "xml": "XML",
    "xml-placeholder": "여기에 XML 붙여넣기...",
    "json": "JSON"
  },
  "ru": {
    "xml": "XML",
    "xml-placeholder": "Вставьте XML здесь...",
    "json": "JSON"
  },
  "pt": {
    "xml": "XML",
    "xml-placeholder": "Cole XML aqui...",
    "json": "JSON"
  },
  "ar": {
    "xml": "XML",
    "xml-placeholder": "الصق XML هنا...",
    "json": "JSON"
  },
  "hi": {
    "xml": "XML",
    "xml-placeholder": "यहाँ XML पेस्ट करें...",
    "json": "JSON"
  },
  "tr": {
    "xml": "XML",
    "xml-placeholder": "Buraya XML yapıştırın...",
    "json": "JSON"
  },
  "nl": {
    "xml": "XML",
    "xml-placeholder": "Plak hier XML...",
    "json": "JSON"
  },
  "sv": {
    "xml": "XML",
    "xml-placeholder": "Klistra in XML här...",
    "json": "JSON"
  },
  "pl": {
    "xml": "XML",
    "xml-placeholder": "Wklej tutaj XML...",
    "json": "JSON"
  },
  "vi": {
    "xml": "XML",
    "xml-placeholder": "Dán XML vào đây...",
    "json": "JSON"
  },
  "th": {
    "xml": "XML",
    "xml-placeholder": "วาง XML ที่นี่...",
    "json": "JSON"
  },
  "id": {
    "xml": "XML",
    "xml-placeholder": "Tempel XML di sini...",
    "json": "JSON"
  },
  "he": {
    "xml": "XML",
    "xml-placeholder": "הדביקו XML כאן...",
    "json": "JSON"
  },
  "ms": {
    "xml": "XML",
    "xml-placeholder": "Tampal XML di sini...",
    "json": "JSON"
  },
  "no": {
    "xml": "XML",
    "xml-placeholder": "Lim inn XML her...",
    "json": "JSON"
  }
}
</i18n>
