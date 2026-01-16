import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsCuid2 from './WhatIsCuid2.vue'

describe('WhatIsCuid2', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsCuid2)
    const text = wrapper.text()

    expect(text).toContain('What is CUID2')
    expect(text).toContain('collision-resistant')
    expect(text).toContain('URL-friendly')
  })
})
