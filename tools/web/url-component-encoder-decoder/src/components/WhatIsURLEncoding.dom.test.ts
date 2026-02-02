import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsURLEncoding from './WhatIsURLEncoding.vue'

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

describe('WhatIsURLEncoding', () => {
  it('renders the description content', () => {
    const wrapper = mount(WhatIsURLEncoding)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('what-is-url-encoding')
    expect(description.attributes('data-description')).toBe(
      'what-is-url-encoding-description-markdown',
    )
  })
})
