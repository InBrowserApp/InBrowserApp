import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RandomNumberGeneratorPresets from './RandomNumberGeneratorPresets.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

describe('RandomNumberGeneratorPresets', () => {
  it('emits preset selections', async () => {
    const wrapper = mount(RandomNumberGeneratorPresets)

    await wrapper.get('[data-testid="preset-dice"]').trigger('click')
    await wrapper.get('[data-testid="preset-ten"]').trigger('click')
    await wrapper.get('[data-testid="preset-hundred"]').trigger('click')
    await wrapper.get('[data-testid="preset-lotto"]').trigger('click')

    expect(wrapper.emitted('apply-preset')).toEqual([['dice'], ['ten'], ['hundred'], ['lotto']])
  })
})
