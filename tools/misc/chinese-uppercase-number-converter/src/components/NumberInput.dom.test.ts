import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItem, NInput } from 'naive-ui'
import NumberInput from './NumberInput.vue'

const stubs = {
  CopyToClipboardButton: {
    template: '<button class="copy" />',
  },
}

const mountNumberInput = (value: string) =>
  mount(NumberInput, {
    props: {
      value,
    },
    global: {
      stubs,
    },
  })

describe('NumberInput', () => {
  it('shows no status when empty', () => {
    const wrapper = mountNumberInput('')

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBeUndefined()
    expect(formItem.props().feedback).toBeUndefined()
    expect(input.props().status).toBeUndefined()
  })

  it('syncs when props change', async () => {
    const wrapper = mountNumberInput('1')

    await wrapper.setProps({ value: '2' })

    const input = wrapper.findComponent(NInput)
    expect(input.props().value).toBe('2')
  })

  it('shows success when valid', () => {
    const wrapper = mountNumberInput('123')

    const formItem = wrapper.findComponent(NFormItem)

    expect(formItem.props().validationStatus).toBe('success')
    expect(formItem.props().feedback).toBe('Valid number')
  })

  it('shows invalid format errors', () => {
    const wrapper = mountNumberInput('12.3.4')

    const formItem = wrapper.findComponent(NFormItem)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Only digits and one decimal point are allowed.')
  })

  it('shows decimal errors', () => {
    const wrapper = mountNumberInput('1.234')

    const formItem = wrapper.findComponent(NFormItem)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Use up to 2 decimal places.')
  })

  it('shows range errors', () => {
    const wrapper = mountNumberInput('1000000000000000')

    const formItem = wrapper.findComponent(NFormItem)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Value exceeds the maximum range.')
  })

  it('does not emit updates for invalid non-empty input', async () => {
    const wrapper = mountNumberInput('10')

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', '12.3.4')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:value')).toBeUndefined()
  })

  it('emits updates when valid', async () => {
    const wrapper = mountNumberInput('')

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', '001,234.50')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:value')).toEqual([['1234.50']])
  })

  it('emits empty updates when cleared', async () => {
    const wrapper = mountNumberInput('10')

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', '')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:value')).toEqual([['']])
  })
})
