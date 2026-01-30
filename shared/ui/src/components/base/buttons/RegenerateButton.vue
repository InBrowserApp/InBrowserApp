<template>
  <n-button text @click="emit('click')">
    <template #icon>
      <slot name="icon">
        <n-icon :component="Icon" />
      </slot>
    </template>
    <slot name="label">
      {{ t('label') }}
    </slot>
  </n-button>
</template>

<script setup lang="ts">
import { NIcon, NButton } from 'naive-ui'
import Icon from '@vicons/ionicons5/RefreshOutline'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<i18n lang="json">
{
  "en": {
    "label": "Regenerate"
  },
  "zh": {
    "label": "重新生成"
  },
  "zh-CN": {
    "label": "重新生成"
  },
  "zh-TW": {
    "label": "重新生成"
  },
  "zh-HK": {
    "label": "重新生成"
  },
  "es": {
    "label": "Regenerar"
  },
  "fr": {
    "label": "Régénérer"
  },
  "de": {
    "label": "Neu generieren"
  },
  "it": {
    "label": "Rigenera"
  },
  "ja": {
    "label": "再生成"
  },
  "ko": {
    "label": "재생성"
  },
  "ru": {
    "label": "Перегенерировать"
  },
  "pt": {
    "label": "Regenerar"
  },
  "ar": {
    "label": "إعادة التوليد"
  },
  "hi": {
    "label": "पुनः उत्पन्न करें"
  },
  "tr": {
    "label": "Yeniden Oluştur"
  },
  "nl": {
    "label": "Opnieuw genereren"
  },
  "sv": {
    "label": "Återskapa"
  },
  "pl": {
    "label": "Wygeneruj ponownie"
  },
  "vi": {
    "label": "Tạo lại"
  },
  "th": {
    "label": "สร้างใหม่"
  },
  "id": {
    "label": "Buat Ulang"
  },
  "he": {
    "label": "ליצור מחדש"
  },
  "ms": {
    "label": "Jana Semula"
  },
  "no": {
    "label": "Regenerer"
  }
}
</i18n>
