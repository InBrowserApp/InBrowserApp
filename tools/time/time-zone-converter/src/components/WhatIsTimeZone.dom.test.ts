import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsTimeZone from './WhatIsTimeZone.vue'

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

    expect(wrapper.text()).toContain('What is a time zone?')
    expect(wrapper.text()).toContain('defined by an offset from UTC')
  })
})
