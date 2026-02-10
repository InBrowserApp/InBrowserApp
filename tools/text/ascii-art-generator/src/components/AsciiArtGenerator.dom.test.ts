import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NMessageProvider } from 'naive-ui'
import { h } from 'vue'
import AsciiArtGenerator from './AsciiArtGenerator.vue'

// Wrapper component with NMessageProvider
const AsciiArtGeneratorWithProvider = {
  render() {
    return h(NMessageProvider, () => h(AsciiArtGenerator))
  },
}

describe('AsciiArtGenerator', () => {
  it('renders correctly', () => {
    const wrapper = mount(AsciiArtGeneratorWithProvider)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders TextInput component', () => {
    const wrapper = mount(AsciiArtGeneratorWithProvider)
    // TextInput renders an input element
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders FontSelector component', () => {
    const wrapper = mount(AsciiArtGeneratorWithProvider)
    // FontSelector renders NSelect which has specific classes
    expect(wrapper.findComponent({ name: 'FontSelector' }).exists()).toBe(true)
  })

  it('renders AsciiOutput component', () => {
    const wrapper = mount(AsciiArtGeneratorWithProvider)
    expect(wrapper.findComponent({ name: 'AsciiOutput' }).exists()).toBe(true)
  })

  it('has default text value', () => {
    const wrapper = mount(AsciiArtGeneratorWithProvider)
    const input = wrapper.find('input')
    // Default value is 'Hello' from useStorage
    expect(input.element.value).toBe('Hello')
  })

  it('updates output text when TextInput emits model update', async () => {
    const wrapper = mount(AsciiArtGeneratorWithProvider)
    const textInput = wrapper.findComponent({ name: 'TextInput' })
    await textInput.vm.$emit('update:modelValue', 'World')
    await wrapper.vm.$nextTick()

    const output = wrapper.findComponent({ name: 'AsciiOutput' })
    expect(output.props('text')).toBe('World')
  })

  it('updates output font when FontSelector emits model update', async () => {
    const wrapper = mount(AsciiArtGeneratorWithProvider)
    const fontSelector = wrapper.findComponent({ name: 'FontSelector' })
    await fontSelector.vm.$emit('update:modelValue', 'Banner')
    await wrapper.vm.$nextTick()

    const output = wrapper.findComponent({ name: 'AsciiOutput' })
    expect(output.props('font')).toBe('Banner')
  })
})
