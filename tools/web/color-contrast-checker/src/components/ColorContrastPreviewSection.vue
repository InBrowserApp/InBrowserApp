<template>
  <ToolSectionHeader>{{ t('preview-title') }}</ToolSectionHeader>
  <ToolSection>
    <div class="preview" :style="previewStyle">
      <div class="preview-row">
        <div class="preview-label">{{ t('normal-text') }}</div>
        <div class="preview-text">{{ t('sample-text') }}</div>
      </div>
      <div class="preview-row">
        <div class="preview-label">{{ t('large-text') }}</div>
        <div class="preview-text preview-text-large">{{ t('sample-text') }}</div>
      </div>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  previewStyle: CSSProperties
}>()

const { t } = useI18n()
</script>

<style scoped>
.preview {
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-label {
  font-size: 12px;
  opacity: 0.7;
}

.preview-text {
  font-size: 16px;
}

.preview-text-large {
  font-size: 24px;
  font-weight: 600;
}
</style>

<i18n lang="json">
{
  "en": {
    "preview-title": "Preview",
    "normal-text": "Normal text",
    "large-text": "Large text",
    "sample-text": "Aa Bb Cc 123"
  },
  "zh": {
    "preview-title": "预览",
    "normal-text": "普通文本",
    "large-text": "大号文本",
    "sample-text": "Aa Bb Cc 123"
  },
  "zh-CN": {
    "preview-title": "预览",
    "normal-text": "普通文本",
    "large-text": "大号文本",
    "sample-text": "Aa Bb Cc 123"
  },
  "zh-TW": {
    "preview-title": "預覽",
    "normal-text": "一般文字",
    "large-text": "大字體文字",
    "sample-text": "Aa Bb Cc 123"
  },
  "zh-HK": {
    "preview-title": "預覽",
    "normal-text": "一般文字",
    "large-text": "大字體文字",
    "sample-text": "Aa Bb Cc 123"
  },
  "es": {
    "preview-title": "Vista previa",
    "normal-text": "Texto normal",
    "large-text": "Texto grande",
    "sample-text": "Aa Bb Cc 123"
  },
  "fr": {
    "preview-title": "Aperçu",
    "normal-text": "Texte normal",
    "large-text": "Texte grand",
    "sample-text": "Aa Bb Cc 123"
  },
  "de": {
    "preview-title": "Vorschau",
    "normal-text": "Normaler Text",
    "large-text": "Großer Text",
    "sample-text": "Aa Bb Cc 123"
  },
  "it": {
    "preview-title": "Anteprima",
    "normal-text": "Testo normale",
    "large-text": "Testo grande",
    "sample-text": "Aa Bb Cc 123"
  },
  "ja": {
    "preview-title": "プレビュー",
    "normal-text": "通常テキスト",
    "large-text": "大きいテキスト",
    "sample-text": "Aa Bb Cc 123"
  },
  "ko": {
    "preview-title": "미리보기",
    "normal-text": "일반 텍스트",
    "large-text": "큰 텍스트",
    "sample-text": "Aa Bb Cc 123"
  },
  "ru": {
    "preview-title": "Предпросмотр",
    "normal-text": "Обычный текст",
    "large-text": "Крупный текст",
    "sample-text": "Aa Bb Cc 123"
  },
  "pt": {
    "preview-title": "Prévia",
    "normal-text": "Texto normal",
    "large-text": "Texto grande",
    "sample-text": "Aa Bb Cc 123"
  },
  "ar": {
    "preview-title": "معاينة",
    "normal-text": "نص عادي",
    "large-text": "نص كبير",
    "sample-text": "Aa Bb Cc 123"
  },
  "hi": {
    "preview-title": "पूर्वावलोकन",
    "normal-text": "सामान्य टेक्स्ट",
    "large-text": "बड़ा टेक्स्ट",
    "sample-text": "Aa Bb Cc 123"
  },
  "tr": {
    "preview-title": "Önizleme",
    "normal-text": "Normal metin",
    "large-text": "Büyük metin",
    "sample-text": "Aa Bb Cc 123"
  },
  "nl": {
    "preview-title": "Voorbeeld",
    "normal-text": "Normale tekst",
    "large-text": "Grote tekst",
    "sample-text": "Aa Bb Cc 123"
  },
  "sv": {
    "preview-title": "Förhandsgranskning",
    "normal-text": "Normal text",
    "large-text": "Stor text",
    "sample-text": "Aa Bb Cc 123"
  },
  "pl": {
    "preview-title": "Podgląd",
    "normal-text": "Tekst normalny",
    "large-text": "Tekst duży",
    "sample-text": "Aa Bb Cc 123"
  },
  "vi": {
    "preview-title": "Xem trước",
    "normal-text": "Chữ thường",
    "large-text": "Chữ lớn",
    "sample-text": "Aa Bb Cc 123"
  },
  "th": {
    "preview-title": "ตัวอย่าง",
    "normal-text": "ข้อความปกติ",
    "large-text": "ข้อความขนาดใหญ่",
    "sample-text": "Aa Bb Cc 123"
  },
  "id": {
    "preview-title": "Pratinjau",
    "normal-text": "Teks normal",
    "large-text": "Teks besar",
    "sample-text": "Aa Bb Cc 123"
  },
  "he": {
    "preview-title": "תצוגה מקדימה",
    "normal-text": "טקסט רגיל",
    "large-text": "טקסט גדול",
    "sample-text": "Aa Bb Cc 123"
  },
  "ms": {
    "preview-title": "Pratonton",
    "normal-text": "Teks biasa",
    "large-text": "Teks besar",
    "sample-text": "Aa Bb Cc 123"
  },
  "no": {
    "preview-title": "Forhåndsvisning",
    "normal-text": "Normal tekst",
    "large-text": "Stor tekst",
    "sample-text": "Aa Bb Cc 123"
  }
}
</i18n>
