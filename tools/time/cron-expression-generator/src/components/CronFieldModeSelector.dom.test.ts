import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronFieldModeSelector from './CronFieldModeSelector.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      props: ['value'],
      emits: ['update:value'],
      template: '<div class="n-radio-group"><slot /></div>',
    }),
    NRadio: defineComponent({
      name: 'NRadio',
      props: ['value'],
      template: '<label class="n-radio"><slot /></label>',
    }),
  }
})
describe('CronFieldModeSelector', () => {
  it('renders mode options', () => {
    const wrapper = mount(CronFieldModeSelector, {
      props: {
        mode: 'every',
      },
    })
    expect(wrapper.findAll('.n-radio')).toHaveLength(4)
  })
  it('emits mode updates from the radio group', () => {
    const onUpdate = vi.fn()
    const wrapper = mount(CronFieldModeSelector, {
      props: {
        mode: 'every',
        'onUpdate:mode': onUpdate,
      },
    })
    wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'range')
    expect(onUpdate).toHaveBeenCalledWith('range')
  })
})
