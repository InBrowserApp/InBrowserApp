import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

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
import { mount } from '@vue/test-utils'
import CssGradientGeneratorTool from './CssGradientGeneratorTool.vue'
import * as gradientUtils from '../utils/gradient'

const CopyToClipboardButtonStub = {
  template: '<button />',
  props: ['content'],
}

const NColorPickerStub = {
  template: '<div />',
  props: ['value'],
  emits: ['update:value'],
}

describe('CssGradientGeneratorTool', () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext
  const originalToBlob = HTMLCanvasElement.prototype.toBlob

  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({}) as never
    HTMLCanvasElement.prototype.toBlob = vi.fn((callback: (blob: Blob) => void) => {
      callback(new Blob(['png'], { type: 'image/png' }))
    }) as never
  })

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext
    HTMLCanvasElement.prototype.toBlob = originalToBlob
    vi.restoreAllMocks()
  })

  it('renders default sections', () => {
    const wrapper = mount(CssGradientGeneratorTool, {
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NColorPicker: NColorPickerStub,
        },
      },
    })

    expect(wrapper.text()).toContain('CSS Output')
    expect(wrapper.find('[data-testid="gradient-preview"]').exists()).toBe(true)
  })

  it('adds layers and handles stop limits', async () => {
    const wrapper = mount(CssGradientGeneratorTool, {
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NColorPicker: NColorPickerStub,
        },
      },
    })

    const initialLayers = wrapper.findAll('.layer-card').length
    await wrapper.get('[data-testid="add-layer"]').trigger('click')
    expect(wrapper.findAll('.layer-card').length).toBe(initialLayers + 1)

    const initialStops = wrapper.findAll('[data-testid="stop-handle"]').length
    await wrapper.get('[data-testid="add-stop"]').trigger('click')
    expect(wrapper.findAll('[data-testid="stop-handle"]').length).toBe(initialStops + 1)

    await wrapper.get('[data-testid="remove-stop"]').trigger('click')
    await wrapper.get('[data-testid="remove-stop"]').trigger('click')
    await wrapper.get('[data-testid="remove-stop"]').trigger('click')
    expect(wrapper.find('[data-testid="stop-error"]').exists()).toBe(true)
  })

  it('loads JSON configuration', async () => {
    const wrapper = mount(CssGradientGeneratorTool, {
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NColorPicker: NColorPickerStub,
        },
      },
    })

    const jsonInput = wrapper.get('[data-testid="json-input"]').find('textarea')
    await jsonInput.setValue(
      JSON.stringify({
        layers: [
          {
            type: 'linear',
            angle: 90,
            centerX: 50,
            centerY: 50,
            radialShape: 'circle',
            radialSize: 'farthest-corner',
            colorSpace: 'srgb',
            blendMode: 'normal',
            stops: [
              { color: '#000000', position: 0 },
              { color: '#ffffff', position: 100 },
            ],
          },
        ],
      }),
    )
    await wrapper.get('[data-testid="load-json"]').trigger('click')

    expect(wrapper.find('[data-testid="json-error"]').exists()).toBe(false)
    expect(wrapper.findAll('.layer-card').length).toBe(1)
  })

  it('downloads PNG on demand', async () => {
    const drawSpy = vi.spyOn(gradientUtils, 'drawLayersToCanvas').mockReturnValue(true)

    const wrapper = mount(CssGradientGeneratorTool, {
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NColorPicker: NColorPickerStub,
        },
      },
    })

    await wrapper.get('[data-testid="download-png"]').trigger('click')
    await nextTick()

    expect(drawSpy).toHaveBeenCalled()
    expect(wrapper.get('[data-testid="download-png"]').attributes('href')).toBe('blob:mock')
  })

  it('exposes SVG download link', async () => {
    const wrapper = mount(CssGradientGeneratorTool, {
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NColorPicker: NColorPickerStub,
        },
      },
    })

    await nextTick()

    expect(wrapper.get('[data-testid="download-svg"]').attributes('href')).toBe('blob:mock')
  })

  it('exposes CSS download link', async () => {
    const wrapper = mount(CssGradientGeneratorTool, {
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NColorPicker: NColorPickerStub,
        },
      },
    })

    await nextTick()

    expect(wrapper.get('[data-testid="download-css"]').attributes('href')).toBe('blob:mock')
  })

  it('wires panel v-model updates back to the tool state', async () => {
    const wrapper = mount(CssGradientGeneratorTool, {
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NColorPicker: NColorPickerStub,
        },
      },
    })

    const stopsPanel = wrapper.getComponent({ name: 'CssGradientStopsPanel' })
    const layerSettingsPanel = wrapper.getComponent({ name: 'CssGradientLayerSettingsPanel' })
    const outputPanel = wrapper.getComponent({ name: 'CssGradientOutputPanel' })
    const exportPanel = wrapper.getComponent({ name: 'CssGradientExportPanel' })

    stopsPanel.vm.$emit('update:stopColor', '#123456')
    stopsPanel.vm.$emit('update:stopPosition', 33)

    layerSettingsPanel.vm.$emit('update:layerType', 'radial')
    layerSettingsPanel.vm.$emit('update:layerAngle', 75)
    layerSettingsPanel.vm.$emit('update:layerCenterX', 40)
    layerSettingsPanel.vm.$emit('update:layerCenterY', 60)
    layerSettingsPanel.vm.$emit('update:layerShape', 'ellipse')
    layerSettingsPanel.vm.$emit('update:layerSize', 'closest-side')
    layerSettingsPanel.vm.$emit('update:layerColorSpace', 'oklch')
    layerSettingsPanel.vm.$emit('update:layerBlendMode', 'multiply')

    outputPanel.vm.$emit('update:outputFormat', 'rgba')
    exportPanel.vm.$emit('update:exportWidth', 640)
    exportPanel.vm.$emit('update:exportHeight', 360)

    await nextTick()

    expect(stopsPanel.props('stopColor')).toBe('#123456FF')
    expect(stopsPanel.props('stopPosition')).toBe(33)

    expect(layerSettingsPanel.props('layerType')).toBe('radial')
    expect(layerSettingsPanel.props('layerAngle')).toBe(75)
    expect(layerSettingsPanel.props('layerCenterX')).toBe(40)
    expect(layerSettingsPanel.props('layerCenterY')).toBe(60)
    expect(layerSettingsPanel.props('layerShape')).toBe('ellipse')
    expect(layerSettingsPanel.props('layerSize')).toBe('closest-side')
    expect(layerSettingsPanel.props('layerColorSpace')).toBe('oklch')
    expect(layerSettingsPanel.props('layerBlendMode')).toBe('multiply')

    expect(outputPanel.props('outputFormat')).toBe('rgba')
    expect(exportPanel.props('exportWidth')).toBe(640)
    expect(exportPanel.props('exportHeight')).toBe(360)
  })

  it('rejects invalid JSON input', async () => {
    const wrapper = mount(CssGradientGeneratorTool, {
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
          NColorPicker: NColorPickerStub,
        },
      },
    })

    const jsonInput = wrapper.get('[data-testid="json-input"]').find('textarea')
    await jsonInput.setValue('not-json')
    await wrapper.get('[data-testid="load-json"]').trigger('click')

    expect(wrapper.find('[data-testid="json-error"]').exists()).toBe(true)
  })
})
