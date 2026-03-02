import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RandomNumberGeneratorPresets from './RandomNumberGeneratorPresets.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
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
