import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ImageToWebpOptionsSection from './ImageToWebpOptionsSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const ConversionOptionsStub = defineComponent({
  name: 'ConversionOptions',
  props: ['title', 'scaleLabel', 'targetSizeLabel', 'convertLabel'],
  emits: [
    'convert',
    'update:scale',
    'update:quality',
    'update:method',
    'update:lossless',
    'update:advanced-enabled',
    'update:target-size',
    'update:target-psnr',
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
          ConversionOptions: ConversionOptionsStub,
        },
      },
    })

    const options = wrapper.findComponent(ConversionOptionsStub)
    expect(options.props('title')).toBe('optionsTitle')
    expect(options.props('scaleLabel')).toBe('scaleLabel')
    expect(options.props('targetSizeLabel')).toBe('targetSizeLabel')
    expect(options.props('convertLabel')).toBe('convert')

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('convert')).toHaveLength(1)
  })

  it('forwards option model updates', () => {
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
          ConversionOptions: ConversionOptionsStub,
        },
      },
    })

    const options = wrapper.findComponent(ConversionOptionsStub)
    options.vm.$emit('update:scale', 90)
    options.vm.$emit('update:quality', 70)
    options.vm.$emit('update:method', 2)
    options.vm.$emit('update:lossless', true)
    options.vm.$emit('update:advanced-enabled', true)
    options.vm.$emit('update:target-size', 128)
    options.vm.$emit('update:target-psnr', 36)
    options.vm.$emit('update:near-lossless', 85)
    options.vm.$emit('update:alpha-quality', 88)
    options.vm.$emit('update:sns-strength', 70)
    options.vm.$emit('update:filter-strength', 40)
    options.vm.$emit('update:filter-sharpness', 3)
    options.vm.$emit('update:filter-type', 1)
    options.vm.$emit('update:partitions', 2)
    options.vm.$emit('update:segments', 4)
    options.vm.$emit('update:pass-count', 6)
    options.vm.$emit('update:exact-mode', 'on')
    options.vm.$emit('update:sharp-yuv-mode', 'off')

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([90])
    expect(wrapper.emitted('update:quality')?.[0]).toEqual([70])
    expect(wrapper.emitted('update:method')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:lossless')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:advancedEnabled')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:targetSize')?.[0]).toEqual([128])
    expect(wrapper.emitted('update:targetPsnr')?.[0]).toEqual([36])
    expect(wrapper.emitted('update:nearLossless')?.[0]).toEqual([85])
    expect(wrapper.emitted('update:alphaQuality')?.[0]).toEqual([88])
    expect(wrapper.emitted('update:snsStrength')?.[0]).toEqual([70])
    expect(wrapper.emitted('update:filterStrength')?.[0]).toEqual([40])
    expect(wrapper.emitted('update:filterSharpness')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:filterType')?.[0]).toEqual([1])
    expect(wrapper.emitted('update:partitions')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:segments')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:passCount')?.[0]).toEqual([6])
    expect(wrapper.emitted('update:exactMode')?.[0]).toEqual(['on'])
    expect(wrapper.emitted('update:sharpYuvMode')?.[0]).toEqual(['off'])
  })
})
