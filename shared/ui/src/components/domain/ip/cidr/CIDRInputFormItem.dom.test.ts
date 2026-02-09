import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CIDRInputFormItem from './CIDRInputFormItem.vue'

describe('CIDRInputFormItem', () => {
  it('emits valid cidr values and clears invalid values', async () => {
    const wrapper = mount(CIDRInputFormItem, {
      props: {
        cidr: '',
      },
    })

    await wrapper.find('input').setValue('10.0.0.0/24')
    await flushPromises()
    expect(wrapper.emitted('update:cidr')?.slice(-1)[0]).toEqual(['10.0.0.0/24'])

    await wrapper.find('input').setValue('invalid-cidr')
    await flushPromises()
    expect(wrapper.emitted('update:cidr')?.slice(-1)[0]).toEqual([''])
  })

  it('returns validation errors for invalid cidr values', async () => {
    const wrapper = mount(CIDRInputFormItem, {
      props: {
        cidr: '',
      },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: { rule: { validator: () => unknown } }
      }
    ).setupState

    await wrapper.find('input').setValue('10.0.0.0/24')
    expect(setupState.rule.validator()).toBeUndefined()

    await wrapper.find('input').setValue('oops')
    expect(setupState.rule.validator()).toBeInstanceOf(Error)
  })
})
