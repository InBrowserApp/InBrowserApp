import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsCRC from './WhatIsCRC.vue'

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

describe('WhatIsCRC', () => {
  it('renders the description content', () => {
    const wrapper = mount(WhatIsCRC)

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('what-is-crc')
    expect(description.attributes('data-description')).toBe('what-is-crc-description-markdown')
  })
})
