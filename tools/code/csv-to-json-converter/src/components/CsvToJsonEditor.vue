<template>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('csv')" :show-feedback="false">
        <n-input
          v-model:value="csvText"
          type="textarea"
          autosize
          :placeholder="t('csv-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('json')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="renderedJson" language="json" :hljs="hljs" word-wrap></n-code>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import { NCard, NCode, NFormItemGi, NGrid, NInput } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', jsonLang)

defineProps<{
  renderedJson: string
}>()

const csvText = defineModel<string>('csvText', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "csv": "CSV",
    "csv-placeholder": "Paste CSV here...",
    "json": "JSON"
  },
  "zh": {
    "csv": "CSV",
    "csv-placeholder": "在此粘贴 CSV...",
    "json": "JSON"
  },
  "zh-CN": {
    "csv": "CSV",
    "csv-placeholder": "在此粘贴 CSV...",
    "json": "JSON"
  },
  "zh-TW": {
    "csv": "CSV",
    "csv-placeholder": "在此貼上 CSV...",
    "json": "JSON"
  },
  "zh-HK": {
    "csv": "CSV",
    "csv-placeholder": "在此貼上 CSV...",
    "json": "JSON"
  },
  "es": {
    "csv": "CSV",
    "csv-placeholder": "Pega CSV aquí...",
    "json": "JSON"
  },
  "fr": {
    "csv": "CSV",
    "csv-placeholder": "Collez du CSV ici...",
    "json": "JSON"
  },
  "de": {
    "csv": "CSV",
    "csv-placeholder": "CSV hier einfügen...",
    "json": "JSON"
  },
  "it": {
    "csv": "CSV",
    "csv-placeholder": "Incolla CSV qui...",
    "json": "JSON"
  },
  "ja": {
    "csv": "CSV",
    "csv-placeholder": "ここにCSVを貼り付け...",
    "json": "JSON"
  },
  "ko": {
    "csv": "CSV",
    "csv-placeholder": "여기에 CSV 붙여넣기...",
    "json": "JSON"
  },
  "ru": {
    "csv": "CSV",
    "csv-placeholder": "Вставьте CSV здесь...",
    "json": "JSON"
  },
  "pt": {
    "csv": "CSV",
    "csv-placeholder": "Cole CSV aqui...",
    "json": "JSON"
  },
  "ar": {
    "csv": "CSV",
    "csv-placeholder": "الصق CSV هنا...",
    "json": "JSON"
  },
  "hi": {
    "csv": "CSV",
    "csv-placeholder": "यहाँ CSV पेस्ट करें...",
    "json": "JSON"
  },
  "tr": {
    "csv": "CSV",
    "csv-placeholder": "Buraya CSV yapıştırın...",
    "json": "JSON"
  },
  "nl": {
    "csv": "CSV",
    "csv-placeholder": "Plak hier CSV...",
    "json": "JSON"
  },
  "sv": {
    "csv": "CSV",
    "csv-placeholder": "Klistra in CSV här...",
    "json": "JSON"
  },
  "pl": {
    "csv": "CSV",
    "csv-placeholder": "Wklej tutaj CSV...",
    "json": "JSON"
  },
  "vi": {
    "csv": "CSV",
    "csv-placeholder": "Dán CSV vào đây...",
    "json": "JSON"
  },
  "th": {
    "csv": "CSV",
    "csv-placeholder": "วาง CSV ที่นี่...",
    "json": "JSON"
  },
  "id": {
    "csv": "CSV",
    "csv-placeholder": "Tempel CSV di sini...",
    "json": "JSON"
  },
  "he": {
    "csv": "CSV",
    "csv-placeholder": "הדביקו CSV כאן...",
    "json": "JSON"
  },
  "ms": {
    "csv": "CSV",
    "csv-placeholder": "Tampal CSV di sini...",
    "json": "JSON"
  },
  "no": {
    "csv": "CSV",
    "csv-placeholder": "Lim inn CSV her...",
    "json": "JSON"
  }
}
</i18n>
