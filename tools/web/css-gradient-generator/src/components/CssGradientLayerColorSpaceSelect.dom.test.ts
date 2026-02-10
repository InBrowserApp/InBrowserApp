import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientLayerColorSpaceSelect from './CssGradientLayerColorSpaceSelect.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

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
    template: '<div />',
  })

  return { NSelect }
})

describe('CssGradientLayerColorSpaceSelect', () => {
  it('lists color spaces and emits updates', () => {
    const wrapper = mount(CssGradientLayerColorSpaceSelect, {
      props: {
        layerColorSpace: 'srgb',
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    expect(select.props('options')).toHaveLength(2)

    select.vm.$emit('update:value', 'oklch')
    expect(wrapper.emitted('update:layerColorSpace')?.[0]).toEqual(['oklch'])
  })
})
