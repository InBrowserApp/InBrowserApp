import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsNanoid from './WhatIsNanoid.vue'

describe('WhatIsNanoid', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsNanoid)
    const text = wrapper.text()

    expect(text).toContain('What is NanoID')
    expect(text).toContain('URL-safe')
    expect(text).toContain('Secure randomness')
  })
})
