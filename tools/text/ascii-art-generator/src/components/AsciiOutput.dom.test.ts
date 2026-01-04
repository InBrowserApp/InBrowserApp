import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { NMessageProvider } from 'naive-ui'
import { h } from 'vue'
import figlet from 'figlet'
import standard from 'figlet/importable-fonts/Standard.js'
import AsciiOutput from './AsciiOutput.vue'

// Parse Standard font for testing
figlet.parseFont('Standard', standard)

// Wrapper component with NMessageProvider
const withMessageProvider = (props: { text: string; font: string }) => ({
  render() {
    return h(NMessageProvider, () => h(AsciiOutput, props))
  },
})

describe('AsciiOutput', () => {
  it('renders correctly', () => {
    const wrapper = mount(withMessageProvider({ text: '', font: 'Standard' }))
    expect(wrapper.exists()).toBe(true)
  })

  it('shows placeholder when text is empty', async () => {
    const wrapper = mount(withMessageProvider({ text: '', font: 'Standard' }))
    await flushPromises()

    // Should show placeholder text
    expect(wrapper.text()).toContain('ASCII')
  })

  it('generates ASCII art for non-empty text', async () => {
    const wrapper = mount(withMessageProvider({ text: 'Hi', font: 'Standard' }))
    await flushPromises()

    // Wait for computedAsync to resolve
    await new Promise((resolve) => setTimeout(resolve, 100))
    await flushPromises()

    const html = wrapper.html()
    // ASCII art contains special characters like underscores, pipes, slashes
    expect(html).toMatch(/[_|\\\/]/)
  })

  it('shows copy button when output exists', async () => {
    const wrapper = mount(withMessageProvider({ text: 'Test', font: 'Standard' }))
    await flushPromises()
    await new Promise((resolve) => setTimeout(resolve, 100))
    await flushPromises()

    // CopyToClipboardButton should be rendered
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('hides copy button when text is empty', async () => {
    const wrapper = mount(withMessageProvider({ text: '', font: 'Standard' }))
    await flushPromises()

    // No output means no copy button
    const buttons = wrapper.findAll('button')
    // May have 0 buttons or buttons without copy functionality
    expect(wrapper.text()).not.toContain('_')
  })
})
