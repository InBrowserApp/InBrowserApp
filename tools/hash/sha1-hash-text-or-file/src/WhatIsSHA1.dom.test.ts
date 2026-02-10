import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHA1: typeof import('./WhatIsSHA1.vue').default

beforeAll(async () => {
  WhatIsSHA1 = (await import('./WhatIsSHA1.vue')).default
})

describe('WhatIsSHA1', () => {
  it('renders the SHA-1 description', () => {
    const wrapper = mount(WhatIsSHA1)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHA-1?')
    expect(description.attributes('data-description')).toContain('SHA-1 (Secure Hash Algorithm 1)')
  })
})
