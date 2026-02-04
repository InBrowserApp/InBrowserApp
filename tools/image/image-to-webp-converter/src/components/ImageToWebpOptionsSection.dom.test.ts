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
})
