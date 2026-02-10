import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHA512: typeof import('./WhatIsSHA512.vue').default

beforeAll(async () => {
  WhatIsSHA512 = (await import('./WhatIsSHA512.vue')).default
})

describe('WhatIsSHA512', () => {
  it('renders the SHA-512 description', () => {
    const wrapper = mount(WhatIsSHA512)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHA-512?')
    expect(description.attributes('data-description')).toContain(
      'SHA-512 (Secure Hash Algorithm 512-bit)',
    )
  })
})
