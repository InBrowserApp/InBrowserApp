import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsScrypt from './WhatIsScrypt.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

describe('WhatIsScrypt', () => {
  it('passes the translated title and description', () => {
    const wrapper = mount(WhatIsScrypt)
    const description = wrapper.find('.description')

    expect(description.attributes('data-title')).toBe('what-is-scrypt')
    expect(description.attributes('data-description')).toBe('what-is-scrypt-description')
  })
})
