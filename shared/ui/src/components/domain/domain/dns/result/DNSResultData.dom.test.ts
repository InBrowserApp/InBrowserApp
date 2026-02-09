import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DNSResultData from './DNSResultData.vue'

describe('DNSResultData', () => {
  it('renders an external link for IP addresses', () => {
    const wrapper = mount(DNSResultData, {
      props: { data: '8.8.8.8' },
    })

    const link = wrapper.find('a.ip-link')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://ip.inbrowser.app/tools/ip-info/8.8.8.8')
  })

  it('renders plain text for non-ip values', () => {
    const wrapper = mount(DNSResultData, {
      props: { data: 'example.com' },
    })

    expect(wrapper.find('a.ip-link').exists()).toBe(false)
    expect(wrapper.text()).toContain('example.com')
  })
})
