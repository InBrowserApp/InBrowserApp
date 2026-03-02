import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import WhatIsSshKey from './WhatIsSshKey.vue'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="markdown" :data-title="title" :data-description="description" />',
  },
}))

describe('WhatIsSshKey', () => {
  it('passes translated title and description', () => {
    const wrapper = mount(WhatIsSshKey)

    const markdown = wrapper.get('.markdown')
    expect(markdown.attributes('data-title')).toBe('What is an SSH Key?')
    expect(markdown.attributes('data-description')).toContain('SSH (Secure Shell) keys')
  })
})
