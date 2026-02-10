import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHA256: typeof import('./WhatIsSHA256.vue').default

beforeAll(async () => {
  WhatIsSHA256 = (await import('./WhatIsSHA256.vue')).default
})

describe('WhatIsSHA256', () => {
  it('renders the SHA-256 description', () => {
    const wrapper = mount(WhatIsSHA256)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHA-256?')
    expect(description.attributes('data-description')).toContain(
      'SHA-256 (Secure Hash Algorithm 256-bit)',
    )
  })
})
