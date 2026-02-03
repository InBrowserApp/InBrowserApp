import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@vicons/fluent/TextNumberFormat20Regular', () => ({
  default: {},
}))

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
        '<input :value="value" :placeholder="placeholder" :data-status="status" @input="$emit(\'update:value\', $event.target.value)" />',
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
    expect(form.attributes('data-feedback')).toBe('invalidCountry')
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
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
    expect(form.attributes('data-feedback')).toBe('invalidChecksum')
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
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
    expect(form.attributes('data-feedback')).toBe('valid')
    expect(form.attributes('data-status')).toBe('success')

    await wrapper.get('input').setValue('DE89')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['DE89'])
  })
})
