import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItem, NInput } from 'naive-ui'
import EmailInput from './EmailInput.vue'
import { validateEmail } from '../data/email'

describe('EmailInput', () => {
  it('shows no status or feedback when empty', () => {
    const wrapper = mount(EmailInput, {
      props: {
        modelValue: '',
        validationResult: validateEmail(''),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBeUndefined()
    expect(formItem.props().feedback).toBeUndefined()
    expect(input.props().status).toBeUndefined()
  })

  it('shows success when valid', () => {
    const wrapper = mount(EmailInput, {
      props: {
        modelValue: 'hello@example.com',
        validationResult: validateEmail('hello@example.com'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('success')
    expect(formItem.props().feedback).toBe('Valid email address')
    expect(input.props().status).toBe('success')
  })

  it('falls back to a generic error message', () => {
    const baseResult = validateEmail('hello@example.com')
    const wrapper = mount(EmailInput, {
      props: {
        modelValue: 'hello@example.com',
        validationResult: { ...baseResult, isValid: false },
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Invalid email address')
    expect(input.props().status).toBe('error')
  })

  it.each([
    {
      label: 'missing @',
      value: 'hello.example.com',
      feedback: 'Email must contain a single @',
    },
    {
      label: 'local length',
      value: `${'a'.repeat(65)}@example.com`,
      feedback: 'Local part must be 1-64 characters',
    },
    {
      label: 'domain length',
      value: `user@${'a'.repeat(254)}`,
      feedback: 'Domain must be 1-253 characters',
    },
    {
      label: 'total length',
      value: `${'a'.repeat(64)}@${'b'.repeat(190)}`,
      feedback: 'Email must be at most 254 characters',
    },
    {
      label: 'local format',
      value: 'user..name@example.com',
      feedback: 'Local part is invalid',
    },
    {
      label: 'domain format',
      value: 'user@exa_mple.com',
      feedback: 'Domain is invalid',
    },
    {
      label: 'tld',
      value: 'user@example',
      feedback: 'Domain must include a top-level domain',
    },
  ])('shows $label error message', ({ value, feedback }) => {
    const wrapper = mount(EmailInput, {
      props: {
        modelValue: value,
        validationResult: validateEmail(value),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe(feedback)
    expect(input.props().status).toBe('error')
  })

  it('emits updates from the input', async () => {
    const wrapper = mount(EmailInput, {
      props: {
        modelValue: '',
        validationResult: validateEmail(''),
      },
    })

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', 'hello@example.com')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([['hello@example.com']])
  })
})
