import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./data/residentId', async () => {
  const actual = await vi.importActual<typeof import('./data/residentId')>('./data/residentId')

  return {
    ...actual,
    generateRandomResidentId: vi.fn(() => '11010519491231002X'),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
}))

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')

  return {
    useStorage: (key: string, initialValue: string) => {
      const stored = localStorage.getItem(key)
      const value = ref(stored ?? initialValue)

      if (stored === null) {
        localStorage.setItem(key, String(value.value))
      }

      return value
    },
  }
})

vi.mock('./components/ResidentIdInput.vue', () => ({
  default: {
    props: ['modelValue', 'validationResult'],
    emits: ['update:modelValue'],
    template: '<div class="resident-input" :data-value="modelValue" />',
  },
}))

vi.mock('./components/ResidentIdResult.vue', () => ({
  default: {
    props: ['validationResult'],
    template: '<div class="resident-result" />',
  },
}))

vi.mock('./components/WhatIsPRCResidentIdValidator.vue', () => ({
  default: {
    template: '<div class="resident-what-is" />',
  },
}))

import { mount } from '@vue/test-utils'
import PRCResidentIDValidatorView from './PRCResidentIDValidatorView.vue'

const storageKey = 'tools:prc-id-validator:resident-id'

describe('PRCResidentIDValidatorView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses a generated default when storage is empty', () => {
    const wrapper = mount(PRCResidentIDValidatorView)

    expect(wrapper.find('.resident-input').attributes('data-value')).toBe('11010519491231002X')
    expect(wrapper.find('.resident-result').exists()).toBe(true)
    expect(wrapper.find('.resident-what-is').exists()).toBe(true)
  })

  it('keeps stored value when storage has data', () => {
    localStorage.setItem(storageKey, '110105199001010020')
    const wrapper = mount(PRCResidentIDValidatorView)

    expect(wrapper.find('.resident-input').attributes('data-value')).toBe('110105199001010020')
  })
})
