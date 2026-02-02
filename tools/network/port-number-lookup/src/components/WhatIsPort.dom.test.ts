import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsPort from './WhatIsPort.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NText: defineComponent({
      name: 'NText',
      template: '<span class="text"><slot /></span>',
    }),
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

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('systemPorts')
    expect(wrapper.text()).toContain('registeredPorts')
    expect(wrapper.text()).toContain('dynamicPorts')
  })
})
