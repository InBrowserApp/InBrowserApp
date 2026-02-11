<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('source-sql')" :show-feedback="false">
      <n-input
        v-model:value="sourceSql"
        type="textarea"
        :autosize="{ minRows: 12, maxRows: 26 }"
        :placeholder="t('input-placeholder')"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('formatted-sql')" :show-feedback="false">
      <n-alert v-if="formatError" type="error" :bordered="false">{{ formatError }}</n-alert>
      <n-card v-else size="small">
        <n-code v-if="formattedSql" :code="formattedSql" language="sql" :hljs="hljs" word-wrap />
        <n-text v-else depth="3">{{ t('output-empty') }}</n-text>
      </n-card>
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NCard, NCode, NFormItemGi, NGrid, NInput, NText } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import sql from 'highlight.js/lib/languages/sql'

defineProps<{
  formattedSql: string
  formatError: string
}>()

const sourceSql = defineModel<string>('sourceSql', { required: true })

hljs.registerLanguage('sql', sql)

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "zh": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此粘贴 SQL，支持多语句。",
    "output-empty": "格式化后的 SQL 将显示在这里。"
  },
  "zh-CN": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此粘贴 SQL，支持多语句。",
    "output-empty": "格式化后的 SQL 将显示在这里。"
  },
  "zh-TW": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此貼上 SQL，支援多語句。",
    "output-empty": "格式化後的 SQL 會顯示在這裡。"
  },
  "zh-HK": {
    "source-sql": "原始 SQL",
    "formatted-sql": "格式化 SQL",
    "input-placeholder": "在此貼上 SQL，支援多語句。",
    "output-empty": "格式化後的 SQL 會顯示在這裡。"
  },
  "es": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "fr": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "de": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "it": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "ja": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "ko": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "ru": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "pt": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "ar": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "hi": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "tr": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "nl": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "sv": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "pl": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "vi": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "th": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "id": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "he": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "ms": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  },
  "no": {
    "source-sql": "Source SQL",
    "formatted-sql": "Formatted SQL",
    "input-placeholder": "Paste SQL here...",
    "output-empty": "Formatting output appears here."
  }
}
</i18n>
