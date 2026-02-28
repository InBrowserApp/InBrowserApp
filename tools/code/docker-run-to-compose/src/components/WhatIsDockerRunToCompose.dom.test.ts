import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsDockerRunToCompose from './WhatIsDockerRunToCompose.vue'

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

describe('WhatIsDockerRunToCompose', () => {
  it('renders the description markdown content', () => {
    const wrapper = mount(WhatIsDockerRunToCompose, {
      global: {
        stubs: {
          DescriptionMarkdown: DescriptionStub,
        },
      },
    })

    const description = wrapper.find('.description')
    expect(description.text()).toContain('What is Docker Run to Compose?')
    expect(description.text()).toContain(
      'converts docker run commands into a docker-compose.yml file',
    )
  })
})
