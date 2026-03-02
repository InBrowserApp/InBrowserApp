import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsAes from './WhatIsAes.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  return {
    NText: Base,
    NUl: Base,
    NLi: Base,
  }
})

describe('WhatIsAes', () => {
  it('renders AES descriptions', () => {
    const wrapper = mount(WhatIsAes)

    expect(wrapper.text()).toContain('What is AES?')
    expect(wrapper.text()).toContain('Advanced Encryption Standard')
    expect(wrapper.text()).toContain('Galois/Counter Mode')
    expect(wrapper.text()).toContain('Cipher Block Chaining')
    expect(wrapper.text()).toContain('Counter Mode - Stream cipher mode, no padding needed.')
  })
})
