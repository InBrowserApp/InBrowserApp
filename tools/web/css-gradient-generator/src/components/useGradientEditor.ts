import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import type {
  BlendMode,
  ColorFormat,
  GradientLayer,
  GradientType,
  RadialShape,
  RadialSize,
} from '../types'
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

export const useGradientEditor = () => {
  const layers = ref<GradientLayer[]>([createLayer()])
  const activeLayerId = ref(layers.value[0]?.id ?? '')
  const activeStopId = ref(layers.value[0]?.stops[0]?.id ?? null)
  const outputFormat = ref<ColorFormat>('hex')
  const jsonInput = ref('')
  const showLayerError = ref(false)
  const showStopError = ref(false)
  const showJsonError = ref(false)

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

  const backgroundImageDeclaration = computed(
    () => `background-image: ${backgroundImageCss.value};`,
  )

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

  return {
    layers,
    activeLayerId,
    activeStopId,
    outputFormat,
    jsonInput,
    showLayerError,
    showStopError,
    showJsonError,
    presets,
    activeStops,
    activeTrackCss,
    backgroundImageCss,
    previewBlendMode,
    activeStopColor,
    activeStopPosition,
    layerType,
    layerAngle,
    layerCenterX,
    layerCenterY,
    layerShape,
    layerSize,
    layerColorSpace,
    layerBlendMode,
    presetSwatchStyleMap,
    cssOutput,
    backgroundImageDeclaration,
    backgroundBlendDeclaration,
    backgroundShorthand,
    hasBlendModes,
    cssUrl,
    serializedConfig,
    jsonUrl,
    setActiveLayer,
    addLayer,
    duplicateLayer,
    moveLayer,
    removeLayer,
    handleAddStop,
    setActiveStop,
    updateStopPosition,
    removeStop,
    handleRandomizeLayer,
    handleRandomizeAll,
    applyPreset,
    loadJson,
  }
}
