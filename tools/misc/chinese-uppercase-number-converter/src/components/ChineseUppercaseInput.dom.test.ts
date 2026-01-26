import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NFormItem, NInput } from 'naive-ui'
import ChineseUppercaseInput from './ChineseUppercaseInput.vue'

const stubs = {
  CopyToClipboardButton: {
    template: '<button class="copy" />',
  },
}

const mountUppercaseInput = (value: string) =>
  mount(ChineseUppercaseInput, {
    props: {
      value,
    },
    global: {
      stubs,
    },
  })

describe('ChineseUppercaseInput', () => {
  it('shows no status when empty', () => {
    const wrapper = mountUppercaseInput('')

    const formItem = wrapper.findComponent(NFormItem)
    const input = wrapper.findComponent(NInput)

    expect(formItem.props().validationStatus).toBeUndefined()
    expect(formItem.props().feedback).toBeUndefined()
    expect(input.props().status).toBeUndefined()
  })

  it('syncs when props change', async () => {
    const wrapper = mountUppercaseInput('壹元整')

    await wrapper.setProps({ value: '贰元整' })

    const input = wrapper.findComponent(NInput)
    expect(input.props().value).toBe('贰元整')
  })

  it('shows success when valid', () => {
    const wrapper = mountUppercaseInput('壹拾贰元整')

    const formItem = wrapper.findComponent(NFormItem)

    expect(formItem.props().validationStatus).toBe('success')
    expect(formItem.props().feedback).toBe('Valid uppercase')
  })

  it('shows invalid character errors', () => {
    const wrapper = mountUppercaseInput('ABC')

    const formItem = wrapper.findComponent(NFormItem)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Only Chinese uppercase digits and units are allowed.')
  })

  it('shows invalid format errors', () => {
    const wrapper = mountUppercaseInput('壹拾拾元')

    const formItem = wrapper.findComponent(NFormItem)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Invalid uppercase format.')
  })

  it('shows range errors', () => {
    const wrapper = mountUppercaseInput('壹仟兆元整')

    const formItem = wrapper.findComponent(NFormItem)

    expect(formItem.props().validationStatus).toBe('error')
    expect(formItem.props().feedback).toBe('Value exceeds the maximum range.')
  })

  it('emits updates when valid', async () => {
    const wrapper = mountUppercaseInput('')

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', '  壹元整  ')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:value')).toEqual([['壹元整']])
  })

  it('emits empty updates when cleared', async () => {
    const wrapper = mountUppercaseInput('壹元整')

    const input = wrapper.findComponent(NInput)
    input.vm.$emit('update:value', '')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:value')).toEqual([['']])
  })
})
