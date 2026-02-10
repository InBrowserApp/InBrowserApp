import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHA384: typeof import('./WhatIsSHA384.vue').default

beforeAll(async () => {
  WhatIsSHA384 = (await import('./WhatIsSHA384.vue')).default
})

describe('WhatIsSHA384', () => {
  it('renders the SHA-384 description', () => {
    const wrapper = mount(WhatIsSHA384)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHA-384?')
    expect(description.attributes('data-description')).toContain(
      'SHA-384 (Secure Hash Algorithm 384-bit)',
    )
  })
})
