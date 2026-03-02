import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsIPv6LinkLocal from './WhatIsIPv6LinkLocal.vue'

describe('WhatIsIPv6LinkLocal', () => {
  it('renders the title and description', () => {
    const wrapper = mount(WhatIsIPv6LinkLocal, {
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

    expect(wrapper.text()).toContain('What is IPv6 Link-Local Address?')
    expect(wrapper.text()).toContain('fe80::/10')
  })
})
