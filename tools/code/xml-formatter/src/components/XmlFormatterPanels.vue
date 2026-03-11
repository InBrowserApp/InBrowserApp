<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
    <n-gi>
      <n-flex vertical :size="8">
        <n-text strong>{{ t('source-xml') }}</n-text>
        <n-input
          :value="sourceXml"
          type="textarea"
          :autosize="{ minRows: 14, maxRows: 24 }"
          :placeholder="t('source-placeholder')"
          :status="isInvalid ? 'error' : undefined"
          @update:value="$emit('update:source-xml', $event)"
        />
      </n-flex>
    </n-gi>

    <n-gi>
      <n-flex vertical :size="8">
        <n-text strong>{{ t('output-xml') }}</n-text>
        <n-card size="small">
          <n-alert v-if="isInvalid" type="error" :title="t('invalid-xml')">
            <n-flex vertical :size="8">
              <n-text>{{ errorMessage }}</n-text>
              <n-text type="error">{{ lineAndColumnText }}</n-text>
              <n-flex vertical :size="4">
                <n-text strong>{{ t('error-context') }}</n-text>
                <pre :class="$style.context">{{ errorContext }}</pre>
              </n-flex>
            </n-flex>
          </n-alert>
          <n-empty v-else-if="!outputXml" size="small" :description="t('output-placeholder')" />
          <n-code v-else :code="outputXml" language="xml" :hljs="hljs" word-wrap />
        </n-card>
      </n-flex>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NCard, NCode, NEmpty, NFlex, NGi, NGrid, NInput, NText } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import xmlLang from 'highlight.js/lib/languages/xml'

const props = defineProps<{
  errorColumn?: number
  errorContext: string
  errorLine?: number
  errorMessage: string
  isInvalid: boolean
  outputXml: string
  sourceXml: string
}>()

defineEmits<{
  (e: 'update:source-xml', value: string): void
}>()

hljs.registerLanguage('xml', xmlLang)

const { t } = useI18n({ useScope: 'local' })

const lineAndColumnText = computed(() => {
  if (props.errorLine == null || props.errorColumn == null) {
    return ''
  }

  return t('line-and-column', {
    line: props.errorLine,
    column: props.errorColumn,
  })
})
</script>

<style module>
.context {
  margin: 0;
  overflow-x: auto;
  white-space: pre;
  font-family: var(--n-font-family-mono);
}
</style>

<i18n lang="json">
{
  "en": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "zh": {
    "source-xml": "源 XML",
    "output-xml": "输出 XML",
    "source-placeholder": "在此粘贴 XML...",
    "output-placeholder": "当输入有效时，这里会显示格式化或压缩后的 XML。",
    "invalid-xml": "XML 无效",
    "line-and-column": "第 {line} 行，第 {column} 列",
    "error-context": "错误上下文"
  },
  "zh-CN": {
    "source-xml": "源 XML",
    "output-xml": "输出 XML",
    "source-placeholder": "在此粘贴 XML...",
    "output-placeholder": "当输入有效时，这里会显示格式化或压缩后的 XML。",
    "invalid-xml": "XML 无效",
    "line-and-column": "第 {line} 行，第 {column} 列",
    "error-context": "错误上下文"
  },
  "zh-TW": {
    "source-xml": "來源 XML",
    "output-xml": "輸出 XML",
    "source-placeholder": "在此貼上 XML...",
    "output-placeholder": "當輸入有效時，這裡會顯示格式化或壓縮後的 XML。",
    "invalid-xml": "XML 無效",
    "line-and-column": "第 {line} 行，第 {column} 欄",
    "error-context": "錯誤內容"
  },
  "zh-HK": {
    "source-xml": "來源 XML",
    "output-xml": "輸出 XML",
    "source-placeholder": "在此貼上 XML...",
    "output-placeholder": "當輸入有效時，這裡會顯示格式化或壓縮後的 XML。",
    "invalid-xml": "XML 無效",
    "line-and-column": "第 {line} 行，第 {column} 欄",
    "error-context": "錯誤內容"
  },
  "es": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "fr": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "de": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "it": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "ja": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "ko": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "ru": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "pt": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "ar": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "hi": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "tr": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "nl": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "sv": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "pl": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "vi": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "th": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "id": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "he": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "ms": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  },
  "no": {
    "source-xml": "Source XML",
    "output-xml": "Output XML",
    "source-placeholder": "Paste XML here...",
    "output-placeholder": "Formatted or minified XML will appear here when the input is valid.",
    "invalid-xml": "Invalid XML",
    "line-and-column": "Line {line}, column {column}",
    "error-context": "Error context"
  }
}
</i18n>
