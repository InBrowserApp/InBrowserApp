import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFormItem: defineComponent({
      name: 'NFormItem',
      props: ['label', 'feedback', 'validationStatus'],
      template:
        '<div class="form-item" :data-label="label" :data-feedback="feedback" :data-status="validationStatus"><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value', 'placeholder', 'status'],
      emits: ['update:value'],
      template:
        '<div><slot name="prefix" /><input :value="value" :placeholder="placeholder" :data-status="status" @input="$emit(\'update:value\', $event.target.value)" /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      props: ['component', 'size'],
      template: '<span class="icon" />',
    }),
  }
})

import IBANInput from './IBANInput.vue'

const baseResult = {
  input: '',
  normalized: '',
  formatted: '',
  countryCode: null,
  expectedLength: null,
  length: 0,
  checkDigits: null,
  expectedCheckDigits: null,
  bban: null,
  isCountryValid: false,
  isLengthValid: false,
  isFormatValid: false,
  isStructureValid: false,
  isChecksumValid: false,
  isValid: false,
}

describe('IBANInput', () => {
  it('shows no status or feedback when input is empty', () => {
    const wrapper = mount(IBANInput, {
      props: {
        modelValue: '',
        validationResult: baseResult,
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-status')).toBeUndefined()
    expect(form.attributes('data-feedback')).toBeUndefined()
    expect(wrapper.get('input').attributes('data-status')).toBeUndefined()

    const icon = wrapper.findComponent({ name: 'NIcon' })
    expect(icon.props('size')).toBe(24)
    expect(icon.props('component')).toBeTypeOf('object')
  })

  it('reports invalid country feedback', () => {
    const wrapper = mount(IBANInput, {
      props: {
        modelValue: 'XX',
        validationResult: {
          ...baseResult,
          isCountryValid: false,
          isValid: false,
        },
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-feedback')).toBe('Unknown country code')
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
  })

  it('reports invalid length feedback', () => {
    const wrapper = mount(IBANInput, {
      props: {
        modelValue: 'GB29',
        validationResult: {
          ...baseResult,
          isCountryValid: true,
          isLengthValid: false,
          isValid: false,
        },
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe('Invalid IBAN length')
  })

  it('reports invalid format feedback', () => {
    const wrapper = mount(IBANInput, {
      props: {
        modelValue: 'GB29',
        validationResult: {
          ...baseResult,
          isCountryValid: true,
          isLengthValid: true,
          isFormatValid: false,
          isStructureValid: true,
          isValid: false,
        },
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe('Invalid IBAN format')
  })

  it('reports invalid checksum feedback', () => {
    const wrapper = mount(IBANInput, {
      props: {
        modelValue: 'GB29',
        validationResult: {
          ...baseResult,
          isCountryValid: true,
          isLengthValid: true,
          isFormatValid: true,
          isStructureValid: true,
          isChecksumValid: false,
          isValid: false,
        },
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-feedback')).toBe('Invalid checksum')
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
  })

  it('uses fallback invalid feedback when checks are inconsistent', () => {
    const wrapper = mount(IBANInput, {
      props: {
        modelValue: 'GB29',
        validationResult: {
          ...baseResult,
          isCountryValid: true,
          isLengthValid: true,
          isFormatValid: true,
          isStructureValid: true,
          isChecksumValid: true,
          isValid: false,
        },
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe('Invalid IBAN')
  })

  it('marks valid inputs as success', async () => {
    const wrapper = mount(IBANInput, {
      props: {
        modelValue: 'GB29',
        validationResult: {
          ...baseResult,
          isValid: true,
        },
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-feedback')).toBe('Valid IBAN')
    expect(form.attributes('data-status')).toBe('success')

    await wrapper.get('input').setValue('DE89')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['DE89'])
  })
})
