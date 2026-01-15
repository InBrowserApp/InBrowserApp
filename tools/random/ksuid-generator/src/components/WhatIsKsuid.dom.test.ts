import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsKsuid from './WhatIsKsuid.vue'

describe('WhatIsKsuid', () => {
  it('renders explanation content', () => {
    const wrapper = mount(WhatIsKsuid)
    const text = wrapper.text()

    expect(text).toContain('What is KSUID')
    expect(text).toContain('Time-sortable')
    expect(text).toContain('Second precision')
  })
})
