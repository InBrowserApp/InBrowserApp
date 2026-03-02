import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PaletteControls from './PaletteControls.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
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
      emits: ['update:value'],
      template: '<div data-test="slider" />',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: ['value', 'disabled'],
      emits: ['update:value'],
      template: '<div data-test="input-number" />',
    }),
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      props: ['value', 'disabled'],
      emits: ['update:value'],
      template: '<div><slot /></div>',
    }),
    NRadioButton: defineComponent({
      name: 'NRadioButton',
      template: '<div><slot /></div>',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['options', 'value', 'disabled'],
      emits: ['update:value'],
      template: '<select data-test="sort" />',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: ['value', 'disabled'],
      emits: ['update:value'],
      template: '<div data-test="switch" />',
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
  it('updates options when controls emit v-model updates', async () => {
    const options = {
      colorCount: 4,
      quality: 'fast' as const,
      sortBy: 'dominance' as const,
      ignoreTransparent: true,
    }
    const wrapper = mount(PaletteControls, {
      props: {
        options,
        isLoading: false,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })
    wrapper.findComponent({ name: 'NSlider' }).vm.$emit('update:value', 10)
    wrapper.findComponent({ name: 'NInputNumber' }).vm.$emit('update:value', 11)
    wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'precise')
    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'lightness')
    wrapper.findComponent({ name: 'NSwitch' }).vm.$emit('update:value', false)
    await nextTick()
    expect(options).toEqual({
      colorCount: 11,
      quality: 'precise',
      sortBy: 'lightness',
      ignoreTransparent: false,
    })
  })
})
