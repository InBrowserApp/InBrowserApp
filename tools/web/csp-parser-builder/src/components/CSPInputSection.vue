<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-flex align="center" justify="space-between" :wrap="true" :size="12">
        <n-text depth="3">{{ t('detected') }}: {{ detectedInputKind }}</n-text>
        <n-flex :wrap="true" :size="8">
          <n-button text @click="importFromFile">{{ t('import') }}</n-button>
          <n-button text @click="applySample">{{ t('sample') }}</n-button>
          <n-button text @click="clearInput">{{ t('clear') }}</n-button>
        </n-flex>
      </n-flex>

      <n-input
        v-model:value="modelValue"
        class="monospace-input"
        type="textarea"
        :autosize="{ minRows: 8, maxRows: 18 }"
        :status="status"
        :placeholder="t('placeholder')"
      />

      <n-text v-if="feedback" type="error">{{ feedback }}</n-text>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NInput, NSpace, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  detectedInputKind: string
  status?: 'error' | 'success'
  feedback?: string
  importFromFile: () => Promise<void>
  applySample: () => void
  clearInput: () => void
}>()

const modelValue = defineModel<string>('value', { required: true })
const { t } = useI18n()
</script>

<style scoped>
.monospace-input :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "zh": {
    "title": "输入",
    "detected": "检测到",
    "import": "导入",
    "sample": "示例",
    "clear": "清空",
    "placeholder": "在此粘贴 CSP 标头、meta 标签或策略值..."
  },
  "zh-CN": {
    "title": "输入",
    "detected": "检测到",
    "import": "导入",
    "sample": "示例",
    "clear": "清空",
    "placeholder": "在此粘贴 CSP 标头、meta 标签或策略值..."
  },
  "zh-TW": {
    "title": "輸入",
    "detected": "偵測到",
    "import": "匯入",
    "sample": "範例",
    "clear": "清空",
    "placeholder": "在此貼上 CSP 標頭、meta 標籤或策略值..."
  },
  "zh-HK": {
    "title": "輸入",
    "detected": "偵測到",
    "import": "匯入",
    "sample": "範例",
    "clear": "清空",
    "placeholder": "在此貼上 CSP 標頭、meta 標籤或策略值..."
  },
  "es": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "fr": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "de": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "it": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "ja": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "ko": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "ru": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "pt": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "ar": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "hi": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "tr": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "nl": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "sv": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "pl": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "vi": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "th": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "id": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "he": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "ms": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  },
  "no": {
    "title": "Input",
    "detected": "Detected",
    "import": "Import",
    "sample": "Sample",
    "clear": "Clear",
    "placeholder": "Paste a CSP header, meta tag, or policy value here..."
  }
}
</i18n>
