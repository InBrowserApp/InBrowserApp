import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsXmlFormatter from './WhatIsXmlFormatter.vue'

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
  template: '<div class="description">{{ title }}|{{ description }}</div>',
})

describe('WhatIsXmlFormatter', () => {
  it('renders the explanation block', () => {
    const wrapper = mount(WhatIsXmlFormatter, {
      global: {
        stubs: {
          DescriptionMarkdown: DescriptionMarkdownStub,
        },
      },
    })

    expect(wrapper.text()).toContain('What is XML formatting and validation?')
    expect(wrapper.text()).toContain('Everything runs locally in your browser')
  })
})
