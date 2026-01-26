import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsVINValidator from './WhatIsVINValidator.vue'

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

describe('WhatIsVINValidator', () => {
  it('renders headings and content', () => {
    const wrapper = mount(WhatIsVINValidator, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('What is a VIN?')
    expect(wrapper.text()).toContain('What it includes')
    expect(wrapper.text()).toContain('Check digit')
  })
})
