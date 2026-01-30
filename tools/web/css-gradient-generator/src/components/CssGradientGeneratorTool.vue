<template>
  <ToolSection>
    <n-grid cols="1 l:2" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi>
        <n-flex vertical :size="16">
          <CssGradientPreviewPanel
            :background-image="backgroundImageCss"
            :blend-mode="previewBlendMode"
            @randomize-layer="handleRandomizeLayer"
            @randomize-all="handleRandomizeAll"
          />
          <CssGradientStopsPanel
            v-model:stop-color="activeStopColor"
            v-model:stop-position="activeStopPosition"
            :stops="activeStops"
            :active-stop-id="activeStopId"
            :gradient-css="activeTrackCss"
            :show-error="showStopError"
            @add-stop="handleAddStop"
            @select-stop="setActiveStop"
            @update-stop="updateStopPosition"
            @remove-stop="removeStop"
          />
          <CssGradientPresetsPanel
            :presets="presets"
            :preset-swatch-style-map="presetSwatchStyleMap"
            @apply-preset="applyPreset"
          />
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="16">
          <CssGradientLayersPanel
            :layers="layers"
            :active-layer-id="activeLayerId"
            :show-error="showLayerError"
            @set-active="setActiveLayer"
            @add-layer="addLayer"
            @duplicate-layer="duplicateLayer"
            @move-layer="moveLayer"
            @remove-layer="removeLayer"
          />
          <CssGradientLayerSettingsPanel
            v-model:layer-type="layerType"
            v-model:layer-angle="layerAngle"
            v-model:layer-center-x="layerCenterX"
            v-model:layer-center-y="layerCenterY"
            v-model:layer-shape="layerShape"
            v-model:layer-size="layerSize"
            v-model:layer-color-space="layerColorSpace"
            v-model:layer-blend-mode="layerBlendMode"
          />
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSection>
    <n-grid cols="1 l:3" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi>
        <CssGradientOutputPanel
          v-model:output-format="outputFormat"
          :css-output="cssOutput"
          :background-image-declaration="backgroundImageDeclaration"
          :background-blend-declaration="backgroundBlendDeclaration"
          :background-shorthand="backgroundShorthand"
          :has-blend-modes="hasBlendModes"
          :css-url="cssUrl"
        />
      </n-gi>
      <n-gi>
        <CssGradientExportPanel
          v-model:export-width="exportWidth"
          v-model:export-height="exportHeight"
          :png-url="pngUrl"
          :svg-url="svgUrl"
          :is-exporting-png="isExportingPng"
          :show-error="showExportError"
          @download-png="handlePngDownload"
        />
      </n-gi>
      <n-gi>
        <CssGradientJsonPanel
          v-model:json-input="jsonInput"
          :serialized-config="serializedConfig"
          :json-url="jsonUrl"
          :show-error="showJsonError"
          @load-json="loadJson"
        />
      </n-gi>
    </n-grid>
  </ToolSection>

  <WhatIsCssGradient />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NFlex, NGi, NGrid } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import type {
  BlendMode,
  ColorFormat,
  GradientLayer,
  GradientType,
  RadialShape,
  RadialSize,
} from '../types'
import CssGradientExportPanel from './CssGradientExportPanel.vue'
import CssGradientJsonPanel from './CssGradientJsonPanel.vue'
import CssGradientLayerSettingsPanel from './CssGradientLayerSettingsPanel.vue'
import CssGradientLayersPanel from './CssGradientLayersPanel.vue'
import CssGradientOutputPanel from './CssGradientOutputPanel.vue'
import CssGradientPresetsPanel from './CssGradientPresetsPanel.vue'
import CssGradientPreviewPanel from './CssGradientPreviewPanel.vue'
import CssGradientStopsPanel from './CssGradientStopsPanel.vue'
import WhatIsCssGradient from './WhatIsCssGradient.vue'
import { useGradientExport } from './useGradientExport'
import {
  clamp,
  cloneLayerWithNewIds,
  createBackgroundImage,
  createBlendModeCss,
  createGradientCss,
  createLayer,
  createLayerFromSeed,
  createStop,
  getNearestStopColor,
  normalizeHexColor,
  parseGradientConfig,
  randomizeLayer,
  serializeGradientConfig,
  sortStops,
} from '../utils/gradient'
import { gradientPresets } from '../utils/presets'

const layers = ref<GradientLayer[]>([createLayer()])
const activeLayerId = ref(layers.value[0]?.id ?? '')
const activeStopId = ref(layers.value[0]?.stops[0]?.id ?? null)
const outputFormat = ref<ColorFormat>('hex')
const jsonInput = ref('')
const showLayerError = ref(false)
const showStopError = ref(false)
const showJsonError = ref(false)

