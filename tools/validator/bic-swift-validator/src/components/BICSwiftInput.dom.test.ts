import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItem, NInput } from 'naive-ui'
import BICSwiftInput from './BICSwiftInput.vue'
import { validateBIC } from '../data/bic'

const baseValidResult = validateBIC('DEUTDEFF')

describe('BICSwiftInput', () => {
  it('shows no status or feedback when empty', () => {
    const wrapper = mount(BICSwiftInput, {
      props: {
        modelValue: '',
        validationResult: validateBIC(''),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBeUndefined()
    expect(formItem.props().feedback).toBeUndefined()
    expect(input.props().status).toBeUndefined()
  })

  it('shows length error when input is too short', () => {
    const wrapper = mount(BICSwiftInput, {
      props: {
        modelValue: 'DEUT',
        validationResult: validateBIC('DEUT'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('BIC must be 8 or 11 characters')
    expect(input.props().status).toBe('error')
  })

  it('shows success when input is valid', () => {
    const wrapper = mount(BICSwiftInput, {
      props: {
        modelValue: 'DEUTDEFF',
        validationResult: validateBIC('DEUTDEFF'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('success')
    expect(formItem.props().feedback).toBe('Valid BIC / SWIFT code')
    expect(input.props().status).toBe('success')
  })

  it.each([
    {
      label: 'country',
      value: 'DEUTXXFF',
      result: validateBIC('DEUTXXFF'),
      feedback: 'Unknown country code',
    },
    {
      label: 'bank',
      value: 'DEU1DEFF',
      result: validateBIC('DEU1DEFF'),
      feedback: 'Invalid bank code',
    },
    {
      label: 'location',
      value: 'DEUTDE_F',
      result: validateBIC('DEUTDE_F'),
      feedback: 'Invalid location code',
    },
    {
      label: 'branch',
      value: 'DEUTDEFF0_0',
      result: validateBIC('DEUTDEFF0_0'),
      feedback: 'Invalid branch code',
    },
    {
      label: 'format',
      value: 'DEUTDEFF',
      result: { ...baseValidResult, isValid: false, isFormatValid: false },
      feedback: 'Invalid BIC format',
    },
    {
      label: 'fallback',
      value: 'DEUTDEFF',
      result: { ...baseValidResult, isValid: false },
      feedback: 'Invalid BIC / SWIFT code',
    },
  ])('shows $label error message', ({ value, result, feedback }) => {
    const wrapper = mount(BICSwiftInput, {
      props: {
        modelValue: value,
        validationResult: result,
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe(feedback)
    expect(input.props().status).toBe('error')
  })

  it('emits updates from the input', async () => {
    const wrapper = mount(BICSwiftInput, {
      props: {
        modelValue: '',
        validationResult: validateBIC(''),
      },
    })

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', 'DEUTDEFF')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([['DEUTDEFF']])
  })
})
