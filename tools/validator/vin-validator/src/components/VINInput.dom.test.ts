import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItem, NInput } from 'naive-ui'
import VINInput from './VINInput.vue'
import { validateVIN } from '../data/vin'

describe('VINInput', () => {
  it('shows no status or feedback when empty', () => {
    const wrapper = mount(VINInput, {
      props: {
        modelValue: '',
        validationResult: validateVIN(''),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBeUndefined()
    expect(formItem.props().feedback).toBeUndefined()
    expect(input.props().status).toBeUndefined()
  })

  it('shows success when valid', () => {
    const wrapper = mount(VINInput, {
      props: {
        modelValue: '1M8GDM9AXKP042788',
        validationResult: validateVIN('1M8GDM9AXKP042788'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('success')
    expect(formItem.props().feedback).toBe('Valid VIN')
    expect(input.props().status).toBe('success')
  })

  it('shows length errors', () => {
    const wrapper = mount(VINInput, {
      props: {
        modelValue: '123',
        validationResult: validateVIN('123'),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('VIN must be 17 characters.')
    expect(input.props().status).toBe('error')
  })

  it('shows character errors', () => {
    const value = '1IOGDM9AXKP042788'
    const wrapper = mount(VINInput, {
      props: {
        modelValue: value,
        validationResult: validateVIN(value),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe(
      'VIN can only use letters A-H, J-N, P, R-Z and digits 0-9.',
    )
    expect(input.props().status).toBe('error')
  })

  it('falls back to a generic error message', () => {
    const baseResult = validateVIN('1M8GDM9AXKP042788')
    const wrapper = mount(VINInput, {
      props: {
        modelValue: '1M8GDM9AXKP042788',
        validationResult: { ...baseResult, isValid: false },
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Invalid VIN')
    expect(input.props().status).toBe('error')
  })

  it('shows checksum errors', () => {
    const value = '1M8GDM9A1KP042788'
    const wrapper = mount(VINInput, {
      props: {
        modelValue: value,
        validationResult: validateVIN(value),
      },
    })

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Check digit does not match.')
    expect(input.props().status).toBe('error')
  })

  it('emits updates from the input', async () => {
    const wrapper = mount(VINInput, {
      props: {
        modelValue: '',
        validationResult: validateVIN(''),
      },
    })

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', '1M8GDM9AXKP042788')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([['1M8GDM9AXKP042788']])
  })
})
