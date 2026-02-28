import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsHttpStatusCode from './WhatIsHttpStatusCode.vue'

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

describe('WhatIsHttpStatusCode', () => {
  it('renders the description and status code categories', () => {
    const wrapper = mount(WhatIsHttpStatusCode, {
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

    expect(wrapper.text()).toContain('What is an HTTP Status Code?')
    expect(wrapper.text()).toContain('three-digit numbers returned by a server')
    expect(wrapper.text()).toContain('1xx Informational:')
    expect(wrapper.text()).toContain('2xx Success:')
    expect(wrapper.text()).toContain('3xx Redirection:')
    expect(wrapper.text()).toContain('4xx Client Error:')
    expect(wrapper.text()).toContain('5xx Server Error:')
  })
})
