import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsAdler32: typeof import('./WhatIsAdler32.vue').default

beforeAll(async () => {
  WhatIsAdler32 = (await import('./WhatIsAdler32.vue')).default
})

describe('WhatIsAdler32', () => {
  it('renders the Adler-32 description', () => {
    const wrapper = mount(WhatIsAdler32)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is Adler-32?')
    expect(description.attributes('data-description')).toContain(
      'Adler-32 is a fast checksum algorithm',
    )
  })
})
