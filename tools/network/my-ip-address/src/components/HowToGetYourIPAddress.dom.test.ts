import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HowToGetYourIPAddress from './HowToGetYourIPAddress.vue'

describe('HowToGetYourIPAddress', () => {
  it('renders the title and description', () => {
    const wrapper = mount(HowToGetYourIPAddress, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('How We Get Your IP Address')
    expect(wrapper.text()).toContain(
      'This tool fetches your IP address by making requests to third-party services including Cloudflare, geojs.io, ip.sb, and ipify.org. Please note that this is not an offline service and requires network connectivity to external servers to retrieve your public IP information.',
    )
  })
})
