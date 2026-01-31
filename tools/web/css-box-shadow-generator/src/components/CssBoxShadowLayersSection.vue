<template>
  <ToolSectionHeader>{{ t('layers-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 l:2" responsive="screen" :x-gap="16" :y-gap="16">
      <n-gi>
        <CssBoxShadowLayerList
          :layers="layers"
          :active-layer-id="activeLayerId"
          @set-active="handleSetActive"
          @add-layer="handleAddLayer"
          @remove-layer="handleRemoveLayer"
          @move-layer="handleMoveLayer"
        />
      </n-gi>
      <n-gi>
        <CssBoxShadowLayerSettings
          :active-layer="activeLayer"
          :offset-range="offsetRange"
          :blur-range="blurRange"
          :spread-range="spreadRange"
          :swatches="swatches"
          @update-layer="handleUpdateLayer"
        />
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NGi, NGrid } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ShadowLayer } from '../utils/shadow'
import CssBoxShadowLayerList from './CssBoxShadowLayerList.vue'
import CssBoxShadowLayerSettings from './CssBoxShadowLayerSettings.vue'

defineProps<{
  layers: ShadowLayer[]
  activeLayerId: string
  activeLayer: ShadowLayer
  offsetRange: { min: number; max: number }
  blurRange: { min: number; max: number }
  spreadRange: { min: number; max: number }
  swatches: string[]
}>()

const emit = defineEmits<{
  (event: 'set-active', value: string): void
  (event: 'add-layer'): void
  (event: 'remove-layer', value: string): void
  (event: 'move-layer', value: { id: string; direction: number }): void
  (event: 'update-layer', value: Partial<ShadowLayer>): void
}>()

const { t } = useI18n()

function handleSetActive(value: string) {
  emit('set-active', value)
}

function handleAddLayer() {
  emit('add-layer')
}

function handleRemoveLayer(value: string) {
  emit('remove-layer', value)
}

function handleMoveLayer(value: { id: string; direction: number }) {
  emit('move-layer', value)
}

function handleUpdateLayer(value: Partial<ShadowLayer>) {
  emit('update-layer', value)
}
</script>

<i18n lang="json">
{
  "en": {
    "layers-title": "Layers"
  },
  "zh": {
    "layers-title": "图层"
  },
  "zh-CN": {
    "layers-title": "图层"
  },
  "zh-TW": {
    "layers-title": "圖層"
  },
  "zh-HK": {
    "layers-title": "圖層"
  },
  "es": {
    "layers-title": "Capas"
  },
  "fr": {
    "layers-title": "Calques"
  },
  "de": {
    "layers-title": "Ebenen"
  },
  "it": {
    "layers-title": "Livelli"
  },
  "ja": {
    "layers-title": "レイヤー"
  },
  "ko": {
    "layers-title": "레이어"
  },
  "ru": {
    "layers-title": "Слои"
  },
  "pt": {
    "layers-title": "Camadas"
  },
  "ar": {
    "layers-title": "الطبقات"
  },
  "hi": {
    "layers-title": "परतें"
  },
  "tr": {
    "layers-title": "Katmanlar"
  },
  "nl": {
    "layers-title": "Lagen"
  },
  "sv": {
    "layers-title": "Lager"
  },
  "pl": {
    "layers-title": "Warstwy"
  },
  "vi": {
    "layers-title": "Lớp"
  },
  "th": {
    "layers-title": "เลเยอร์"
  },
  "id": {
    "layers-title": "Lapisan"
  },
  "he": {
    "layers-title": "שכבות"
  },
  "ms": {
    "layers-title": "Lapisan"
  },
  "no": {
    "layers-title": "Lag"
  }
}
</i18n>
