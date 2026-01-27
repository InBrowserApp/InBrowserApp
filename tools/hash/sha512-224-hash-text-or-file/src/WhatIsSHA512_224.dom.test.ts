import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHA512_224: typeof import('./WhatIsSHA512_224.vue').default

beforeAll(async () => {
  WhatIsSHA512_224 = (await import('./WhatIsSHA512_224.vue')).default
})

describe('WhatIsSHA512_224', () => {
  it('renders the SHA-512/224 description', () => {
    const wrapper = mount(WhatIsSHA512_224)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHA-512/224 (FIPS 180-4)?')
    expect(description.attributes('data-description')).toContain('SHA-512/224 (FIPS 180-4)')
  })
})
