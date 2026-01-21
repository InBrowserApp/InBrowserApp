<template>
  <ToolSection>
    <n-grid cols="1 l:2" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi>
        <n-flex vertical :size="16">
          <n-card class="panel">
            <div class="panel__header">
              <div>
                <div class="panel__title">{{ t('previewTitle') }}</div>
                <div class="panel__subtitle">{{ t('previewHint') }}</div>
              </div>
              <n-flex :size="8" :wrap="true">
                <n-button size="small" @click="handleRandomizeLayer" data-testid="randomize-layer">
                  {{ t('randomizeLayer') }}
                </n-button>
                <n-button size="small" @click="handleRandomizeAll" data-testid="randomize-all">
                  {{ t('randomizeAll') }}
                </n-button>
              </n-flex>
            </div>
            <GradientPreview
              :background-image="backgroundImageCss"
              :blend-mode="previewBlendMode"
            />
          </n-card>

          <n-card class="panel">
            <div class="panel__header">
              <div>
                <div class="panel__title">{{ t('stopsTitle') }}</div>
                <div class="panel__subtitle">{{ t('trackHint') }}</div>
              </div>
              <n-button size="small" @click="handleAddStopClick" data-testid="add-stop">
                {{ t('addStop') }}
              </n-button>
            </div>
            <GradientStopsTrack
              :stops="activeStops"
              :active-stop-id="activeStopId"
              :gradient-css="activeTrackCss"
              @add="handleAddStop"
              @select="setActiveStop"
              @update="updateStopPosition"
            />
            <div class="stop-editor">
              <div class="stop-editor__row">
                <div class="stop-editor__label">{{ t('stopColor') }}</div>
                <n-color-picker
                  v-model:value="activeStopColor"
                  :show-alpha="true"
                  :modes="['hex']"
                  data-testid="stop-color"
                />
              </div>
              <div class="stop-editor__row">
                <div class="stop-editor__label">{{ t('stopPosition') }}</div>
                <div class="stop-editor__controls">
                  <n-slider v-model:value="activeStopPosition" :min="0" :max="100" />
                  <n-input-number
                    v-model:value="activeStopPosition"
                    :min="0"
                    :max="100"
                    size="small"
                  />
                </div>
              </div>
              <n-flex align="center" justify="space-between" :wrap="true">
                <n-button size="small" type="error" @click="removeStop" data-testid="remove-stop">
                  {{ t('deleteStop') }}
                </n-button>
                <n-text depth="3">{{ t('minStopsHint') }}</n-text>
              </n-flex>
            </div>
            <n-alert
              v-if="stopError"
              type="warning"
              :show-icon="false"
              class="panel__alert"
              data-testid="stop-error"
            >
              {{ stopError }}
            </n-alert>
          </n-card>

          <n-card class="panel">
            <div class="panel__header">
              <div>
                <div class="panel__title">{{ t('presetsTitle') }}</div>
                <div class="panel__subtitle">{{ t('presetsSubtitle') }}</div>
              </div>
            </div>
            <n-grid cols="2 s:3" :x-gap="8" :y-gap="8" responsive="screen">
              <n-gi v-for="preset in presets" :key="preset.id">
                <n-button
                  size="small"
                  quaternary
                  class="preset-button"
                  :data-testid="`preset-${preset.id}`"
                  @click="applyPreset(preset.id)"
                >
                  {{ presetLabelMap[preset.id] ?? preset.id }}
                </n-button>
              </n-gi>
            </n-grid>
          </n-card>
        </n-flex>
      </n-gi>

      <n-gi>
        <n-flex vertical :size="16">
          <n-card class="panel">
            <div class="panel__header">
              <div>
                <div class="panel__title">{{ t('layersTitle') }}</div>
                <div class="panel__subtitle">{{ t('layersSubtitle') }}</div>
              </div>
              <n-button size="small" @click="addLayer" data-testid="add-layer">
                {{ t('addLayer') }}
              </n-button>
            </div>
            <div class="layer-list">
              <button
                v-for="(layer, index) in layers"
                :key="layer.id"
                type="button"
                class="layer-card"
                :class="{ 'layer-card--active': layer.id === activeLayerId }"
                :data-testid="`layer-${layer.id}`"
                @click="setActiveLayer(layer.id)"
              >
                <div class="layer-card__preview" :style="layerPreviewStyle(layer)" />
                <div class="layer-card__meta">
                  <div class="layer-card__title">{{ t('layerLabel', { index: index + 1 }) }}</div>
                  <div class="layer-card__subtitle">{{ typeLabelMap[layer.type] }}</div>
                </div>
                <div class="layer-card__actions">
                  <n-button
                    size="tiny"
                    tertiary
                    :data-testid="`layer-duplicate-${layer.id}`"
                    @click.stop="duplicateLayer(layer.id)"
                  >
                    {{ t('duplicateLayer') }}
                  </n-button>
                  <n-button
                    size="tiny"
                    tertiary
                    :disabled="index === 0"
                    :data-testid="`layer-up-${layer.id}`"
                    @click.stop="moveLayer(index, -1)"
                  >
                    {{ t('moveUp') }}
                  </n-button>
                  <n-button
                    size="tiny"
                    tertiary
                    :disabled="index === layers.length - 1"
                    :data-testid="`layer-down-${layer.id}`"
                    @click.stop="moveLayer(index, 1)"
                  >
                    {{ t('moveDown') }}
                  </n-button>
                  <n-button
                    size="tiny"
                    tertiary
                    type="error"
                    :disabled="layers.length === 1"
                    :data-testid="`layer-delete-${layer.id}`"
                    @click.stop="removeLayer(layer.id)"
                  >
                    {{ t('deleteLayer') }}
                  </n-button>
                </div>
              </button>
            </div>
            <n-alert
              v-if="layerError"
              type="warning"
              :show-icon="false"
              class="panel__alert"
              data-testid="layer-error"
            >
              {{ layerError }}
            </n-alert>
          </n-card>

          <n-card class="panel">
            <div class="panel__header">
              <div>
                <div class="panel__title">{{ t('settingsTitle') }}</div>
                <div class="panel__subtitle">{{ t('settingsSubtitle') }}</div>
              </div>
            </div>
            <n-flex vertical :size="12">
              <div class="form-row">
                <div class="form-label">{{ t('gradientType') }}</div>
                <n-select v-model:value="layerType" :options="typeOptions" />
              </div>
              <div v-if="layerType !== 'radial'" class="form-row">
                <div class="form-label">{{ t('angle') }}</div>
                <n-input-number v-model:value="layerAngle" :min="0" :max="360" />
              </div>
              <div v-if="layerType !== 'linear'" class="form-row">
                <div class="form-label">{{ t('centerX') }}</div>
                <div class="form-controls">
                  <n-slider v-model:value="layerCenterX" :min="0" :max="100" />
                  <n-input-number v-model:value="layerCenterX" :min="0" :max="100" size="small" />
                </div>
              </div>
              <div v-if="layerType !== 'linear'" class="form-row">
                <div class="form-label">{{ t('centerY') }}</div>
                <div class="form-controls">
                  <n-slider v-model:value="layerCenterY" :min="0" :max="100" />
                  <n-input-number v-model:value="layerCenterY" :min="0" :max="100" size="small" />
                </div>
              </div>
              <div v-if="layerType === 'radial'" class="form-row">
                <div class="form-label">{{ t('shapeLabel') }}</div>
                <n-select v-model:value="layerShape" :options="shapeOptions" />
              </div>
              <div v-if="layerType === 'radial'" class="form-row">
                <div class="form-label">{{ t('sizeLabel') }}</div>
                <n-select v-model:value="layerSize" :options="sizeOptions" />
              </div>
              <n-divider />
              <div class="form-row">
                <div class="form-label">{{ t('colorSpaceLabel') }}</div>
                <n-select v-model:value="layerColorSpace" :options="colorSpaceOptions" />
              </div>
              <div class="form-row">
                <div class="form-label">{{ t('blendMode') }}</div>
                <n-select v-model:value="layerBlendMode" :options="blendModeOptions" />
              </div>
            </n-flex>
          </n-card>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSection>
    <n-grid cols="1 l:3" :x-gap="24" :y-gap="24" responsive="screen">
      <n-gi>
        <n-card class="panel">
          <div class="panel__header">
            <div>
              <div class="panel__title">{{ t('outputTitle') }}</div>
              <div class="panel__subtitle">{{ t('outputSubtitle') }}</div>
            </div>
          </div>
          <n-flex vertical :size="12">
            <div class="form-row">
              <div class="form-label">{{ t('outputFormat') }}</div>
              <n-select v-model:value="outputFormat" :options="formatOptions" />
            </div>
            <n-input
              :value="cssOutput"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 9 }"
              readonly
              data-testid="css-output"
            />
            <n-flex :size="8" :wrap="true">
              <CopyToClipboardButton :content="cssOutput">
                <template #label>{{ t('copyCss') }}</template>
              </CopyToClipboardButton>
              <CopyToClipboardButton :content="backgroundImageDeclaration">
                <template #label>{{ t('copyBackgroundImage') }}</template>
              </CopyToClipboardButton>
              <CopyToClipboardButton :content="backgroundShorthand">
                <template #label>{{ t('copyBackground') }}</template>
              </CopyToClipboardButton>
              <CopyToClipboardButton v-if="hasBlendModes" :content="backgroundBlendDeclaration">
                <template #label>{{ t('copyBlendMode') }}</template>
              </CopyToClipboardButton>
            </n-flex>
          </n-flex>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card class="panel">
          <div class="panel__header">
            <div>
              <div class="panel__title">{{ t('exportTitle') }}</div>
              <div class="panel__subtitle">{{ t('exportSubtitle') }}</div>
            </div>
          </div>
          <n-flex vertical :size="12">
            <div class="form-row">
              <div class="form-label">{{ t('exportWidth') }}</div>
              <n-input-number v-model:value="exportWidth" :min="200" :max="4096" />
            </div>
            <div class="form-row">
              <div class="form-label">{{ t('exportHeight') }}</div>
              <n-input-number v-model:value="exportHeight" :min="200" :max="4096" />
            </div>
            <n-flex :size="8" :wrap="true">
              <n-button type="primary" @click="generatePng" data-testid="generate-png">
                {{ t('generatePng') }}
              </n-button>
              <n-button
                v-if="pngUrl"
                tag="a"
                :href="pngUrl"
                download="gradient.png"
                data-testid="download-png"
              >
                {{ t('downloadPng') }}
              </n-button>
            </n-flex>
            <n-alert
              v-if="exportError"
              type="warning"
              :show-icon="false"
              class="panel__alert"
              data-testid="export-error"
            >
              {{ exportError }}
            </n-alert>
          </n-flex>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card class="panel">
          <div class="panel__header">
            <div>
              <div class="panel__title">{{ t('jsonTitle') }}</div>
              <div class="panel__subtitle">{{ t('jsonSubtitle') }}</div>
            </div>
          </div>
          <n-flex vertical :size="12">
            <n-input
              :value="serializedConfig"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              readonly
              data-testid="json-output"
            />
            <n-flex :size="8" :wrap="true">
              <CopyToClipboardButton :content="serializedConfig">
                <template #label>{{ t('copyJson') }}</template>
              </CopyToClipboardButton>
              <n-button
                tag="a"
                :href="jsonUrl ?? undefined"
                download="gradient.json"
                :disabled="!jsonUrl"
                data-testid="download-json"
              >
                {{ t('downloadJson') }}
              </n-button>
            </n-flex>
            <n-input
              v-model:value="jsonInput"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :placeholder="t('jsonPlaceholder')"
              data-testid="json-input"
            />
            <n-button type="primary" @click="loadJson" data-testid="load-json">
              {{ t('loadJson') }}
            </n-button>
            <n-alert
              v-if="jsonError"
              type="warning"
              :show-icon="false"
              class="panel__alert"
              data-testid="json-error"
            >
              {{ jsonError }}
            </n-alert>
          </n-flex>
        </n-card>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NCard,
  NColorPicker,
  NDivider,
  NFlex,
  NGi,
  NGrid,
  NInput,
  NInputNumber,
  NSelect,
  NSlider,
  NText,
} from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type {
  BlendMode,
  ColorFormat,
  GradientLayer,
  GradientType,
  RadialShape,
  RadialSize,
} from '../types'
import GradientPreview from './GradientPreview.vue'
import GradientStopsTrack from './GradientStopsTrack.vue'
import {
  clamp,
  cloneLayerWithNewIds,
  createBackgroundImage,
  createBlendModeCss,
  createGradientCss,
  createLayer,
  createLayerFromSeed,
  createStop,
  drawLayersToCanvas,
  getNearestStopColor,
  normalizeHexColor,
  parseGradientConfig,
  randomizeLayer,
  serializeGradientConfig,
  sortStops,
} from '../utils/gradient'
import { gradientPresets } from '../utils/presets'

const { t } = useI18n()

const layers = ref<GradientLayer[]>([createLayer()])
const activeLayerId = ref(layers.value[0]?.id ?? '')
const activeStopId = ref(layers.value[0]?.stops[0]?.id ?? null)
const outputFormat = ref<ColorFormat>('hex')
const exportWidth = ref(1200)
const exportHeight = ref(800)
const pngBlob = ref<Blob | null>(null)
const exportError = ref('')
const jsonInput = ref('')
const jsonError = ref('')
const layerError = ref('')
const stopError = ref('')

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

const serializedConfig = computed(() => serializeGradientConfig(layers.value))

const jsonBlob = computed(
  () => new Blob([serializedConfig.value], { type: 'application/json;charset=utf-8' }),
)

const jsonUrl = useObjectUrl(jsonBlob)
const pngUrl = useObjectUrl(pngBlob)

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

const typeOptions = computed(() => [
  { label: t('type.linear'), value: 'linear' },
  { label: t('type.radial'), value: 'radial' },
  { label: t('type.conic'), value: 'conic' },
])

const shapeOptions = computed(() => [
  { label: t('shape.circle'), value: 'circle' },
  { label: t('shape.ellipse'), value: 'ellipse' },
])

