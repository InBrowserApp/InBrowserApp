import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import WhatIsLoremIpsum from './WhatIsLoremIpsum.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

describe('WhatIsLoremIpsum', () => {
  it('renders the lorem ipsum description', () => {
    const wrapper = mount(WhatIsLoremIpsum, {
      global: {
        plugins: [i18n],
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          NText: {
            template: '<p><slot /></p>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('What is Lorem Ipsum?')
    expect(wrapper.text()).toContain('Lorem Ipsum is dummy text')
  })
})
