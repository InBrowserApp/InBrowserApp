import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsHmac from './WhatIsHmac.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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
    expect(description.attributes('data-title')).toBe('what-is-hmac')
    expect(description.attributes('data-description')).toBe('what-is-hmac-description')
  })
})
