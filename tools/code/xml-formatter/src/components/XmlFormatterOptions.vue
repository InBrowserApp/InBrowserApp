<template>
  <n-flex align="center" justify="space-between" :wrap="true">
    <n-flex align="center" :wrap="true">
      <n-text :depth="3">{{ t('indentation') }}:</n-text>
      <n-select
        :value="selectedIndentation"
        :options="indentationOptions"
        size="small"
        style="width: 140px"
        :disabled="selectedMode === 'minified'"
        @update:value="$emit('update:selected-indentation', $event)"
      />
      <n-text :depth="3">{{ t('line-endings') }}:</n-text>
      <n-select
        :value="selectedLineEnding"
        :options="lineEndingOptions"
        size="small"
        style="width: 110px"
        :disabled="selectedMode === 'minified'"
        @update:value="$emit('update:selected-line-ending', $event)"
      />
    </n-flex>

    <n-flex align="center" :wrap="true">
      <n-checkbox
        :checked="collapseContent"
        @update:checked="$emit('update:collapse-content', $event)"
      >
        {{ t('inline-text') }}
      </n-checkbox>
      <n-checkbox
        :checked="forceSelfClosingEmptyTag"
        @update:checked="$emit('update:force-self-closing-empty-tag', $event)"
      >
        {{ t('self-close-empty') }}
      </n-checkbox>
      <n-tag v-if="hasValidXml" type="success">
        {{ t('valid-xml') }}
      </n-tag>
      <n-tag v-else-if="hasInvalidXml" type="error">
        {{ t('invalid-xml') }}
      </n-tag>
      <n-text v-if="hasInvalidXml" type="error"> {{ errorLine }}:{{ errorColumn }} </n-text>
      <n-text depth="3">{{ t('browser-only-note') }}</n-text>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCheckbox, NFlex, NSelect, NTag, NText } from 'naive-ui'
import type { XmlIndentation, XmlLineEnding, XmlOutputMode } from '../utils/xml'

defineProps<{
  collapseContent: boolean
  errorColumn?: number
  errorLine?: number
  forceSelfClosingEmptyTag: boolean
  hasInvalidXml: boolean
  hasValidXml: boolean
  selectedIndentation: XmlIndentation
  selectedLineEnding: XmlLineEnding
  selectedMode: XmlOutputMode
}>()

defineEmits<{
  (e: 'update:collapse-content', value: boolean): void
  (e: 'update:force-self-closing-empty-tag', value: boolean): void
  (e: 'update:selected-indentation', value: XmlIndentation): void
  (e: 'update:selected-line-ending', value: XmlLineEnding): void
}>()

const { t } = useI18n({ useScope: 'local' })

const indentationOptions = computed(() => [
  { label: t('two-spaces'), value: '2-spaces' },
  { label: t('four-spaces'), value: '4-spaces' },
  { label: t('tab'), value: 'tab' },
])

const lineEndingOptions: Array<{ label: string; value: XmlLineEnding }> = [
  { label: 'LF', value: 'lf' },
  { label: 'CRLF', value: 'crlf' },
]
</script>

<i18n lang="json">
{
  "en": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "zh": {
    "indentation": "缩进",
    "line-endings": "换行符",
    "two-spaces": "2 个空格",
    "four-spaces": "4 个空格",
    "tab": "Tab",
    "inline-text": "将文本节点保持在同一行",
    "self-close-empty": "空标签使用自闭合形式",
    "valid-xml": "XML 有效",
    "invalid-xml": "XML 无效",
    "browser-only-note": "所有处理都在浏览器本地完成"
  },
  "zh-CN": {
    "indentation": "缩进",
    "line-endings": "换行符",
    "two-spaces": "2 个空格",
    "four-spaces": "4 个空格",
    "tab": "Tab",
    "inline-text": "将文本节点保持在同一行",
    "self-close-empty": "空标签使用自闭合形式",
    "valid-xml": "XML 有效",
    "invalid-xml": "XML 无效",
    "browser-only-note": "所有处理都在浏览器本地完成"
  },
  "zh-TW": {
    "indentation": "縮排",
    "line-endings": "換行符號",
    "two-spaces": "2 個空格",
    "four-spaces": "4 個空格",
    "tab": "Tab",
    "inline-text": "將文字節點保留在同一行",
    "self-close-empty": "空標籤使用自閉合形式",
    "valid-xml": "XML 有效",
    "invalid-xml": "XML 無效",
    "browser-only-note": "所有處理都在瀏覽器本機完成"
  },
  "zh-HK": {
    "indentation": "縮排",
    "line-endings": "換行符號",
    "two-spaces": "2 個空格",
    "four-spaces": "4 個空格",
    "tab": "Tab",
    "inline-text": "將文字節點保留在同一行",
    "self-close-empty": "空標籤使用自閉合形式",
    "valid-xml": "XML 有效",
    "invalid-xml": "XML 無效",
    "browser-only-note": "所有處理都在瀏覽器本機完成"
  },
  "es": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "fr": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "de": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "it": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "ja": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "ko": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "ru": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "pt": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "ar": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "hi": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "tr": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "nl": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "sv": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "pl": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "vi": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "th": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "id": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "he": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "ms": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  },
  "no": {
    "indentation": "Indentation",
    "line-endings": "Line endings",
    "two-spaces": "2 spaces",
    "four-spaces": "4 spaces",
    "tab": "Tab",
    "inline-text": "Keep text nodes inline",
    "self-close-empty": "Self-close empty tags",
    "valid-xml": "Valid XML",
    "invalid-xml": "Invalid XML",
    "browser-only-note": "Runs locally in your browser"
  }
}
</i18n>
