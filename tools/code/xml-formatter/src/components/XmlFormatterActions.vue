<template>
  <n-flex align="center" justify="space-between" :wrap="true">
    <n-flex align="center" :wrap="true">
      <n-button text @click="$emit('import')">
        <template #icon>
          <n-icon :component="Document16Regular" />
        </template>
        {{ t('import-from-file') }}
      </n-button>
      <n-button text @click="$emit('use-example')">
        {{ t('use-example') }}
      </n-button>
      <n-button text @click="$emit('clear')">
        {{ t('clear') }}
      </n-button>
    </n-flex>

    <n-flex align="center" :wrap="true">
      <n-radio-group
        :value="selectedMode"
        name="xml-mode"
        size="small"
        @update:value="$emit('update:selected-mode', $event)"
      >
        <n-radio-button value="formatted">
          {{ t('formatted') }}
        </n-radio-button>
        <n-radio-button value="minified">
          {{ t('minified') }}
        </n-radio-button>
      </n-radio-group>

      <CopyToClipboardButton :content="outputXml" :disabled="!outputXml" />
      <n-button
        tag="a"
        text
        :href="downloadUrl"
        :download="downloadFileName"
        :tabindex="outputXml ? 0 : -1"
      >
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download-xml') }}
      </n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { NButton, NFlex, NIcon, NRadioButton, NRadioGroup } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import type { XmlOutputMode } from '../utils/xml'

defineProps<{
  downloadFileName: string
  downloadUrl?: string
  outputXml: string
  selectedMode: XmlOutputMode
}>()

defineEmits<{
  (e: 'clear'): void
  (e: 'import'): void
  (e: 'update:selected-mode', value: XmlOutputMode): void
  (e: 'use-example'): void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "zh": {
    "import-from-file": "从文件导入",
    "use-example": "使用示例",
    "clear": "清空",
    "formatted": "格式化",
    "minified": "压缩",
    "download-xml": "下载 XML"
  },
  "zh-CN": {
    "import-from-file": "从文件导入",
    "use-example": "使用示例",
    "clear": "清空",
    "formatted": "格式化",
    "minified": "压缩",
    "download-xml": "下载 XML"
  },
  "zh-TW": {
    "import-from-file": "從檔案匯入",
    "use-example": "使用範例",
    "clear": "清空",
    "formatted": "格式化",
    "minified": "壓縮",
    "download-xml": "下載 XML"
  },
  "zh-HK": {
    "import-from-file": "從檔案匯入",
    "use-example": "使用範例",
    "clear": "清空",
    "formatted": "格式化",
    "minified": "壓縮",
    "download-xml": "下載 XML"
  },
  "es": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "fr": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "de": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "it": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "ja": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "ko": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "ru": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "pt": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "ar": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "hi": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "tr": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "nl": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "sv": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "pl": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "vi": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "th": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "id": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "he": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "ms": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  },
  "no": {
    "import-from-file": "Import from file",
    "use-example": "Use example",
    "clear": "Clear",
    "formatted": "Formatted",
    "minified": "Minified",
    "download-xml": "Download XML"
  }
}
</i18n>
