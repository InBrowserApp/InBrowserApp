import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsPgpKey from './WhatIsPgpKey.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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
    expect(description.text()).toContain('title')
    expect(description.text()).toContain('description')
  })
})
