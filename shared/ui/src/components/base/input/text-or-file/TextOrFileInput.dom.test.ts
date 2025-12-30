import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TextOrFileInput from './TextOrFileInput.vue'

describe('TextOrFileInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render text input initially', () => {
    const wrapper = mount(TextOrFileInput, {
      props: { value: '' },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('should emit update:value with text on input', async () => {
    const wrapper = mount(TextOrFileInput, {
      props: { value: '' },
    })
    await wrapper.find('textarea').setValue('hello world')
    await flushPromises()
    expect(wrapper.emitted('update:value')).toBeTruthy()
    expect(wrapper.emitted('update:value')![0]).toEqual(['hello world'])
  })

  it('should initialize with string value from prop', async () => {
    const wrapper = mount(TextOrFileInput, {
      props: { value: 'initial text' },
    })
    await flushPromises()
    expect(wrapper.find('textarea').element.value).toBe('initial text')
  })

  it('should update text value when prop changes', async () => {
    const wrapper = mount(TextOrFileInput, {
      props: { value: 'initial' },
    })
    await wrapper.setProps({ value: 'updated' })
    await flushPromises()
    expect(wrapper.find('textarea').element.value).toBe('updated')
  })

  it('should have upload area when no text', () => {
    const wrapper = mount(TextOrFileInput, {
      props: { value: '' },
    })
    // Check that there's an upload area (NUpload renders this)
    expect(wrapper.html()).toContain('text-or-file-input')
  })

  it('should accept custom accept prop', () => {
    const wrapper = mount(TextOrFileInput, {
      props: { value: '', accept: '.txt,.csv' },
    })
    expect(wrapper.props('accept')).toBe('.txt,.csv')
  })
})
