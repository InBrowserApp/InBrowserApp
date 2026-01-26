import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsSM3 from './WhatIsSM3.vue'

describe('WhatIsSM3', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsSM3)
    const text = wrapper.text()

    expect(text).toContain('What is SM3')
    expect(text).toContain('256-bit')
    expect(text).toContain('Digital signatures')
  })
})
