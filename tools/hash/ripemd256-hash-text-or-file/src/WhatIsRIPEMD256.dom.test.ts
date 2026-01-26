import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsRIPEMD256 from './WhatIsRIPEMD256.vue'

describe('WhatIsRIPEMD256', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsRIPEMD256)
    const text = wrapper.text()

    expect(text).toContain('What is RIPEMD-256')
    expect(text).toContain('256-bit')
    expect(text).toContain('32-byte')
  })
})
