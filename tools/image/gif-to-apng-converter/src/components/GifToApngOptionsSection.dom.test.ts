import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import GifToApngOptionsSection from './GifToApngOptionsSection.vue'

const coreLabels = {
  title: 'Core Title',
  scaleLabel: 'Scale',
  scaleHint: 'Scale hint',
  speedLabel: 'Speed',
  speedHint: 'Speed hint',
  loopLabel: 'Loop',
  loopHint: 'Loop hint',
  loopCountLabel: 'Loop count',
  loopInheritLabel: 'Inherit',
  loopInfiniteLabel: 'Infinite',
  loopCustomLabel: 'Custom',
  convertLabel: 'Convert',
  convertingLabel: 'Converting',
}

const optimizeLabels = {
  optimizeLabel: 'Optimize',
  optimizeLevelLabel: 'Optimize level',
  optimizeHint: 'Optimize hint',
}

const CoreLabelsStub = defineComponent({
  name: 'GifToApngOptionsLabelsCore',
  setup(_, { slots }) {
    return () => slots.default?.({ labels: coreLabels })
  },
})

const OptimizeLabelsStub = defineComponent({
  name: 'GifToApngOptionsLabelsOptimize',
  setup(_, { slots }) {
    return () => slots.default?.({ labels: optimizeLabels })
  },
})

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
    'optimizeLabel',
    'optimizeLevelLabel',
    'optimizeHint',
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
    'optimize',
    'optimizeLevel',
  ],
  emits: [
    'update:scale',
    'update:speed',
    'update:loopMode',
    'update:loopCount',
    'update:optimize',
    'update:optimizeLevel',
    'convert',
  ],
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
  optimize: true,
  optimizeLevel: 2,
}

describe('GifToApngOptionsSection', () => {
  it('passes labels and option props into ConversionOptions', () => {
    const wrapper = mount(GifToApngOptionsSection, {
      props: {
        ...baseProps,
      },
      global: {
        stubs: {
          GifToApngOptionsLabelsCore: CoreLabelsStub,
          GifToApngOptionsLabelsOptimize: OptimizeLabelsStub,
          ConversionOptions: ConversionOptionsStub,
        },
      },
    })

    const stub = wrapper.findComponent(ConversionOptionsStub)
    expect(stub.props('title')).toBe(coreLabels.title)
    expect(stub.props('scaleLabel')).toBe(coreLabels.scaleLabel)
    expect(stub.props('speedLabel')).toBe(coreLabels.speedLabel)
    expect(stub.props('loopLabel')).toBe(coreLabels.loopLabel)
    expect(stub.props('optimizeLabel')).toBe(optimizeLabels.optimizeLabel)
    expect(stub.props('optimizeLevelLabel')).toBe(optimizeLabels.optimizeLevelLabel)
    expect(stub.props('minScale')).toBe(10)
    expect(stub.props('maxSpeed')).toBe(2)
    expect(stub.props('optimize')).toBe(true)
    expect(stub.props('optimizeLevel')).toBe(2)
  })

  it('emits v-model updates and convert', () => {
    const wrapper = mount(GifToApngOptionsSection, {
      props: {
        ...baseProps,
      },
      global: {
        stubs: {
          GifToApngOptionsLabelsCore: CoreLabelsStub,
          GifToApngOptionsLabelsOptimize: OptimizeLabelsStub,
          ConversionOptions: ConversionOptionsStub,
        },
      },
    })

    const stub = wrapper.findComponent(ConversionOptionsStub)
    stub.vm.$emit('update:scale', 80)
    stub.vm.$emit('update:speed', 1.5)
    stub.vm.$emit('update:loopMode', 'custom')
    stub.vm.$emit('update:loopCount', 3)
    stub.vm.$emit('update:optimize', false)
    stub.vm.$emit('update:optimizeLevel', 4)
    stub.vm.$emit('convert')

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([80])
    expect(wrapper.emitted('update:speed')?.[0]).toEqual([1.5])
    expect(wrapper.emitted('update:loopMode')?.[0]).toEqual(['custom'])
    expect(wrapper.emitted('update:loopCount')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:optimize')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:optimizeLevel')?.[0]).toEqual([4])
    expect(wrapper.emitted('convert')?.length).toBe(1)
  })
})
