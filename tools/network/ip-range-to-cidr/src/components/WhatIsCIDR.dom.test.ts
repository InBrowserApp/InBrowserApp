import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsCIDR from './WhatIsCIDR.vue'

describe('WhatIsCIDR', () => {
  it('renders the title and description', () => {
    const wrapper = mount(WhatIsCIDR, {
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

    expect(wrapper.text()).toContain('What is CIDR?')
    expect(wrapper.text()).toContain('Classless Inter-Domain Routing')
  })
})
