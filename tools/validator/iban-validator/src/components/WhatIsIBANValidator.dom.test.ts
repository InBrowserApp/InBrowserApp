import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h3><slot /></h3>',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NText: defineComponent({
      name: 'NText',
      props: ['tag'],
      template: '<p><slot /></p>',
    }),
    NH3: defineComponent({
      name: 'NH3',
      template: '<h3><slot /></h3>',
    }),
    NOl: defineComponent({
      name: 'NOl',
      template: '<ol><slot /></ol>',
    }),
    NLi: defineComponent({
      name: 'NLi',
      template: '<li><slot /></li>',
    }),
  }
})

import WhatIsIBANValidator from './WhatIsIBANValidator.vue'

describe('WhatIsIBANValidator', () => {
  it('renders explanatory copy', () => {
    const wrapper = mount(WhatIsIBANValidator)

    expect(wrapper.text()).toContain('What is IBAN?')
    expect(wrapper.text()).toContain('IBAN Structure')
    expect(wrapper.text()).toContain('Checksum Validation')
    expect(wrapper.text()).toContain('Remove spaces and move the first four characters to the end')
  })
})
