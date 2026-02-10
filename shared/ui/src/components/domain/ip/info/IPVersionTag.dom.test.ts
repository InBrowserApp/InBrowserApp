import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IPVersionTag from './IPVersionTag.vue'

describe('IPVersionTag', () => {
  it('shows ipv4 label for ipv4 input', () => {
    const wrapper = mount(IPVersionTag, {
      props: { ip: '8.8.8.8' },
    })

    expect(wrapper.text()).toContain('IPv4')
  })

  it('shows ipv6 label for ipv6 input', () => {
    const wrapper = mount(IPVersionTag, {
      props: { ip: '2001:db8::1' },
    })

    expect(wrapper.text()).toContain('IPv6')
  })

  it('shows unknown for invalid input', () => {
    const wrapper = mount(IPVersionTag, {
      props: { ip: 'not-an-ip' },
    })

    expect(wrapper.text()).toContain('Unknown')
  })
})
