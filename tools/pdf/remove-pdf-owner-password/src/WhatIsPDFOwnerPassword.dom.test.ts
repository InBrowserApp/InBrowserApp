import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsPDFOwnerPassword from './WhatIsPDFOwnerPassword.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
}))

describe('WhatIsPDFOwnerPassword', () => {
  it('renders the translated title and description', () => {
    const wrapper = mount(WhatIsPDFOwnerPassword)

    expect(wrapper.find('.tool-section-header').text()).toBe('What is PDF Owner Password?')
    expect(wrapper.find('.tool-section').text()).toContain(
      'A PDF owner password is a password that is used to restrict documents in PDF files.',
    )
  })
})
