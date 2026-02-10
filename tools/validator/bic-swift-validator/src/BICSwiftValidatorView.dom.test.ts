import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BICSwiftValidatorView from './BICSwiftValidatorView.vue'

const storageKey = 'tools:bic-swift-validator:bic'

const stubs = {
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  BICSwiftInput: {
    props: ['modelValue', 'validationResult'],
    emits: ['update:modelValue'],
    template:
      '<div class="bic-input" :data-value="modelValue" :data-valid="validationResult?.isValid"><button class="emit-empty" @click="$emit(\'update:modelValue\', \'\')" /><button class="emit-valid" @click="$emit(\'update:modelValue\', \'DEUTDEFF500\')" /></div>',
  },
  BICSwiftResult: {
    props: ['validationResult'],
    template: '<div class="bic-result" />',
  },
  WhatIsBICSwiftValidator: {
    template: '<div class="bic-what-is" />',
  },
}

describe('BICSwiftValidatorView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the result when storage has a value', () => {
    localStorage.setItem(storageKey, 'DEUTDEFF')
    const wrapper = mount(BICSwiftValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.bic-input').exists()).toBe(true)
    expect(wrapper.find('.bic-result').exists()).toBe(true)
    expect(wrapper.find('.bic-what-is').exists()).toBe(true)
  })

  it('hides the result when the input is empty', () => {
    localStorage.setItem(storageKey, '')
    const wrapper = mount(BICSwiftValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.bic-input').exists()).toBe(true)
    expect(wrapper.find('.bic-result').exists()).toBe(false)
  })

  it('updates the view when BICSwiftInput emits v-model changes', async () => {
    localStorage.setItem(storageKey, 'DEUTDEFF')
    const wrapper = mount(BICSwiftValidatorView, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.bic-result').exists()).toBe(true)
    expect(wrapper.find('.bic-input').attributes('data-valid')).toBe('true')

    await wrapper.find('.emit-empty').trigger('click')
    await nextTick()

    expect(wrapper.find('.bic-result').exists()).toBe(false)
    expect(wrapper.find('.bic-input').attributes('data-valid')).toBe('false')

    await wrapper.find('.emit-valid').trigger('click')
    await nextTick()

    expect(wrapper.find('.bic-result').exists()).toBe(true)
    expect(wrapper.find('.bic-input').attributes('data-value')).toBe('DEUTDEFF500')
  })
})
