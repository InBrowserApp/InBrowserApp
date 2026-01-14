import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsBICSwiftValidator from './WhatIsBICSwiftValidator.vue'

const stubs = {
  NText: {
    template: '<p class="n-text"><slot /></p>',
  },
  NH3: {
    template: '<h3 class="n-h3"><slot /></h3>',
  },
  NOl: {
    template: '<ol class="n-ol"><slot /></ol>',
  },
  NLi: {
    template: '<li class="n-li"><slot /></li>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
}

describe('WhatIsBICSwiftValidator', () => {
  it('renders headings and steps', () => {
    const wrapper = mount(WhatIsBICSwiftValidator, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('What is BIC/SWIFT?')
    expect(wrapper.text()).toContain('BIC Structure')
    expect(wrapper.text()).toContain('Validation Rules')
    expect(wrapper.text()).toContain('Strip spaces and hyphens')
  })
})