const sizeOptions = computed(() => [
  { label: t('size.closest-side'), value: 'closest-side' },
  { label: t('size.closest-corner'), value: 'closest-corner' },
  { label: t('size.farthest-side'), value: 'farthest-side' },
  { label: t('size.farthest-corner'), value: 'farthest-corner' },
])

const colorSpaceOptions = computed(() => [
  { label: t('colorSpace.srgb'), value: 'srgb' },
  { label: t('colorSpace.oklch'), value: 'oklch' },
])

const blendModeOptions = computed(() => [
  { label: t('blend.normal'), value: 'normal' },
  { label: t('blend.multiply'), value: 'multiply' },
  { label: t('blend.screen'), value: 'screen' },
  { label: t('blend.overlay'), value: 'overlay' },
  { label: t('blend.darken'), value: 'darken' },
  { label: t('blend.lighten'), value: 'lighten' },
  { label: t('blend.color-dodge'), value: 'color-dodge' },
  { label: t('blend.color-burn'), value: 'color-burn' },
  { label: t('blend.hard-light'), value: 'hard-light' },
  { label: t('blend.soft-light'), value: 'soft-light' },
  { label: t('blend.difference'), value: 'difference' },
  { label: t('blend.exclusion'), value: 'exclusion' },
  { label: t('blend.hue'), value: 'hue' },
  { label: t('blend.saturation'), value: 'saturation' },
  { label: t('blend.color'), value: 'color' },
  { label: t('blend.luminosity'), value: 'luminosity' },
])

const formatOptions = computed(() => [
  { label: t('format.hex'), value: 'hex' },
  { label: t('format.rgba'), value: 'rgba' },
])

const typeLabelMap = computed<Record<GradientType, string>>(() => ({
  linear: t('type.linear'),
  radial: t('type.radial'),
  conic: t('type.conic'),
}))

const presetLabelMap = computed<Record<string, string>>(() => ({
  aurora: t('preset.aurora'),
  sunset: t('preset.sunset'),
  ocean: t('preset.ocean'),
  neon: t('preset.neon'),
  dawn: t('preset.dawn'),
  citrus: t('preset.citrus'),
}))

const layerPreviewStyle = (layer: GradientLayer) => ({
  backgroundImage: createGradientCss(layer, 'hex'),
  backgroundBlendMode: layer.blendMode,
})

const setActiveLayer = (id: string) => {
  layerError.value = ''
  activeLayerId.value = id
  const layer = layers.value.find((item) => item.id === id)
  activeStopId.value = layer?.stops[0]?.id ?? null
}

const setActiveStop = (id: string) => {
  stopError.value = ''
  activeStopId.value = id
}

const addLayer = () => {
  layerError.value = ''
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
    layerError.value = t('minLayerHint')
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

const handleAddStopClick = () => {
  handleAddStop()
}

const handleAddStop = (position = 50) => {
  stopError.value = ''
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
    stopError.value = t('minStopsHint')
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
  const preset = presets.find((item) => item.id === presetId)
  if (!preset) return
  layers.value = preset.layers.map((layer) => createLayerFromSeed(layer))
  const next = layers.value[0]
  if (next) setActiveLayer(next.id)
}

const generatePng = async () => {
  exportError.value = ''
  const width = typeof exportWidth.value === 'number' ? exportWidth.value : 1200
  const height = typeof exportHeight.value === 'number' ? exportHeight.value : 800
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    exportError.value = t('pngUnsupported')
    return
  }
  const rendered = drawLayersToCanvas(ctx, layers.value, width, height)
  if (!rendered) {
    exportError.value = t('pngUnsupported')
    return
  }
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })
  if (!blob) {
    exportError.value = t('pngUnsupported')
    return
  }
  pngBlob.value = blob
}

