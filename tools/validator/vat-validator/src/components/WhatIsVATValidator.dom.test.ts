import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsVATValidator from './WhatIsVATValidator.vue'

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

describe('WhatIsVATValidator', () => {
  it('renders headings and steps', () => {
    const wrapper = mount(WhatIsVATValidator, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('What is a VAT number?')
    expect(wrapper.text()).toContain('VAT Number Structure')
    expect(wrapper.text()).toContain('Validation Checks')
    expect(wrapper.text()).toContain('Normalize the input')
  })
})
