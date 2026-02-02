import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorNameSearch from './ColorNameSearch.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('../data/colorData', () => ({
  colorCategories: ['red', 'blue'],
  categoryColors: {
    red: '#ff0000',
    blue: '#0000ff',
  },
}))

vi.mock('@vicons/fluent/Search20Regular', () => ({
  default: {},
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: ['value', 'placeholder'],
    emits: ['update:value'],
    template:
      '<input class="n-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    props: ['component'],
    template: '<span class="n-icon" />',
  })

  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    props: ['value'],
    emits: ['update:value'],
    template: '<div class="n-radio-group"><slot /></div>',
  })

  const NRadioButton = defineComponent({
    name: 'NRadioButton',
    props: ['value'],
    template: '<button class="n-radio-button" :data-value="value"><slot /></button>',
  })

  const NScrollbar = defineComponent({
    name: 'NScrollbar',
    template: '<div class="n-scrollbar"><slot /></div>',
  })

  return {
    NFlex,
    NInput,
    NIcon,
    NRadioGroup,
    NRadioButton,
    NScrollbar,
  }
})

describe('ColorNameSearch', () => {
  it('renders categories and emits updates', async () => {
    const wrapper = mount(ColorNameSearch, {
      props: {
        search: '',
        category: 'all',
      },
    })

    expect(wrapper.findComponent({ name: 'NInput' }).props('placeholder')).toBe('searchPlaceholder')
    expect(wrapper.findAll('.n-radio-button')).toHaveLength(3)

    await wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'azure')
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['azure'])

    await wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'blue')
    expect(wrapper.emitted('update:category')?.[0]).toEqual(['blue'])
  })
})
