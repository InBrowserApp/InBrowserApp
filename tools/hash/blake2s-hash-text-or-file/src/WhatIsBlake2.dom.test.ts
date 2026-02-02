import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsBlake2 from './WhatIsBlake2.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

describe('WhatIsBlake2', () => {
  it('renders the description content', () => {
    const wrapper = mount(WhatIsBlake2)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('what-is-blake2s')
    expect(description.attributes('data-description')).toBe('what-is-blake2s-description-markdown')
  })
})
