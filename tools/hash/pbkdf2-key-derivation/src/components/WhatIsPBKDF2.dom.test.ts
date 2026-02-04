import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsPBKDF2 from './WhatIsPBKDF2.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: {
    props: ['title', 'description'],
    template: '<div class="description" :data-title="title" :data-description="description" />',
  },
}))

describe('WhatIsPBKDF2', () => {
  it('passes the translated title and description', () => {
    const wrapper = mount(WhatIsPBKDF2)
    const description = wrapper.find('.description')

    expect(description.attributes('data-title')).toBe('what-is-pbkdf2')
    expect(description.attributes('data-description')).toBe('what-is-pbkdf2-description')
  })
})
