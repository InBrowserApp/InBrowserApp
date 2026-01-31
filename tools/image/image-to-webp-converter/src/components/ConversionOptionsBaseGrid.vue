<template>
  <n-grid cols="1 s:2 l:4" :x-gap="12" :y-gap="12" responsive="screen">
    <n-form-item-gi :label="scaleLabel" :show-feedback="false">
      <n-flex vertical :size="8" style="width: 100%">
        <n-input-number
          :value="scale"
          :min="minScale"
          :max="maxScale"
          :step="1"
          style="width: 100%"
          @update:value="handleScaleUpdate"
        />
        <n-text depth="3">{{ scaleHint }}</n-text>
      </n-flex>
    </n-form-item-gi>
    <n-form-item-gi :label="qualityLabel" :show-feedback="false">
      <n-flex vertical :size="8" style="width: 100%">
        <n-input-number
          :value="quality"
          :min="0"
          :max="100"
          :step="1"
          style="width: 100%"
          @update:value="handleQualityUpdate"
        />
        <n-text depth="3">{{ qualityHint }}</n-text>
      </n-flex>
    </n-form-item-gi>
    <n-form-item-gi :label="methodLabel" :show-feedback="false">
      <n-flex vertical :size="8" style="width: 100%">
        <n-input-number
          :value="method"
          :min="0"
          :max="6"
          :step="1"
          style="width: 100%"
          @update:value="handleMethodUpdate"
        />
        <n-text depth="3">{{ methodHint }}</n-text>
      </n-flex>
    </n-form-item-gi>
    <n-form-item-gi :label="losslessLabel" :show-feedback="false">
      <n-switch v-model:value="lossless" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NFlex, NFormItemGi, NGrid, NInputNumber, NSwitch, NText } from 'naive-ui'

defineProps<{
  scaleLabel: string
  scaleHint: string
  qualityLabel: string
  qualityHint: string
  methodLabel: string
  methodHint: string
  losslessLabel: string
  minScale: number
  maxScale: number
}>()

const scale = defineModel<number>('scale', { required: true })
const quality = defineModel<number>('quality', { required: true })
const method = defineModel<number>('method', { required: true })
const lossless = defineModel<boolean>('lossless', { required: true })

function handleScaleUpdate(value: number | null) {
  if (value === null) return
  scale.value = value
}

function handleQualityUpdate(value: number | null) {
  if (value === null) return
  quality.value = value
}

function handleMethodUpdate(value: number | null) {
  if (value === null) return
  method.value = value
}
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
