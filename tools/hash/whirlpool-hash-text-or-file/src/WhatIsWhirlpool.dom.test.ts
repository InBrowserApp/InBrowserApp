import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsWhirlpool from './WhatIsWhirlpool.vue'

describe('WhatIsWhirlpool', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsWhirlpool)
    const text = wrapper.text()

    expect(text).toContain('What is Whirlpool')
    expect(text).toContain('512-bit')
    expect(text).toContain('64-byte')
  })
})
