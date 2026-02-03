import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsAes from './WhatIsAes.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('gcm')
    expect(wrapper.text()).toContain('cbc')
    expect(wrapper.text()).toContain('ctr')
  })
})
