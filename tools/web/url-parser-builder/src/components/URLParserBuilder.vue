<template>
  <div>
    <!-- URL Input/Output Section -->
    <ToolSectionHeader>URL</ToolSectionHeader>
    <ToolSection>
      <URLInput v-model:url="urlString" />
    </ToolSection>
    <ToolSection>
      <n-flex justify="space-between">
        <CopyToClipboardButton :content="urlString" />
      </n-flex>
    </ToolSection>

    <!-- URL Components Section -->
    <ToolSectionHeader>{{ t('url-components') }}</ToolSectionHeader>
    <URLComponents v-model:url="urlString" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NFlex } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useStorage } from '@vueuse/core'
import URLInput from './URLInput.vue'
import URLComponents from './URLComponents.vue'
import { syncRef } from '@vueuse/core'

const { t } = useI18n()

const urlString = useStorage<string>(
  'tools:url-parser-builder:url',
  'https://user:pass@example.com:8080/path/to/resource?param1=value1&param2=value2#section1',
)
const url = ref<URL>(new URL(urlString.value))
syncRef(url, urlString, {
  transform: {
    ltr: (left) => left.toString(),
    rtl: (right) => new URL(right ?? ''),
  },
})
</script>

<i18n lang="json">
{
  "en": {
    "url-components": "URL Components"
  },
  "zh": {
    "url-components": "URL 组件"
  },
  "zh-CN": {
    "url-components": "URL 组件"
  },
  "zh-TW": {
    "url-components": "URL 組件"
  },
  "zh-HK": {
    "url-components": "URL 組件"
  },
  "es": {
    "url-components": "Componentes de URL"
  },
  "fr": {
    "url-components": "Composants d'URL"
  },
  "de": {
    "url-components": "URL-Komponenten"
  },
  "it": {
    "url-components": "Componenti URL"
  },
  "ja": {
    "url-components": "URLコンポーネント"
  },
  "ko": {
    "url-components": "URL 구성 요소"
  },
  "ru": {
    "url-components": "Компоненты URL"
  },
  "pt": {
    "url-components": "Componentes da URL"
  },
  "ar": {
    "url-components": "مكونات URL"
  },
  "hi": {
    "url-components": "URL घटक"
  },
  "tr": {
    "url-components": "URL Bileşenleri"
  },
  "nl": {
    "url-components": "URL-componenten"
  },
  "sv": {
    "url-components": "URL-komponenter"
  },
  "pl": {
    "url-components": "Komponenty URL"
  },
  "vi": {
    "url-components": "Thành phần URL"
  },
  "th": {
    "url-components": "ส่วนประกอบ URL"
  },
  "id": {
    "url-components": "Komponen URL"
  },
  "he": {
    "url-components": "רכיבי URL"
  },
  "ms": {
    "url-components": "Komponen URL"
  },
  "no": {
    "url-components": "URL-komponenter"
  }
}
</i18n>
