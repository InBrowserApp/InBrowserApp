import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import WhatIsSshKey from './WhatIsSshKey.vue'

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
    template: '<div class="markdown" :data-title="title" :data-description="description" />',
  },
}))

describe('WhatIsSshKey', () => {
  it('passes translated title and description', () => {
    const wrapper = mount(WhatIsSshKey)

    const markdown = wrapper.get('.markdown')
    expect(markdown.attributes('data-title')).toBe('title')
    expect(markdown.attributes('data-description')).toBe('description')
  })
})
