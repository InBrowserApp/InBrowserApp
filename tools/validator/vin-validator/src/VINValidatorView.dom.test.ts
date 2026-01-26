import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VINValidatorView from './VINValidatorView.vue'

const storageKey = 'tools:vin-validator:vin'

const VINInputStub = {
  name: 'VINInput',
  props: ['modelValue', 'validationResult'],
  emits: ['update:modelValue'],
  template: '<div class="vin-input" />',
}

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  VINInput: VINInputStub,
  VINResult: {
    props: ['validationResult'],
    template: '<div class="vin-result" />',
  },
  WhatIsVINValidator: {
    template: '<div class="vin-what-is" />',
  },
}

describe('VINValidatorView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the result when storage has a value', () => {
    localStorage.setItem(storageKey, '1M8GDM9AXKP042788')
    const wrapper = mount(VINValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.vin-input').exists()).toBe(true)
    expect(wrapper.find('.vin-result').exists()).toBe(true)
    expect(wrapper.find('.vin-what-is').exists()).toBe(true)
  })

  it('hides the result when the input is empty', () => {
    localStorage.setItem(storageKey, '')
    const wrapper = mount(VINValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.vin-input').exists()).toBe(true)
    expect(wrapper.find('.vin-result').exists()).toBe(false)
  })

  it('updates storage when the input emits updates', async () => {
    localStorage.setItem(storageKey, '1M8GDM9AXKP042788')
    const wrapper = mount(VINValidatorView, {
      global: {
        stubs,
      },
    })

    const input = wrapper.findComponent({ name: 'VINInput' })
    input.vm.$emit('update:modelValue', '1HGCM82633A004352')
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem(storageKey)).toBe('1HGCM82633A004352')
  })
})
