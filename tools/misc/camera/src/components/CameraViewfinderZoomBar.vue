<template>
  <div class="zoom-bar">
    <n-icon :component="ZoomOutIcon" />
    <n-slider
      :value="zoomValue"
      :min="zoomMin"
      :max="zoomMax"
      :step="zoomStep"
      :disabled="isPreparing"
      @update:value="(value) => emit('apply-zoom', value)"
    />
    <n-icon :component="ZoomInIcon" />
    <span class="zoom-label">{{ zoomDisplay }}</span>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NSlider } from 'naive-ui'
import ZoomInIcon from '@vicons/fluent/ZoomIn16Regular'
import ZoomOutIcon from '@vicons/fluent/ZoomOut16Regular'

defineProps<{
  zoomValue: number
  zoomMin: number
  zoomMax: number
  zoomStep: number
  zoomDisplay: string
  isPreparing: boolean
}>()

const emit = defineEmits<{
  (event: 'apply-zoom', value: number): void
}>()
</script>

<style scoped>
.zoom-bar {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 130px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
}

.zoom-label {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  min-width: 40px;
  text-align: right;
}
</style>

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
