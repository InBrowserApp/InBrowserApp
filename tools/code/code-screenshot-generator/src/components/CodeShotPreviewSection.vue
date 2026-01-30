<template>
  <ToolSectionHeader>{{ t('previewTitle') }}</ToolSectionHeader>
  <ToolSection>
    <CodeShotPreview
      :lines="lines"
      :line-numbers="lineNumbers"
      :layout="layout"
      :theme="theme"
      :background="background"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { BackgroundConfig, CodeShotLayout, StyledToken } from '../utils/render'
import type { Theme } from '../utils/themes'
import CodeShotPreview from './CodeShotPreview.vue'

defineProps<{
  lines: StyledToken[][]
  lineNumbers: string[]
  layout: CodeShotLayout
  theme: Theme
  background: BackgroundConfig
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Preview"
  },
  "zh": {
    "previewTitle": "预览"
  },
  "zh-CN": {
    "previewTitle": "预览"
  },
  "zh-TW": {
    "previewTitle": "預覽"
  },
  "zh-HK": {
    "previewTitle": "預覽"
  },
  "es": {
    "previewTitle": "Vista previa"
  },
  "fr": {
    "previewTitle": "Aperçu"
  },
  "de": {
    "previewTitle": "Vorschau"
  },
  "it": {
    "previewTitle": "Anteprima"
  },
  "ja": {
    "previewTitle": "プレビュー"
  },
  "ko": {
    "previewTitle": "미리보기"
  },
  "ru": {
    "previewTitle": "Предпросмотр"
  },
  "pt": {
    "previewTitle": "Pré-visualização"
  },
  "ar": {
    "previewTitle": "المعاينة"
  },
  "hi": {
    "previewTitle": "प्रीव्यू"
  },
  "tr": {
    "previewTitle": "Önizleme"
  },
  "nl": {
    "previewTitle": "Voorbeeld"
  },
  "sv": {
    "previewTitle": "Förhandsvisning"
  },
  "pl": {
    "previewTitle": "Podgląd"
  },
  "vi": {
    "previewTitle": "Xem trước"
  },
  "th": {
    "previewTitle": "ตัวอย่าง"
  },
  "id": {
    "previewTitle": "Pratinjau"
  },
  "he": {
    "previewTitle": "תצוגה מקדימה"
  },
  "ms": {
    "previewTitle": "Pratonton"
  },
  "no": {
    "previewTitle": "Forhåndsvisning"
  }
}
</i18n>
