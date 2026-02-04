import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ConversionOptionsBaseGrid from './ConversionOptionsBaseGrid.vue'

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
    NInputNumber: makeModelStub('NInputNumber'),
    NSwitch: makeModelStub('NSwitch'),
    NFlex: BaseStub,
    NFormItemGi: BaseStub,
    NGrid: BaseStub,
    NText: BaseStub,
  }
})

describe('ConversionOptionsBaseGrid', () => {
  it('emits updates for scale, quality, method, and lossless', () => {
    const wrapper = mount(ConversionOptionsBaseGrid, {
      props: {
        scaleLabel: 'Scale',
        scaleHint: 'Scale hint',
        qualityLabel: 'Quality',
        qualityHint: 'Quality hint',
        methodLabel: 'Method',
        methodHint: 'Method hint',
        losslessLabel: 'Lossless',
        minScale: 10,
        maxScale: 400,
        scale: 100,
        quality: 80,
        method: 4,
        lossless: false,
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    inputs[0]?.vm.$emit('update:value', 90)
    inputs[1]?.vm.$emit('update:value', 70)
    inputs[2]?.vm.$emit('update:value', 5)

    wrapper.findComponent({ name: 'NSwitch' }).vm.$emit('update:value', true)

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([90])
    expect(wrapper.emitted('update:quality')?.[0]).toEqual([70])
    expect(wrapper.emitted('update:method')?.[0]).toEqual([5])
    expect(wrapper.emitted('update:lossless')?.[0]).toEqual([true])
  })

  it('ignores null updates', () => {
    const wrapper = mount(ConversionOptionsBaseGrid, {
      props: {
        scaleLabel: 'Scale',
        scaleHint: 'Scale hint',
        qualityLabel: 'Quality',
        qualityHint: 'Quality hint',
        methodLabel: 'Method',
        methodHint: 'Method hint',
        losslessLabel: 'Lossless',
        minScale: 10,
        maxScale: 400,
        scale: 100,
        quality: 80,
        method: 4,
        lossless: false,
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    inputs[0]?.vm.$emit('update:value', null)
    inputs[1]?.vm.$emit('update:value', null)
    inputs[2]?.vm.$emit('update:value', null)

    expect(wrapper.emitted('update:scale')).toBeUndefined()
    expect(wrapper.emitted('update:quality')).toBeUndefined()
    expect(wrapper.emitted('update:method')).toBeUndefined()
  })
})
