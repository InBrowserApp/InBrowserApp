import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsJsonSchema from './WhatIsJsonSchema.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
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
      template: '<div class="description" :data-title="title" :data-description="description" />',
    }),
  }
})

describe('WhatIsJsonSchema', () => {
  it('passes title and description to the markdown component', () => {
    const wrapper = mount(WhatIsJsonSchema)
    const description = wrapper.findComponent({ name: 'DescriptionMarkdown' })
    expect(description.props('title')).toBe('title')
    expect(description.props('description')).toBe('description')
  })
})
