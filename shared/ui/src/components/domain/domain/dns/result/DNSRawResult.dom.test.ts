import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DNSRawResult from './DNSRawResult.vue'

describe('DNSRawResult', () => {
  it('renders the raw dns json payload', () => {
    const wrapper = mount(DNSRawResult, {
      props: {
        result: {
          Status: 0,
          TC: false,
          RD: true,
          RA: true,
          AD: false,
          CD: false,
          Question: [{ name: 'example.com', type: 1 }],
          Answer: [{ name: 'example.com', type: 1, TTL: 60, data: '93.184.216.34' }],
        },
      },
    })

    expect(wrapper.text()).toContain('"Status": 0')
    expect(wrapper.text()).toContain('"example.com"')
  })
})
