import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IPInputFormItem from './IPInputFormItem.vue'

describe('IPInputFormItem', () => {
  it('validates required, invalid, and valid ip input', async () => {
    const wrapper = mount(IPInputFormItem, {
      props: { ip: '' },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: { rule: { validator: () => unknown } }
      }
    ).setupState

    expect(setupState.rule.validator()).toBeInstanceOf(Error)

    await wrapper.find('input').setValue('not-an-ip')
    expect(setupState.rule.validator()).toBeInstanceOf(Error)

    await wrapper.find('input').setValue('1.1.1.1')
    expect(setupState.rule.validator()).toBe(true)
  })
})
