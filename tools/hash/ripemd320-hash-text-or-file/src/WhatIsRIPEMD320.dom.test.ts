import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsRIPEMD320 from './WhatIsRIPEMD320.vue'

describe('WhatIsRIPEMD320', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsRIPEMD320)
    const text = wrapper.text()

    expect(text).toContain('What is RIPEMD-320')
    expect(text).toContain('320-bit')
    expect(text).toContain('40-byte')
  })
})
