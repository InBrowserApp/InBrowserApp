import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ListComparerOptionsSection from './ListComparerOptionsSection.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NCheckbox: defineComponent({
      name: 'NCheckbox',
      props: {
        checked: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:checked'],
      template:
        '<label><input type="checkbox" :checked="checked" @change="$emit(\'update:checked\', $event.target.checked)" /><slot /></label>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: {
        label: {
          type: String,
          default: '',
        },
      },
      template: '<label :data-label="label"><slot /></label>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
        placeholder: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template:
        '<input class="n-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NSelect: defineComponent({
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
    }),
  }
})

describe('ListComparerOptionsSection', () => {
  it('renders delimiter options and toggles', () => {
    const wrapper = mount(ListComparerOptionsSection, {
      props: {
        delimiterMode: 'newline',
        customDelimiter: '|',
        trimItems: true,
        ignoreCase: false,
        omitEmptyItems: true,
        sortResults: false,
        'onUpdate:delimiterMode': vi.fn(),
        'onUpdate:customDelimiter': vi.fn(),
        'onUpdate:trimItems': vi.fn(),
        'onUpdate:ignoreCase': vi.fn(),
        'onUpdate:omitEmptyItems': vi.fn(),
        'onUpdate:sortResults': vi.fn(),
      },
    })

    expect(wrapper.text()).toContain('Comparison Options')
    expect(wrapper.text()).toContain('Trim each item')
    expect(wrapper.find('select.n-select').exists()).toBe(true)
  })

  it('emits updates for delimiter mode, custom delimiter, and booleans', async () => {
    const updateDelimiter = vi.fn()
    const updateCustom = vi.fn()
    const updateTrim = vi.fn()
    const updateIgnoreCase = vi.fn()
    const updateOmitEmptyItems = vi.fn()
    const updateSortResults = vi.fn()
    const wrapper = mount(ListComparerOptionsSection, {
      props: {
        delimiterMode: 'custom',
        customDelimiter: '|',
        trimItems: true,
        ignoreCase: false,
        omitEmptyItems: true,
        sortResults: false,
        'onUpdate:delimiterMode': updateDelimiter,
        'onUpdate:customDelimiter': updateCustom,
        'onUpdate:trimItems': updateTrim,
        'onUpdate:ignoreCase': updateIgnoreCase,
        'onUpdate:omitEmptyItems': updateOmitEmptyItems,
        'onUpdate:sortResults': updateSortResults,
      },
    })

    await wrapper.get('select.n-select').setValue('comma')
    await wrapper.get('input.n-input').setValue('::')
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0]!.setValue(false)
    await checkboxes[1]!.setValue(true)
    await checkboxes[2]!.setValue(false)
    await checkboxes[3]!.setValue(true)

    expect(updateDelimiter).toHaveBeenCalledWith('comma')
    expect(updateCustom).toHaveBeenCalledWith('::')
    expect(updateTrim).toHaveBeenCalledWith(false)
    expect(updateIgnoreCase).toHaveBeenCalledWith(true)
    expect(updateOmitEmptyItems).toHaveBeenCalledWith(false)
    expect(updateSortResults).toHaveBeenCalledWith(true)
  })
})
