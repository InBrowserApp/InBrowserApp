import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientPresetsPanel from './CssGradientPresetsPanel.vue'
import { gradientPresets } from '../utils/presets'

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
    NGi: makeStub('NGi'),
    NGrid: makeStub('NGrid'),
  }
})

describe('CssGradientPresetsPanel', () => {
  it('emits apply-preset for selected presets', async () => {
    const preset = gradientPresets[0]
    if (!preset) {
      throw new Error('Expected at least one preset')
    }
    const wrapper = mount(CssGradientPresetsPanel, {
      props: {
        presets: gradientPresets,
        presetSwatchStyleMap: {
          [preset.id]: { backgroundImage: 'linear-gradient(#000, #fff)' },
        },
      },
    })

    await wrapper.get(`[data-testid="preset-${preset.id}"]`).trigger('click')
    expect(wrapper.emitted('apply-preset')?.[0]).toEqual([preset.id])
  })
})
