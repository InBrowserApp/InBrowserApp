import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsMD4: typeof import('./WhatIsMD4.vue').default

beforeAll(async () => {
  WhatIsMD4 = (await import('./WhatIsMD4.vue')).default
})

describe('WhatIsMD4', () => {
  it('renders the MD4 description', () => {
    const wrapper = mount(WhatIsMD4)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is MD4?')
    expect(description.attributes('data-description')).toContain('MD4 (Message Digest Algorithm 4)')
  })
})
