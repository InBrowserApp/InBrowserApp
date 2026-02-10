import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ConversionOptions from './ConversionOptions.vue'

const BaseGridStub = defineComponent({
  name: 'ConversionOptionsBaseGrid',
  emits: ['update:scale', 'update:quality', 'update:method', 'update:lossless'],
  template: '<div />',
})

const AdvancedSectionStub = defineComponent({
  name: 'ConversionOptionsAdvancedSection',
  emits: [
    'update:target-size',
    'update:target-psnr',
    'update:advanced-enabled',
    'update:near-lossless',
    'update:alpha-quality',
    'update:sns-strength',
    'update:filter-strength',
    'update:filter-sharpness',
    'update:filter-type',
    'update:partitions',
    'update:segments',
    'update:pass-count',
    'update:exact-mode',
    'update:sharp-yuv-mode',
  ],
  template: '<div />',
})

const ActionsStub = defineComponent({
  name: 'ConversionOptionsActions',
  emits: ['convert'],
  template: '<button @click="$emit(\'convert\')">convert</button>',
})

function mountOptions(overrides: Partial<Record<string, unknown>> = {}) {
  return mount(ConversionOptions, {
    props: {
      title: 'Options',
      scaleLabel: 'Scale',
      scaleHint: 'Scale hint',
      qualityLabel: 'Quality',
      qualityHint: 'Quality hint',
      methodLabel: 'Method',
      methodHint: 'Method hint',
      losslessLabel: 'Lossless',
      advancedLabel: 'Advanced',
      targetSizeLabel: 'Target size',
      targetPsnrLabel: 'Target psnr',
      nearLosslessLabel: 'Near lossless',
      alphaQualityLabel: 'Alpha quality',
      snsStrengthLabel: 'SNS strength',
      filterStrengthLabel: 'Filter strength',
      filterSharpnessLabel: 'Filter sharpness',
      filterTypeLabel: 'Filter type',
      partitionsLabel: 'Partitions',
      segmentsLabel: 'Segments',
      passLabel: 'Passes',
      exactLabel: 'Exact',
      useSharpYuvLabel: 'Sharp YUV',
      optionDefaultLabel: 'Default',
      optionOnLabel: 'On',
      optionOffLabel: 'Off',
      convertLabel: 'Convert',
      convertingLabel: 'Converting',
      minScale: 10,
      maxScale: 400,
      isConverting: false,
      canConvert: true,
      scale: 100,
      quality: 80,
      method: 4,
      lossless: false,
      advancedEnabled: false,
      targetSize: null,
      targetPsnr: null,
      nearLossless: null,
      alphaQuality: null,
      snsStrength: null,
      filterStrength: null,
      filterSharpness: null,
      filterType: null,
      partitions: null,
      segments: null,
      passCount: null,
      exactMode: 'default',
      sharpYuvMode: 'default',
      ...overrides,
    },
    global: {
      stubs: {
        ToolSection: defineComponent({ template: '<section><slot /></section>' }),
        ToolSectionHeader: defineComponent({ template: '<header><slot /></header>' }),
        ConversionOptionsBaseGrid: BaseGridStub,
        ConversionOptionsAdvancedSection: AdvancedSectionStub,
        ConversionOptionsActions: ActionsStub,
      },
    },
  })
}

