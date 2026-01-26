import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsRIPEMD128 from './WhatIsRIPEMD128.vue'

describe('WhatIsRIPEMD128', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsRIPEMD128)
    const text = wrapper.text()

    expect(text).toContain('What is RIPEMD-128')
    expect(text).toContain('128-bit')
    expect(text).toContain('16-byte')
  })
})
