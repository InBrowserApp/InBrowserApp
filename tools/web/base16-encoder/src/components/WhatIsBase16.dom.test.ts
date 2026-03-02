import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsBase16 from './WhatIsBase16.vue'

const DescriptionMarkdownStub = defineComponent({
  name: 'DescriptionMarkdown',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  template: '<section>{{ title }} {{ description }}</section>',
})

describe('WhatIsBase16', () => {
  it('passes translated copy to DescriptionMarkdown', () => {
    const wrapper = mount(WhatIsBase16, {
      global: {
        stubs: {
          DescriptionMarkdown: DescriptionMarkdownStub,
        },
      },
    })

    expect(wrapper.text()).toContain('What is Base16 (Hex)?')
    expect(wrapper.text()).toContain(
      'binary-to-text encoding that represents each byte as two characters',
    )
  })
})
