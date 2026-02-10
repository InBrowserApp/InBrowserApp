import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

let WhatIsBcrypt: typeof import('./WhatIsBcrypt.vue').default

beforeAll(async () => {
  WhatIsBcrypt = (await import('./WhatIsBcrypt.vue')).default
})

describe('WhatIsBcrypt', () => {
  it('renders the bcrypt description', () => {
    const wrapper = mount(WhatIsBcrypt)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is bcrypt?')
    expect(description.attributes('data-description')).toContain(
      'password hashing function designed by Niels Provos',
    )
  })
})
