import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CreditCardValidatorView from './CreditCardValidatorView.vue'

const { storageState } = vi.hoisted(() => ({
  storageState: {
    current: '' as string,
  },
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')
  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(storageState.current ?? initialValue),
  }
})

const CreditCardInputStub = defineComponent({
  name: 'CreditCardInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    validationResult: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div class="credit-card-input" :data-value="modelValue" />',
})

const CreditCardResultStub = defineComponent({
  name: 'CreditCardResult',
  props: {
    validationResult: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div class="credit-card-result" />',
})

describe('CreditCardValidatorView', () => {
  it('hides the result when the input is empty', () => {
    storageState.current = ''

    const wrapper = mount(CreditCardValidatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          CreditCardInput: CreditCardInputStub,
          CreditCardResult: CreditCardResultStub,
          WhatIsCreditCardValidator: {
            template: '<div class="what-is-credit-card" />',
          },
        },
      },
    })

    expect(wrapper.find('.credit-card-input').attributes('data-value')).toBe('')
    expect(wrapper.find('.credit-card-result').exists()).toBe(false)
    expect(wrapper.find('.what-is-credit-card').exists()).toBe(true)
  })

  it('shows the result when the input has digits', () => {
    storageState.current = '4111'

    const wrapper = mount(CreditCardValidatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          CreditCardInput: CreditCardInputStub,
          CreditCardResult: CreditCardResultStub,
          WhatIsCreditCardValidator: {
            template: '<div class="what-is-credit-card" />',
          },
        },
      },
    })

    expect(wrapper.find('.credit-card-input').attributes('data-value')).toBe('4111')
    expect(wrapper.find('.credit-card-result').exists()).toBe(true)
  })

  it('updates the stored card number from child input events', async () => {
    storageState.current = ''

    const wrapper = mount(CreditCardValidatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          CreditCardInput: CreditCardInputStub,
          CreditCardResult: CreditCardResultStub,
          WhatIsCreditCardValidator: {
            template: '<div class="what-is-credit-card" />',
          },
        },
      },
    })

    const input = wrapper.findComponent(CreditCardInputStub)
    await input.vm.$emit('update:modelValue', '4111111111111111')
    await nextTick()

    expect(wrapper.find('.credit-card-input').attributes('data-value')).toBe('4111111111111111')
    expect(wrapper.find('.credit-card-result').exists()).toBe(true)
  })
})
