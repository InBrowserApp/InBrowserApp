import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsAsciiArt from './WhatIsAsciiArt.vue'

const ToolSectionStub = {
  template: '<section><slot /></section>',
}

const ToolSectionHeaderStub = {
  template: '<header><slot /></header>',
}

const TextStub = defineComponent({
  name: 'NText',
  template: '<span><slot /></span>',
})

describe('WhatIsAsciiArt', () => {
  it('renders the title and description', () => {
    const wrapper = mount(WhatIsAsciiArt, {
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NText: TextStub,
        },
      },
    })

    expect(wrapper.text()).toContain('ASCII')
  })
})
