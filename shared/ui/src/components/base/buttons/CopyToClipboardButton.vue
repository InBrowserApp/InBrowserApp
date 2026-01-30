<template>
  <n-button
    :text="variant === 'text'"
    :tertiary="variant === 'tertiary'"
    :secondary="variant === 'secondary'"
    :quaternary="variant === 'quaternary'"
    :disabled="disabled"
    @click="onClick"
  >
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
import Icon from '@vicons/fluent/Clipboard16Regular'
import { useI18n } from 'vue-i18n'
import { useCopyToClipboard } from '../../../composables/base/clipboard/useCopyToClipboard'
import { computed, toRef } from 'vue'

const props = defineProps<{
  content?: string | number
  variant?: 'text' | 'tertiary' | 'secondary' | 'quaternary'
  disabled?: boolean
}>()
const content = toRef(props, 'content')
const variant = computed(() => props.variant ?? 'text')
const disabled = computed(() => props.disabled ?? false)

const { copy } = useCopyToClipboard(content)
const { t } = useI18n()
const emit = defineEmits<{
  (e: 'click'): void
}>()

function onClick() {
  emit('click')
  copy()
}
</script>

<i18n lang="json">
{
  "en": {
    "label": "Copy"
  },
  "zh": {
    "label": "复制"
  },
  "zh-CN": {
    "label": "复制"
  },
  "zh-TW": {
    "label": "複製"
  },
  "zh-HK": {
    "label": "複製"
  },
  "es": {
    "label": "Copiar"
  },
  "fr": {
    "label": "Copier"
  },
  "de": {
    "label": "Kopieren"
  },
  "it": {
    "label": "Copia"
  },
  "ja": {
    "label": "コピー"
  },
  "ko": {
    "label": "복사"
  },
  "ru": {
    "label": "Копировать"
  },
  "pt": {
    "label": "Copiar"
  },
  "ar": {
    "label": "نسخ"
  },
  "hi": {
    "label": "कॉपी करें"
  },
  "tr": {
    "label": "Kopyala"
  },
  "nl": {
    "label": "Kopiëren"
  },
  "sv": {
    "label": "Kopiera"
  },
  "pl": {
    "label": "Kopiuj"
  },
  "vi": {
    "label": "Sao chép"
  },
  "th": {
    "label": "คัดลอก"
  },
  "id": {
    "label": "Salin"
  },
  "he": {
    "label": "העתק"
  },
  "ms": {
    "label": "Salin"
  },
  "no": {
    "label": "Kopier"
  }
}
</i18n>
