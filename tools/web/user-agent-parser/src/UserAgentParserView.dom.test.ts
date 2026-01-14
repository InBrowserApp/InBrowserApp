import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserAgentParserView from './UserAgentParserView.vue'

describe('UserAgentParserView', () => {
  it('renders the parser and guide sections', () => {
    const wrapper = mount(UserAgentParserView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<main><slot /></main>',
          },
          UserAgentParser: { template: '<section data-test="parser" />' },
          WhatIsUserAgent: { template: '<section data-test="guide" />' },
        },
      },
    })

    expect(wrapper.find('[data-test="parser"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="guide"]').exists()).toBe(true)
  })
})
