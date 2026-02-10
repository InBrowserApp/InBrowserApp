import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DNSResult from './DNSResult.vue'

const result = {
  Status: 0,
  TC: false,
  RD: true,
  RA: true,
  AD: false,
  CD: false,
  Question: [{ name: 'example.com', type: 1 }],
  Answer: [{ name: 'example.com', type: 1, TTL: 300, data: '1.1.1.1' }],
}

describe('DNSResult', () => {
  it('renders with a custom title', () => {
    const wrapper = mount(DNSResult, {
      props: {
        result,
        title: 'DNS Lookup Result',
      },
    })

    expect(wrapper.text()).toContain('DNS Lookup Result')
    expect(wrapper.text()).toContain('Raw Result')
  })

  it('uses the default title when one is not provided', () => {
    const wrapper = mount(DNSResult, {
      props: {
        result,
      },
    })

    expect(wrapper.text()).toContain('Result')
  })
})
