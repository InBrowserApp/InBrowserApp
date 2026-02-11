import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsHighwayHash: typeof import('./WhatIsHighwayHash.vue').default

beforeAll(async () => {
  WhatIsHighwayHash = (await import('./WhatIsHighwayHash.vue')).default
})

describe('WhatIsHighwayHash', () => {
  it('renders the HighwayHash description', () => {
    const wrapper = mount(WhatIsHighwayHash)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is HighwayHash?')
    expect(description.attributes('data-description')).toContain(
      'HighwayHash is a fast keyed hash function',
    )
  })
})
