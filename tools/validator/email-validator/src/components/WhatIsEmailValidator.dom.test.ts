import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsEmailValidator from './WhatIsEmailValidator.vue'

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

describe('WhatIsEmailValidator', () => {
  it('renders headings and checks', () => {
    const wrapper = mount(WhatIsEmailValidator, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('What does this validator check?')
    expect(wrapper.text()).toContain('Checks performed')
    expect(wrapper.text()).toContain('Single @ with local and domain parts')
  })
})
