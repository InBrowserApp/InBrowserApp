<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <slot :copy="copy" />
    </template>
    <n-icon :component="Icon" />
    <span>{{ t('tooltip') }}</span>
  </n-tooltip>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { NTooltip, NIcon } from 'naive-ui'
import Icon from '@vicons/fluent/Clipboard16Regular'
import { useCopyToClipboard } from '../../../composables/base/clipboard/useCopyToClipboard'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  content: string | number | undefined
}>()
const content = toRef(props, 'content')
const { copy } = useCopyToClipboard(content)
const { t } = useI18n()
</script>

<style scoped>
.icon {
  margin-right: 0.3em;
  vertical-align: -0.15em;
}
</style>

<i18n lang="json">
{
  "en": {
    "tooltip": "Copy to Clipboard"
  },
  "zh": {
    "tooltip": "复制到剪贴板"
  },
  "zh-CN": {
    "tooltip": "复制到剪贴板"
  },
  "zh-TW": {
    "tooltip": "複製到剪貼簿"
  },
  "zh-HK": {
    "tooltip": "複製到剪貼簿"
  },
  "es": {
    "tooltip": "Copiar al portapapeles"
  },
  "fr": {
    "tooltip": "Copier dans le presse-papiers"
  },
  "de": {
    "tooltip": "In Zwischenablage kopieren"
  },
  "it": {
    "tooltip": "Copia negli appunti"
  },
  "ja": {
    "tooltip": "クリップボードにコピー"
  },
  "ko": {
    "tooltip": "클립보드에 복사"
  },
  "ru": {
    "tooltip": "Копировать в буфер обмена"
  },
  "pt": {
    "tooltip": "Copiar para a área de transferência"
  },
  "ar": {
    "tooltip": "نسخ إلى الحافظة"
  },
  "hi": {
    "tooltip": "क्लिपबोर्ड पर कॉपी करें"
  },
  "tr": {
    "tooltip": "Panoya kopyala"
  },
  "nl": {
    "tooltip": "Kopiëren naar klembord"
  },
  "sv": {
    "tooltip": "Kopiera till urklipp"
  },
  "pl": {
    "tooltip": "Kopiuj do schowka"
  },
  "vi": {
    "tooltip": "Sao chép vào bộ nhớ tạm"
  },
  "th": {
    "tooltip": "คัดลอกไปยังคลิปบอร์ด"
  },
  "id": {
    "tooltip": "Salin ke papan klip"
  },
  "he": {
    "tooltip": "העתק ללוח"
  },
  "ms": {
    "tooltip": "Salin ke papan klip"
  },
  "no": {
    "tooltip": "Kopier til utklippstavle"
  }
}
</i18n>
