import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsPgpKey from './WhatIsPgpKey.vue'

const DescriptionStub = defineComponent({
  name: 'DescriptionMarkdown',
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  template: '<div class="description"><h2>{{ title }}</h2><p>{{ description }}</p></div>',
})

describe('WhatIsPgpKey', () => {
  it('renders the description markdown content', () => {
    const wrapper = mount(WhatIsPgpKey, {
      global: {
        stubs: {
          DescriptionMarkdown: DescriptionStub,
        },
      },
    })

    const description = wrapper.find('.description')
    expect(description.text()).toContain('What is a PGP Key?')
    expect(description.text()).toContain('OpenPGP (PGP) keys')
  })
})
