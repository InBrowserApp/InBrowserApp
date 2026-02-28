import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CssGradientLayerSettingsPanel from './CssGradientLayerSettingsPanel.vue'

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
  emits: ['update:layerType', 'update:layerAngle', 'update:layerCenterX', 'update:layerCenterY'],
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
  emits: ['update:layerShape', 'update:layerSize'],
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

    expect(wrapper.text()).toContain('Layer Settings')

    const typeControls = wrapper.findComponent(LayerTypeControlsStub)
    typeControls.vm.$emit('update:layerType', 'radial')
    expect(wrapper.emitted('update:layerType')?.[0]).toEqual(['radial'])

    typeControls.vm.$emit('update:layerAngle', 45)
    expect(wrapper.emitted('update:layerAngle')?.[0]).toEqual([45])

    typeControls.vm.$emit('update:layerCenterX', 40)
    expect(wrapper.emitted('update:layerCenterX')?.[0]).toEqual([40])

    typeControls.vm.$emit('update:layerCenterY', 60)
    expect(wrapper.emitted('update:layerCenterY')?.[0]).toEqual([60])

    const radialControls = wrapper.findComponent(RadialControlsStub)
    radialControls.vm.$emit('update:layerShape', 'ellipse')
    expect(wrapper.emitted('update:layerShape')?.[0]).toEqual(['ellipse'])

    radialControls.vm.$emit('update:layerSize', 'farthest-corner')
    expect(wrapper.emitted('update:layerSize')?.[0]).toEqual(['farthest-corner'])

    const colorSpace = wrapper.findComponent(ColorSpaceStub)
    colorSpace.vm.$emit('update:layerColorSpace', 'oklch')
    expect(wrapper.emitted('update:layerColorSpace')?.[0]).toEqual(['oklch'])

    const blendMode = wrapper.findComponent(BlendModeStub)
    blendMode.vm.$emit('update:layerBlendMode', 'multiply')
    expect(wrapper.emitted('update:layerBlendMode')?.[0]).toEqual(['multiply'])
  })
})
