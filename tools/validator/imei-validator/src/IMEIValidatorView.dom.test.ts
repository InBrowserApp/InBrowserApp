import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IMEIValidatorView from './IMEIValidatorView.vue'

const storageKey = 'tools:imei-validator:imei'

const stubs = {
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  IMEIInput: {
    name: 'IMEIInput',
    props: ['modelValue', 'validationResult'],
    emits: ['update:modelValue'],
    template: '<div class="imei-input" />',
  },
  IMEIResult: {
    name: 'IMEIResult',
    props: ['validationResult'],
    template: '<div class="imei-result" />',
  },
  WhatIsIMEIValidator: {
    name: 'WhatIsIMEIValidator',
    template: '<div class="imei-what-is" />',
  },
}

describe('IMEIValidatorView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders input and result when storage has a value', () => {
    localStorage.setItem(storageKey, '490154203237518')

    const wrapper = mount(IMEIValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.imei-input').exists()).toBe(true)
    expect(wrapper.find('.imei-result').exists()).toBe(true)
    expect(wrapper.find('.imei-what-is').exists()).toBe(true)
  })

  it('hides result when input is empty', () => {
    localStorage.setItem(storageKey, '')

    const wrapper = mount(IMEIValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.imei-input').exists()).toBe(true)
    expect(wrapper.find('.imei-result').exists()).toBe(false)
    expect(wrapper.find('.imei-what-is').exists()).toBe(true)
  })

  it('updates storage when input emits a new value', async () => {
    localStorage.setItem(storageKey, '490154203237518')

    const wrapper = mount(IMEIValidatorView, {
      global: {
        stubs,
      },
    })

    wrapper.findComponent({ name: 'IMEIInput' }).vm.$emit('update:modelValue', '490154203237519')
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem(storageKey)).toBe('490154203237519')
  })
})
