import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItem, NInput } from 'naive-ui'
import VATInput from './VATInput.vue'
import { validateVAT } from '../data/vat'

const baseValidResult = validateVAT('BE0123456749')

describe('VATInput', () => {
  it('shows no status or feedback when empty', () => {
    const wrapper = mount(VATInput, {
      props: {
        modelValue: '',
        validationResult: validateVAT(''),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBeUndefined()
    expect(formItem.props().feedback).toBeUndefined()
    expect(input.props().status).toBeUndefined()
  })

  it('shows country code error when invalid', () => {
    const wrapper = mount(VATInput, {
      props: {
        modelValue: '1A123',
        validationResult: validateVAT('1A123'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Invalid country code')
    expect(input.props().status).toBe('error')
  })

  it('shows unsupported country message', () => {
    const wrapper = mount(VATInput, {
      props: {
        modelValue: 'US123456789',
        validationResult: validateVAT('US123456789'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().feedback).toBe('Country not supported')
    expect(formItem.props().validationStatus).toBe('error')
    expect(input.props().status).toBe('error')
  })

  it('shows format error for supported countries', () => {
    const wrapper = mount(VATInput, {
      props: {
        modelValue: 'BE123',
        validationResult: validateVAT('BE123'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().feedback).toBe('Invalid VAT format')
    expect(formItem.props().validationStatus).toBe('error')
    expect(input.props().status).toBe('error')
  })

  it('shows checksum error when checksum is invalid', () => {
    const wrapper = mount(VATInput, {
      props: {
        modelValue: 'BE0123456748',
        validationResult: validateVAT('BE0123456748'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().feedback).toBe('Invalid checksum')
    expect(formItem.props().validationStatus).toBe('error')
    expect(input.props().status).toBe('error')
  })

  it('shows success when VAT number is valid', () => {
    const wrapper = mount(VATInput, {
      props: {
        modelValue: 'BE0123456749',
        validationResult: validateVAT('BE0123456749'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('success')
    expect(formItem.props().feedback).toBe('Valid VAT number')
    expect(input.props().status).toBe('success')
  })

  it('falls back to invalid message', () => {
    const wrapper = mount(VATInput, {
      props: {
        modelValue: 'BE0123456749',
        validationResult: { ...baseValidResult, isValid: false },
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().feedback).toBe('Invalid VAT number')
    expect(formItem.props().validationStatus).toBe('error')
    expect(input.props().status).toBe('error')
  })

  it('emits updates from the input', async () => {
    const wrapper = mount(VATInput, {
      props: {
        modelValue: '',
        validationResult: validateVAT(''),
      },
    })

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', 'BE0123456749')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([['BE0123456749']])
  })
})
