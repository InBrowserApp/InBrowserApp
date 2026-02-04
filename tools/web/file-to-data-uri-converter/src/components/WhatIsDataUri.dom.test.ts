import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsDataUri from './WhatIsDataUri.vue'

const DescriptionMarkdownStub = defineComponent({
  props: {
    title: String,
    description: String,
  },
  template: '<div><h3>{{ title }}</h3><p>{{ description }}</p></div>',
})

describe('WhatIsDataUri', () => {
  it('renders the data uri explanation', () => {
    const wrapper = mount(WhatIsDataUri, {
      global: {
        stubs: {
          DescriptionMarkdown: DescriptionMarkdownStub,
        },
      },
    })

    expect(wrapper.text()).toContain('What is Data URI?')
    expect(wrapper.text()).toContain('Data URI (or data URL)')
  })
})
