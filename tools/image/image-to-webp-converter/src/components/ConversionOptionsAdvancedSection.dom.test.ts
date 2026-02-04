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
})
