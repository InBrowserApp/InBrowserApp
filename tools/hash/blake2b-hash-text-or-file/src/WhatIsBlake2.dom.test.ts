import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsBlake2 from './WhatIsBlake2.vue'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

describe('WhatIsBlake2', () => {
  it('renders the description content', () => {
    const wrapper = mount(WhatIsBlake2)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is BLAKE2b?')
    expect(description.attributes('data-description')).toContain(
      'BLAKE2b is a cryptographic hash function',
    )
  })
})
