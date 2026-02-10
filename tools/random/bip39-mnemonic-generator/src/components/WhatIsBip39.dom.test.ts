import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsBip39 from './WhatIsBip39.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/base', () => ({
  DescriptionMarkdown: defineComponent({
    name: 'DescriptionMarkdown',
    props: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    template: '<div class="description" :data-title="title" :data-description="description" />',
  }),
}))

describe('WhatIsBip39', () => {
  it('passes translated title and description', () => {
    const wrapper = mount(WhatIsBip39)
    const description = wrapper.find('.description')

    expect(description.attributes('data-title')).toBe('what-is-bip39')
    expect(description.attributes('data-description')).toBe('what-is-bip39-description-markdown')
  })
})
