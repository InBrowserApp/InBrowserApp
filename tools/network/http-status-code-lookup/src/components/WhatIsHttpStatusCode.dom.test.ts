import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsHttpStatusCode from './WhatIsHttpStatusCode.vue'

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

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('informationalTitle')
    expect(wrapper.text()).toContain('successTitle')
    expect(wrapper.text()).toContain('redirectionTitle')
    expect(wrapper.text()).toContain('clientErrorTitle')
    expect(wrapper.text()).toContain('serverErrorTitle')
  })
})
