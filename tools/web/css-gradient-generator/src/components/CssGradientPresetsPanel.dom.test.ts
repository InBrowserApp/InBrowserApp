import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientPresetsPanel from './CssGradientPresetsPanel.vue'
import { gradientPresets } from '../utils/presets'
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
  it('uses the preset id when no translated label exists', () => {
    const basePreset = gradientPresets[0]
    if (!basePreset) {
      throw new Error('Expected at least one preset')
    }
    const customPreset = { ...basePreset, id: 'custom-preset' }
    const wrapper = mount(CssGradientPresetsPanel, {
      props: {
        presets: [customPreset],
        presetSwatchStyleMap: {
          [customPreset.id]: { backgroundImage: 'linear-gradient(#111, #eee)' },
        },
      },
    })
    expect(wrapper.text()).toContain('custom-preset')
  })
})
