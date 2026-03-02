import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorNameSearch from './ColorNameSearch.vue'

vi.mock('../data/colorData', () => ({
  colorCategories: ['red', 'blue', 'white'],
  categoryColors: {
    red: '#ff0000',
    blue: '#0000ff',
    white: '#ffffff',
  },
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
      '<label class="n-input-shell"><span class="n-input-prefix"><slot name="prefix" /></span><input class="n-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" /></label>',
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

    expect(wrapper.find('.n-icon').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NInput' }).props('placeholder')).toBe(
      'Search by color name or HEX value...',
    )
    expect(wrapper.findAll('.n-radio-button')).toHaveLength(4)

    const whiteButton = wrapper.findAll('.n-radio-button')[3]
    const whiteIndicator = whiteButton?.find('span')
    expect(whiteIndicator?.attributes('style')).toContain('border: 1px solid #ccc')

    await wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'azure')
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['azure'])

    await wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'blue')
    expect(wrapper.emitted('update:category')?.[0]).toEqual(['blue'])
  })
})
