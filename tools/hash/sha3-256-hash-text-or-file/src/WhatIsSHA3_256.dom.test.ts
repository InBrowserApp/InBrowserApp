import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHA3_256: typeof import('./WhatIsSHA3_256.vue').default

beforeAll(async () => {
  WhatIsSHA3_256 = (await import('./WhatIsSHA3_256.vue')).default
})

describe('WhatIsSHA3_256', () => {
  it('renders the SHA3-256 description', () => {
    const wrapper = mount(WhatIsSHA3_256)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHA3-256 (FIPS 202)?')
    expect(description.attributes('data-description')).toContain('SHA3-256 (FIPS 202)')
  })
})
