import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CreditCardInput from './CreditCardInput.vue'
import type { ValidationResult } from '../data/cardBrands'

const BrandIconStub = defineComponent({
  name: 'BrandIcon',
  template: '<svg class="brand-icon" />',
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      label: {
        type: String,
        default: '',
      },
      feedback: {
        type: String,
        default: undefined,
      },
      validationStatus: {
        type: String,
        default: undefined,
      },
    },
    template: '<div class="n-form-item"><slot /></div>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        default: undefined,
      },
      size: {
        type: String,
        default: 'medium',
      },
    },
    emits: ['update:value'],
    setup(_props, { slots }) {
      return () =>
        h('div', { class: 'n-input' }, [h('input', { class: 'n-input-control' }), slots.prefix?.()])
    },
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    props: {
      component: {
        type: Object,
        default: () => ({}),
      },
      size: {
        type: Number,
        default: 16,
      },
    },
    template: '<span class="n-icon" />',
  })

  return {
    NFormItem,
    NInput,
    NIcon,
  }
})

const createResult = (overrides: Partial<ValidationResult> = {}): ValidationResult => ({
  isValid: false,
  brand: null,
  formattedNumber: '',
  isLuhnValid: false,
  isLengthValid: false,
  digits: '',
  ...overrides,
})

describe('CreditCardInput', () => {
  it('renders placeholder and omits feedback for empty input', () => {
    const wrapper = mount(CreditCardInput, {
      props: {
        modelValue: '',
        validationResult: createResult(),
      },
    })

    const formItem = wrapper.findComponent({ name: 'NFormItem' })
    const input = wrapper.findComponent({ name: 'NInput' })

    expect(formItem.props('label')).toBe('Credit Card Number')
    expect(formItem.props('feedback')).toBeUndefined()
    expect(formItem.props('validationStatus')).toBeUndefined()
    expect(input.props('placeholder')).toBe('Enter credit card number')
    expect(input.props('status')).toBeUndefined()
  })

  it('emits updates and shows success feedback for valid cards', async () => {
    const brand = {
      id: 'visa',
      name: 'Visa',
      patterns: ['4'],
      lengths: [16],
      icon: BrandIconStub,
      cvcLength: 3,
      formatPattern: [4, 4, 4, 4],
    }

    const wrapper = mount(CreditCardInput, {
      props: {
        modelValue: '4111111111111111',
        validationResult: createResult({
          isValid: true,
          isLuhnValid: true,
          isLengthValid: true,
          brand,
          digits: '4111111111111111',
        }),
      },
    })

    const formItem = wrapper.findComponent({ name: 'NFormItem' })
    const input = wrapper.findComponent({ name: 'NInput' })

    expect(formItem.props('feedback')).toBe('Valid card number')
    expect(formItem.props('validationStatus')).toBe('success')
    expect(input.props('status')).toBe('success')
    const icon = wrapper.findComponent({ name: 'NIcon' })
    expect(icon.props('component')?.name).toBe('BrandIcon')

    input.vm.$emit('update:value', '4242')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['4242'])
  })

  it('shows the Luhn error message when the checksum fails', () => {
    const wrapper = mount(CreditCardInput, {
      props: {
        modelValue: '4111111111111112',
        validationResult: createResult({
          isValid: false,
          isLuhnValid: false,
          isLengthValid: true,
          digits: '4111111111111112',
        }),
      },
    })

    const formItem = wrapper.findComponent({ name: 'NFormItem' })
    const input = wrapper.findComponent({ name: 'NInput' })

    expect(formItem.props('feedback')).toBe('Invalid checksum (Luhn algorithm failed)')
    expect(formItem.props('validationStatus')).toBe('error')
    expect(input.props('status')).toBe('error')
  })

  it('shows the length error when the card length is invalid', () => {
    const wrapper = mount(CreditCardInput, {
      props: {
        modelValue: '4111',
        validationResult: createResult({
          isValid: false,
          isLuhnValid: true,
          isLengthValid: false,
          digits: '4111',
        }),
      },
    })

    const formItem = wrapper.findComponent({ name: 'NFormItem' })
    expect(formItem.props('feedback')).toBe('Invalid card number length')
  })

  it('falls back to the generic invalid message for inconsistent data', () => {
    const wrapper = mount(CreditCardInput, {
      props: {
        modelValue: '4111111111111111',
        validationResult: createResult({
          isValid: false,
          isLuhnValid: true,
          isLengthValid: true,
          digits: '4111111111111111',
        }),
      },
    })

    const formItem = wrapper.findComponent({ name: 'NFormItem' })
    expect(formItem.props('feedback')).toBe('Invalid card number')
  })
})
