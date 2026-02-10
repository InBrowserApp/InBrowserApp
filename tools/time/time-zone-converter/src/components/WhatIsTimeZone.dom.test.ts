import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsTimeZone from './WhatIsTimeZone.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('WhatIsTimeZone', () => {
  it('passes title and description to markdown', () => {
    const wrapper = mount(WhatIsTimeZone, {
      global: {
        stubs: {
          DescriptionMarkdown: {
            props: ['title', 'description'],
            template: '<div class="markdown">{{ title }} {{ description }}</div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
  })
})
