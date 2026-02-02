import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsMimeType from './WhatIsMimeType.vue'

describe('WhatIsMimeType', () => {
  it('renders the intro and categories sections', () => {
    const wrapper = mount(WhatIsMimeType, {
      global: {
        stubs: {
          MimeTypeIntro: {
            template: '<div class="mime-intro" />',
          },
          MimeTypeCategories: {
            template: '<div class="mime-categories" />',
          },
        },
      },
    })

    expect(wrapper.find('.mime-intro').exists()).toBe(true)
    expect(wrapper.find('.mime-categories').exists()).toBe(true)
  })
})
