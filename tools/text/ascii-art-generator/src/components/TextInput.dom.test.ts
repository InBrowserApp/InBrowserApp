import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextInput from './TextInput.vue'

describe('TextInput', () => {
  it('renders correctly', () => {
    const wrapper = mount(TextInput, {
      props: { modelValue: 'Hello' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits update:modelValue when input changes', async () => {
    const wrapper = mount(TextInput, {
      props: { modelValue: 'Hello' },
    })

    const input = wrapper.find('input')
    await input.setValue('World')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['World'])
  })

  it('displays the modelValue in input', () => {
    const wrapper = mount(TextInput, {
      props: { modelValue: 'Test Value' },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('Test Value')
  })

  it('has correct input type', () => {
    const wrapper = mount(TextInput, {
      props: { modelValue: '' },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
  })
})
