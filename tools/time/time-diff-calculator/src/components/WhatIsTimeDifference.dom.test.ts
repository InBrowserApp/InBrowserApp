import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsTimeDifference from './WhatIsTimeDifference.vue'

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

describe('WhatIsTimeDifference', () => {
  it('renders the description markdown content', () => {
    const wrapper = mount(WhatIsTimeDifference, {
      global: {
        stubs: {
          DescriptionMarkdown: DescriptionStub,
        },
      },
    })

    const description = wrapper.find('.description')
    expect(description.text()).toContain('What is a time difference?')
    expect(description.text()).toContain('elapsed time between two timestamps')
  })
})
