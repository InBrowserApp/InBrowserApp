import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsIMEIValidator from './WhatIsIMEIValidator.vue'

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

describe('WhatIsIMEIValidator', () => {
  it('renders title and checks', () => {
    const wrapper = mount(WhatIsIMEIValidator, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('What is IMEI?')
    expect(wrapper.text()).toContain('What this validator checks')
    expect(wrapper.text()).toContain('Length: IMEI must be exactly 15 digits')
  })
})
