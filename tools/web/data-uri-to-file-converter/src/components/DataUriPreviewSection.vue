<template>
  <template v-if="previewKind && previewKind !== 'text'">
    <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
    <ToolSection>
      <n-card v-if="previewKind === 'image'" size="small">
        <img :src="previewUrl" alt="Preview" style="max-width: 100%" />
      </n-card>
      <audio v-else-if="previewKind === 'audio'" :src="previewUrl" controls style="width: 100%" />
      <video v-else-if="previewKind === 'video'" :src="previewUrl" controls style="width: 100%" />
    </ToolSection>
  </template>

  <template v-if="previewKind === 'text' && textPreview">
    <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
    <ToolSection>
      <n-card size="small">
        <n-code :code="textPreview" word-wrap />
      </n-card>
    </ToolSection>
  </template>
</template>

<script setup lang="ts">
import { NCard, NCode } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()

defineProps<{
  previewKind: 'image' | 'audio' | 'video' | 'text' | null
  previewUrl: string
  textPreview: string
}>()
</script>

<i18n lang="json">
{
  "en": {
    "preview": "Preview"
  },
  "zh": {
    "preview": "预览"
  },
  "zh-CN": {
    "preview": "预览"
  },
  "zh-TW": {
    "preview": "預覽"
  },
  "zh-HK": {
    "preview": "預覽"
  },
  "es": {
    "preview": "Vista previa"
  },
  "fr": {
    "preview": "Aperçu"
  },
  "de": {
    "preview": "Vorschau"
  },
  "it": {
    "preview": "Anteprima"
  },
  "ja": {
    "preview": "プレビュー"
  },
  "ko": {
    "preview": "미리보기"
  },
  "ru": {
    "preview": "Предпросмотр"
  },
  "pt": {
    "preview": "Pré-visualização"
  },
  "ar": {
    "preview": "معاينة"
  },
  "hi": {
    "preview": "पूर्वावलोकन"
  },
  "tr": {
    "preview": "Önizleme"
  },
  "nl": {
    "preview": "Voorbeeld"
  },
  "sv": {
    "preview": "Förhandsvisning"
  },
  "pl": {
    "preview": "Podgląd"
  },
  "vi": {
    "preview": "Xem trước"
  },
  "th": {
    "preview": "ตัวอย่าง"
  },
  "id": {
    "preview": "Pratinjau"
  },
  "he": {
    "preview": "תצוגה מקדימה"
  },
  "ms": {
    "preview": "Pratonton"
  },
  "no": {
    "preview": "Forhåndsvisning"
  }
}
</i18n>
