import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ConversionOptionsAdvancedSection from './ConversionOptionsAdvancedSection.vue'

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  const { defineComponent } = await import('vue')

  const BaseStub = defineComponent({
    name: 'BaseStub',
    template: '<div><slot /></div>',
  })

  const makeModelStub = (name: string) =>
    defineComponent({
      name,
      props: {
        value: {
          type: [Array, Number, Boolean, String],
          default: undefined,
        },
      },
      emits: ['update:value', 'update:checked'],
      template: '<div />',
    })

  return {
    ...actual,
    NCollapseTransition: BaseStub,
    NFlex: BaseStub,
    NFormItemGi: BaseStub,
    NGrid: BaseStub,
    NInputNumber: makeModelStub('NInputNumber'),
    NSelect: makeModelStub('NSelect'),
    NSwitch: makeModelStub('NSwitch'),
    NText: BaseStub,
  }
})

function mountSection(overrides: Partial<Record<string, unknown>> = {}) {
  return mount(ConversionOptionsAdvancedSection, {
    props: {
      advancedLabel: 'Advanced',
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
      optionDefaultLabel: 'Default',
      optionOnLabel: 'On',
      optionOffLabel: 'Off',
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
  })
}

describe('ConversionOptionsAdvancedSection', () => {
  it('clears target PSNR when target size updates', () => {
    const wrapper = mountSection({ targetPsnr: 12 })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    inputs[0]?.vm.$emit('update:value', 5)

    expect(wrapper.emitted('update:targetSize')?.[0]).toEqual([5])
    expect(wrapper.emitted('update:targetPsnr')?.[0]).toEqual([null])
  })

  it('clears target size when target PSNR updates', () => {
    const wrapper = mountSection({ targetSize: 4 })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    inputs[1]?.vm.$emit('update:value', 18)

    expect(wrapper.emitted('update:targetPsnr')?.[0]).toEqual([18])
    expect(wrapper.emitted('update:targetSize')?.[0]).toEqual([null])
  })

  it('emits advancedEnabled updates', () => {
    const wrapper = mountSection({ advancedEnabled: false })

    wrapper.findComponent({ name: 'NSwitch' }).vm.$emit('update:value', true)

    expect(wrapper.emitted('update:advancedEnabled')?.[0]).toEqual([true])
  })

  it('renders advanced controls when enabled', () => {
    const wrapper = mountSection({ advancedEnabled: true })

    expect(wrapper.findAllComponents({ name: 'NInputNumber' })).toHaveLength(11)
    expect(wrapper.findAllComponents({ name: 'NSelect' })).toHaveLength(2)
  })

  it('emits updates for advanced numeric and toggle options', () => {
    const wrapper = mountSection({ advancedEnabled: true })
    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    const selects = wrapper.findAllComponents({ name: 'NSelect' })

    inputs[2]?.vm.$emit('update:value', 50)
    inputs[3]?.vm.$emit('update:value', 80)
    inputs[4]?.vm.$emit('update:value', 60)
    inputs[5]?.vm.$emit('update:value', 55)
    inputs[6]?.vm.$emit('update:value', 3)
    inputs[7]?.vm.$emit('update:value', 1)
    inputs[8]?.vm.$emit('update:value', 2)
    inputs[9]?.vm.$emit('update:value', 4)
    inputs[10]?.vm.$emit('update:value', 6)
    selects[0]?.vm.$emit('update:value', 'on')
    selects[1]?.vm.$emit('update:value', 'off')

    expect(wrapper.emitted('update:nearLossless')?.[0]).toEqual([50])
    expect(wrapper.emitted('update:alphaQuality')?.[0]).toEqual([80])
    expect(wrapper.emitted('update:snsStrength')?.[0]).toEqual([60])
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
