import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

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

import WhatIsOpenApi from './WhatIsOpenApi.vue'

describe('WhatIsOpenApi', () => {
  it('passes translated title and description to the markdown block', () => {
    const wrapper = mount(WhatIsOpenApi)

    const markdown = wrapper.get('[data-testid="markdown"]')
    expect(markdown.attributes('data-title')).toBe('What is OpenAPI?')
    expect(markdown.attributes('data-description')).toContain('OpenAPI (formerly Swagger)')
  })
})
