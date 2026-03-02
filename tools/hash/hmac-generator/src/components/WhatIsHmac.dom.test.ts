import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsHmac from './WhatIsHmac.vue'

describe('WhatIsHmac', () => {
  it('passes title and description to the markdown renderer', () => {
    const wrapper = mount(WhatIsHmac, {
      global: {
        stubs: {
          DescriptionMarkdown: {
            props: ['title', 'description'],
            template:
              '<div class="description" :data-title="title" :data-description="description" />',
          },
        },
      },
    })

    const description = wrapper.find('.description')
    expect(description.attributes('data-title')).toBe('What is HMAC?')
    expect(description.attributes('data-description')).toContain(
      'Hash-based Message Authentication Code',
    )
  })
})
