import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GeneralInfoDisplay from './GeneralInfoDisplay.vue'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div class="stub"><slot /></div>',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template:
      '<select class="n-select" :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  })

  return {
    NSelect,
    NFormItem: Base,
    NGridItem: Base,
  }
})

describe('GeneralInfoDisplay', () => {
  it('provides display options and updates selection', async () => {
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

    const wrapper = mount(GeneralInfoDisplay, {
      props: {
        options,
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    const selectOptions = select.props('options') as Array<{ label: string; value: string }>
    expect(selectOptions).toHaveLength(4)
    expect(selectOptions.map((option) => option.value)).toEqual([
      'fullscreen',
      'standalone',
      'minimal-ui',
      'browser',
    ])

    await wrapper.find('select.n-select').setValue('fullscreen')
    expect(options.display).toBe('fullscreen')
  })
})
