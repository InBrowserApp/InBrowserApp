import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsBlake3 from './WhatIsBlake3.vue'

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

describe('WhatIsBlake3', () => {
  it('passes translated content to DescriptionMarkdown', () => {
    const wrapper = mount(WhatIsBlake3)

    const markdown = wrapper.get('[data-testid="markdown"]')
    expect(markdown.attributes('data-title')).toBe('What is BLAKE3?')
    expect(markdown.attributes('data-description')).toContain(
      'BLAKE3 is a modern cryptographic hash function',
    )
  })
})
