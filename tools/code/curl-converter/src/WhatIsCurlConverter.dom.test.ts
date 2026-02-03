import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsCurlConverter from './components/WhatIsCurlConverter.vue'

describe('WhatIsCurlConverter', () => {
  it('renders the localized title and description', () => {
    const wrapper = mount(WhatIsCurlConverter, {
      global: {
        stubs: {
          DescriptionMarkdown: {
            props: ['title', 'description'],
            template: '<div><h2>{{ title }}</h2><p>{{ description }}</p></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('What is a cURL Converter?')
    expect(wrapper.text()).toContain('A cURL converter turns a cURL command')
  })
})
