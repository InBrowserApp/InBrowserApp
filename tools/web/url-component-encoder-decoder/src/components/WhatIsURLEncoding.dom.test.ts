import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsURLEncoding from './WhatIsURLEncoding.vue'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

describe('WhatIsURLEncoding', () => {
  it('renders the description content', () => {
    const wrapper = mount(WhatIsURLEncoding)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is URL Encoding?')
    expect(description.attributes('data-description')).toContain(
      'URL encoding (also called percent encoding) is a method',
    )
    expect(description.attributes('data-description')).toContain('%20')
  })
})
