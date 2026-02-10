import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsKeccak: typeof import('./WhatIsKeccak.vue').default

beforeAll(async () => {
  WhatIsKeccak = (await import('./WhatIsKeccak.vue')).default
})

describe('WhatIsKeccak', () => {
  it('renders the Keccak description', () => {
    const wrapper = mount(WhatIsKeccak)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is Keccak?')
    expect(description.attributes('data-description')).toContain(
      'family of cryptographic hash functions',
    )
  })
})
