import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsMurmurHash3: typeof import('./WhatIsMurmurHash3.vue').default

beforeAll(async () => {
  WhatIsMurmurHash3 = (await import('./WhatIsMurmurHash3.vue')).default
})

describe('WhatIsMurmurHash3', () => {
  it('renders the MurmurHash3 x86 128-bit description', () => {
    const wrapper = mount(WhatIsMurmurHash3)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is MurmurHash3 (x86 128-bit)?')
    expect(description.attributes('data-description')).toContain('MurmurHash3')
  })
})
