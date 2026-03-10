<template>
  <n-flex align="center" :size="12" style="margin-top: 12px">
    <n-button
      type="primary"
      :loading="isConverting"
      :disabled="!canConvert"
      @click="emit('convert')"
    >
      <template #icon>
        <n-icon><ImageEdit24Regular /></n-icon>
      </template>
      {{ isConverting ? convertingLabel : convertLabel }}
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
import { NButton, NFlex, NIcon } from 'naive-ui'
import ImageEdit24Regular from '@vicons/fluent/ImageEdit24Regular'

defineProps<{
  convertLabel: string
  convertingLabel: string
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{
  convert: []
}>()
</script>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
