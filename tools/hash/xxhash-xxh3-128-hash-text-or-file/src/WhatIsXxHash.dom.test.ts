import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsXxHash: typeof import('./WhatIsXxHash.vue').default

beforeAll(async () => {
  WhatIsXxHash = (await import('./WhatIsXxHash.vue')).default
})

describe('WhatIsXxHash', () => {
  it('renders the XXH3 128-bit description', () => {
    const wrapper = mount(WhatIsXxHash)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is xxHash (XXH3 128)?')
    expect(description.attributes('data-description')).toContain('XXH3 128')
  })
})
