import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
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
      template: '<button class="n-select">{{ options.length }}</button>',
    }),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<div><slot /></div>',
    }),
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<div><slot /></div>',
    }),
  }
})

import FontSelector from './FontSelector.vue'
import { fontNames } from '../utils/fonts'

const mountSelector = () =>
  mount(FontSelector, {
    props: { modelValue: 'Standard' },
  })

describe('FontSelector', () => {
  it('renders correctly', () => {
    const wrapper = mountSelector()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders all available fonts as options', () => {
    const wrapper = mountSelector()
    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as Array<{ label: string; value: string }>

    expect(options).toHaveLength(fontNames.length)
    expect(options[0]).toEqual({ label: fontNames[0], value: fontNames[0] })
  })

  it('emits update:modelValue when selection changes', async () => {
    const wrapper = mountSelector()
    const select = wrapper.findComponent({ name: 'NSelect' })

    await select.vm.$emit('update:value', 'Banner')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Banner'])
  })

  it('uses fontNames from utils', () => {
    expect(Array.isArray(fontNames)).toBe(true)
    expect(fontNames.length).toBeGreaterThan(100)
  })

  it('has Standard font in fontNames', () => {
    expect(fontNames).toContain('Standard')
  })
})
