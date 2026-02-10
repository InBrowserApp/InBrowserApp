import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsArgon2: typeof import('./WhatIsArgon2.vue').default

beforeAll(async () => {
  WhatIsArgon2 = (await import('./WhatIsArgon2.vue')).default
})

describe('WhatIsArgon2', () => {
  it('renders the argon2 description', () => {
    const wrapper = mount(WhatIsArgon2)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is Argon2?')
    expect(description.attributes('data-description')).toContain(
      'modern password hashing algorithm',
    )
  })
})
