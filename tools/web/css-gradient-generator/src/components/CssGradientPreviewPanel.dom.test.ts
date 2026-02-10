import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientPreviewPanel from './CssGradientPreviewPanel.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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

  return {
    NButton,
    NCard: makeStub('NCard'),
    NFlex: makeStub('NFlex'),
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
