import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ImageToWebpOptionsSection from './ImageToWebpOptionsSection.vue'

const coreLabels = {
  title: 'Core',
  scaleLabel: 'Scale',
  scaleHint: 'Scale hint',
  qualityLabel: 'Quality',
  qualityHint: 'Quality hint',
  methodLabel: 'Method',
  methodHint: 'Method hint',
  losslessLabel: 'Lossless',
  advancedLabel: 'Advanced',
  convertLabel: 'Convert',
  convertingLabel: 'Converting',
}

const advancedLabels = {
  targetSizeLabel: 'Target size',
  targetPsnrLabel: 'Target PSNR',
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
  optionDefault: 'Default',
  optionOn: 'On',
  optionOff: 'Off',
}

const LabelsCoreStub = defineComponent({
  name: 'ImageToWebpOptionsLabelsCore',
  setup(_, { slots }) {
    return () => slots.default?.({ labels: coreLabels })
  },
})

const LabelsAdvancedStub = defineComponent({
  name: 'ImageToWebpOptionsLabelsAdvanced',
  setup(_, { slots }) {
    return () => slots.default?.({ labels: advancedLabels })
  },
})

const ConversionOptionsStub = defineComponent({
  name: 'ConversionOptions',
  props: ['title', 'scaleLabel', 'targetSizeLabel', 'convertLabel'],
  emits: ['convert'],
  template: '<button @click="$emit(\'convert\')">convert</button>',
})

describe('ImageToWebpOptionsSection', () => {
  it('passes labels and emits convert', async () => {
    const wrapper = mount(ImageToWebpOptionsSection, {
      props: {
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
      },
      global: {
        stubs: {
          ImageToWebpOptionsLabelsCore: LabelsCoreStub,
          ImageToWebpOptionsLabelsAdvanced: LabelsAdvancedStub,
          ConversionOptions: ConversionOptionsStub,
        },
      },
    })

    const options = wrapper.findComponent(ConversionOptionsStub)
    expect(options.props('title')).toBe('Core')
    expect(options.props('scaleLabel')).toBe('Scale')
    expect(options.props('targetSizeLabel')).toBe('Target size')
    expect(options.props('convertLabel')).toBe('Convert')

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('convert')).toHaveLength(1)
  })
})
