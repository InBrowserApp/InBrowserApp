import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsSvgOptimizer from './WhatIsSvgOptimizer.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  return {
    NP: makeStub('NP'),
    NH4: makeStub('NH4'),
    NUl: makeStub('NUl'),
    NLi: makeStub('NLi'),
  }
})

describe('WhatIsSvgOptimizer', () => {
  it('renders descriptive content', () => {
    const wrapper = mount(WhatIsSvgOptimizer, {
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('benefit1')
    expect(wrapper.text()).toContain('removed5')
  })
})
