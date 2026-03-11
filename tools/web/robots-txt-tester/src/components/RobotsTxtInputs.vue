<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-flex vertical :size="12">
      <n-flex justify="space-between" align="center" wrap>
        <n-flex :size="8" wrap>
          <n-tag size="small" round>{{ t('groups') }}: {{ groupCount }}</n-tag>
          <n-tag size="small" round>{{ t('sitemaps') }}: {{ sitemapCount }}</n-tag>
          <n-tag size="small" round>{{ t('warnings') }}: {{ warningCount }}</n-tag>
          <n-tag size="small" round>{{ t('otherDirectives') }}: {{ otherDirectiveCount }}</n-tag>
        </n-flex>

        <n-flex :size="8" wrap>
          <n-button size="small" @click="emit('update:modelValue', exampleValue)">
            {{ t('useExample') }}
          </n-button>
          <n-button size="small" @click="importFromFile">{{ t('import') }}</n-button>
          <n-button size="small" quaternary @click="emit('update:modelValue', '')">
            {{ t('clear') }}
          </n-button>
        </n-flex>
      </n-flex>

      <n-input
        type="textarea"
        :value="modelValue"
        :placeholder="t('placeholder')"
        :autosize="{ minRows: 12, maxRows: 20 }"
        @update:value="emit('update:modelValue', $event)"
      />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NInput, NTag } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { fileOpen } from 'browser-fs-access'

const props = defineProps<{
  modelValue: string
  exampleValue: string
  groupCount: number
  sitemapCount: number
  warningCount: number
  otherDirectiveCount: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n({ useScope: 'local' })

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({
      extensions: ['.txt'],
      mimeTypes: ['text/plain'],
    })
    emit('update:modelValue', await file.text())
  } catch {
    // User canceled file selection.
  }
}

void props
</script>

<i18n lang="json">
{
  "en": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "zh": {
    "title": "robots.txt 输入",
    "groups": "分组",
    "sitemaps": "Sitemap",
    "warnings": "警告",
    "otherDirectives": "其他指令",
    "useExample": "使用示例",
    "import": "导入文件",
    "clear": "清空",
    "placeholder": "在此粘贴 robots.txt..."
  },
  "zh-CN": {
    "title": "robots.txt 输入",
    "groups": "分组",
    "sitemaps": "Sitemap",
    "warnings": "警告",
    "otherDirectives": "其他指令",
    "useExample": "使用示例",
    "import": "导入文件",
    "clear": "清空",
    "placeholder": "在此粘贴 robots.txt..."
  },
  "zh-TW": {
    "title": "robots.txt 輸入",
    "groups": "群組",
    "sitemaps": "Sitemap",
    "warnings": "警告",
    "otherDirectives": "其他指令",
    "useExample": "使用範例",
    "import": "匯入檔案",
    "clear": "清空",
    "placeholder": "在此貼上 robots.txt..."
  },
  "zh-HK": {
    "title": "robots.txt 輸入",
    "groups": "群組",
    "sitemaps": "Sitemap",
    "warnings": "警告",
    "otherDirectives": "其他指令",
    "useExample": "使用範例",
    "import": "匯入檔案",
    "clear": "清空",
    "placeholder": "在此貼上 robots.txt..."
  },
  "es": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "fr": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "de": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "it": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "ja": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "ko": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "ru": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "pt": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "ar": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "hi": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "tr": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "nl": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "sv": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "pl": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "vi": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "th": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "id": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "he": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "ms": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  },
  "no": {
    "title": "robots.txt Input",
    "groups": "Groups",
    "sitemaps": "Sitemaps",
    "warnings": "Warnings",
    "otherDirectives": "Other directives",
    "useExample": "Use example",
    "import": "Import file",
    "clear": "Clear",
    "placeholder": "Paste robots.txt here..."
  }
}
</i18n>
