import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientPreviewPanel from './CssGradientPreviewPanel.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })
  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /></button>',
  })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NButton,
    NCard: makeStub('NCard'),
    NIcon: makeStub('NIcon'),
  }
})
describe('CssGradientPreviewPanel', () => {
  it('emits randomize events', async () => {
    const wrapper = mount(CssGradientPreviewPanel, {
      props: {
        backgroundImage: 'linear-gradient(#000, #fff)',
        blendMode: 'multiply',
      },
    })
    await wrapper.get('[data-testid="randomize-layer"]').trigger('click')
    await wrapper.get('[data-testid="randomize-all"]').trigger('click')
    expect(wrapper.emitted('randomize-layer')).toBeTruthy()
    expect(wrapper.emitted('randomize-all')).toBeTruthy()
  })
})
