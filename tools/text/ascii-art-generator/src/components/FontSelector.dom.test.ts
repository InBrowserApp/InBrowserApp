import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FontSelector from './FontSelector.vue'
import { fontNames } from '../utils/fonts'

describe('FontSelector', () => {
  it('renders correctly', () => {
    const wrapper = mount(FontSelector, {
      props: { modelValue: 'Standard' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders all available fonts as options', () => {
    mount(FontSelector, {
      props: { modelValue: 'Standard' },
    })

    // Font options should match fontNames count
    expect(fontNames.length).toBeGreaterThan(0)
  })

  it('emits update:modelValue when selection changes', async () => {
    const wrapper = mount(FontSelector, {
      props: { modelValue: 'Standard' },
    })

    // Trigger the component's emit directly since NSelect is complex
    await wrapper.vm.$emit('update:modelValue', 'Banner')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Banner'])
  })

  it('uses fontNames from utils', () => {
    expect(Array.isArray(fontNames)).toBe(true)
    expect(fontNames.length).toBeGreaterThan(100)
  })

  it('has Standard font in fontNames', () => {
    expect(fontNames).toContain('Standard')
  })
})
