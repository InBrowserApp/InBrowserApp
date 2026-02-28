import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GeneralInfoThemeColors from './GeneralInfoThemeColors.vue'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div class="stub"><slot /><slot name="label" /><slot name="icon" /></div>',
  })

  const NColorPicker = defineComponent({
    name: 'NColorPicker',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<input class="color" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NCheckbox = defineComponent({
    name: 'NCheckbox',
    props: {
      checked: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:checked'],
    template:
      '<input class="checkbox" type="checkbox" :checked="checked" @change="$emit(\'update:checked\', $event.target.checked)" />',
  })

  return {
    NColorPicker,
    NCheckbox,
    NFormItem: Base,
    NGridItem: Base,
    NButton: Base,
    NIcon: Base,
  }
})

describe('GeneralInfoThemeColors', () => {
  it('updates theme colors and dark mode toggle', async () => {
    const options: GeneralInfoOptions = {
      name: 'App',
      short_name: 'App',
      description: 'Description',
      start_url: '/',
      display: 'standalone',
      theme_color: '#ffffff',
      theme_color_dark_enabled: false,
      theme_color_dark: '#000000',
      background_color: '#cccccc',
      path: '/icons/',
    }

    const wrapper = mount(GeneralInfoThemeColors, {
      props: {
        options,
      },
    })

    const checkbox = wrapper.find('input.checkbox')
    await checkbox.setValue(true)
    expect(options.theme_color_dark_enabled).toBe(true)

    const colors = wrapper.findAll('input.color')
    expect(colors.length).toBeGreaterThanOrEqual(3)

    await colors[0]!.setValue('#111111')
    await colors[1]!.setValue('#222222')
    await colors[2]!.setValue('#333333')

    expect(options.theme_color).toBe('#111111')
    expect(options.theme_color_dark).toBe('#222222')
    expect(options.background_color).toBe('#333333')
  })
})
