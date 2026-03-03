import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { IMEIValidationResult } from '../data/imei'
import IMEIInput from './IMEIInput.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NFormItem: defineComponent({
      name: 'NFormItem',
      props: ['label', 'feedback', 'validationStatus'],
      template:
        '<div class="n-form-item" :data-feedback="feedback" :data-validation-status="validationStatus"><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value', 'placeholder', 'status', 'size'],
      emits: ['update:value'],
      template:
        '<div class="n-input" :data-status="status" :data-placeholder="placeholder"><slot /><slot name="prefix" /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      props: ['component', 'size'],
      template: '<i class="n-icon" />',
    }),
  }
})

function makeResult(overrides: Partial<IMEIValidationResult> = {}): IMEIValidationResult {
  return {
    input: '',
    normalized: '',
    length: 0,
    tac: null,
    serialNumber: null,
    checkDigit: null,
    expectedCheckDigit: null,
    isLengthValid: false,
    isFormatValid: false,
    isChecksumValid: false,
    isValid: false,
    reason: 'empty',
    ...overrides,
  }
}

function mountInput(modelValue: string, validationResult: IMEIValidationResult) {
  return mount(IMEIInput, {
    props: {
      modelValue,
      validationResult,
    },
  })
}

describe('IMEIInput', () => {
  it('has no validation state for empty model value', () => {
    const wrapper = mountInput('', makeResult())
    const formItem = wrapper.find('.n-form-item')
    const input = wrapper.find('.n-input')

    expect(formItem.attributes('data-feedback')).toBeUndefined()
    expect(formItem.attributes('data-validation-status')).toBeUndefined()
    expect(input.attributes('data-status')).toBeUndefined()
  })

  it('shows valid feedback for valid imei', () => {
    const wrapper = mountInput(
      '490154203237518',
      makeResult({
        isValid: true,
        reason: 'valid',
      }),
    )

    const formItem = wrapper.find('.n-form-item')
    const input = wrapper.find('.n-input')

    expect(formItem.attributes('data-feedback')).toBe('Valid IMEI')
    expect(formItem.attributes('data-validation-status')).toBe('success')
    expect(input.attributes('data-status')).toBe('success')
  })

  it('shows invalid length feedback', () => {
    const wrapper = mountInput('49015420323751', makeResult({ reason: 'invalid-length' }))
    const formItem = wrapper.find('.n-form-item')

    expect(formItem.attributes('data-feedback')).toBe('IMEI must be exactly 15 digits')
    expect(formItem.attributes('data-validation-status')).toBe('error')
  })

  it('shows invalid format feedback', () => {
    const wrapper = mountInput('49015420323751A', makeResult({ reason: 'invalid-format' }))
    const formItem = wrapper.find('.n-form-item')

    expect(formItem.attributes('data-feedback')).toBe('IMEI must contain digits only')
    expect(formItem.attributes('data-validation-status')).toBe('error')
  })

  it('shows invalid checksum feedback', () => {
    const wrapper = mountInput('490154203237519', makeResult({ reason: 'invalid-checksum' }))
    const formItem = wrapper.find('.n-form-item')

    expect(formItem.attributes('data-feedback')).toBe('Invalid checksum digit')
    expect(formItem.attributes('data-validation-status')).toBe('error')
  })

  it('falls back to generic invalid feedback for unmatched reasons', () => {
    const wrapper = mountInput('---', makeResult({ reason: 'empty' }))
    const formItem = wrapper.find('.n-form-item')

    expect(formItem.attributes('data-feedback')).toBe('Invalid IMEI')
    expect(formItem.attributes('data-validation-status')).toBe('error')
  })

  it('emits model updates from the input event', async () => {
    const wrapper = mountInput('490154203237518', makeResult({ reason: 'valid', isValid: true }))

    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', '490154203237519')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([['490154203237519']])
  })
})
