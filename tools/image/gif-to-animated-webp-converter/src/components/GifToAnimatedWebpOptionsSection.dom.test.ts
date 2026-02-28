import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import GifToAnimatedWebpOptionsSection from './GifToAnimatedWebpOptionsSection.vue'

const ConversionOptionsStub = defineComponent({
  name: 'ConversionOptions',
  props: [
    'title',
    'scaleLabel',
    'scaleHint',
    'speedLabel',
    'speedHint',
    'loopLabel',
    'loopHint',
    'loopCountLabel',
    'loopInheritLabel',
    'loopInfiniteLabel',
    'loopCustomLabel',
    'convertLabel',
    'convertingLabel',
    'minScale',
    'maxScale',
    'minSpeed',
    'maxSpeed',
    'isConverting',
    'canConvert',
    'scale',
    'speed',
    'loopMode',
    'loopCount',
  ],
  emits: ['update:scale', 'update:speed', 'update:loopMode', 'update:loopCount', 'convert'],
  template: '<button data-test="convert" @click="$emit(\'convert\')">convert</button>',
})

const baseProps = {
  minScale: 10,
  maxScale: 200,
  minSpeed: 0.5,
  maxSpeed: 2,
  isConverting: false,
  canConvert: true,
  scale: 100,
  speed: 1,
  loopMode: 'inherit' as const,
  loopCount: null as number | null,
}

describe('GifToAnimatedWebpOptionsSection', () => {
  it('passes localized labels and option props', () => {
    const wrapper = mount(GifToAnimatedWebpOptionsSection, {
      props: {
        ...baseProps,
      },
      global: {
        stubs: {
          ConversionOptions: ConversionOptionsStub,
        },
      },
    })

    const stub = wrapper.findComponent(ConversionOptionsStub)
    expect(stub.props('title')).toBe('Conversion Options')
    expect(stub.props('scaleLabel')).toBe('Scale (%)')
    expect(stub.props('speedLabel')).toBe('Speed multiplier')
    expect(stub.props('loopLabel')).toBe('Loop')
    expect(stub.props('convertLabel')).toBe('Convert to Animated WebP')
    expect(stub.props('convertingLabel')).toBe('Converting...')
    expect(stub.props('minScale')).toBe(10)
    expect(stub.props('maxSpeed')).toBe(2)
    expect(stub.props('scale')).toBe(100)
    expect(stub.props('loopMode')).toBe('inherit')
  })

  it('emits v-model updates and convert', () => {
    const wrapper = mount(GifToAnimatedWebpOptionsSection, {
      props: {
        ...baseProps,
      },
      global: {
        stubs: {
          ConversionOptions: ConversionOptionsStub,
        },
      },
    })

    const stub = wrapper.findComponent(ConversionOptionsStub)
    stub.vm.$emit('update:scale', 80)
    stub.vm.$emit('update:speed', 1.5)
    stub.vm.$emit('update:loopMode', 'custom')
    stub.vm.$emit('update:loopCount', 3)
    stub.vm.$emit('convert')

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([80])
    expect(wrapper.emitted('update:speed')?.[0]).toEqual([1.5])
    expect(wrapper.emitted('update:loopMode')?.[0]).toEqual(['custom'])
    expect(wrapper.emitted('update:loopCount')?.[0]).toEqual([3])
    expect(wrapper.emitted('convert')?.length).toBe(1)
  })
})
