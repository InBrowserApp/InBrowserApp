import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CspParserView from './CspParserView.vue'

describe('CspParserView', () => {
  it('renders the parser and the CSP explanation', () => {
    const wrapper = mount(CspParserView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<main><slot /></main>',
          },
          CspParser: { template: '<section data-test="parser" />' },
          WhatIsCsp: { template: '<section data-test="what-is" />' },
        },
      },
    })

    expect(wrapper.find('[data-test="parser"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="what-is"]').exists()).toBe(true)
  })
})
