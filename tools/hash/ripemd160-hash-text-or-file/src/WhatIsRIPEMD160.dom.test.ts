import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsRIPEMD160: typeof import('./WhatIsRIPEMD160.vue').default

beforeAll(async () => {
  WhatIsRIPEMD160 = (await import('./WhatIsRIPEMD160.vue')).default
})

describe('WhatIsRIPEMD160', () => {
  it('renders the RIPEMD-160 description', () => {
    const wrapper = mount(WhatIsRIPEMD160)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is RIPEMD-160?')
    expect(description.attributes('data-description')).toContain(
      'RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest)',
    )
  })
})
