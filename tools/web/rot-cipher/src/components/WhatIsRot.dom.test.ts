import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsRot from './WhatIsRot.vue'

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
    props: {
      code: {
        type: Boolean,
        default: false,
      },
    },
    template: '<span class="n-text"><slot /></span>',
  })

  const NP = defineComponent({
    name: 'NP',
    template: '<p class="n-p"><slot /></p>',
  })

  return { NText, NP }
})

const stubs = {
  ToolSectionHeader: {
    template: '<header class="section-header"><slot /></header>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  'i18n-t': {
    template: '<span class="i18n-t"><slot name="hello" /><slot name="uryyb" /></span>',
  },
}

describe('WhatIsRot', () => {
  it('renders the description and example', () => {
    const wrapper = mount(WhatIsRot, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('Uryyb')
    expect(wrapper.text()).toContain('self-reversing')
  })
})
