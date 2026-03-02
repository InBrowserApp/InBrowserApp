import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaceholderPresetSizeOptions from './PlaceholderPresetSizeOptions.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    ...actual,
    NFormItemGi: actual.NFormItemGi,
    NSelect: defineComponent({
      name: 'NSelect',
      props: {
        value: {
          type: [Number],
          default: null,
        },
        options: {
          type: Array,
          default: () => [],
        },
      },
      emits: ['update:value'],
      template: '<div class="select"><slot /></div>',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: {
        value: {
          type: Number,
          default: 0,
        },
      },
      emits: ['update:value'],
      template: '<div class="input-number" />',
    }),
  }
})
describe('PlaceholderPresetSizeOptions', () => {
  it('selects the matching preset index', () => {
    const wrapper = mount(PlaceholderPresetSizeOptions, {
      props: {
        width: 1280,
        height: 720,
      },
    })
    const select = wrapper.findComponent({ name: 'NSelect' })
    expect(select.props('value')).toBe(0)
  })
  it('clears the preset selection when size does not match', () => {
    const wrapper = mount(PlaceholderPresetSizeOptions, {
      props: {
        width: 123,
        height: 456,
      },
    })
    const select = wrapper.findComponent({ name: 'NSelect' })
    expect(select.props('value')).toBe(null)
  })
  it('applies preset dimensions when selected', async () => {
    const onUpdateWidth = vi.fn()
    const onUpdateHeight = vi.fn()
    const wrapper = mount(PlaceholderPresetSizeOptions, {
      props: {
        width: 100,
        height: 100,
        'onUpdate:width': onUpdateWidth,
        'onUpdate:height': onUpdateHeight,
      },
    })
    const select = wrapper.findComponent({ name: 'NSelect' })
    select.vm.$emit('update:value', 3)
    await wrapper.vm.$nextTick()
    expect(onUpdateWidth).toHaveBeenCalledWith(500)
    expect(onUpdateHeight).toHaveBeenCalledWith(500)
  })
  it('falls back to defaults when inputs are cleared', async () => {
    const onUpdateWidth = vi.fn()
    const onUpdateHeight = vi.fn()
    const wrapper = mount(PlaceholderPresetSizeOptions, {
      props: {
        width: 200,
        height: 300,
        'onUpdate:width': onUpdateWidth,
        'onUpdate:height': onUpdateHeight,
      },
    })
    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    inputs[0]?.vm.$emit('update:value', null)
    inputs[1]?.vm.$emit('update:value', null)
    await wrapper.vm.$nextTick()
    expect(onUpdateWidth).toHaveBeenCalledWith(800)
    expect(onUpdateHeight).toHaveBeenCalledWith(600)
  })
})
