import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IPv6ToMACView from './IPv6ToMACView.vue'

const stubs = {
  ToolDefaultPageLayout: {
    name: 'ToolDefaultPageLayout',
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
  IPv6ToMAC: {
    name: 'IPv6ToMAC',
    template: '<div class="ipv6-to-mac" />',
  },
  HowToConvertIPv6ToMAC: {
    name: 'HowToConvertIPv6ToMAC',
    template: '<div class="how-to" />',
  },
}

describe('IPv6ToMACView', () => {
  it('renders the layout and sections', () => {
    const wrapper = mount(IPv6ToMACView, {
      global: {
        stubs,
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.exists()).toBe(true)
    expect(layout.props('info')).toBeTruthy()
    expect(wrapper.find('.ipv6-to-mac').exists()).toBe(true)
    expect(wrapper.find('.how-to').exists()).toBe(true)
  })
})
