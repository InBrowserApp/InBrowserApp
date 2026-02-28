import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowToConvertIPv6ToMAC from './HowToConvertIPv6ToMAC.vue'

const stubs = {
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}

describe('HowToConvertIPv6ToMAC', () => {
  it('renders the help content', () => {
    const wrapper = mount(HowToConvertIPv6ToMAC, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('How to Convert IPv6 to MAC Address')
    expect(wrapper.text()).toContain(
      "Converting an IPv6 address to a MAC address is possible when the IPv6 address was generated using the EUI-64 format from a MAC address. This typically applies to IPv6 link-local addresses (starting with fe80::) and some stateless autoconfigured addresses. The process involves: 1) Extracting the interface identifier (last 64 bits) from the IPv6 address, 2) Inverting the 7th bit (Universal/Local bit) of the first byte, 3) Removing the inserted 'fffe' bytes to reconstruct the original 48-bit MAC address. Note that this only works for IPv6 addresses that were originally derived from MAC addresses using EUI-64.",
    )
  })
})
