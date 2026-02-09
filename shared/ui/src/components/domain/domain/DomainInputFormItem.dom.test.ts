import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DomainInputFormItem from './DomainInputFormItem.vue'

describe('DomainInputFormItem', () => {
  it('validates required, invalid, and valid domains', async () => {
    const wrapper = mount(DomainInputFormItem, {
      props: {
        domain: '',
      },
    })

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: { rule: { validator: () => unknown } }
      }
    ).setupState

    expect(setupState.rule.validator()).toBeInstanceOf(Error)

    await wrapper.find('input').setValue('invalid_domain')
    expect(setupState.rule.validator()).toBeInstanceOf(Error)

    await wrapper.find('input').setValue('example.com')
    expect(setupState.rule.validator()).toBeUndefined()
  })
})
