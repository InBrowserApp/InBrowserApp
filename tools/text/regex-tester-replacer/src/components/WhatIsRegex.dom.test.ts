import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsRegex from './WhatIsRegex.vue'

const { tMock } = vi.hoisted(() => ({
  tMock: vi.fn((key: string) => `translated:${key}`),
}))

vi.mock('vue-i18n', async () => {
  return {
    useI18n: () => ({ t: tMock }),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')

  return {
    DescriptionMarkdown: defineComponent({
      name: 'DescriptionMarkdown',
      props: {
        title: {
          type: String,
          default: '',
        },
        description: {
          type: String,
          default: '',
        },
      },
      template:
        '<div data-testid="markdown" :data-title="title" :data-description="description"></div>',
    }),
  }
})

describe('WhatIsRegex', () => {
  it('passes translated title and description to the markdown block', () => {
    const wrapper = mount(WhatIsRegex)

    const markdown = wrapper.get('[data-testid="markdown"]')
    expect(markdown.attributes('data-title')).toBe('translated:what-is-regex')
    expect(markdown.attributes('data-description')).toBe(
      'translated:what-is-regex-description-markdown',
    )
    expect(tMock).toHaveBeenCalledWith('what-is-regex')
    expect(tMock).toHaveBeenCalledWith('what-is-regex-description-markdown')
  })
})
