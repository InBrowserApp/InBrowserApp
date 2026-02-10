import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NText: defineComponent({
      name: 'NText',
      props: ['tag'],
      template: '<p class="text"><slot /></p>',
    }),
    NH3: defineComponent({
      name: 'NH3',
      template: '<h3 class="heading"><slot /></h3>',
    }),
    NOl: defineComponent({
      name: 'NOl',
      template: '<ol class="list"><slot /></ol>',
    }),
    NLi: defineComponent({
      name: 'NLi',
      template: '<li class="list-item"><slot /></li>',
    }),
  }
})

import WhatIsISBNValidator from './WhatIsISBNValidator.vue'

describe('WhatIsISBNValidator', () => {
  it('renders the explanation sections', () => {
    const wrapper = mount(WhatIsISBNValidator, {
      global: {
        stubs: {
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2 class="section-header"><slot /></h2>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('isbn10Title')
    expect(wrapper.text()).toContain('isbn13Title')
    expect(wrapper.text()).toContain('conversionNote')
  })
})
