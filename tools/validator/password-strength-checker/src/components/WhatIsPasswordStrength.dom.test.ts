import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsPasswordStrength from './WhatIsPasswordStrength.vue'

describe('WhatIsPasswordStrength', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsPasswordStrength)
    const text = wrapper.text()

    expect(text).toContain('What is Password Strength')
    expect(text).toContain('Longer passphrases')
    expect(text).toContain('password manager')
  })
})
