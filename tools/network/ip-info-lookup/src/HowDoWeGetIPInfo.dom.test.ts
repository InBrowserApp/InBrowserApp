import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HowDoWeGetIPInfo from './HowDoWeGetIPInfo.vue'

describe('HowDoWeGetIPInfo', () => {
  it('renders the title and description', () => {
    const wrapper = mount(HowDoWeGetIPInfo, {
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

    expect(wrapper.text()).toContain('How We Get IP Information')
    expect(wrapper.text()).toContain(
      'This tool fetches IP information by making requests to third-party services including geojs.io, ip.sb, Cloudflare, Google DoH, and other geolocation providers. Please note that this is not an offline service and requires network connectivity to external servers to retrieve detailed IP address information including location, ISP, and other metadata.',
    )
  })
})
