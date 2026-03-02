import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsRegex from './WhatIsRegex.vue'

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
    expect(markdown.attributes('data-title')).toBe('What is Regex?')
    expect(markdown.attributes('data-description')).toContain(
      'Regex (regular expression) is a pattern language',
    )
  })
})
