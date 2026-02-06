import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsBase16 from './WhatIsBase16.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')

  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
  })
})
