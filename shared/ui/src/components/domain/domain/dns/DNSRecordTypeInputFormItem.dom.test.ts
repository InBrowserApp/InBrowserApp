import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DNSRecordTypeInputFormItem from './DNSRecordTypeInputFormItem.vue'

describe('DNSRecordTypeInputFormItem', () => {
  it('renders DNS record type selector', () => {
    const wrapper = mount(DNSRecordTypeInputFormItem, {
      props: {
        types: [],
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toContain('n-base-selection')
    expect(wrapper.text()).toContain('Record Type')
  })
})
