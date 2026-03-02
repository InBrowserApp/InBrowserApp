import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { getResidentIdCheckDigit, validateResidentId } from '../data/residentId'
import ResidentIdInput from './ResidentIdInput.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

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
    template:
      '<div class="form-item" :data-label="label" :data-feedback="feedback" :data-status="validationStatus"><slot /></div>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        default: undefined,
      },
      placeholder: {
        type: String,
        default: '',
      },
      size: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<div class="input" :data-value="value" :data-status="status" :data-placeholder="placeholder"><slot name="prefix" /><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="icon" />',
  })

  return { NFormItem, NInput, NIcon }
})

describe('ResidentIdInput', () => {
  it('renders empty state without validation status', () => {
    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: '',
        validationResult: validateResidentId(''),
      },
    })

    const formItem = wrapper.get('.form-item')
    const input = wrapper.get('.input')

    expect(formItem.attributes('data-feedback')).toBeUndefined()
    expect(formItem.attributes('data-status')).toBeUndefined()
    expect(input.attributes('data-status')).toBeUndefined()
    expect(wrapper.find('.icon').exists()).toBe(true)
  })

  it('marks valid input as success', () => {
    const validationResult = validateResidentId('11010519491231002X')
    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: '11010519491231002X',
        validationResult,
      },
    })

    const formItem = wrapper.get('.form-item')
    const input = wrapper.get('.input')

    expect(formItem.attributes('data-feedback')).toBe('Valid ID number')
    expect(formItem.attributes('data-status')).toBe('success')
    expect(input.attributes('data-status')).toBe('success')
  })

  it('shows invalid length feedback', () => {
    const validationResult = validateResidentId('11010519491231002')
    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: '11010519491231002',
        validationResult,
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe(
      'ID number must be 18 digits',
    )
  })

  it('shows invalid format feedback', () => {
    const value = '11010519491231A02X'
    const validationResult = validateResidentId(value)
    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: value,
        validationResult,
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe(
      'Invalid format (digits or X)',
    )
  })

  it('shows invalid region feedback', () => {
    const core = '99000019900101003'
    const checkDigit = getResidentIdCheckDigit(core) ?? '0'
    const value = `${core}${checkDigit}`
    const validationResult = validateResidentId(value)
    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: value,
        validationResult,
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe(
      'Unknown administrative region code',
    )
  })

  it('shows invalid birthdate feedback', () => {
    const core = '11010519991301002'
    const checkDigit = getResidentIdCheckDigit(core) ?? '0'
    const value = `${core}${checkDigit}`
    const validationResult = validateResidentId(value)
    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: value,
        validationResult,
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe('Invalid birthdate')
  })

  it('shows invalid checksum feedback', () => {
    const value = '110105194912310020'
    const validationResult = validateResidentId(value)
    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: value,
        validationResult,
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe('Invalid checksum')
  })

  it('falls back to generic invalid feedback when detailed flags do not match', () => {
    const validationResult = {
      ...validateResidentId('11010519491231002X'),
      isValid: false,
      isLengthValid: true,
      isFormatValid: true,
      isRegionValid: true,
      isBirthdateValid: true,
      isChecksumValid: true,
    }

    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: '11010519491231002X',
        validationResult,
      },
    })

    expect(wrapper.get('.form-item').attributes('data-feedback')).toBe('Invalid ID number')
    expect(wrapper.get('.form-item').attributes('data-status')).toBe('error')
  })

  it('emits updates from input events', async () => {
    const wrapper = mount(ResidentIdInput, {
      props: {
        modelValue: '11010519491231002X',
        validationResult: validateResidentId('11010519491231002X'),
      },
    })

    await wrapper.getComponent({ name: 'NInput' }).vm.$emit('update:value', '110105199001010020')

    expect(wrapper.emitted('update:modelValue')).toEqual([['110105199001010020']])
  })
})
