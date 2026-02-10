import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsPDFOwnerPassword from './WhatIsPDFOwnerPassword.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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

    expect(wrapper.find('.tool-section-header').text()).toBe('title')
    expect(wrapper.find('.tool-section').text()).toBe('description')
  })
})
