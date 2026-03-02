import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsSvgOptimizer from './WhatIsSvgOptimizer.vue'

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

    expect(wrapper.text()).toContain('What is SVG Optimization?')
    expect(wrapper.text()).toContain('Benefits of SVG Optimization')
    expect(wrapper.text()).toContain('Smaller file sizes mean faster page load times')
    expect(wrapper.text()).toContain('Unnecessary precision in path data and transforms')
  })
})
