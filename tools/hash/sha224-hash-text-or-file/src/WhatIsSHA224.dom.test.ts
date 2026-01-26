import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsSHA224 from './WhatIsSHA224.vue'

describe('WhatIsSHA224', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsSHA224)
    const text = wrapper.text()

    expect(text).toContain('What is SHA-224')
    expect(text).toContain('224-bit')
    expect(text).toContain('28-byte')
  })
})
