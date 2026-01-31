<template>
  <div class="form-row">
    <div class="form-label">{{ t('blendMode') }}</div>
    <n-select v-model:value="layerBlendModeModel" :options="blendOptions" />
    <CssGradientBlendModeOptionsPrimary ref="primaryOptions" />
    <CssGradientBlendModeOptionsSecondary ref="secondaryOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { BlendMode } from '../types'
import CssGradientBlendModeOptionsPrimary from './CssGradientBlendModeOptionsPrimary.vue'
import CssGradientBlendModeOptionsSecondary from './CssGradientBlendModeOptionsSecondary.vue'

const { t } = useI18n()

type OptionsExpose = {
  options: { label: string; value: BlendMode }[]
}

const primaryOptions = ref<OptionsExpose | null>(null)
const secondaryOptions = ref<OptionsExpose | null>(null)

const layerBlendModeModel = defineModel<BlendMode>('layerBlendMode', { required: true })

const blendOptions = computed(() => [
  ...(primaryOptions.value?.options ?? []),
  ...(secondaryOptions.value?.options ?? []),
])
</script>

<style scoped>
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.form-label {
  font-size: 13px;
  color: var(--n-text-color-3);
}
</style>

<i18n lang="json">
{
  "en": {
    "blendMode": "Blend mode"
  },
  "zh": {
    "blendMode": "混合模式"
  },
  "zh-CN": {
    "blendMode": "混合模式"
  },
  "zh-TW": {
    "blendMode": "混合模式"
  },
  "zh-HK": {
    "blendMode": "混合模式"
  },
  "es": {
    "blendMode": "Modo de mezcla"
  },
  "fr": {
    "blendMode": "Mode de fusion"
  },
  "de": {
    "blendMode": "Mischmodus"
  },
  "it": {
    "blendMode": "Modalità di fusione"
  },
  "ja": {
    "blendMode": "ブレンドモード"
  },
  "ko": {
    "blendMode": "블렌드 모드"
  },
  "ru": {
    "blendMode": "Режим смешивания"
  },
  "pt": {
    "blendMode": "Modo de mesclagem"
  },
  "ar": {
    "blendMode": "وضع المزج"
  },
  "hi": {
    "blendMode": "ब्लेंड मोड"
  },
  "tr": {
    "blendMode": "Karışım modu"
  },
  "nl": {
    "blendMode": "Mengmodus"
  },
  "sv": {
    "blendMode": "Blandningsläge"
  },
  "pl": {
    "blendMode": "Tryb mieszania"
  },
  "vi": {
    "blendMode": "Chế độ hòa trộn"
  },
  "th": {
    "blendMode": "โหมดผสมสี"
  },
  "id": {
    "blendMode": "Mode blend"
  },
  "he": {
    "blendMode": "מצב מיזוג"
  },
  "ms": {
    "blendMode": "Mod campuran"
  },
  "no": {
    "blendMode": "Blandemodus"
  }
}
</i18n>
