import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EmailValidatorView from './EmailValidatorView.vue'

const storageKey = 'tools:email-validator:email'

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  EmailInput: {
    name: 'EmailInput',
    props: ['modelValue', 'validationResult'],
    emits: ['update:modelValue'],
    template: '<div class="email-input" />',
  },
  EmailResult: {
    props: ['validationResult'],
    template: '<div class="email-result" />',
  },
  WhatIsEmailValidator: {
    template: '<div class="email-what-is" />',
  },
}

describe('EmailValidatorView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the result when storage has a value', () => {
    localStorage.setItem(storageKey, 'hello@example.com')
    const wrapper = mount(EmailValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.email-input').exists()).toBe(true)
    expect(wrapper.find('.email-result').exists()).toBe(true)
    expect(wrapper.find('.email-what-is').exists()).toBe(true)
  })

  it('hides the result when the input is empty', () => {
    localStorage.setItem(storageKey, '')
    const wrapper = mount(EmailValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.email-input').exists()).toBe(true)
    expect(wrapper.find('.email-result').exists()).toBe(false)
  })

  it('updates storage when the input emits a change', async () => {
    localStorage.setItem(storageKey, 'hello@example.com')
    const wrapper = mount(EmailValidatorView, {
      global: {
        stubs,
      },
    })

    const input = wrapper.findComponent({ name: 'EmailInput' })
    input.vm.$emit('update:modelValue', 'next@example.com')
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem(storageKey)).toBe('next@example.com')
  })
})
