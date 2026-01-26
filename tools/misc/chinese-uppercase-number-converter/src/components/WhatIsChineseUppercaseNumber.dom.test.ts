import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsChineseUppercaseNumber from './WhatIsChineseUppercaseNumber.vue'

describe('WhatIsChineseUppercaseNumber', () => {
  it('renders the explainer section', () => {
    const wrapper = mount(WhatIsChineseUppercaseNumber)
    expect(wrapper.text()).toContain('What are Chinese uppercase numbers?')
  })
})
