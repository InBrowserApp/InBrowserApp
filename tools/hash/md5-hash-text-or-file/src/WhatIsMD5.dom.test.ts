import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsMD5: typeof import('./WhatIsMD5.vue').default

beforeAll(async () => {
  WhatIsMD5 = (await import('./WhatIsMD5.vue')).default
})

describe('WhatIsMD5', () => {
  it('renders the MD5 description', () => {
    const wrapper = mount(WhatIsMD5)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is MD5?')
    expect(description.attributes('data-description')).toContain('MD5 (Message Digest Algorithm 5)')
  })
})
