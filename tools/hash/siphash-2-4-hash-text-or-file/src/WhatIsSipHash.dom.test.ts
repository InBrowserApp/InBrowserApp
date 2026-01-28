import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSipHash: typeof import('./WhatIsSipHash.vue').default

beforeAll(async () => {
  WhatIsSipHash = (await import('./WhatIsSipHash.vue')).default
})

describe('WhatIsSipHash', () => {
  it('renders the SipHash-2-4 description', () => {
    const wrapper = mount(WhatIsSipHash)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SipHash-2-4?')
    expect(description.attributes('data-description')).toContain('SipHash-2-4')
  })
})
