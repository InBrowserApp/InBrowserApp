import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PaletteControls from './PaletteControls.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NForm: defineComponent({
      name: 'NForm',
      template: '<form><slot /></form>',
    }),
    NFormItem: defineComponent({
      name: 'NFormItem',
      props: ['label'],
      template: '<div><slot /></div>',
    }),
    NSlider: defineComponent({
      name: 'NSlider',
      props: ['value', 'disabled'],
      template: '<div data-test="slider" />',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: ['value', 'disabled'],
      template: '<div data-test="input-number" />',
    }),
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      props: ['value', 'disabled'],
      template: '<div><slot /></div>',
    }),
    NRadioButton: defineComponent({
      name: 'NRadioButton',
      template: '<div><slot /></div>',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['options', 'value', 'disabled'],
      template: '<select data-test="sort" />',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: ['value', 'disabled'],
      template: '<div data-test="switch" />',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
  }
})

const ToolSectionStub = {
  template: '<div><slot /></div>',
}

const ToolSectionHeaderStub = {
  template: '<div><slot /></div>',
}

describe('PaletteControls', () => {
  it('renders palette settings and sort options', () => {
    const wrapper = mount(PaletteControls, {
      props: {
        options: {
          colorCount: 8,
          quality: 'balanced',
          sortBy: 'dominance',
          ignoreTransparent: true,
        },
        isLoading: false,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Palette Settings')
    expect(wrapper.text()).toContain('Fast')
  })

  it('disables controls when loading and provides sort options', () => {
    const wrapper = mount(PaletteControls, {
      props: {
        options: {
          colorCount: 6,
          quality: 'fast',
          sortBy: 'hue',
          ignoreTransparent: false,
        },
        isLoading: true,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    const options = wrapper.findComponent({ name: 'NSelect' }).props('options') as Array<{
      label: string
      value: string
    }>

    expect(options.map((item) => item.value)).toEqual(['dominance', 'hue', 'lightness'])
    expect(wrapper.findComponent({ name: 'NSlider' }).props('disabled')).toBe(true)
    expect(wrapper.findComponent({ name: 'NInputNumber' }).props('disabled')).toBe(true)
    expect(wrapper.findComponent({ name: 'NRadioGroup' }).props('disabled')).toBe(true)
    expect(wrapper.findComponent({ name: 'NSelect' }).props('disabled')).toBe(true)
    expect(wrapper.findComponent({ name: 'NSwitch' }).props('disabled')).toBe(true)
  })
})
