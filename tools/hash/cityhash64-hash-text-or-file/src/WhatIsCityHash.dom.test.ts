import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsCityHash: typeof import('./WhatIsCityHash.vue').default

beforeAll(async () => {
  WhatIsCityHash = (await import('./WhatIsCityHash.vue')).default
})

describe('WhatIsCityHash', () => {
  it('renders the CityHash64 description', () => {
    const wrapper = mount(WhatIsCityHash)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is CityHash64?')
    expect(description.attributes('data-description')).toContain('CityHash64')
  })
})
