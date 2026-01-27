import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsSHA3_224: typeof import('./WhatIsSHA3_224.vue').default

beforeAll(async () => {
  WhatIsSHA3_224 = (await import('./WhatIsSHA3_224.vue')).default
})

describe('WhatIsSHA3_224', () => {
  it('renders the SHA3-224 description', () => {
    const wrapper = mount(WhatIsSHA3_224)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is SHA3-224 (FIPS 202)?')
    expect(description.attributes('data-description')).toContain('SHA3-224 (FIPS 202)')
  })
})
