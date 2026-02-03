import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsGitignore from './WhatIsGitignore.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  },
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
    NUl: defineComponent({
      name: 'NUl',
      template: '<ul><slot /></ul>',
    }),
    NLi: defineComponent({
      name: 'NLi',
      template: '<li><slot /></li>',
    }),
  }
})

describe('WhatIsGitignore', () => {
  it('renders the info copy', () => {
    const wrapper = mount(WhatIsGitignore)

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('point1')
    expect(wrapper.text()).toContain('point2')
    expect(wrapper.text()).toContain('point3')
    expect(wrapper.text()).toContain('templates')
  })
})
