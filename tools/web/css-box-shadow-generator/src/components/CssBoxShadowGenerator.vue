<template>
  <CssBoxShadowLayersSection
    :layers="layers"
    :active-layer-id="activeLayerId"
    :active-layer="activeLayer"
    :offset-range="offsetRange"
    :blur-range="blurRange"
    :spread-range="spreadRange"
    :swatches="swatches"
    @set-active="setActiveLayer"
    @add-layer="addLayer"
    @remove-layer="removeLayer"
    @move-layer="({ id, direction }) => moveLayer(id, direction)"
    @update-layer="updateActiveLayer"
  />
  <CssBoxShadowPreviewSection
    v-model:dark-background="darkBackground"
    :css-output="cssOutput"
    :preview-style="previewStyle"
  />
  <CssBoxShadowWhatIsSection />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { buildBoxShadow, createShadowLayer, type ShadowLayer } from '../utils/shadow'
import CssBoxShadowLayersSection from './CssBoxShadowLayersSection.vue'
import CssBoxShadowPreviewSection from './CssBoxShadowPreviewSection.vue'
import CssBoxShadowWhatIsSection from './CssBoxShadowWhatIsSection.vue'

const offsetRange = { min: -120, max: 120 }
const blurRange = { min: 0, max: 200 }
const spreadRange = { min: -60, max: 60 }

const swatches = [
  '#00000033',
  '#00000066',
  '#00000099',
  '#FFFFFF33',
  '#FFFFFF66',
  '#FFB02066',
  '#22C55E66',
  '#3B82F666',
  '#A855F766',
  '#EF444466',
]

const layers = useStorage<ShadowLayer[]>('tools:css-box-shadow-generator:layers', [
  createShadowLayer(),
])
const activeLayerId = useStorage(
  'tools:css-box-shadow-generator:active-layer',
  layers.value[0]?.id ?? '',
)
const darkBackground = useStorage('tools:css-box-shadow-generator:dark-preview', false)

const activeLayer = computed<ShadowLayer>(() => {
  const found = layers.value.find((layer) => layer.id === activeLayerId.value)
  return found ?? layers.value[0]!
})

const shadowValue = computed(() => buildBoxShadow(layers.value))
const cssOutput = computed(() => `box-shadow: ${shadowValue.value};`)
const previewStyle = computed(() => ({
  boxShadow: shadowValue.value,
}))

watch(
  layers,
  () => {
    if (layers.value.length === 0) {
      const nextLayer = createShadowLayer()
      layers.value = [nextLayer]
      activeLayerId.value = nextLayer.id
      return
    }

    const hasActive = layers.value.some((layer) => layer.id === activeLayerId.value)
    if (!hasActive) {
      activeLayerId.value = layers.value[0]?.id ?? ''
    }
  },
  { deep: true, immediate: true },
)

function setActiveLayer(id: string) {
  activeLayerId.value = id
}

function addLayer() {
  const nextLayer = createShadowLayer()
  layers.value = [...layers.value, nextLayer]
  activeLayerId.value = nextLayer.id
}

function removeLayer(id: string) {
  if (layers.value.length <= 1) return
  layers.value = layers.value.filter((layer) => layer.id !== id)
}

function moveLayer(id: string, direction: number) {
  const index = layers.value.findIndex((layer) => layer.id === id)
  if (index === -1) return

  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= layers.value.length) return

  const nextLayers = [...layers.value]
  const temp = nextLayers[index]!
  nextLayers[index] = nextLayers[nextIndex]!
  nextLayers[nextIndex] = temp
  layers.value = nextLayers
}

function updateActiveLayer(patch: Partial<ShadowLayer>) {
  Object.assign(activeLayer.value, patch)
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
