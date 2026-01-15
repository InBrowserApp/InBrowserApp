import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CspGeneratorView from './CspGeneratorView.vue'

describe('CspGeneratorView', () => {
  it('renders the generator and the CSP explanation', () => {
    const wrapper = mount(CspGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<main><slot /></main>',
          },
          CspGenerator: { template: '<section data-test="generator" />' },
          WhatIsCsp: { template: '<section data-test="what-is" />' },
        },
      },
    })

    expect(wrapper.find('[data-test="generator"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="what-is"]').exists()).toBe(true)
  })
})