const {
  exportWidth,
  exportHeight,
  pngUrl,
  svgUrl,
  isExportingPng,
  showExportError,
  handlePngDownload,
} = useGradientExport(layers, outputFormat)

const presets = gradientPresets

const activeLayer = computed(
  () => layers.value.find((layer) => layer.id === activeLayerId.value) ?? layers.value[0] ?? null,
)

const activeStops = computed(() => activeLayer.value?.stops ?? [])

const activeStop = computed(() => {
  const layer = activeLayer.value
  if (!layer) return null
  return layer.stops.find((stop) => stop.id === activeStopId.value) ?? layer.stops[0] ?? null
})

const activeTrackCss = computed(() =>
  activeLayer.value ? createGradientCss(activeLayer.value, 'hex') : 'linear-gradient(#000, #fff)',
)

const backgroundImageCss = computed(() => createBackgroundImage(layers.value, outputFormat.value))

const blendModeCss = computed(() => createBlendModeCss(layers.value))

const hasBlendModes = computed(
  () => layers.value.length > 1 && layers.value.some((layer) => layer.blendMode !== 'normal'),
)

const previewBlendMode = computed(() => (layers.value.length > 1 ? blendModeCss.value : ''))

const backgroundImageDeclaration = computed(() => `background-image: ${backgroundImageCss.value};`)

const backgroundBlendDeclaration = computed(() => `background-blend-mode: ${blendModeCss.value};`)

const backgroundShorthand = computed(() => `background: ${backgroundImageCss.value};`)

const cssOutput = computed(() => {
  const output = [backgroundImageDeclaration.value]
  if (hasBlendModes.value) output.push(backgroundBlendDeclaration.value)
  return output.join('\n')
})

const cssBlob = computed(() => new Blob([cssOutput.value], { type: 'text/css;charset=utf-8' }))

const serializedConfig = computed(() => serializeGradientConfig(layers.value))

const jsonBlob = computed(
  () => new Blob([serializedConfig.value], { type: 'application/json;charset=utf-8' }),
)

const cssUrl = useObjectUrl(cssBlob)
const jsonUrl = useObjectUrl(jsonBlob)

const activeStopColor = computed({
  get: () => activeStop.value?.color ?? '#FFFFFFFF',
  set: (value: string) => {
    const layer = activeLayer.value
    const stop = activeStop.value
    if (!layer || !stop) return
    stop.color = normalizeHexColor(value)
  },
})

const activeStopPosition = computed({
  get: () => activeStop.value?.position ?? 0,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    updateStopPosition(activeStop.value?.id ?? '', value)
  },
})

const layerType = computed<GradientType>({
  get: () => activeLayer.value?.type ?? 'linear',
  set: (value) => {
    if (!activeLayer.value) return
    activeLayer.value.type = value
  },
})

const layerAngle = computed({
  get: () => activeLayer.value?.angle ?? 0,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    if (!activeLayer.value) return
    activeLayer.value.angle = clamp(value, 0, 360)
  },
})

const layerCenterX = computed({
  get: () => activeLayer.value?.centerX ?? 50,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    if (!activeLayer.value) return
    activeLayer.value.centerX = clamp(value, 0, 100)
  },
})

const layerCenterY = computed({
  get: () => activeLayer.value?.centerY ?? 50,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    if (!activeLayer.value) return
    activeLayer.value.centerY = clamp(value, 0, 100)
  },
})

const layerShape = computed<RadialShape>({
  get: () => activeLayer.value?.radialShape ?? 'circle',
  set: (value) => {
    if (!activeLayer.value) return
    activeLayer.value.radialShape = value
  },
})

const layerSize = computed<RadialSize>({
  get: () => activeLayer.value?.radialSize ?? 'farthest-corner',
  set: (value) => {
    if (!activeLayer.value) return
    activeLayer.value.radialSize = value
  },
})

const layerColorSpace = computed({
  get: () => activeLayer.value?.colorSpace ?? 'srgb',
  set: (value) => {
    if (!activeLayer.value) return
    activeLayer.value.colorSpace = value
  },
})

const layerBlendMode = computed<BlendMode>({
  get: () => activeLayer.value?.blendMode ?? 'normal',
  set: (value) => {
    if (!activeLayer.value) return
    activeLayer.value.blendMode = value
  },
})

