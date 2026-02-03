import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GeneralInfoPaths from './GeneralInfoPaths.vue'
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

describe('GeneralInfoPaths', () => {
  it('updates start url and path', async () => {
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

    const wrapper = mount(GeneralInfoPaths, {
      props: {
        options,
      },
    })

    const inputs = wrapper.findAll('input.n-input')
    expect(inputs).toHaveLength(2)

    await inputs[0]!.setValue('/start')
    await inputs[1]!.setValue('/assets/')

    expect(options.start_url).toBe('/start')
    expect(options.path).toBe('/assets/')
  })
})
