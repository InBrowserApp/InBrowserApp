import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsPort from './WhatIsPort.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NUl: defineComponent({
      name: 'NUl',
      template: '<ul class="list"><slot /></ul>',
    }),
    NLi: defineComponent({
      name: 'NLi',
      template: '<li class="list-item"><slot /></li>',
    }),
  }
})
describe('WhatIsPort', () => {
  it('renders the description and port categories', () => {
    const wrapper = mount(WhatIsPort, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })
    expect(wrapper.text()).toContain('What is a Port Number?')
    expect(wrapper.text()).toContain('16-bit unsigned integer (0-65535)')
    expect(wrapper.text()).toContain('System Ports (0-1023):')
    expect(wrapper.text()).toContain('Registered Ports (1024-49151):')
    expect(wrapper.text()).toContain('Dynamic Ports (49152-65535):')
  })
})
