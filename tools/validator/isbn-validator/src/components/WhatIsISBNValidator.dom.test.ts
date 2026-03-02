import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

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

    expect(wrapper.text()).toContain('What is ISBN?')
    expect(wrapper.text()).toContain('ISBN-10 Check')
    expect(wrapper.text()).toContain('ISBN-13 Check')
    expect(wrapper.text()).toContain('Valid ISBN-10 converts to ISBN-13 with prefix 978')
  })
})
