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
      props: ['value', 'placeholder', 'status', 'size'],
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

import ISBNInput from './ISBNInput.vue'

const baseResult = {
  input: '',
  normalized: '',
  length: 0,
  type: 'unknown' as const,
  isValid: false,
  isLengthValid: false,
  isFormatValid: false,
  isChecksumValid: false,
  expectedCheckDigit: null,
  actualCheckDigit: null,
  isbn10: null,
  isbn13: null,
  prefix: null,
}

describe('ISBNInput', () => {
  it('shows no status or feedback when input is empty', () => {
    const wrapper = mount(ISBNInput, {
      props: {
        modelValue: '',
        validationResult: baseResult,
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-status')).toBeUndefined()
    expect(form.attributes('data-feedback')).toBeUndefined()
    expect(wrapper.get('input').attributes('data-status')).toBeUndefined()
    expect(wrapper.find('.icon').exists()).toBe(true)
  })

  it('reports invalid length feedback', () => {
    const wrapper = mount(ISBNInput, {
      props: {
        modelValue: '123',
        validationResult: {
          ...baseResult,
          isLengthValid: false,
          isValid: false,
        },
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-feedback')).toBe('ISBN must be 10 or 13 digits')
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
  })

  it('reports invalid format feedback', () => {
    const wrapper = mount(ISBNInput, {
      props: {
        modelValue: '1234567890',
        validationResult: {
          ...baseResult,
          isLengthValid: true,
          isFormatValid: false,
          isValid: false,
        },
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-feedback')).toBe('Invalid ISBN format')
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
  })

  it('reports invalid checksum feedback', () => {
    const wrapper = mount(ISBNInput, {
      props: {
        modelValue: '0306406153',
        validationResult: {
          ...baseResult,
          isLengthValid: true,
          isFormatValid: true,
          isChecksumValid: false,
          isValid: false,
        },
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-feedback')).toBe('Invalid checksum')
    expect(wrapper.get('input').attributes('data-status')).toBe('error')
  })

  it('falls back to a generic invalid message for inconsistent invalid states', () => {
    const wrapper = mount(ISBNInput, {
      props: {
        modelValue: '0306406152',
        validationResult: {
          ...baseResult,
          isLengthValid: true,
          isFormatValid: true,
          isChecksumValid: true,
          isValid: false,
        },
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-feedback')).toBe('Invalid ISBN')
    expect(form.attributes('data-status')).toBe('error')
  })

  it('marks valid inputs as success and emits updates', async () => {
    const wrapper = mount(ISBNInput, {
      props: {
        modelValue: '0306406152',
        validationResult: {
          ...baseResult,
          isLengthValid: true,
          isFormatValid: true,
          isChecksumValid: true,
          isValid: true,
        },
      },
    })

    const form = wrapper.get('.form-item')
    expect(form.attributes('data-feedback')).toBe('Valid ISBN')
    expect(form.attributes('data-status')).toBe('success')

    await wrapper.get('input').setValue('9780306406157')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['9780306406157'])
  })
})
