import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsMarkdown from './WhatIsMarkdown.vue'

describe('WhatIsMarkdown', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsMarkdown)
    const text = wrapper.text()

    expect(text).toContain('What is Markdown')
    expect(text).toContain('Common syntax')
    expect(text).toContain('README')
  })
})
