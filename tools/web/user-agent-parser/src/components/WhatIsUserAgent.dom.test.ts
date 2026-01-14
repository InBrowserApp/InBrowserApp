import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsUserAgent from './WhatIsUserAgent.vue'

describe('WhatIsUserAgent', () => {
  it('renders the localized title and description', () => {
    const wrapper = mount(WhatIsUserAgent, {
      global: {
        stubs: {
          DescriptionMarkdown: {
            props: ['title', 'description'],
            template: '<div><h2>{{ title }}</h2><p>{{ description }}</p></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('What is a User-Agent?')
    expect(wrapper.text()).toContain('A User-Agent (UA) string identifies the browser or app')
  })
})
