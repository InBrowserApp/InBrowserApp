import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsRomanNumeral from './WhatIsRomanNumeral.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  return { NText }
})

const stubs = {
  ToolSectionHeader: {
    template: '<header class="section-header"><slot /></header>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  'i18n-t': {
    template: '<span class="i18n-t"><slot name="example" /></span>',
  },
}

describe('WhatIsRomanNumeral', () => {
  it('renders the description example', () => {
    const wrapper = mount(WhatIsRomanNumeral, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('title')
    expect(wrapper.text()).toContain('MMXXIV = 2024')
  })
})