const presetSwatchStyleMap = computed<Record<string, Record<string, string>>>(() => {
  const styles: Record<string, Record<string, string>> = {}
  for (const preset of presets) {
    const layers = preset.layers.map((layer) => createLayerFromSeed(layer))
    const backgroundImage = createBackgroundImage(layers, 'hex')
    const blendMode = createBlendModeCss(layers)
    const style: Record<string, string> = { backgroundImage }
    if (blendMode) {
      style.backgroundBlendMode = blendMode
    }
    styles[preset.id] = style
  }
  return styles
})

const setActiveLayer = (id: string) => {
  showLayerError.value = false
  activeLayerId.value = id
  const layer = layers.value.find((item) => item.id === id)
  activeStopId.value = layer?.stops[0]?.id ?? null
}

const setActiveStop = (id: string) => {
  showStopError.value = false
  activeStopId.value = id
}

const addLayer = () => {
  showLayerError.value = false
  const layer = createLayer()
  layers.value.push(layer)
  setActiveLayer(layer.id)
}

const duplicateLayer = (id: string) => {
  const index = layers.value.findIndex((layer) => layer.id === id)
  if (index < 0) return
  const layer = layers.value[index]
  if (!layer) return
  const clone = cloneLayerWithNewIds(layer)
  layers.value.splice(index + 1, 0, clone)
  setActiveLayer(clone.id)
}

const removeLayer = (id: string) => {
  if (layers.value.length <= 1) {
    showLayerError.value = true
    return
  }
  const index = layers.value.findIndex((layer) => layer.id === id)
  if (index < 0) return
  layers.value.splice(index, 1)
  const fallback = layers.value[Math.max(0, index - 1)]
  if (fallback) setActiveLayer(fallback.id)
}

const moveLayer = (index: number, direction: number) => {
  const target = index + direction
  if (target < 0 || target >= layers.value.length) return
  const nextLayers = [...layers.value]
  const [layer] = nextLayers.splice(index, 1)
  if (!layer) return
  nextLayers.splice(target, 0, layer)
  layers.value = nextLayers
}

const handleAddStop = (position = 50) => {
  showStopError.value = false
  const layer = activeLayer.value
  if (!layer) return
  const color = activeStop.value?.color ?? getNearestStopColor(layer.stops, position)
  const nextStop = createStop(color, position)
  layer.stops = sortStops([...layer.stops, nextStop])
  activeStopId.value = nextStop.id
}

const removeStop = () => {
  const layer = activeLayer.value
  if (!layer) return
  if (layer.stops.length <= 2) {
    showStopError.value = true
    return
  }
  const stopId = activeStop.value?.id
  layer.stops = layer.stops.filter((stop) => stop.id !== stopId)
  activeStopId.value = layer.stops[0]?.id ?? null
}

const updateStopPosition = (id: string, position: number) => {
  const layer = activeLayer.value
  if (!layer) return
  if (!Number.isFinite(position)) return
  const stop = layer.stops.find((item) => item.id === id)
  if (!stop) return
  stop.position = clamp(position, 0, 100)
  layer.stops = sortStops(layer.stops)
}

const handleRandomizeLayer = () => {
  const layer = activeLayer.value
  if (!layer) return
  const index = layers.value.findIndex((item) => item.id === layer.id)
  if (index < 0) return
  const randomized = randomizeLayer(layer)
  layers.value.splice(index, 1, randomized)
  activeStopId.value = randomized.stops[0]?.id ?? null
}

const handleRandomizeAll = () => {
  layers.value = layers.value.map((layer) => randomizeLayer(layer))
  const layer = layers.value[0]
  if (layer) setActiveLayer(layer.id)
}

const applyPreset = (presetId: string) => {
  showLayerError.value = false
  showStopError.value = false
  const preset = presets.find((item) => item.id === presetId)
  if (!preset) return
  layers.value = preset.layers.map((layer) => createLayerFromSeed(layer))
  const next = layers.value[0]
  if (next) setActiveLayer(next.id)
}

const loadJson = () => {
  showJsonError.value = false
  const parsed = parseGradientConfig(jsonInput.value)
  if (!parsed) {
    showJsonError.value = true
    return
  }
  layers.value = parsed
  const layer = layers.value[0]
  if (layer) setActiveLayer(layer.id)
  jsonInput.value = ''
}
</script>

<style scoped>
:deep(.panel) {
  border-radius: 16px;
  border: 1px solid var(--n-border-color);
}

:deep(.panel__header) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

:deep(.panel__title) {
  font-weight: 600;
  font-size: 16px;
}

:deep(.panel__subtitle) {
  font-size: 13px;
  color: var(--n-text-color-3);
}

:deep(.panel__alert) {
  margin-top: 12px;
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