const loadJson = () => {
  jsonError.value = ''
  const parsed = parseGradientConfig(jsonInput.value)
  if (!parsed) {
    jsonError.value = t('invalidJson')
    return
  }
  layers.value = parsed
  const layer = layers.value[0]
  if (layer) setActiveLayer(layer.id)
  jsonInput.value = ''
}
</script>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Preview",
    "previewHint": "Live preview of the current gradient stack.",
    "stopsTitle": "Color Stops",
    "trackHint": "Click to add a stop. Drag handles to move.",
    "stopColor": "Stop color",
    "stopPosition": "Position",
    "addStop": "Add stop",
    "deleteStop": "Delete stop",
    "minStopsHint": "At least two stops are required.",
    "presetsTitle": "Presets",
    "presetsSubtitle": "Pick a polished starting point.",
    "layersTitle": "Layers",
    "layersSubtitle": "Stack multiple gradients for depth.",
    "layerLabel": "Layer {index}",
    "addLayer": "Add layer",
    "duplicateLayer": "Duplicate",
    "moveUp": "Up",
    "moveDown": "Down",
    "deleteLayer": "Delete",
    "minLayerHint": "You need at least one layer.",
    "settingsTitle": "Layer Settings",
    "settingsSubtitle": "Tune the geometry and blending.",
    "gradientType": "Gradient type",
    "angle": "Angle",
    "centerX": "Center X",
    "centerY": "Center Y",
    "shapeLabel": "Shape",
    "sizeLabel": "Size",
    "colorSpaceLabel": "Interpolation",
    "blendMode": "Blend mode",
    "randomizeLayer": "Randomize layer",
    "randomizeAll": "Randomize all layers",
    "outputTitle": "CSS Output",
    "outputSubtitle": "Copy CSS that matches the preview.",
    "outputFormat": "Stop format",
    "copyCss": "Copy CSS",
    "copyBackgroundImage": "Copy background-image",
    "copyBackground": "Copy background",
    "copyBlendMode": "Copy blend mode",
    "exportTitle": "Export",
    "exportSubtitle": "Generate a PNG snapshot.",
    "exportWidth": "Width",
    "exportHeight": "Height",
    "generatePng": "Generate PNG",
    "downloadPng": "Download PNG",
    "pngUnsupported": "PNG export is not supported in this browser.",
    "jsonTitle": "Config JSON",
    "jsonSubtitle": "Export or paste a gradient setup.",
    "copyJson": "Copy JSON",
    "downloadJson": "Download JSON",
    "jsonPlaceholder": "Paste JSON to load a gradient...",
    "loadJson": "Load JSON",
    "invalidJson": "Invalid gradient JSON.",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Conic"
    },
    "shape": {
      "circle": "Circle",
      "ellipse": "Ellipse"
    },
    "size": {
      "closest-side": "Closest side",
      "closest-corner": "Closest corner",
      "farthest-side": "Farthest side",
      "farthest-corner": "Farthest corner"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Multiply",
      "screen": "Screen",
      "overlay": "Overlay",
      "darken": "Darken",
      "lighten": "Lighten",
      "color-dodge": "Color dodge",
      "color-burn": "Color burn",
      "hard-light": "Hard light",
      "soft-light": "Soft light",
      "difference": "Difference",
      "exclusion": "Exclusion",
      "hue": "Hue",
      "saturation": "Saturation",
      "color": "Color",
      "luminosity": "Luminosity"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Sunset Wash",
      "ocean": "Ocean Depth",
      "neon": "Neon Mist",
      "dawn": "Soft Dawn",
      "citrus": "Citrus Glow"
    }
  },
  "zh": {
    "previewTitle": "预览",
    "previewHint": "实时预览当前渐变叠层。",
    "stopsTitle": "颜色停靠点",
    "trackHint": "点击添加停靠点，拖拽调整位置。",
    "stopColor": "停靠点颜色",
    "stopPosition": "位置",
    "addStop": "添加停靠点",
    "deleteStop": "删除停靠点",
    "minStopsHint": "至少保留两个停靠点。",
    "presetsTitle": "预设",
    "presetsSubtitle": "选择一个精心调校的起点。",
    "layersTitle": "图层",
    "layersSubtitle": "叠加多层渐变以增加层次。",
    "layerLabel": "图层 {index}",
    "addLayer": "添加图层",
    "duplicateLayer": "复制",
    "moveUp": "上移",
    "moveDown": "下移",
    "deleteLayer": "删除",
    "minLayerHint": "至少需要保留一个图层。",
    "settingsTitle": "图层设置",
    "settingsSubtitle": "调整几何与混合方式。",
    "gradientType": "渐变类型",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "shapeLabel": "形状",
    "sizeLabel": "尺寸",
    "colorSpaceLabel": "插值空间",
    "blendMode": "混合模式",
    "randomizeLayer": "随机图层",
    "randomizeAll": "随机所有图层",
    "outputTitle": "CSS 输出",
    "outputSubtitle": "复制与预览一致的 CSS。",
    "outputFormat": "颜色格式",
    "copyCss": "复制 CSS",
    "copyBackgroundImage": "复制 background-image",
    "copyBackground": "复制 background",
    "copyBlendMode": "复制混合模式",
    "exportTitle": "导出",
    "exportSubtitle": "生成 PNG 快照。",
    "exportWidth": "宽度",
    "exportHeight": "高度",
    "generatePng": "生成 PNG",
    "downloadPng": "下载 PNG",
    "pngUnsupported": "当前浏览器不支持 PNG 导出。",
    "jsonTitle": "配置 JSON",
    "jsonSubtitle": "导出或粘贴渐变配置。",
    "copyJson": "复制 JSON",
    "downloadJson": "下载 JSON",
    "jsonPlaceholder": "粘贴 JSON 以加载渐变...",
    "loadJson": "加载 JSON",
    "invalidJson": "无效的渐变 JSON。",
    "type": {
      "linear": "线性",
      "radial": "径向",
      "conic": "圆锥"
    },
    "shape": {
      "circle": "圆形",
      "ellipse": "椭圆"
    },
    "size": {
      "closest-side": "最近边",
      "closest-corner": "最近角",
      "farthest-side": "最远边",
      "farthest-corner": "最远角"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "正常",
      "multiply": "正片叠底",
      "screen": "滤色",
      "overlay": "叠加",
      "darken": "变暗",
      "lighten": "变亮",
      "color-dodge": "颜色减淡",
      "color-burn": "颜色加深",
      "hard-light": "强光",
      "soft-light": "柔光",
      "difference": "差值",
      "exclusion": "排除",
      "hue": "色相",
      "saturation": "饱和度",
      "color": "颜色",
      "luminosity": "明度"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "极光",
      "sunset": "日落薄雾",
      "ocean": "深海",
      "neon": "霓虹薄雾",
      "dawn": "柔和晨曦",
      "citrus": "柑橘光"
    }
  },
  "zh-CN": {
    "previewTitle": "预览",
    "previewHint": "实时预览当前渐变叠层。",
    "stopsTitle": "颜色停靠点",
    "trackHint": "点击添加停靠点，拖拽调整位置。",
    "stopColor": "停靠点颜色",
    "stopPosition": "位置",
    "addStop": "添加停靠点",
    "deleteStop": "删除停靠点",
    "minStopsHint": "至少保留两个停靠点。",
    "presetsTitle": "预设",
    "presetsSubtitle": "选择一个精心调校的起点。",
    "layersTitle": "图层",
    "layersSubtitle": "叠加多层渐变以增加层次。",
    "layerLabel": "图层 {index}",
    "addLayer": "添加图层",
    "duplicateLayer": "复制",
    "moveUp": "上移",
    "moveDown": "下移",
    "deleteLayer": "删除",
    "minLayerHint": "至少需要保留一个图层。",
    "settingsTitle": "图层设置",
    "settingsSubtitle": "调整几何与混合方式。",
    "gradientType": "渐变类型",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "shapeLabel": "形状",
    "sizeLabel": "尺寸",
    "colorSpaceLabel": "插值空间",
    "blendMode": "混合模式",
    "randomizeLayer": "随机图层",
    "randomizeAll": "随机所有图层",
    "outputTitle": "CSS 输出",
    "outputSubtitle": "复制与预览一致的 CSS。",
    "outputFormat": "颜色格式",
    "copyCss": "复制 CSS",
    "copyBackgroundImage": "复制 background-image",
    "copyBackground": "复制 background",
    "copyBlendMode": "复制混合模式",
    "exportTitle": "导出",
    "exportSubtitle": "生成 PNG 快照。",
    "exportWidth": "宽度",
    "exportHeight": "高度",
    "generatePng": "生成 PNG",
    "downloadPng": "下载 PNG",
    "pngUnsupported": "当前浏览器不支持 PNG 导出。",
    "jsonTitle": "配置 JSON",
    "jsonSubtitle": "导出或粘贴渐变配置。",
    "copyJson": "复制 JSON",
    "downloadJson": "下载 JSON",
    "jsonPlaceholder": "粘贴 JSON 以加载渐变...",
    "loadJson": "加载 JSON",
    "invalidJson": "无效的渐变 JSON。",
    "type": {
      "linear": "线性",
      "radial": "径向",
      "conic": "圆锥"
    },
    "shape": {
      "circle": "圆形",
      "ellipse": "椭圆"
    },
    "size": {
      "closest-side": "最近边",
      "closest-corner": "最近角",
      "farthest-side": "最远边",
      "farthest-corner": "最远角"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "正常",
      "multiply": "正片叠底",
      "screen": "滤色",
      "overlay": "叠加",
      "darken": "变暗",
      "lighten": "变亮",
      "color-dodge": "颜色减淡",
      "color-burn": "颜色加深",
      "hard-light": "强光",
      "soft-light": "柔光",
      "difference": "差值",
      "exclusion": "排除",
      "hue": "色相",
      "saturation": "饱和度",
      "color": "颜色",
      "luminosity": "明度"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "极光",
      "sunset": "日落薄雾",
      "ocean": "深海",
      "neon": "霓虹薄雾",
      "dawn": "柔和晨曦",
      "citrus": "柑橘光"
    }
  },
  "zh-TW": {
    "previewTitle": "預覽",
    "previewHint": "即時預覽目前的漸層疊層。",
    "stopsTitle": "色標",
    "trackHint": "點擊新增色標，拖曳調整位置。",
    "stopColor": "色標顏色",
    "stopPosition": "位置",
    "addStop": "新增色標",
    "deleteStop": "刪除色標",
    "minStopsHint": "至少保留兩個色標。",
    "presetsTitle": "預設",
    "presetsSubtitle": "選擇一個精緻的起點。",
    "layersTitle": "圖層",
    "layersSubtitle": "疊加多層漸層以增加層次。",
    "layerLabel": "圖層 {index}",
    "addLayer": "新增圖層",
    "duplicateLayer": "複製",
    "moveUp": "上移",
    "moveDown": "下移",
    "deleteLayer": "刪除",
    "minLayerHint": "至少需要保留一個圖層。",
    "settingsTitle": "圖層設定",
    "settingsSubtitle": "調整幾何與混合方式。",
    "gradientType": "漸層類型",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "shapeLabel": "形狀",
    "sizeLabel": "尺寸",
    "colorSpaceLabel": "插值空間",
    "blendMode": "混合模式",
    "randomizeLayer": "隨機圖層",
    "randomizeAll": "隨機所有圖層",
    "outputTitle": "CSS 輸出",
    "outputSubtitle": "複製與預覽一致的 CSS。",
    "outputFormat": "顏色格式",
    "copyCss": "複製 CSS",
    "copyBackgroundImage": "複製 background-image",
    "copyBackground": "複製 background",
    "copyBlendMode": "複製混合模式",
    "exportTitle": "匯出",
    "exportSubtitle": "產生 PNG 快照。",
    "exportWidth": "寬度",
    "exportHeight": "高度",
    "generatePng": "產生 PNG",
    "downloadPng": "下載 PNG",
    "pngUnsupported": "此瀏覽器不支援 PNG 匯出。",
    "jsonTitle": "設定 JSON",
    "jsonSubtitle": "匯出或貼上漸層設定。",
    "copyJson": "複製 JSON",
    "downloadJson": "下載 JSON",
    "jsonPlaceholder": "貼上 JSON 以載入漸層...",
    "loadJson": "載入 JSON",
    "invalidJson": "無效的漸層 JSON。",
    "type": {
      "linear": "線性",
      "radial": "放射",
      "conic": "圓錐"
    },
    "shape": {
      "circle": "圓形",
      "ellipse": "橢圓"
    },
    "size": {
      "closest-side": "最近邊",
      "closest-corner": "最近角",
      "farthest-side": "最遠邊",
      "farthest-corner": "最遠角"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "正常",
      "multiply": "正片疊底",
      "screen": "濾色",
      "overlay": "疊加",
      "darken": "變暗",
      "lighten": "變亮",
      "color-dodge": "顏色減淡",
      "color-burn": "顏色加深",
      "hard-light": "強光",
      "soft-light": "柔光",
      "difference": "差值",
      "exclusion": "排除",
      "hue": "色相",
      "saturation": "飽和度",
      "color": "顏色",
      "luminosity": "明度"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "極光",
      "sunset": "日落薄霧",
      "ocean": "深海",
      "neon": "霓虹薄霧",
      "dawn": "柔和晨曦",
      "citrus": "柑橘光"
    }
  },
  "zh-HK": {
    "previewTitle": "預覽",
    "previewHint": "即時預覽目前的漸層疊層。",
    "stopsTitle": "色標",
    "trackHint": "點擊新增色標，拖曳調整位置。",
    "stopColor": "色標顏色",
    "stopPosition": "位置",
    "addStop": "新增色標",
    "deleteStop": "刪除色標",
    "minStopsHint": "至少保留兩個色標。",
    "presetsTitle": "預設",
    "presetsSubtitle": "選擇一個精緻的起點。",
    "layersTitle": "圖層",
    "layersSubtitle": "疊加多層漸層以增加層次。",
    "layerLabel": "圖層 {index}",
    "addLayer": "新增圖層",
    "duplicateLayer": "複製",
    "moveUp": "上移",
    "moveDown": "下移",
    "deleteLayer": "刪除",
    "minLayerHint": "至少需要保留一個圖層。",
    "settingsTitle": "圖層設定",
    "settingsSubtitle": "調整幾何與混合方式。",
    "gradientType": "漸層類型",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "shapeLabel": "形狀",
    "sizeLabel": "尺寸",
    "colorSpaceLabel": "插值空間",
    "blendMode": "混合模式",
    "randomizeLayer": "隨機圖層",
    "randomizeAll": "隨機所有圖層",
    "outputTitle": "CSS 輸出",
    "outputSubtitle": "複製與預覽一致的 CSS。",
    "outputFormat": "顏色格式",
    "copyCss": "複製 CSS",
    "copyBackgroundImage": "複製 background-image",
    "copyBackground": "複製 background",
    "copyBlendMode": "複製混合模式",
    "exportTitle": "匯出",
    "exportSubtitle": "產生 PNG 快照。",
    "exportWidth": "寬度",
    "exportHeight": "高度",
    "generatePng": "產生 PNG",
    "downloadPng": "下載 PNG",
    "pngUnsupported": "此瀏覽器不支援 PNG 匯出。",
    "jsonTitle": "設定 JSON",
    "jsonSubtitle": "匯出或貼上漸層設定。",
    "copyJson": "複製 JSON",
    "downloadJson": "下載 JSON",
    "jsonPlaceholder": "貼上 JSON 以載入漸層...",
    "loadJson": "載入 JSON",
    "invalidJson": "無效的漸層 JSON。",
    "type": {
      "linear": "線性",
      "radial": "放射",
      "conic": "圓錐"
    },
    "shape": {
      "circle": "圓形",
      "ellipse": "橢圓"
    },
    "size": {
      "closest-side": "最近邊",
      "closest-corner": "最近角",
      "farthest-side": "最遠邊",
      "farthest-corner": "最遠角"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "正常",
      "multiply": "正片疊底",
      "screen": "濾色",
      "overlay": "疊加",
      "darken": "變暗",
      "lighten": "變亮",
      "color-dodge": "顏色減淡",
      "color-burn": "顏色加深",
      "hard-light": "強光",
      "soft-light": "柔光",
      "difference": "差值",
      "exclusion": "排除",
      "hue": "色相",
      "saturation": "飽和度",
      "color": "顏色",
      "luminosity": "明度"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "極光",
      "sunset": "日落薄霧",
      "ocean": "深海",
      "neon": "霓虹薄霧",
      "dawn": "柔和晨曦",
      "citrus": "柑橘光"
    }
  },
  "es": {
    "previewTitle": "Vista previa",
    "previewHint": "Vista previa en tiempo real del conjunto de gradientes.",
    "stopsTitle": "Paradas de color",
    "trackHint": "Haz clic para añadir una parada. Arrastra para mover.",
    "stopColor": "Color de parada",
    "stopPosition": "Posición",
    "addStop": "Añadir parada",
    "deleteStop": "Eliminar parada",
    "minStopsHint": "Se necesitan al menos dos paradas.",
    "presetsTitle": "Preajustes",
    "presetsSubtitle": "Elige un punto de partida pulido.",
    "layersTitle": "Capas",
    "layersSubtitle": "Apila varios gradientes para dar profundidad.",
    "layerLabel": "Capa {index}",
    "addLayer": "Añadir capa",
    "duplicateLayer": "Duplicar",
    "moveUp": "Subir",
    "moveDown": "Bajar",
    "deleteLayer": "Eliminar",
    "minLayerHint": "Necesitas al menos una capa.",
    "settingsTitle": "Ajustes de capa",
    "settingsSubtitle": "Ajusta la geometría y la mezcla.",
    "gradientType": "Tipo de gradiente",
    "angle": "Ángulo",
    "centerX": "Centro X",
    "centerY": "Centro Y",
    "shapeLabel": "Forma",
    "sizeLabel": "Tamaño",
    "colorSpaceLabel": "Interpolación",
    "blendMode": "Modo de mezcla",
    "randomizeLayer": "Aleatorizar capa",
    "randomizeAll": "Aleatorizar todas",
    "outputTitle": "Salida CSS",
    "outputSubtitle": "Copia el CSS que coincide con la vista previa.",
    "outputFormat": "Formato de color",
    "copyCss": "Copiar CSS",
    "copyBackgroundImage": "Copiar background-image",
    "copyBackground": "Copiar background",
    "copyBlendMode": "Copiar modo de mezcla",
    "exportTitle": "Exportar",
    "exportSubtitle": "Genera una captura PNG.",
    "exportWidth": "Ancho",
    "exportHeight": "Alto",
    "generatePng": "Generar PNG",
    "downloadPng": "Descargar PNG",
    "pngUnsupported": "La exportación PNG no es compatible en este navegador.",
    "jsonTitle": "JSON de configuración",
    "jsonSubtitle": "Exporta o pega una configuración de gradiente.",
    "copyJson": "Copiar JSON",
    "downloadJson": "Descargar JSON",
    "jsonPlaceholder": "Pega JSON para cargar un gradiente...",
    "loadJson": "Cargar JSON",
    "invalidJson": "JSON de gradiente inválido.",
    "type": {
      "linear": "Lineal",
      "radial": "Radial",
      "conic": "Cónico"
    },
    "shape": {
      "circle": "Círculo",
      "ellipse": "Elipse"
    },
    "size": {
      "closest-side": "Lado más cercano",
      "closest-corner": "Esquina más cercana",
      "farthest-side": "Lado más lejano",
      "farthest-corner": "Esquina más lejana"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Multiplicar",
      "screen": "Trama",
      "overlay": "Superponer",
      "darken": "Oscurecer",
      "lighten": "Aclarar",
      "color-dodge": "Sobreexponer",
      "color-burn": "Subexponer",
      "hard-light": "Luz fuerte",
      "soft-light": "Luz suave",
      "difference": "Diferencia",
      "exclusion": "Exclusión",
      "hue": "Tono",
      "saturation": "Saturación",
      "color": "Color",
      "luminosity": "Luminosidad"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Lavado del atardecer",
      "ocean": "Profundidad oceánica",
      "neon": "Niebla neón",
      "dawn": "Amanecer suave",
      "citrus": "Brillo cítrico"
    }
  },
  "fr": {
    "previewTitle": "Aperçu",
    "previewHint": "Aperçu en direct de l’empilement de dégradés.",
    "stopsTitle": "Points de couleur",
    "trackHint": "Cliquez pour ajouter un point. Faites glisser pour déplacer.",
    "stopColor": "Couleur du point",
    "stopPosition": "Position",
    "addStop": "Ajouter un point",
    "deleteStop": "Supprimer le point",
    "minStopsHint": "Au moins deux points sont requis.",
    "presetsTitle": "Préréglages",
    "presetsSubtitle": "Choisissez un point de départ soigné.",
    "layersTitle": "Calques",
    "layersSubtitle": "Empilez plusieurs dégradés pour plus de profondeur.",
    "layerLabel": "Calque {index}",
    "addLayer": "Ajouter un calque",
    "duplicateLayer": "Dupliquer",
    "moveUp": "Monter",
    "moveDown": "Descendre",
    "deleteLayer": "Supprimer",
    "minLayerHint": "Au moins un calque est requis.",
    "settingsTitle": "Réglages du calque",
    "settingsSubtitle": "Ajustez la géométrie et le mélange.",
    "gradientType": "Type de dégradé",
    "angle": "Angle",
    "centerX": "Centre X",
    "centerY": "Centre Y",
    "shapeLabel": "Forme",
    "sizeLabel": "Taille",
    "colorSpaceLabel": "Interpolation",
    "blendMode": "Mode de fusion",
    "randomizeLayer": "Aléatoire (calque)",
    "randomizeAll": "Tout aléatoire",
    "outputTitle": "Sortie CSS",
    "outputSubtitle": "Copiez le CSS conforme à l’aperçu.",
    "outputFormat": "Format couleur",
    "copyCss": "Copier le CSS",
    "copyBackgroundImage": "Copier background-image",
    "copyBackground": "Copier background",
    "copyBlendMode": "Copier le mode de fusion",
    "exportTitle": "Exporter",
    "exportSubtitle": "Générez un instantané PNG.",
    "exportWidth": "Largeur",
    "exportHeight": "Hauteur",
    "generatePng": "Générer PNG",
    "downloadPng": "Télécharger PNG",
    "pngUnsupported": "L’export PNG n’est pas pris en charge dans ce navigateur.",
    "jsonTitle": "JSON de configuration",
    "jsonSubtitle": "Exportez ou collez une configuration de dégradé.",
    "copyJson": "Copier le JSON",
    "downloadJson": "Télécharger le JSON",
    "jsonPlaceholder": "Collez du JSON pour charger un dégradé...",
    "loadJson": "Charger le JSON",
    "invalidJson": "JSON de dégradé invalide.",
    "type": {
      "linear": "Linéaire",
      "radial": "Radial",
      "conic": "Conique"
    },
    "shape": {
      "circle": "Cercle",
      "ellipse": "Ellipse"
    },
    "size": {
      "closest-side": "Côté le plus proche",
      "closest-corner": "Coin le plus proche",
      "farthest-side": "Côté le plus éloigné",
      "farthest-corner": "Coin le plus éloigné"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Produit",
      "screen": "Superposition",
      "overlay": "Incrustation",
      "darken": "Assombrir",
      "lighten": "Éclaircir",
      "color-dodge": "Densité couleur -",
      "color-burn": "Densité couleur +",
      "hard-light": "Lumière crue",
      "soft-light": "Lumière tamisée",
      "difference": "Différence",
      "exclusion": "Exclusion",
      "hue": "Teinte",
      "saturation": "Saturation",
      "color": "Couleur",
      "luminosity": "Luminosité"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurore",
      "sunset": "Lavage du coucher",
      "ocean": "Profondeur océanique",
      "neon": "Brume néon",
      "dawn": "Aube douce",
      "citrus": "Lueur citronnée"
    }
  },
  "de": {
    "previewTitle": "Vorschau",
    "previewHint": "Live-Vorschau des aktuellen Verlaufsstapels.",
    "stopsTitle": "Farbstopps",
    "trackHint": "Klicken zum Hinzufügen, ziehen zum Verschieben.",
    "stopColor": "Stoppfarbe",
    "stopPosition": "Position",
    "addStop": "Stopp hinzufügen",
    "deleteStop": "Stopp löschen",
    "minStopsHint": "Mindestens zwei Stopps sind erforderlich.",
    "presetsTitle": "Presets",
    "presetsSubtitle": "Wählen Sie einen hochwertigen Ausgangspunkt.",
    "layersTitle": "Ebenen",
    "layersSubtitle": "Stapeln Sie mehrere Verläufe für mehr Tiefe.",
    "layerLabel": "Ebene {index}",
    "addLayer": "Ebene hinzufügen",
    "duplicateLayer": "Duplizieren",
    "moveUp": "Hoch",
    "moveDown": "Runter",
    "deleteLayer": "Löschen",
    "minLayerHint": "Mindestens eine Ebene ist erforderlich.",
    "settingsTitle": "Ebeneneinstellungen",
    "settingsSubtitle": "Geometrie und Mischmodus anpassen.",
    "gradientType": "Verlaufsart",
    "angle": "Winkel",
    "centerX": "Zentrum X",
    "centerY": "Zentrum Y",
    "shapeLabel": "Form",
    "sizeLabel": "Größe",
    "colorSpaceLabel": "Interpolation",
    "blendMode": "Mischmodus",
    "randomizeLayer": "Ebene zufällig",
    "randomizeAll": "Alle zufällig",
    "outputTitle": "CSS-Ausgabe",
    "outputSubtitle": "CSS passend zur Vorschau kopieren.",
    "outputFormat": "Farbformat",
    "copyCss": "CSS kopieren",
    "copyBackgroundImage": "background-image kopieren",
    "copyBackground": "background kopieren",
    "copyBlendMode": "Mischmodus kopieren",
    "exportTitle": "Export",
    "exportSubtitle": "PNG-Schnappschuss erzeugen.",
    "exportWidth": "Breite",
    "exportHeight": "Höhe",
    "generatePng": "PNG erzeugen",
    "downloadPng": "PNG herunterladen",
    "pngUnsupported": "PNG-Export wird in diesem Browser nicht unterstützt.",
    "jsonTitle": "Konfig-JSON",
    "jsonSubtitle": "Exportieren oder einfügen, um ein Setup zu laden.",
    "copyJson": "JSON kopieren",
    "downloadJson": "JSON herunterladen",
    "jsonPlaceholder": "JSON einfügen, um einen Verlauf zu laden...",
    "loadJson": "JSON laden",
    "invalidJson": "Ungültiges Verlaufs-JSON.",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konisch"
    },
    "shape": {
      "circle": "Kreis",
      "ellipse": "Ellipse"
    },
    "size": {
      "closest-side": "Nächste Seite",
      "closest-corner": "Nächste Ecke",
      "farthest-side": "Fernste Seite",
      "farthest-corner": "Fernste Ecke"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Multiplizieren",
      "screen": "Negativ multiplizieren",
      "overlay": "Überlagern",
      "darken": "Abdunkeln",
      "lighten": "Aufhellen",
      "color-dodge": "Farbig abwedeln",
      "color-burn": "Farbig nachbelichten",
      "hard-light": "Hartes Licht",
      "soft-light": "Weiches Licht",
      "difference": "Differenz",
      "exclusion": "Ausschluss",
      "hue": "Farbton",
      "saturation": "Sättigung",
      "color": "Farbe",
      "luminosity": "Luminanz"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Sonnenuntergang",
      "ocean": "Ozeantiefe",
      "neon": "Neonnebel",
      "dawn": "Sanfte Morgendämmerung",
      "citrus": "Zitrusglühen"
    }
  },
  "it": {
    "previewTitle": "Anteprima",
    "previewHint": "Anteprima live dello stack di gradienti.",
    "stopsTitle": "Punti colore",
    "trackHint": "Clicca per aggiungere un punto. Trascina per spostare.",
    "stopColor": "Colore del punto",
    "stopPosition": "Posizione",
    "addStop": "Aggiungi punto",
    "deleteStop": "Rimuovi punto",
    "minStopsHint": "Sono necessari almeno due punti.",
    "presetsTitle": "Preset",
    "presetsSubtitle": "Scegli un punto di partenza raffinato.",
    "layersTitle": "Livelli",
    "layersSubtitle": "Sovrapponi gradienti per profondità.",
    "layerLabel": "Livello {index}",
    "addLayer": "Aggiungi livello",
    "duplicateLayer": "Duplica",
    "moveUp": "Su",
    "moveDown": "Giù",
    "deleteLayer": "Elimina",
    "minLayerHint": "Serve almeno un livello.",
    "settingsTitle": "Impostazioni livello",
    "settingsSubtitle": "Regola geometria e fusione.",
    "gradientType": "Tipo di gradiente",
    "angle": "Angolo",
    "centerX": "Centro X",
    "centerY": "Centro Y",
    "shapeLabel": "Forma",
    "sizeLabel": "Dimensione",
    "colorSpaceLabel": "Interpolazione",
    "blendMode": "Modalità di fusione",
    "randomizeLayer": "Casualizza livello",
    "randomizeAll": "Casualizza tutto",
    "outputTitle": "Output CSS",
    "outputSubtitle": "Copia il CSS che corrisponde all’anteprima.",
    "outputFormat": "Formato colore",
    "copyCss": "Copia CSS",
    "copyBackgroundImage": "Copia background-image",
    "copyBackground": "Copia background",
    "copyBlendMode": "Copia modalità fusione",
    "exportTitle": "Esporta",
    "exportSubtitle": "Genera uno snapshot PNG.",
    "exportWidth": "Larghezza",
    "exportHeight": "Altezza",
    "generatePng": "Genera PNG",
    "downloadPng": "Scarica PNG",
    "pngUnsupported": "L’esportazione PNG non è supportata in questo browser.",
    "jsonTitle": "JSON di configurazione",
    "jsonSubtitle": "Esporta o incolla una configurazione.",
    "copyJson": "Copia JSON",
    "downloadJson": "Scarica JSON",
    "jsonPlaceholder": "Incolla JSON per caricare un gradiente...",
    "loadJson": "Carica JSON",
    "invalidJson": "JSON del gradiente non valido.",
    "type": {
      "linear": "Lineare",
      "radial": "Radiale",
      "conic": "Conico"
    },
    "shape": {
      "circle": "Cerchio",
      "ellipse": "Ellisse"
    },
    "size": {
      "closest-side": "Lato più vicino",
      "closest-corner": "Angolo più vicino",
      "farthest-side": "Lato più lontano",
      "farthest-corner": "Angolo più lontano"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normale",
      "multiply": "Moltiplica",
      "screen": "Scherma",
      "overlay": "Sovrapponi",
      "darken": "Scurisci",
      "lighten": "Schiarisci",
      "color-dodge": "Scherma colore",
      "color-burn": "Brucia colore",
      "hard-light": "Luce intensa",
      "soft-light": "Luce soffusa",
      "difference": "Differenza",
      "exclusion": "Esclusione",
      "hue": "Tonalità",
      "saturation": "Saturazione",
      "color": "Colore",
      "luminosity": "Luminosità"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Tramonto",
      "ocean": "Profondità oceanica",
      "neon": "Nebbia neon",
      "dawn": "Alba morbida",
      "citrus": "Bagliore agrumato"
    }
  },
  "ja": {
    "previewTitle": "プレビュー",
    "previewHint": "現在のグラデーションスタックをリアルタイム表示します。",
    "stopsTitle": "カラー停止点",
    "trackHint": "クリックで追加、ドラッグで移動。",
    "stopColor": "停止点の色",
    "stopPosition": "位置",
    "addStop": "停止点を追加",
    "deleteStop": "停止点を削除",
    "minStopsHint": "少なくとも 2 つの停止点が必要です。",
    "presetsTitle": "プリセット",
    "presetsSubtitle": "洗練された出発点を選択します。",
    "layersTitle": "レイヤー",
    "layersSubtitle": "複数のグラデーションを重ねて奥行きを追加。",
    "layerLabel": "レイヤー {index}",
    "addLayer": "レイヤーを追加",
    "duplicateLayer": "複製",
    "moveUp": "上へ",
    "moveDown": "下へ",
    "deleteLayer": "削除",
    "minLayerHint": "少なくとも 1 つのレイヤーが必要です。",
    "settingsTitle": "レイヤー設定",
    "settingsSubtitle": "形状とブレンドを調整します。",
    "gradientType": "グラデーション種類",
    "angle": "角度",
    "centerX": "中心 X",
    "centerY": "中心 Y",
    "shapeLabel": "形状",
    "sizeLabel": "サイズ",
    "colorSpaceLabel": "補間",
    "blendMode": "ブレンドモード",
    "randomizeLayer": "レイヤーをランダム化",
    "randomizeAll": "すべてをランダム化",
    "outputTitle": "CSS 出力",
    "outputSubtitle": "プレビューと一致する CSS をコピー。",
    "outputFormat": "色形式",
    "copyCss": "CSS をコピー",
    "copyBackgroundImage": "background-image をコピー",
    "copyBackground": "background をコピー",
    "copyBlendMode": "ブレンドモードをコピー",
    "exportTitle": "エクスポート",
    "exportSubtitle": "PNG スナップショットを生成。",
    "exportWidth": "幅",
    "exportHeight": "高さ",
    "generatePng": "PNG を生成",
    "downloadPng": "PNG をダウンロード",
    "pngUnsupported": "このブラウザでは PNG 出力に対応していません。",
    "jsonTitle": "設定 JSON",
    "jsonSubtitle": "設定をエクスポートまたは貼り付け。",
    "copyJson": "JSON をコピー",
    "downloadJson": "JSON をダウンロード",
    "jsonPlaceholder": "JSON を貼り付けてグラデーションを読み込み...",
    "loadJson": "JSON を読み込む",
    "invalidJson": "無効なグラデーション JSON です。",
    "type": {
      "linear": "線形",
      "radial": "放射",
      "conic": "円錐"
    },
    "shape": {
      "circle": "円",
      "ellipse": "楕円"
    },
    "size": {
      "closest-side": "最も近い辺",
      "closest-corner": "最も近い角",
      "farthest-side": "最も遠い辺",
      "farthest-corner": "最も遠い角"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "通常",
      "multiply": "乗算",
      "screen": "スクリーン",
      "overlay": "オーバーレイ",
      "darken": "比較（暗）",
      "lighten": "比較（明）",
      "color-dodge": "覆い焼き（カラー）",
      "color-burn": "焼き込み（カラー）",
      "hard-light": "ハードライト",
      "soft-light": "ソフトライト",
      "difference": "差の絶対値",
      "exclusion": "除外",
      "hue": "色相",
      "saturation": "彩度",
      "color": "カラー",
      "luminosity": "輝度"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "オーロラ",
      "sunset": "夕焼け",
      "ocean": "オーシャン",
      "neon": "ネオンミスト",
      "dawn": "ソフトドーン",
      "citrus": "シトラスグロー"
    }
  },
  "ko": {
    "previewTitle": "미리보기",
    "previewHint": "현재 그라디언트 스택을 실시간으로 표시합니다.",
    "stopsTitle": "색상 스톱",
    "trackHint": "클릭해서 추가하고 드래그해서 이동하세요.",
    "stopColor": "스톱 색상",
    "stopPosition": "위치",
    "addStop": "스톱 추가",
    "deleteStop": "스톱 삭제",
    "minStopsHint": "최소 두 개의 스톱이 필요합니다.",
    "presetsTitle": "프리셋",
    "presetsSubtitle": "완성된 시작점을 선택하세요.",
    "layersTitle": "레이어",
    "layersSubtitle": "여러 그라디언트를 쌓아 깊이를 만듭니다.",
    "layerLabel": "레이어 {index}",
    "addLayer": "레이어 추가",
    "duplicateLayer": "복제",
    "moveUp": "위",
    "moveDown": "아래",
    "deleteLayer": "삭제",
    "minLayerHint": "최소 한 개의 레이어가 필요합니다.",
    "settingsTitle": "레이어 설정",
    "settingsSubtitle": "기하와 블렌딩을 조정합니다.",
    "gradientType": "그라디언트 유형",
    "angle": "각도",
    "centerX": "중심 X",
    "centerY": "중심 Y",
    "shapeLabel": "모양",
    "sizeLabel": "크기",
    "colorSpaceLabel": "보간",
    "blendMode": "블렌드 모드",
    "randomizeLayer": "레이어 랜덤",
    "randomizeAll": "전체 랜덤",
    "outputTitle": "CSS 출력",
    "outputSubtitle": "미리보기와 동일한 CSS를 복사합니다.",
    "outputFormat": "색상 형식",
    "copyCss": "CSS 복사",
    "copyBackgroundImage": "background-image 복사",
    "copyBackground": "background 복사",
    "copyBlendMode": "블렌드 모드 복사",
    "exportTitle": "내보내기",
    "exportSubtitle": "PNG 스냅샷을 생성합니다.",
    "exportWidth": "너비",
    "exportHeight": "높이",
    "generatePng": "PNG 생성",
    "downloadPng": "PNG 다운로드",
    "pngUnsupported": "이 브라우저는 PNG 내보내기를 지원하지 않습니다.",
    "jsonTitle": "설정 JSON",
    "jsonSubtitle": "설정을 내보내거나 붙여넣어 불러오세요.",
    "copyJson": "JSON 복사",
    "downloadJson": "JSON 다운로드",
    "jsonPlaceholder": "JSON을 붙여넣어 그라디언트를 불러오기...",
    "loadJson": "JSON 불러오기",
    "invalidJson": "잘못된 그라디언트 JSON입니다.",
    "type": {
      "linear": "선형",
      "radial": "방사형",
      "conic": "원뿔형"
    },
    "shape": {
      "circle": "원",
      "ellipse": "타원"
    },
    "size": {
      "closest-side": "가장 가까운 면",
      "closest-corner": "가장 가까운 모서리",
      "farthest-side": "가장 먼 면",
      "farthest-corner": "가장 먼 모서리"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "일반",
      "multiply": "곱하기",
      "screen": "스크린",
      "overlay": "오버레이",
      "darken": "어둡게",
      "lighten": "밝게",
      "color-dodge": "색상 닷지",
      "color-burn": "색상 번",
      "hard-light": "하드 라이트",
      "soft-light": "소프트 라이트",
      "difference": "차이",
      "exclusion": "제외",
      "hue": "색상",
      "saturation": "채도",
      "color": "컬러",
      "luminosity": "명도"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "오로라",
      "sunset": "노을",
      "ocean": "오션",
      "neon": "네온 미스트",
      "dawn": "부드러운 새벽",
      "citrus": "시트러스 글로우"
    }
  },
  "ru": {
    "previewTitle": "Предпросмотр",
    "previewHint": "Живой предпросмотр текущего набора градиентов.",
    "stopsTitle": "Цветовые стопы",
    "trackHint": "Нажмите, чтобы добавить стоп. Перетащите для перемещения.",
    "stopColor": "Цвет стопа",
    "stopPosition": "Позиция",
    "addStop": "Добавить стоп",
    "deleteStop": "Удалить стоп",
    "minStopsHint": "Нужно как минимум два стопа.",
    "presetsTitle": "Пресеты",
    "presetsSubtitle": "Выберите готовую отправную точку.",
    "layersTitle": "Слои",
    "layersSubtitle": "Накладывайте градиенты для глубины.",
    "layerLabel": "Слой {index}",
    "addLayer": "Добавить слой",
    "duplicateLayer": "Дублировать",
    "moveUp": "Вверх",
    "moveDown": "Вниз",
    "deleteLayer": "Удалить",
    "minLayerHint": "Нужен хотя бы один слой.",
    "settingsTitle": "Настройки слоя",
    "settingsSubtitle": "Настройте геометрию и смешивание.",
    "gradientType": "Тип градиента",
    "angle": "Угол",
    "centerX": "Центр X",
    "centerY": "Центр Y",
    "shapeLabel": "Форма",
    "sizeLabel": "Размер",
    "colorSpaceLabel": "Интерполяция",
    "blendMode": "Режим смешивания",
    "randomizeLayer": "Случайный слой",
    "randomizeAll": "Случайно все",
    "outputTitle": "CSS вывод",
    "outputSubtitle": "Скопируйте CSS как в превью.",
    "outputFormat": "Формат цвета",
    "copyCss": "Копировать CSS",
    "copyBackgroundImage": "Копировать background-image",
    "copyBackground": "Копировать background",
    "copyBlendMode": "Копировать режим",
    "exportTitle": "Экспорт",
    "exportSubtitle": "Создайте PNG-снимок.",
    "exportWidth": "Ширина",
    "exportHeight": "Высота",
    "generatePng": "Сгенерировать PNG",
    "downloadPng": "Скачать PNG",
    "pngUnsupported": "Экспорт PNG не поддерживается в этом браузере.",
    "jsonTitle": "JSON конфигурации",
    "jsonSubtitle": "Экспортируйте или вставьте конфигурацию.",
    "copyJson": "Копировать JSON",
    "downloadJson": "Скачать JSON",
    "jsonPlaceholder": "Вставьте JSON, чтобы загрузить градиент...",
    "loadJson": "Загрузить JSON",
    "invalidJson": "Неверный JSON градиента.",
    "type": {
      "linear": "Линейный",
      "radial": "Радиальный",
      "conic": "Конический"
    },
    "shape": {
      "circle": "Круг",
      "ellipse": "Эллипс"
    },
    "size": {
      "closest-side": "Ближайшая сторона",
      "closest-corner": "Ближайший угол",
      "farthest-side": "Самая дальняя сторона",
      "farthest-corner": "Самый дальний угол"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Нормальный",
      "multiply": "Умножение",
      "screen": "Экран",
      "overlay": "Перекрытие",
      "darken": "Затемнение",
      "lighten": "Осветление",
      "color-dodge": "Осветление основы",
      "color-burn": "Затемнение основы",
      "hard-light": "Жёсткий свет",
      "soft-light": "Мягкий свет",
      "difference": "Разница",
      "exclusion": "Исключение",
      "hue": "Тон",
      "saturation": "Насыщенность",
      "color": "Цвет",
      "luminosity": "Яркость"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Аврора",
      "sunset": "Закат",
      "ocean": "Глубины океана",
      "neon": "Неоновый туман",
      "dawn": "Мягкий рассвет",
      "citrus": "Цитрусовое сияние"
    }
  },
  "pt": {
    "previewTitle": "Prévia",
    "previewHint": "Prévia ao vivo da pilha de gradientes.",
    "stopsTitle": "Paradas de cor",
    "trackHint": "Clique para adicionar uma parada. Arraste para mover.",
    "stopColor": "Cor da parada",
    "stopPosition": "Posição",
    "addStop": "Adicionar parada",
    "deleteStop": "Excluir parada",
    "minStopsHint": "São necessárias pelo menos duas paradas.",
    "presetsTitle": "Predefinições",
    "presetsSubtitle": "Escolha um ponto de partida refinado.",
    "layersTitle": "Camadas",
    "layersSubtitle": "Empilhe gradientes para dar profundidade.",
    "layerLabel": "Camada {index}",
    "addLayer": "Adicionar camada",
    "duplicateLayer": "Duplicar",
    "moveUp": "Subir",
    "moveDown": "Descer",
    "deleteLayer": "Excluir",
    "minLayerHint": "É necessária pelo menos uma camada.",
    "settingsTitle": "Configurações da camada",
    "settingsSubtitle": "Ajuste a geometria e a mesclagem.",
    "gradientType": "Tipo de gradiente",
    "angle": "Ângulo",
    "centerX": "Centro X",
    "centerY": "Centro Y",
    "shapeLabel": "Forma",
    "sizeLabel": "Tamanho",
    "colorSpaceLabel": "Interpolação",
    "blendMode": "Modo de mesclagem",
    "randomizeLayer": "Aleatorizar camada",
    "randomizeAll": "Aleatorizar todas",
    "outputTitle": "Saída CSS",
    "outputSubtitle": "Copie o CSS que corresponde à prévia.",
    "outputFormat": "Formato de cor",
    "copyCss": "Copiar CSS",
    "copyBackgroundImage": "Copiar background-image",
    "copyBackground": "Copiar background",
    "copyBlendMode": "Copiar modo de mesclagem",
    "exportTitle": "Exportar",
    "exportSubtitle": "Gere um snapshot PNG.",
    "exportWidth": "Largura",
    "exportHeight": "Altura",
    "generatePng": "Gerar PNG",
    "downloadPng": "Baixar PNG",
    "pngUnsupported": "A exportação PNG não é suportada neste navegador.",
    "jsonTitle": "JSON de configuração",
    "jsonSubtitle": "Exporte ou cole uma configuração.",
    "copyJson": "Copiar JSON",
    "downloadJson": "Baixar JSON",
    "jsonPlaceholder": "Cole JSON para carregar um gradiente...",
    "loadJson": "Carregar JSON",
    "invalidJson": "JSON de gradiente inválido.",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Cônico"
    },
    "shape": {
      "circle": "Círculo",
      "ellipse": "Elipse"
    },
    "size": {
      "closest-side": "Lado mais próximo",
      "closest-corner": "Canto mais próximo",
      "farthest-side": "Lado mais distante",
      "farthest-corner": "Canto mais distante"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Multiplicar",
      "screen": "Tela",
      "overlay": "Sobrepor",
      "darken": "Escurecer",
      "lighten": "Clarear",
      "color-dodge": "Subexposição de cor",
      "color-burn": "Superexposição de cor",
      "hard-light": "Luz forte",
      "soft-light": "Luz suave",
      "difference": "Diferença",
      "exclusion": "Exclusão",
      "hue": "Matiz",
      "saturation": "Saturação",
      "color": "Cor",
      "luminosity": "Luminosidade"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Lavado do pôr do sol",
      "ocean": "Profundidade oceânica",
      "neon": "Néon",
      "dawn": "Amanhecer suave",
      "citrus": "Brilho cítrico"
    }
  },
  "ar": {
    "previewTitle": "المعاينة",
    "previewHint": "معاينة مباشرة لتكديس التدرجات الحالية.",
    "stopsTitle": "نقاط الألوان",
    "trackHint": "انقر للإضافة واسحب للتحريك.",
    "stopColor": "لون النقطة",
    "stopPosition": "الموضع",
    "addStop": "إضافة نقطة",
    "deleteStop": "حذف النقطة",
    "minStopsHint": "يلزم نقطتان على الأقل.",
    "presetsTitle": "قوالب",
    "presetsSubtitle": "اختر نقطة بداية مصقولة.",
    "layersTitle": "الطبقات",
    "layersSubtitle": "كدّس تدرجات متعددة لإضفاء عمق.",
    "layerLabel": "طبقة {index}",
    "addLayer": "إضافة طبقة",
    "duplicateLayer": "تكرار",
    "moveUp": "أعلى",
    "moveDown": "أسفل",
    "deleteLayer": "حذف",
    "minLayerHint": "تحتاج طبقة واحدة على الأقل.",
    "settingsTitle": "إعدادات الطبقة",
    "settingsSubtitle": "اضبط الهندسة والمزج.",
    "gradientType": "نوع التدرج",
    "angle": "الزاوية",
    "centerX": "المركز X",
    "centerY": "المركز Y",
    "shapeLabel": "الشكل",
    "sizeLabel": "الحجم",
    "colorSpaceLabel": "الاستيفاء",
    "blendMode": "وضع المزج",
    "randomizeLayer": "عشوائي للطبقة",
    "randomizeAll": "عشوائي للجميع",
    "outputTitle": "مخرجات CSS",
    "outputSubtitle": "انسخ CSS المطابق للمعاينة.",
    "outputFormat": "تنسيق اللون",
    "copyCss": "نسخ CSS",
    "copyBackgroundImage": "نسخ background-image",
    "copyBackground": "نسخ background",
    "copyBlendMode": "نسخ وضع المزج",
    "exportTitle": "تصدير",
    "exportSubtitle": "إنشاء لقطة PNG.",
    "exportWidth": "العرض",
    "exportHeight": "الارتفاع",
    "generatePng": "إنشاء PNG",
    "downloadPng": "تنزيل PNG",
    "pngUnsupported": "تصدير PNG غير مدعوم في هذا المتصفح.",
    "jsonTitle": "JSON للإعداد",
    "jsonSubtitle": "صدّر أو الصق إعداد التدرج.",
    "copyJson": "نسخ JSON",
    "downloadJson": "تنزيل JSON",
    "jsonPlaceholder": "الصق JSON لتحميل التدرج...",
    "loadJson": "تحميل JSON",
    "invalidJson": "JSON غير صالح للتدرج.",
    "type": {
      "linear": "خطي",
      "radial": "شعاعي",
      "conic": "مخروطي"
    },
    "shape": {
      "circle": "دائري",
      "ellipse": "بيضاوي"
    },
    "size": {
      "closest-side": "أقرب جانب",
      "closest-corner": "أقرب زاوية",
      "farthest-side": "أبعد جانب",
      "farthest-corner": "أبعد زاوية"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "عادي",
      "multiply": "ضرب",
      "screen": "شاشة",
      "overlay": "تراكب",
      "darken": "تغميق",
      "lighten": "تفتيح",
      "color-dodge": "تفتيح اللون",
      "color-burn": "حرق اللون",
      "hard-light": "ضوء قوي",
      "soft-light": "ضوء ناعم",
      "difference": "فرق",
      "exclusion": "استثناء",
      "hue": "صبغة",
      "saturation": "تشبع",
      "color": "لون",
      "luminosity": "لمعان"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "أورورا",
      "sunset": "غسق",
      "ocean": "عمق المحيط",
      "neon": "ضباب نيون",
      "dawn": "فجر ناعم",
      "citrus": "توهج الحمضيات"
    }
  },
  "hi": {
    "previewTitle": "पूर्वावलोकन",
    "previewHint": "वर्तमान ग्रेडिएंट स्टैक का लाइव पूर्वावलोकन।",
    "stopsTitle": "रंग स्टॉप",
    "trackHint": "जोड़ने के लिए क्लिक करें, खींचकर हिलाएं।",
    "stopColor": "स्टॉप रंग",
    "stopPosition": "स्थिति",
    "addStop": "स्टॉप जोड़ें",
    "deleteStop": "स्टॉप हटाएं",
    "minStopsHint": "कम से कम दो स्टॉप आवश्यक हैं।",
    "presetsTitle": "प्रीसेट",
    "presetsSubtitle": "एक सजा हुआ शुरुआती बिंदु चुनें।",
    "layersTitle": "परतें",
    "layersSubtitle": "गहराई के लिए कई ग्रेडिएंट स्टैक करें।",
    "layerLabel": "परत {index}",
    "addLayer": "परत जोड़ें",
    "duplicateLayer": "डुप्लिकेट",
    "moveUp": "ऊपर",
    "moveDown": "नीचे",
    "deleteLayer": "हटाएं",
    "minLayerHint": "कम से कम एक परत आवश्यक है।",
    "settingsTitle": "परत सेटिंग",
    "settingsSubtitle": "ज्यामिति और ब्लेंडिंग समायोजित करें।",
    "gradientType": "ग्रेडिएंट प्रकार",
    "angle": "कोण",
    "centerX": "केंद्र X",
    "centerY": "केंद्र Y",
    "shapeLabel": "आकार",
    "sizeLabel": "आकार",
    "colorSpaceLabel": "इंटरपोलेशन",
    "blendMode": "ब्लेंड मोड",
    "randomizeLayer": "परत यादृच्छिक",
    "randomizeAll": "सभी यादृच्छिक",
    "outputTitle": "CSS आउटपुट",
    "outputSubtitle": "पूर्वावलोकन के अनुरूप CSS कॉपी करें।",
    "outputFormat": "रंग प्रारूप",
    "copyCss": "CSS कॉपी करें",
    "copyBackgroundImage": "background-image कॉपी करें",
    "copyBackground": "background कॉपी करें",
    "copyBlendMode": "ब्लेंड मोड कॉपी करें",
    "exportTitle": "निर्यात",
    "exportSubtitle": "PNG स्नैपशॉट बनाएं।",
    "exportWidth": "चौड़ाई",
    "exportHeight": "ऊंचाई",
    "generatePng": "PNG बनाएं",
    "downloadPng": "PNG डाउनलोड करें",
    "pngUnsupported": "इस ब्राउज़र में PNG निर्यात समर्थित नहीं है।",
    "jsonTitle": "कॉन्फ़िग JSON",
    "jsonSubtitle": "कॉन्फ़िग निर्यात या पेस्ट करें।",
    "copyJson": "JSON कॉपी करें",
    "downloadJson": "JSON डाउनलोड करें",
    "jsonPlaceholder": "ग्रेडिएंट लोड करने के लिए JSON पेस्ट करें...",
    "loadJson": "JSON लोड करें",
    "invalidJson": "अमान्य ग्रेडिएंट JSON।",
    "type": {
      "linear": "रेखीय",
      "radial": "रेडियल",
      "conic": "कोनिक"
    },
    "shape": {
      "circle": "वृत्त",
      "ellipse": "दीर्घवृत्त"
    },
    "size": {
      "closest-side": "सबसे नज़दीकी किनारा",
      "closest-corner": "सबसे नज़दीकी कोना",
      "farthest-side": "सबसे दूर किनारा",
      "farthest-corner": "सबसे दूर कोना"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "सामान्य",
      "multiply": "गुणा",
      "screen": "स्क्रीन",
      "overlay": "ओवरले",
      "darken": "गहरा",
      "lighten": "हल्का",
      "color-dodge": "कलर डॉज",
      "color-burn": "कलर बर्न",
      "hard-light": "हार्ड लाइट",
      "soft-light": "सॉफ्ट लाइट",
      "difference": "अंतर",
      "exclusion": "बहिष्करण",
      "hue": "ह्यू",
      "saturation": "संतृप्ति",
      "color": "रंग",
      "luminosity": "दीप्ति"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "ऑरोरा",
      "sunset": "सनसेट वॉश",
      "ocean": "ओशन डेप्थ",
      "neon": "निऑन मिस्ट",
      "dawn": "सॉफ्ट डॉन",
      "citrus": "सिट्रस ग्लो"
    }
  },
  "tr": {
    "previewTitle": "Önizleme",
    "previewHint": "Geçerli gradyan yığınının canlı önizlemesi.",
    "stopsTitle": "Renk Durakları",
    "trackHint": "Eklemek için tıklayın, taşımak için sürükleyin.",
    "stopColor": "Durak rengi",
    "stopPosition": "Konum",
    "addStop": "Durak ekle",
    "deleteStop": "Durağı sil",
    "minStopsHint": "En az iki durak gerekir.",
    "presetsTitle": "Ön ayarlar",
    "presetsSubtitle": "Parlak bir başlangıç seçin.",
    "layersTitle": "Katmanlar",
    "layersSubtitle": "Derinlik için gradyanları üst üste koyun.",
    "layerLabel": "Katman {index}",
    "addLayer": "Katman ekle",
    "duplicateLayer": "Çoğalt",
    "moveUp": "Yukarı",
    "moveDown": "Aşağı",
    "deleteLayer": "Sil",
    "minLayerHint": "En az bir katman gerekli.",
    "settingsTitle": "Katman ayarları",
    "settingsSubtitle": "Geometri ve karışımı ayarlayın.",
    "gradientType": "Gradyan türü",
    "angle": "Açı",
    "centerX": "Merkez X",
    "centerY": "Merkez Y",
    "shapeLabel": "Şekil",
    "sizeLabel": "Boyut",
    "colorSpaceLabel": "Enterpolasyon",
    "blendMode": "Karışım modu",
    "randomizeLayer": "Katmanı rastgele",
    "randomizeAll": "Hepsini rastgele",
    "outputTitle": "CSS Çıktısı",
    "outputSubtitle": "Önizlemeyle eşleşen CSS'i kopyalayın.",
    "outputFormat": "Renk biçimi",
    "copyCss": "CSS kopyala",
    "copyBackgroundImage": "background-image kopyala",
    "copyBackground": "background kopyala",
    "copyBlendMode": "Karışım modunu kopyala",
    "exportTitle": "Dışa aktar",
    "exportSubtitle": "PNG anlık görüntü oluşturun.",
    "exportWidth": "Genişlik",
    "exportHeight": "Yükseklik",
    "generatePng": "PNG oluştur",
    "downloadPng": "PNG indir",
    "pngUnsupported": "PNG dışa aktarma bu tarayıcıda desteklenmiyor.",
    "jsonTitle": "JSON yapılandırması",
    "jsonSubtitle": "Yapılandırmayı dışa aktarın veya yapıştırın.",
    "copyJson": "JSON kopyala",
    "downloadJson": "JSON indir",
    "jsonPlaceholder": "Gradyan yüklemek için JSON yapıştırın...",
    "loadJson": "JSON yükle",
    "invalidJson": "Geçersiz gradyan JSON'u.",
    "type": {
      "linear": "Doğrusal",
      "radial": "Radyal",
      "conic": "Konik"
    },
    "shape": {
      "circle": "Daire",
      "ellipse": "Elips"
    },
    "size": {
      "closest-side": "En yakın kenar",
      "closest-corner": "En yakın köşe",
      "farthest-side": "En uzak kenar",
      "farthest-corner": "En uzak köşe"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Çarp",
      "screen": "Ekran",
      "overlay": "Kaplama",
      "darken": "Koyulaştır",
      "lighten": "Aydınlat",
      "color-dodge": "Renk açma",
      "color-burn": "Renk yakma",
      "hard-light": "Sert ışık",
      "soft-light": "Yumuşak ışık",
      "difference": "Fark",
      "exclusion": "Dışlama",
      "hue": "Ton",
      "saturation": "Doygunluk",
      "color": "Renk",
      "luminosity": "Parlaklık"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Gün batımı",
      "ocean": "Okyanus derinliği",
      "neon": "Neon sis",
      "dawn": "Yumuşak şafak",
      "citrus": "Narenciye parıltısı"
    }
  },
  "nl": {
    "previewTitle": "Voorbeeld",
    "previewHint": "Live voorbeeld van de huidige gradient-stack.",
    "stopsTitle": "Kleurstops",
    "trackHint": "Klik om een stop toe te voegen, sleep om te verplaatsen.",
    "stopColor": "Stopkleur",
    "stopPosition": "Positie",
    "addStop": "Stop toevoegen",
    "deleteStop": "Stop verwijderen",
    "minStopsHint": "Minstens twee stops zijn vereist.",
    "presetsTitle": "Presets",
    "presetsSubtitle": "Kies een gepolijst startpunt.",
    "layersTitle": "Lagen",
    "layersSubtitle": "Stapel meerdere gradients voor diepte.",
    "layerLabel": "Laag {index}",
    "addLayer": "Laag toevoegen",
    "duplicateLayer": "Dupliceren",
    "moveUp": "Omhoog",
    "moveDown": "Omlaag",
    "deleteLayer": "Verwijderen",
    "minLayerHint": "Er is minimaal één laag nodig.",
    "settingsTitle": "Laaginstellingen",
    "settingsSubtitle": "Pas geometrie en blending aan.",
    "gradientType": "Gradienttype",
    "angle": "Hoek",
    "centerX": "Middelpunt X",
    "centerY": "Middelpunt Y",
    "shapeLabel": "Vorm",
    "sizeLabel": "Grootte",
    "colorSpaceLabel": "Interpolatie",
    "blendMode": "Mengmodus",
    "randomizeLayer": "Laag willekeurig",
    "randomizeAll": "Alles willekeurig",
    "outputTitle": "CSS-uitvoer",
    "outputSubtitle": "Kopieer CSS dat overeenkomt met de preview.",
    "outputFormat": "Kleurformaat",
    "copyCss": "CSS kopiëren",
    "copyBackgroundImage": "background-image kopiëren",
    "copyBackground": "background kopiëren",
    "copyBlendMode": "Mengmodus kopiëren",
    "exportTitle": "Exporteren",
    "exportSubtitle": "Genereer een PNG-snapshot.",
    "exportWidth": "Breedte",
    "exportHeight": "Hoogte",
    "generatePng": "PNG genereren",
    "downloadPng": "PNG downloaden",
    "pngUnsupported": "PNG-export wordt niet ondersteund in deze browser.",
    "jsonTitle": "Configuratie-JSON",
    "jsonSubtitle": "Exporteer of plak een configuratie.",
    "copyJson": "JSON kopiëren",
    "downloadJson": "JSON downloaden",
    "jsonPlaceholder": "Plak JSON om een gradient te laden...",
    "loadJson": "JSON laden",
    "invalidJson": "Ongeldige gradient-JSON.",
    "type": {
      "linear": "Lineair",
      "radial": "Radiaal",
      "conic": "Conisch"
    },
    "shape": {
      "circle": "Cirkel",
      "ellipse": "Ellips"
    },
    "size": {
      "closest-side": "Dichtstbijzijnde zijde",
      "closest-corner": "Dichtstbijzijnde hoek",
      "farthest-side": "Verste zijde",
      "farthest-corner": "Verste hoek"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normaal",
      "multiply": "Vermenigvuldigen",
      "screen": "Scherm",
      "overlay": "Overlay",
      "darken": "Donkerder",
      "lighten": "Lichter",
      "color-dodge": "Kleur tegenhouden",
      "color-burn": "Kleur doordrukken",
      "hard-light": "Hard licht",
      "soft-light": "Zacht licht",
      "difference": "Verschil",
      "exclusion": "Uitsluiting",
      "hue": "Tint",
      "saturation": "Verzadiging",
      "color": "Kleur",
      "luminosity": "Helderheid"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Zonsondergang",
      "ocean": "Oceaan diepte",
      "neon": "Neon mist",
      "dawn": "Zachte dageraad",
      "citrus": "Citrusglans"
    }
  },
  "sv": {
    "previewTitle": "Förhandsvisning",
    "previewHint": "Liveförhandsvisning av gradientstapeln.",
    "stopsTitle": "Färgstopp",
    "trackHint": "Klicka för att lägga till, dra för att flytta.",
    "stopColor": "Stoppfärg",
    "stopPosition": "Position",
    "addStop": "Lägg till stopp",
    "deleteStop": "Ta bort stopp",
    "minStopsHint": "Minst två stopp krävs.",
    "presetsTitle": "Förval",
    "presetsSubtitle": "Välj en snygg startpunkt.",
    "layersTitle": "Lager",
    "layersSubtitle": "Stapla flera gradienter för djup.",
    "layerLabel": "Lager {index}",
    "addLayer": "Lägg till lager",
    "duplicateLayer": "Duplicera",
    "moveUp": "Upp",
    "moveDown": "Ner",
    "deleteLayer": "Ta bort",
    "minLayerHint": "Minst ett lager krävs.",
    "settingsTitle": "Lagerinställningar",
    "settingsSubtitle": "Justera geometri och blandning.",
    "gradientType": "Gradienttyp",
    "angle": "Vinkel",
    "centerX": "Center X",
    "centerY": "Center Y",
    "shapeLabel": "Form",
    "sizeLabel": "Storlek",
    "colorSpaceLabel": "Interpolering",
    "blendMode": "Blandningsläge",
    "randomizeLayer": "Slumpa lager",
    "randomizeAll": "Slumpa alla",
    "outputTitle": "CSS-utdata",
    "outputSubtitle": "Kopiera CSS som matchar förhandsvisningen.",
    "outputFormat": "Färgformat",
    "copyCss": "Kopiera CSS",
    "copyBackgroundImage": "Kopiera background-image",
    "copyBackground": "Kopiera background",
    "copyBlendMode": "Kopiera blandningsläge",
    "exportTitle": "Exportera",
    "exportSubtitle": "Generera en PNG-snapshot.",
    "exportWidth": "Bredd",
    "exportHeight": "Höjd",
    "generatePng": "Generera PNG",
    "downloadPng": "Ladda ner PNG",
    "pngUnsupported": "PNG-export stöds inte i den här webbläsaren.",
    "jsonTitle": "Konfigurations-JSON",
    "jsonSubtitle": "Exportera eller klistra in en konfiguration.",
    "copyJson": "Kopiera JSON",
    "downloadJson": "Ladda ner JSON",
    "jsonPlaceholder": "Klistra in JSON för att ladda en gradient...",
    "loadJson": "Ladda JSON",
    "invalidJson": "Ogiltig gradient-JSON.",
    "type": {
      "linear": "Linjär",
      "radial": "Radiell",
      "conic": "Konisk"
    },
    "shape": {
      "circle": "Cirkel",
      "ellipse": "Ellips"
    },
    "size": {
      "closest-side": "Närmaste sida",
      "closest-corner": "Närmaste hörn",
      "farthest-side": "Fjärraste sida",
      "farthest-corner": "Fjärraste hörn"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Multiplicera",
      "screen": "Skärm",
      "overlay": "Överlagra",
      "darken": "Mörkare",
      "lighten": "Ljusa upp",
      "color-dodge": "Färgskärm",
      "color-burn": "Färgbränna",
      "hard-light": "Hårt ljus",
      "soft-light": "Mjukt ljus",
      "difference": "Skillnad",
      "exclusion": "Uteslutning",
      "hue": "Nyans",
      "saturation": "Mättnad",
      "color": "Färg",
      "luminosity": "Luminans"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Solnedgång",
      "ocean": "Havsdepth",
      "neon": "Neondimma",
      "dawn": "Mjuk gryning",
      "citrus": "Citrusglöd"
    }
  },
  "pl": {
    "previewTitle": "Podgląd",
    "previewHint": "Podgląd na żywo aktualnego zestawu gradientów.",
    "stopsTitle": "Przystanki kolorów",
    "trackHint": "Kliknij, aby dodać przystanek. Przeciągnij, aby przesunąć.",
    "stopColor": "Kolor przystanku",
    "stopPosition": "Pozycja",
    "addStop": "Dodaj przystanek",
    "deleteStop": "Usuń przystanek",
    "minStopsHint": "Wymagane są co najmniej dwa przystanki.",
    "presetsTitle": "Presetty",
    "presetsSubtitle": "Wybierz dopracowany punkt startowy.",
    "layersTitle": "Warstwy",
    "layersSubtitle": "Nakładaj gradienty dla głębi.",
    "layerLabel": "Warstwa {index}",
    "addLayer": "Dodaj warstwę",
    "duplicateLayer": "Duplikuj",
    "moveUp": "W górę",
    "moveDown": "W dół",
    "deleteLayer": "Usuń",
    "minLayerHint": "Wymagana jest co najmniej jedna warstwa.",
    "settingsTitle": "Ustawienia warstwy",
    "settingsSubtitle": "Dopasuj geometrię i mieszanie.",
    "gradientType": "Typ gradientu",
    "angle": "Kąt",
    "centerX": "Środek X",
    "centerY": "Środek Y",
    "shapeLabel": "Kształt",
    "sizeLabel": "Rozmiar",
    "colorSpaceLabel": "Interpolacja",
    "blendMode": "Tryb mieszania",
    "randomizeLayer": "Losuj warstwę",
    "randomizeAll": "Losuj wszystko",
    "outputTitle": "Wyjście CSS",
    "outputSubtitle": "Skopiuj CSS zgodny z podglądem.",
    "outputFormat": "Format koloru",
    "copyCss": "Kopiuj CSS",
    "copyBackgroundImage": "Kopiuj background-image",
    "copyBackground": "Kopiuj background",
    "copyBlendMode": "Kopiuj tryb mieszania",
    "exportTitle": "Eksport",
    "exportSubtitle": "Wygeneruj zrzut PNG.",
    "exportWidth": "Szerokość",
    "exportHeight": "Wysokość",
    "generatePng": "Generuj PNG",
    "downloadPng": "Pobierz PNG",
    "pngUnsupported": "Eksport PNG nie jest wspierany w tej przeglądarce.",
    "jsonTitle": "JSON konfiguracji",
    "jsonSubtitle": "Eksportuj lub wklej konfigurację.",
    "copyJson": "Kopiuj JSON",
    "downloadJson": "Pobierz JSON",
    "jsonPlaceholder": "Wklej JSON, aby wczytać gradient...",
    "loadJson": "Wczytaj JSON",
    "invalidJson": "Nieprawidłowy JSON gradientu.",
    "type": {
      "linear": "Liniowy",
      "radial": "Radialny",
      "conic": "Stożkowy"
    },
    "shape": {
      "circle": "Koło",
      "ellipse": "Elipsa"
    },
    "size": {
      "closest-side": "Najbliższa krawędź",
      "closest-corner": "Najbliższy róg",
      "farthest-side": "Najdalsza krawędź",
      "farthest-corner": "Najdalszy róg"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normalny",
      "multiply": "Mnożenie",
      "screen": "Ekran",
      "overlay": "Nakładka",
      "darken": "Przyciemnianie",
      "lighten": "Rozjaśnianie",
      "color-dodge": "Rozjaśnianie koloru",
      "color-burn": "Przyciemnianie koloru",
      "hard-light": "Twarde światło",
      "soft-light": "Miękkie światło",
      "difference": "Różnica",
      "exclusion": "Wykluczenie",
      "hue": "Barwa",
      "saturation": "Nasycenie",
      "color": "Kolor",
      "luminosity": "Jasność"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Zachód słońca",
      "ocean": "Głębia oceanu",
      "neon": "Neonowa mgła",
      "dawn": "Miękki świt",
      "citrus": "Cytrusowy blask"
    }
  },
  "vi": {
    "previewTitle": "Xem trước",
    "previewHint": "Xem trước trực tiếp lớp gradient hiện tại.",
    "stopsTitle": "Điểm dừng màu",
    "trackHint": "Nhấp để thêm, kéo để di chuyển.",
    "stopColor": "Màu điểm dừng",
    "stopPosition": "Vị trí",
    "addStop": "Thêm điểm dừng",
    "deleteStop": "Xóa điểm dừng",
    "minStopsHint": "Cần ít nhất hai điểm dừng.",
    "presetsTitle": "Mẫu",
    "presetsSubtitle": "Chọn một điểm bắt đầu đã được tinh chỉnh.",
    "layersTitle": "Lớp",
    "layersSubtitle": "Xếp nhiều gradient để tạo chiều sâu.",
    "layerLabel": "Lớp {index}",
    "addLayer": "Thêm lớp",
    "duplicateLayer": "Nhân bản",
    "moveUp": "Lên",
    "moveDown": "Xuống",
    "deleteLayer": "Xóa",
    "minLayerHint": "Cần ít nhất một lớp.",
    "settingsTitle": "Cài đặt lớp",
    "settingsSubtitle": "Điều chỉnh hình học và hòa trộn.",
    "gradientType": "Loại gradient",
    "angle": "Góc",
    "centerX": "Tâm X",
    "centerY": "Tâm Y",
    "shapeLabel": "Hình dạng",
    "sizeLabel": "Kích thước",
    "colorSpaceLabel": "Nội suy",
    "blendMode": "Chế độ hòa trộn",
    "randomizeLayer": "Ngẫu nhiên lớp",
    "randomizeAll": "Ngẫu nhiên tất cả",
    "outputTitle": "Đầu ra CSS",
    "outputSubtitle": "Sao chép CSS khớp với xem trước.",
    "outputFormat": "Định dạng màu",
    "copyCss": "Sao chép CSS",
    "copyBackgroundImage": "Sao chép background-image",
    "copyBackground": "Sao chép background",
    "copyBlendMode": "Sao chép chế độ hòa trộn",
    "exportTitle": "Xuất",
    "exportSubtitle": "Tạo ảnh PNG.",
    "exportWidth": "Chiều rộng",
    "exportHeight": "Chiều cao",
    "generatePng": "Tạo PNG",
    "downloadPng": "Tải PNG",
    "pngUnsupported": "Trình duyệt này không hỗ trợ xuất PNG.",
    "jsonTitle": "JSON cấu hình",
    "jsonSubtitle": "Xuất hoặc dán cấu hình gradient.",
    "copyJson": "Sao chép JSON",
    "downloadJson": "Tải JSON",
    "jsonPlaceholder": "Dán JSON để tải gradient...",
    "loadJson": "Tải JSON",
    "invalidJson": "JSON gradient không hợp lệ.",
    "type": {
      "linear": "Tuyến tính",
      "radial": "Xuyên tâm",
      "conic": "Hình nón"
    },
    "shape": {
      "circle": "Tròn",
      "ellipse": "Elip"
    },
    "size": {
      "closest-side": "Cạnh gần nhất",
      "closest-corner": "Góc gần nhất",
      "farthest-side": "Cạnh xa nhất",
      "farthest-corner": "Góc xa nhất"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Bình thường",
      "multiply": "Nhân",
      "screen": "Screen",
      "overlay": "Overlay",
      "darken": "Tối",
      "lighten": "Sáng",
      "color-dodge": "Color dodge",
      "color-burn": "Color burn",
      "hard-light": "Hard light",
      "soft-light": "Soft light",
      "difference": "Difference",
      "exclusion": "Exclusion",
      "hue": "Hue",
      "saturation": "Saturation",
      "color": "Color",
      "luminosity": "Luminosity"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Cực quang",
      "sunset": "Hoàng hôn",
      "ocean": "Độ sâu đại dương",
      "neon": "Sương neon",
      "dawn": "Bình minh nhẹ",
      "citrus": "Ánh cam quýt"
    }
  },
  "th": {
    "previewTitle": "ตัวอย่าง",
    "previewHint": "พรีวิวแบบเรียลไทม์ของสแตกไล่สีปัจจุบัน",
    "stopsTitle": "จุดสี",
    "trackHint": "คลิกเพื่อเพิ่ม ลากเพื่อย้าย",
    "stopColor": "สีของจุด",
    "stopPosition": "ตำแหน่ง",
    "addStop": "เพิ่มจุด",
    "deleteStop": "ลบจุด",
    "minStopsHint": "ต้องมีอย่างน้อยสองจุด",
    "presetsTitle": "พรีเซ็ต",
    "presetsSubtitle": "เลือกจุดเริ่มต้นที่ถูกจัดมาอย่างดี",
    "layersTitle": "เลเยอร์",
    "layersSubtitle": "ซ้อนหลายไล่สีเพื่อเพิ่มมิติ",
    "layerLabel": "เลเยอร์ {index}",
    "addLayer": "เพิ่มเลเยอร์",
    "duplicateLayer": "ทำซ้ำ",
    "moveUp": "ขึ้น",
    "moveDown": "ลง",
    "deleteLayer": "ลบ",
    "minLayerHint": "ต้องมีอย่างน้อยหนึ่งเลเยอร์",
    "settingsTitle": "ตั้งค่าเลเยอร์",
    "settingsSubtitle": "ปรับเรขาคณิตและการผสมสี",
    "gradientType": "ชนิดไล่สี",
    "angle": "มุม",
    "centerX": "ศูนย์กลาง X",
    "centerY": "ศูนย์กลาง Y",
    "shapeLabel": "รูปทรง",
    "sizeLabel": "ขนาด",
    "colorSpaceLabel": "การอินเตอร์โพเลต",
    "blendMode": "โหมดผสมสี",
    "randomizeLayer": "สุ่มเลเยอร์",
    "randomizeAll": "สุ่มทั้งหมด",
    "outputTitle": "เอาต์พุต CSS",
    "outputSubtitle": "คัดลอก CSS ที่ตรงกับตัวอย่าง",
    "outputFormat": "รูปแบบสี",
    "copyCss": "คัดลอก CSS",
    "copyBackgroundImage": "คัดลอก background-image",
    "copyBackground": "คัดลอก background",
    "copyBlendMode": "คัดลอกโหมดผสมสี",
    "exportTitle": "ส่งออก",
    "exportSubtitle": "สร้างภาพ PNG",
    "exportWidth": "ความกว้าง",
    "exportHeight": "ความสูง",
    "generatePng": "สร้าง PNG",
    "downloadPng": "ดาวน์โหลด PNG",
    "pngUnsupported": "เบราว์เซอร์นี้ไม่รองรับการส่งออก PNG",
    "jsonTitle": "JSON การตั้งค่า",
    "jsonSubtitle": "ส่งออกหรือวางการตั้งค่าไล่สี",
    "copyJson": "คัดลอก JSON",
    "downloadJson": "ดาวน์โหลด JSON",
    "jsonPlaceholder": "วาง JSON เพื่อโหลดไล่สี...",
    "loadJson": "โหลด JSON",
    "invalidJson": "JSON ไล่สีไม่ถูกต้อง",
    "type": {
      "linear": "เชิงเส้น",
      "radial": "รัศมี",
      "conic": "กรวย"
    },
    "shape": {
      "circle": "วงกลม",
      "ellipse": "วงรี"
    },
    "size": {
      "closest-side": "ด้านที่ใกล้ที่สุด",
      "closest-corner": "มุมที่ใกล้ที่สุด",
      "farthest-side": "ด้านที่ไกลที่สุด",
      "farthest-corner": "มุมที่ไกลที่สุด"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "ปกติ",
      "multiply": "คูณ",
      "screen": "สกรีน",
      "overlay": "โอเวอร์เลย์",
      "darken": "มืด",
      "lighten": "สว่าง",
      "color-dodge": "คัลเลอร์ดอดจ์",
      "color-burn": "คัลเลอร์เบิร์น",
      "hard-light": "ฮาร์ดไลต์",
      "soft-light": "ซอฟต์ไลต์",
      "difference": "ต่าง",
      "exclusion": "ยกเว้น",
      "hue": "ฮิว",
      "saturation": "อิ่มสี",
      "color": "สี",
      "luminosity": "ความสว่าง"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "ออโรรา",
      "sunset": "แสงยามเย็น",
      "ocean": "ความลึกของทะเล",
      "neon": "หมอกนีออน",
      "dawn": "รุ่งอรุณนุ่ม",
      "citrus": "ประกายซิตรัส"
    }
  },
  "id": {
    "previewTitle": "Pratinjau",
    "previewHint": "Pratinjau langsung tumpukan gradien saat ini.",
    "stopsTitle": "Titik warna",
    "trackHint": "Klik untuk menambah, seret untuk memindahkan.",
    "stopColor": "Warna titik",
    "stopPosition": "Posisi",
    "addStop": "Tambah titik",
    "deleteStop": "Hapus titik",
    "minStopsHint": "Minimal dua titik diperlukan.",
    "presetsTitle": "Preset",
    "presetsSubtitle": "Pilih titik awal yang sudah dipoles.",
    "layersTitle": "Lapisan",
    "layersSubtitle": "Tumpuk gradien untuk kedalaman.",
    "layerLabel": "Lapisan {index}",
    "addLayer": "Tambah lapisan",
    "duplicateLayer": "Duplikat",
    "moveUp": "Naik",
    "moveDown": "Turun",
    "deleteLayer": "Hapus",
    "minLayerHint": "Minimal satu lapisan diperlukan.",
    "settingsTitle": "Pengaturan lapisan",
    "settingsSubtitle": "Sesuaikan geometri dan blending.",
    "gradientType": "Jenis gradien",
    "angle": "Sudut",
    "centerX": "Pusat X",
    "centerY": "Pusat Y",
    "shapeLabel": "Bentuk",
    "sizeLabel": "Ukuran",
    "colorSpaceLabel": "Interpolasi",
    "blendMode": "Mode blend",
    "randomizeLayer": "Acak lapisan",
    "randomizeAll": "Acak semua",
    "outputTitle": "Output CSS",
    "outputSubtitle": "Salin CSS yang sesuai dengan pratinjau.",
    "outputFormat": "Format warna",
    "copyCss": "Salin CSS",
    "copyBackgroundImage": "Salin background-image",
    "copyBackground": "Salin background",
    "copyBlendMode": "Salin mode blend",
    "exportTitle": "Ekspor",
    "exportSubtitle": "Buat snapshot PNG.",
    "exportWidth": "Lebar",
    "exportHeight": "Tinggi",
    "generatePng": "Buat PNG",
    "downloadPng": "Unduh PNG",
    "pngUnsupported": "Ekspor PNG tidak didukung di browser ini.",
    "jsonTitle": "JSON konfigurasi",
    "jsonSubtitle": "Ekspor atau tempel konfigurasi.",
    "copyJson": "Salin JSON",
    "downloadJson": "Unduh JSON",
    "jsonPlaceholder": "Tempel JSON untuk memuat gradien...",
    "loadJson": "Muat JSON",
    "invalidJson": "JSON gradien tidak valid.",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konik"
    },
    "shape": {
      "circle": "Lingkaran",
      "ellipse": "Elips"
    },
    "size": {
      "closest-side": "Sisi terdekat",
      "closest-corner": "Sudut terdekat",
      "farthest-side": "Sisi terjauh",
      "farthest-corner": "Sudut terjauh"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Multiply",
      "screen": "Screen",
      "overlay": "Overlay",
      "darken": "Darken",
      "lighten": "Lighten",
      "color-dodge": "Color dodge",
      "color-burn": "Color burn",
      "hard-light": "Hard light",
      "soft-light": "Soft light",
      "difference": "Difference",
      "exclusion": "Exclusion",
      "hue": "Hue",
      "saturation": "Saturation",
      "color": "Color",
      "luminosity": "Luminosity"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Senja",
      "ocean": "Kedalaman laut",
      "neon": "Kabut neon",
      "dawn": "Fajar lembut",
      "citrus": "Kilau sitrus"
    }
  },
  "he": {
    "previewTitle": "תצוגה מקדימה",
    "previewHint": "תצוגה מקדימה חיה של ערימת הגרדיאנטים הנוכחית.",
    "stopsTitle": "נקודות צבע",
    "trackHint": "לחצו להוספה וגררו להזזה.",
    "stopColor": "צבע נקודה",
    "stopPosition": "מיקום",
    "addStop": "הוסף נקודה",
    "deleteStop": "מחק נקודה",
    "minStopsHint": "נדרשות לפחות שתי נקודות.",
    "presetsTitle": "ערכות מוכנות",
    "presetsSubtitle": "בחרו נקודת התחלה מלוטשת.",
    "layersTitle": "שכבות",
    "layersSubtitle": "ערמו גרדיאנטים להעמקת המראה.",
    "layerLabel": "שכבה {index}",
    "addLayer": "הוסף שכבה",
    "duplicateLayer": "שכפל",
    "moveUp": "למעלה",
    "moveDown": "למטה",
    "deleteLayer": "מחק",
    "minLayerHint": "נדרשת לפחות שכבה אחת.",
    "settingsTitle": "הגדרות שכבה",
    "settingsSubtitle": "כוונו גאומטריה ומיזוג.",
    "gradientType": "סוג גרדיאנט",
    "angle": "זווית",
    "centerX": "מרכז X",
    "centerY": "מרכז Y",
    "shapeLabel": "צורה",
    "sizeLabel": "גודל",
    "colorSpaceLabel": "אינטרפולציה",
    "blendMode": "מצב מיזוג",
    "randomizeLayer": "אקראי לשכבה",
    "randomizeAll": "אקראי לכולן",
    "outputTitle": "פלט CSS",
    "outputSubtitle": "העתיקו CSS שתואם לתצוגה המקדימה.",
    "outputFormat": "פורמט צבע",
    "copyCss": "העתק CSS",
    "copyBackgroundImage": "העתק background-image",
    "copyBackground": "העתק background",
    "copyBlendMode": "העתק מצב מיזוג",
    "exportTitle": "ייצוא",
    "exportSubtitle": "צרו תמונת PNG.",
    "exportWidth": "רוחב",
    "exportHeight": "גובה",
    "generatePng": "צור PNG",
    "downloadPng": "הורד PNG",
    "pngUnsupported": "ייצוא PNG אינו נתמך בדפדפן זה.",
    "jsonTitle": "JSON תצורה",
    "jsonSubtitle": "ייצאו או הדביקו תצורה.",
    "copyJson": "העתק JSON",
    "downloadJson": "הורד JSON",
    "jsonPlaceholder": "הדביקו JSON כדי לטעון גרדיאנט...",
    "loadJson": "טען JSON",
    "invalidJson": "JSON גרדיאנט לא תקין.",
    "type": {
      "linear": "ליניארי",
      "radial": "רדיאלי",
      "conic": "קוני"
    },
    "shape": {
      "circle": "עיגול",
      "ellipse": "אליפסה"
    },
    "size": {
      "closest-side": "הצד הקרוב ביותר",
      "closest-corner": "הפינה הקרובה ביותר",
      "farthest-side": "הצד הרחוק ביותר",
      "farthest-corner": "הפינה הרחוקה ביותר"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "רגיל",
      "multiply": "כפל",
      "screen": "מסך",
      "overlay": "כיסוי",
      "darken": "כהה",
      "lighten": "בהיר",
      "color-dodge": "דודג' צבע",
      "color-burn": "ברן צבע",
      "hard-light": "אור קשה",
      "soft-light": "אור רך",
      "difference": "הפרש",
      "exclusion": "החרגה",
      "hue": "גוון",
      "saturation": "רוויה",
      "color": "צבע",
      "luminosity": "בהירות"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "אורורה",
      "sunset": "שקיעה",
      "ocean": "עומק הים",
      "neon": "ערפל ניאון",
      "dawn": "שחר רך",
      "citrus": "זוהר הדרים"
    }
  },
  "ms": {
    "previewTitle": "Pratonton",
    "previewHint": "Pratonton langsung susunan gradien semasa.",
    "stopsTitle": "Hentian warna",
    "trackHint": "Klik untuk tambah, seret untuk alih.",
    "stopColor": "Warna hentian",
    "stopPosition": "Kedudukan",
    "addStop": "Tambah hentian",
    "deleteStop": "Padam hentian",
    "minStopsHint": "Sekurang-kurangnya dua hentian diperlukan.",
    "presetsTitle": "Pratetap",
    "presetsSubtitle": "Pilih titik mula yang kemas.",
    "layersTitle": "Lapisan",
    "layersSubtitle": "Susun beberapa gradien untuk kedalaman.",
    "layerLabel": "Lapisan {index}",
    "addLayer": "Tambah lapisan",
    "duplicateLayer": "Gandakan",
    "moveUp": "Naik",
    "moveDown": "Turun",
    "deleteLayer": "Padam",
    "minLayerHint": "Sekurang-kurangnya satu lapisan diperlukan.",
    "settingsTitle": "Tetapan lapisan",
    "settingsSubtitle": "Laraskan geometri dan campuran.",
    "gradientType": "Jenis gradien",
    "angle": "Sudut",
    "centerX": "Pusat X",
    "centerY": "Pusat Y",
    "shapeLabel": "Bentuk",
    "sizeLabel": "Saiz",
    "colorSpaceLabel": "Interpolasi",
    "blendMode": "Mod campuran",
    "randomizeLayer": "Rawak lapisan",
    "randomizeAll": "Rawak semua",
    "outputTitle": "Output CSS",
    "outputSubtitle": "Salin CSS yang sepadan dengan pratonton.",
    "outputFormat": "Format warna",
    "copyCss": "Salin CSS",
    "copyBackgroundImage": "Salin background-image",
    "copyBackground": "Salin background",
    "copyBlendMode": "Salin mod campuran",
    "exportTitle": "Eksport",
    "exportSubtitle": "Hasilkan snapshot PNG.",
    "exportWidth": "Lebar",
    "exportHeight": "Tinggi",
    "generatePng": "Hasilkan PNG",
    "downloadPng": "Muat turun PNG",
    "pngUnsupported": "Eksport PNG tidak disokong dalam pelayar ini.",
    "jsonTitle": "JSON konfigurasi",
    "jsonSubtitle": "Eksport atau tampal konfigurasi.",
    "copyJson": "Salin JSON",
    "downloadJson": "Muat turun JSON",
    "jsonPlaceholder": "Tampal JSON untuk memuat gradien...",
    "loadJson": "Muat JSON",
    "invalidJson": "JSON gradien tidak sah.",
    "type": {
      "linear": "Linear",
      "radial": "Radial",
      "conic": "Konik"
    },
    "shape": {
      "circle": "Bulatan",
      "ellipse": "Elips"
    },
    "size": {
      "closest-side": "Sisi terdekat",
      "closest-corner": "Bucu terdekat",
      "farthest-side": "Sisi terjauh",
      "farthest-corner": "Bucu terjauh"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Multiply",
      "screen": "Screen",
      "overlay": "Overlay",
      "darken": "Gelapkan",
      "lighten": "Terangkan",
      "color-dodge": "Color dodge",
      "color-burn": "Color burn",
      "hard-light": "Hard light",
      "soft-light": "Soft light",
      "difference": "Difference",
      "exclusion": "Exclusion",
      "hue": "Hue",
      "saturation": "Saturation",
      "color": "Color",
      "luminosity": "Luminosity"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Senja",
      "ocean": "Kedalaman laut",
      "neon": "Kabut neon",
      "dawn": "Fajar lembut",
      "citrus": "Cahaya sitrus"
    }
  },
  "no": {
    "previewTitle": "Forhåndsvisning",
    "previewHint": "Live forhåndsvisning av gjeldende gradientstabel.",
    "stopsTitle": "Fargestopp",
    "trackHint": "Klikk for å legge til, dra for å flytte.",
    "stopColor": "Stoppfarge",
    "stopPosition": "Posisjon",
    "addStop": "Legg til stopp",
    "deleteStop": "Slett stopp",
    "minStopsHint": "Minst to stopp kreves.",
    "presetsTitle": "Forvalg",
    "presetsSubtitle": "Velg et polert utgangspunkt.",
    "layersTitle": "Lag",
    "layersSubtitle": "Stable gradienter for mer dybde.",
    "layerLabel": "Lag {index}",
    "addLayer": "Legg til lag",
    "duplicateLayer": "Dupliser",
    "moveUp": "Opp",
    "moveDown": "Ned",
    "deleteLayer": "Slett",
    "minLayerHint": "Minst ett lag er nødvendig.",
    "settingsTitle": "Laginnstillinger",
    "settingsSubtitle": "Juster geometri og blanding.",
    "gradientType": "Gradienttype",
    "angle": "Vinkel",
    "centerX": "Senter X",
    "centerY": "Senter Y",
    "shapeLabel": "Form",
    "sizeLabel": "Størrelse",
    "colorSpaceLabel": "Interpolasjon",
    "blendMode": "Blandemodus",
    "randomizeLayer": "Tilfeldig lag",
    "randomizeAll": "Tilfeldig alle",
    "outputTitle": "CSS-utdata",
    "outputSubtitle": "Kopier CSS som matcher forhåndsvisningen.",
    "outputFormat": "Fargeformat",
    "copyCss": "Kopier CSS",
    "copyBackgroundImage": "Kopier background-image",
    "copyBackground": "Kopier background",
    "copyBlendMode": "Kopier blandemodus",
    "exportTitle": "Eksporter",
    "exportSubtitle": "Generer et PNG-øyeblikksbilde.",
    "exportWidth": "Bredde",
    "exportHeight": "Høyde",
    "generatePng": "Generer PNG",
    "downloadPng": "Last ned PNG",
    "pngUnsupported": "PNG-eksport støttes ikke i denne nettleseren.",
    "jsonTitle": "JSON-konfigurasjon",
    "jsonSubtitle": "Eksporter eller lim inn konfigurasjon.",
    "copyJson": "Kopier JSON",
    "downloadJson": "Last ned JSON",
    "jsonPlaceholder": "Lim inn JSON for å laste en gradient...",
    "loadJson": "Last JSON",
    "invalidJson": "Ugyldig gradient-JSON.",
    "type": {
      "linear": "Lineær",
      "radial": "Radial",
      "conic": "Konisk"
    },
    "shape": {
      "circle": "Sirkel",
      "ellipse": "Ellipse"
    },
    "size": {
      "closest-side": "Nærmeste side",
      "closest-corner": "Nærmeste hjørne",
      "farthest-side": "Fjerneste side",
      "farthest-corner": "Fjerneste hjørne"
    },
    "colorSpace": {
      "srgb": "sRGB",
      "oklch": "OKLCH"
    },
    "blend": {
      "normal": "Normal",
      "multiply": "Multipliser",
      "screen": "Skjerm",
      "overlay": "Overlegg",
      "darken": "Mørkere",
      "lighten": "Lysere",
      "color-dodge": "Farge dodge",
      "color-burn": "Farge burn",
      "hard-light": "Hardt lys",
      "soft-light": "Mykt lys",
      "difference": "Forskjell",
      "exclusion": "Ekskludering",
      "hue": "Fargetone",
      "saturation": "Metning",
      "color": "Farge",
      "luminosity": "Lysstyrke"
    },
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    },
    "preset": {
      "aurora": "Aurora",
      "sunset": "Solnedgang",
      "ocean": "Havdybde",
      "neon": "Neontåke",
      "dawn": "Myk daggry",
      "citrus": "Sitrusglød"
    }
  }
}
</i18n>

<style scoped>
.panel {
  border-radius: 16px;
  border: 1px solid var(--n-border-color);
}

.panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.panel__title {
  font-weight: 600;
  font-size: 16px;
}

.panel__subtitle {
  font-size: 13px;
  color: var(--n-text-color-3);
}

.panel__alert {
  margin-top: 12px;
}

.stop-editor {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stop-editor__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.stop-editor__label {
  font-size: 13px;
  color: var(--n-text-color-3);
}

.stop-editor__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 220px;
}

.preset-button {
  width: 100%;
  justify-content: center;
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.layer-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  width: 100%;
  text-align: left;
  border-radius: 12px;
  border: 1px solid transparent;
  background: var(--n-color);
  cursor: pointer;
}

.layer-card--active {
  border-color: rgba(59, 130, 246, 0.55);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.layer-card__preview {
  width: 54px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  flex-shrink: 0;
}

.layer-card__meta {
  flex: 1;
  min-width: 0;
}

.layer-card__title {
  font-weight: 600;
  font-size: 14px;
}

.layer-card__subtitle {
  font-size: 12px;
  color: var(--n-text-color-3);
}

.layer-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

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

.form-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 220px;
}
</style>
