import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsTextStatistics from './WhatIsTextStatistics.vue'

const stubs = {
  ToolSectionHeader: {
    template: '<header class="section-header"><slot /></header>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}

describe('WhatIsTextStatistics', () => {
  it('renders title and description', () => {
    const wrapper = mount(WhatIsTextStatistics, {
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('What is Text Statistics?')
    expect(wrapper.find('p').text()).toContain(
      'Text statistics tools help you analyze written content by counting characters',
    )
  })
})
