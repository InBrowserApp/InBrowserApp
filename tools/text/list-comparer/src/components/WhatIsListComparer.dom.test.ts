import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsListComparer from './WhatIsListComparer.vue'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    name: 'DescriptionMarkdown',
    props: ['title', 'description'],
    template: '<div class="markdown" :data-title="title">{{ description }}</div>',
  },
}))

describe('WhatIsListComparer', () => {
  it('passes localized title and description to DescriptionMarkdown', () => {
    const wrapper = mount(WhatIsListComparer)

    expect(wrapper.get('.markdown').attributes('data-title')).toBe('What is a list comparer?')
    expect(wrapper.text()).toContain('A list comparer splits text into items')
  })
})
