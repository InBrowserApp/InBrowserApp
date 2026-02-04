import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CssGradientLayerSettingsPanel from './CssGradientLayerSettingsPanel.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  return {
    NCard: makeStub('NCard'),
    NDivider: makeStub('NDivider'),
    NFlex: makeStub('NFlex'),
  }
})

const LayerTypeControlsStub = defineComponent({
  name: 'CssGradientLayerTypeControls',
  emits: ['update:layerType'],
  template: '<div />',
})

const RadialControlsStub = defineComponent({
  name: 'CssGradientLayerRadialControls',
  props: {
    layerType: {
      type: String,
      default: 'linear',
    },
  },
  template: '<div />',
})

const ColorSpaceStub = defineComponent({
  name: 'CssGradientLayerColorSpaceSelect',
  emits: ['update:layerColorSpace'],
  template: '<div />',
})

const BlendModeStub = defineComponent({
  name: 'CssGradientLayerBlendModeSelect',
  emits: ['update:layerBlendMode'],
  template: '<div />',
})

describe('CssGradientLayerSettingsPanel', () => {
  it('renders settings and forwards model updates', () => {
    const wrapper = mount(CssGradientLayerSettingsPanel, {
      props: {
        layerType: 'linear',
        layerAngle: 90,
        layerCenterX: 50,
        layerCenterY: 50,
        layerShape: 'circle',
        layerSize: 'closest-side',
        layerColorSpace: 'srgb',
        layerBlendMode: 'normal',
      },
      global: {
        stubs: {
          CssGradientLayerTypeControls: LayerTypeControlsStub,
          CssGradientLayerRadialControls: RadialControlsStub,
          CssGradientLayerColorSpaceSelect: ColorSpaceStub,
          CssGradientLayerBlendModeSelect: BlendModeStub,
        },
      },
    })

    expect(wrapper.text()).toContain('settingsTitle')

    const typeControls = wrapper.findComponent(LayerTypeControlsStub)
    typeControls.vm.$emit('update:layerType', 'radial')
    expect(wrapper.emitted('update:layerType')?.[0]).toEqual(['radial'])

    const colorSpace = wrapper.findComponent(ColorSpaceStub)
    colorSpace.vm.$emit('update:layerColorSpace', 'oklch')
    expect(wrapper.emitted('update:layerColorSpace')?.[0]).toEqual(['oklch'])

    const blendMode = wrapper.findComponent(BlendModeStub)
    blendMode.vm.$emit('update:layerBlendMode', 'multiply')
    expect(wrapper.emitted('update:layerBlendMode')?.[0]).toEqual(['multiply'])
  })
})
