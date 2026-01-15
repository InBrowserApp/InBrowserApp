import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsCsp from './WhatIsCsp.vue'

describe('WhatIsCsp', () => {
  it('renders the CSP description', () => {
    const wrapper = mount(WhatIsCsp, {
      global: {
        stubs: {
          DescriptionMarkdown: {
            props: ['title', 'description'],
            template: '<div><h2>{{ title }}</h2><p>{{ description }}</p></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Content Security Policy')
    expect(wrapper.text()).toContain('browser security header')
  })
})