describe('ConversionOptions', () => {
  it('emits target PSNR reset when target size updates', () => {
    const wrapper = mountOptions({ targetPsnr: null })

    wrapper.findComponent(AdvancedSectionStub).vm.$emit('update:target-size', 12)

    expect(wrapper.emitted('update:targetSize')?.[0]).toEqual([12])
    expect(wrapper.emitted('update:targetPsnr')?.[0]).toEqual([null])
  })

  it('clears existing target PSNR when target size updates', () => {
    const wrapper = mountOptions({ targetPsnr: 22 })

    wrapper.findComponent(AdvancedSectionStub).vm.$emit('update:target-size', 14)

    expect(wrapper.emitted('update:targetSize')?.[0]).toEqual([14])
    expect(wrapper.emitted('update:targetPsnr')?.[0]).toEqual([null])
  })

  it('clears target size when target PSNR updates', () => {
    const wrapper = mountOptions({ targetSize: 24 })

    wrapper.findComponent(AdvancedSectionStub).vm.$emit('update:target-psnr', 33)

    expect(wrapper.emitted('update:targetPsnr')?.[0]).toEqual([33])
    expect(wrapper.emitted('update:targetSize')?.[0]).toEqual([null])
  })

  it('emits target size reset when target PSNR updates without size set', () => {
    const wrapper = mountOptions({ targetSize: null })

    wrapper.findComponent(AdvancedSectionStub).vm.$emit('update:target-psnr', 18)

    expect(wrapper.emitted('update:targetPsnr')?.[0]).toEqual([18])
    expect(wrapper.emitted('update:targetSize')?.[0]).toEqual([null])
  })

  it('updates scale, quality, and method from base grid events', () => {
    const wrapper = mountOptions()
    const baseGrid = wrapper.findComponent(BaseGridStub)

    baseGrid.vm.$emit('update:scale', 120)
    baseGrid.vm.$emit('update:quality', 64)
    baseGrid.vm.$emit('update:method', 2)
    baseGrid.vm.$emit('update:lossless', true)

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([120])
    expect(wrapper.emitted('update:quality')?.[0]).toEqual([64])
    expect(wrapper.emitted('update:method')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:lossless')?.[0]).toEqual([true])
  })

  it('ignores null base grid updates', () => {
    const wrapper = mountOptions()
    const baseGrid = wrapper.findComponent(BaseGridStub)

    baseGrid.vm.$emit('update:scale', null)
    baseGrid.vm.$emit('update:quality', null)
    baseGrid.vm.$emit('update:method', null)

    expect(wrapper.emitted('update:scale')).toBeUndefined()
    expect(wrapper.emitted('update:quality')).toBeUndefined()
    expect(wrapper.emitted('update:method')).toBeUndefined()
  })

  it('forwards convert events', async () => {
    const wrapper = mountOptions()

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('convert')).toHaveLength(1)
  })

  it('forwards advanced option updates', () => {
    const wrapper = mountOptions()
    const advanced = wrapper.findComponent(AdvancedSectionStub)

    advanced.vm.$emit('update:advanced-enabled', true)
    advanced.vm.$emit('update:near-lossless', 90)
    advanced.vm.$emit('update:alpha-quality', 75)
    advanced.vm.$emit('update:sns-strength', 70)
    advanced.vm.$emit('update:filter-strength', 55)
    advanced.vm.$emit('update:filter-sharpness', 3)
    advanced.vm.$emit('update:filter-type', 1)
    advanced.vm.$emit('update:partitions', 2)
    advanced.vm.$emit('update:segments', 4)
    advanced.vm.$emit('update:pass-count', 6)
    advanced.vm.$emit('update:exact-mode', 'on')
    advanced.vm.$emit('update:sharp-yuv-mode', 'off')

    expect(wrapper.emitted('update:advancedEnabled')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:nearLossless')?.[0]).toEqual([90])
    expect(wrapper.emitted('update:alphaQuality')?.[0]).toEqual([75])
    expect(wrapper.emitted('update:snsStrength')?.[0]).toEqual([70])
    expect(wrapper.emitted('update:filterStrength')?.[0]).toEqual([55])
    expect(wrapper.emitted('update:filterSharpness')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:filterType')?.[0]).toEqual([1])
    expect(wrapper.emitted('update:partitions')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:segments')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:passCount')?.[0]).toEqual([6])
    expect(wrapper.emitted('update:exactMode')?.[0]).toEqual(['on'])
    expect(wrapper.emitted('update:sharpYuvMode')?.[0]).toEqual(['off'])
  })
})
