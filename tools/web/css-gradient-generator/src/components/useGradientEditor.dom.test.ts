import { describe, expect, it, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref<string | undefined>(undefined)
      watchEffect(() => {
        let value: unknown
        if (isRef(source)) {
          value = source.value
        } else if (typeof source === 'function') {
          value = source()
        } else {
          value = source
        }
        url.value = value ? 'blob:mock' : undefined
      })
      return url
    },
  }
})

import { nextTick } from 'vue'
import { useGradientEditor } from './useGradientEditor'
import { normalizeHexColor } from '../utils/gradient'
import { gradientPresets } from '../utils/presets'

describe('useGradientEditor', () => {
  it('initializes defaults and computed outputs', async () => {
    const editor = useGradientEditor()
    await nextTick()

    expect(editor.layers.value).toHaveLength(1)
    const initialLayer = editor.layers.value[0]
    if (!initialLayer) {
      throw new Error('Expected an initial layer')
    }
    expect(editor.activeLayerId.value).toBe(initialLayer.id)
    expect(editor.activeStopId.value).toBe(initialLayer.stops[0]?.id)
    expect(editor.hasBlendModes.value).toBe(false)
    expect(editor.previewBlendMode.value).toBe('')
    expect(editor.cssOutput.value).toContain('background-image')
    expect(editor.cssOutput.value).not.toContain('background-blend-mode')
    expect(editor.backgroundImageDeclaration.value).toContain('background-image:')
    expect(editor.backgroundBlendDeclaration.value).toContain('background-blend-mode:')
    expect(editor.backgroundShorthand.value).toContain('background:')
    expect(editor.cssUrl.value).toBe('blob:mock')
    expect(editor.jsonUrl.value).toBe('blob:mock')
  })

  it('manages layers, ordering, and blend modes', () => {
    const editor = useGradientEditor()
    const firstLayer = editor.layers.value[0]
    if (!firstLayer) {
      throw new Error('Expected initial layer')
    }
    const firstId = firstLayer.id

    editor.addLayer()
    const secondLayer = editor.layers.value[1]
    if (!secondLayer) {
      throw new Error('Expected second layer')
    }
    const secondId = secondLayer.id
    expect(editor.activeLayerId.value).toBe(secondId)

    editor.setActiveLayer(firstId)
    expect(editor.activeLayerId.value).toBe(firstId)

    editor.duplicateLayer('missing')
    editor.duplicateLayer(firstId)
    expect(editor.layers.value).toHaveLength(3)

    editor.moveLayer(0, -1)
    editor.moveLayer(0, 1)
    expect(editor.layers.value[1]?.id).toBe(firstId)

    editor.layerBlendMode.value = 'multiply'
    expect(editor.hasBlendModes.value).toBe(true)
    expect(editor.cssOutput.value).toContain('background-blend-mode')

    editor.removeLayer('missing')
    editor.removeLayer(editor.layers.value[0]?.id ?? '')
    expect(editor.layers.value.length).toBeGreaterThan(0)
  })

  it('clamps layer geometry updates', () => {
    const editor = useGradientEditor()

    editor.layerAngle.value = 420
    expect(editor.layerAngle.value).toBe(360)

    editor.layerCenterX.value = -20
    expect(editor.layerCenterX.value).toBe(0)

    editor.layerCenterY.value = 140
    expect(editor.layerCenterY.value).toBe(100)
  })

  it('updates stops and validates stop removal', () => {
    const editor = useGradientEditor()
    const initialStops = editor.activeStops.value.length

    editor.handleAddStop(75)
    expect(editor.activeStops.value.length).toBe(initialStops + 1)
    expect(editor.activeStopId.value).toBeTruthy()

    editor.activeStopColor.value = '#fff'
    expect(editor.activeStopColor.value).toBe(normalizeHexColor('#fff'))

    editor.activeStopPosition.value = 150
    expect(editor.activeStopPosition.value).toBe(100)

    editor.updateStopPosition('missing', 20)

    const targetStopId = editor.activeStops.value[0]?.id
    if (targetStopId) {
      editor.setActiveStop(targetStopId)
    }

    editor.removeStop()
    expect(editor.showStopError.value).toBe(false)
    expect(editor.activeStops.value.length).toBeGreaterThan(1)

    const layer = editor.layers.value[0]
    if (!layer) {
      throw new Error('Expected layer for stop updates')
    }
    layer.stops = layer.stops.slice(0, 2)
    editor.removeStop()
    expect(editor.showStopError.value).toBe(true)
  })

  it('applies presets, randomizes, and loads JSON', () => {
    const editor = useGradientEditor()
    const preset = gradientPresets[0]
    if (!preset) {
      throw new Error('Expected at least one preset')
    }

    editor.applyPreset('missing')
    expect(editor.layers.value).toHaveLength(1)

    editor.applyPreset(preset.id)
    expect(editor.layers.value).toHaveLength(preset.layers.length)
    const appliedLayer = editor.layers.value[0]
    if (!appliedLayer) {
      throw new Error('Expected applied preset layer')
    }
    expect(editor.activeLayerId.value).toBe(appliedLayer.id)
    expect(editor.presetSwatchStyleMap.value[preset.id]).toBeTruthy()

    editor.handleRandomizeLayer()
    expect(editor.activeStopId.value).toBe(editor.layers.value[0]?.stops[0]?.id)

    editor.handleRandomizeAll()
    expect(editor.activeLayerId.value).toBe(editor.layers.value[0]?.id)

    editor.jsonInput.value = 'not-json'
    editor.loadJson()
    expect(editor.showJsonError.value).toBe(true)

    editor.jsonInput.value = editor.serializedConfig.value
    editor.loadJson()
    expect(editor.showJsonError.value).toBe(false)
    expect(editor.jsonInput.value).toBe('')
  })

  it('guards layer removal when only one layer exists', () => {
    const editor = useGradientEditor()

    editor.showLayerError.value = false
    editor.removeLayer(editor.layers.value[0]?.id ?? '')
    expect(editor.showLayerError.value).toBe(true)

    editor.showLayerError.value = true
    editor.addLayer()
    editor.setActiveLayer(editor.layers.value[0]?.id ?? '')
    expect(editor.showLayerError.value).toBe(false)
  })

  it('handles guard branches when no active layer is available', async () => {
    const editor = useGradientEditor()

    editor.layers.value = []
    editor.activeLayerId.value = 'missing'
    editor.activeStopId.value = 'missing'
    await nextTick()

    expect(editor.activeTrackCss.value).toContain('linear-gradient(#000, #fff)')
    expect(editor.activeStopColor.value).toBe('#FFFFFFFF')
    expect(editor.activeStopPosition.value).toBe(0)
    expect(editor.layerType.value).toBe('linear')
    expect(editor.layerAngle.value).toBe(0)
    expect(editor.layerCenterX.value).toBe(50)
    expect(editor.layerCenterY.value).toBe(50)
    expect(editor.layerShape.value).toBe('circle')
    expect(editor.layerSize.value).toBe('farthest-corner')
    expect(editor.layerColorSpace.value).toBe('srgb')
    expect(editor.layerBlendMode.value).toBe('normal')

    editor.activeStopColor.value = '#123456'
    editor.activeStopPosition.value = null
    editor.layerType.value = 'conic'
    editor.layerAngle.value = null
    editor.layerCenterX.value = null
    editor.layerCenterY.value = null
    editor.layerShape.value = 'ellipse'
    editor.layerSize.value = 'closest-side'
    editor.layerColorSpace.value = 'oklch'
    editor.layerBlendMode.value = 'multiply'
    editor.handleAddStop()
    editor.removeStop()
    editor.updateStopPosition('missing', 20)
    editor.handleRandomizeLayer()
    editor.handleRandomizeAll()

    expect(editor.layers.value).toHaveLength(0)

    editor.addLayer()
    const layer = editor.layers.value[0]
    if (!layer) {
      throw new Error('Expected layer after addLayer')
    }

    const stopId = layer.stops[0]?.id
    if (!stopId) {
      throw new Error('Expected stop id')
    }

    editor.updateStopPosition(stopId, Number.NaN)
    expect(layer.stops[0]?.position).toBe(0)
  })
})
