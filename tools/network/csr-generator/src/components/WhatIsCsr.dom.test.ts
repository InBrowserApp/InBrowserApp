import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import WhatIsCsr from './WhatIsCsr.vue'

const DescriptionMarkdownStub = defineComponent({
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  setup(props) {
    return () => h('section', [props.title, props.description])
  },
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {},
  },
})

describe('WhatIsCsr', () => {
  it('renders the description', () => {
    const wrapper = mount(WhatIsCsr, {
      global: {
        plugins: [i18n],
        stubs: {
          DescriptionMarkdown: DescriptionMarkdownStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Certificate Signing Request')
    expect(wrapper.text()).toContain('PKCS#10')
  })
})
