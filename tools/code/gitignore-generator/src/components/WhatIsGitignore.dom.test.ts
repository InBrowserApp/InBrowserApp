import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsGitignore from './WhatIsGitignore.vue'
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
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
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
    expect(wrapper.text()).toContain('What is .gitignore?')
    expect(wrapper.text()).toContain('intentionally untracked files that Git should ignore')
    expect(wrapper.text()).toContain('Build outputs (node_modules/, dist/, build/)')
    expect(wrapper.text()).toContain('IDE and editor files (.idea/, .vscode/)')
    expect(wrapper.text()).toContain('Operating system files (.DS_Store, Thumbs.db)')
    expect(wrapper.text()).toContain(
      'This tool uses templates from the official GitHub gitignore repository',
    )
  })
})
