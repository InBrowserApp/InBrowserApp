import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsJsonSchema from './WhatIsJsonSchema.vue'

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
      template: '<div class="description" :data-title="title" :data-description="description" />',
    }),
  }
})

describe('WhatIsJsonSchema', () => {
  it('passes title and description to the markdown component', () => {
    const wrapper = mount(WhatIsJsonSchema)
    const description = wrapper.findComponent({ name: 'DescriptionMarkdown' })
    expect(description.props('title')).toBe('What is JSON Schema?')
    expect(description.props('description')).toContain(
      'JSON Schema is a standard for describing the shape of JSON data.',
    )
  })
})
