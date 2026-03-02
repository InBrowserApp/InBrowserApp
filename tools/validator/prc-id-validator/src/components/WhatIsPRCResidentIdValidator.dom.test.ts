import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsPRCResidentIdValidator from './WhatIsPRCResidentIdValidator.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-header"><slot /></h2>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NText = defineComponent({
    name: 'NText',
    props: {
      tag: {
        type: String,
        default: 'p',
      },
    },
    template: '<p class="paragraph"><slot /></p>',
  })

  return { NText }
})

describe('WhatIsPRCResidentIdValidator', () => {
  it('renders title and description content', () => {
    const wrapper = mount(WhatIsPRCResidentIdValidator)

    expect(wrapper.get('.tool-header').text()).toBe('What is a PRC Resident ID?')
    const paragraphs = wrapper.findAll('.paragraph')
    expect(paragraphs).toHaveLength(2)
    expect(wrapper.text()).toContain(
      '18-digit PRC Resident ID number includes the address code, birthdate, sequence code, and checksum.',
    )
    expect(wrapper.text()).toContain(
      'Region codes are based on the 2023 administrative division dataset.',
    )
  })
})
