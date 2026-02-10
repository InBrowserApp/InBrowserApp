import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GeneralInfoBasics from './GeneralInfoBasics.vue'
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

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<input class="n-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NInput,
    NFormItem: Base,
    NGridItem: Base,
  }
})

describe('GeneralInfoBasics', () => {
  it('updates options from input values', async () => {
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

    const wrapper = mount(GeneralInfoBasics, {
      props: {
        options,
      },
    })

    const inputs = wrapper.findAll('input.n-input')
    expect(inputs).toHaveLength(3)

    await inputs[0]!.setValue('Next App')
    await inputs[1]!.setValue('Next')
    await inputs[2]!.setValue('Next description')

    expect(options.name).toBe('Next App')
    expect(options.short_name).toBe('Next')
    expect(options.description).toBe('Next description')
  })
})
