import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsMorseCode from './WhatIsMorseCode.vue'

describe('WhatIsMorseCode', () => {
  it('renders the section title and SOS example', () => {
    const wrapper = mount(WhatIsMorseCode, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h2 class="header"><slot /></h2>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          NText: {
            props: ['code'],
            template: '<code class="code"><slot /></code>',
          },
          'i18n-t': {
            template: '<p class="i18n"><slot name="sos" /></p>',
          },
          I18nT: {
            template: '<p class="i18n"><slot name="sos" /></p>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('What is Morse Code?')
    expect(wrapper.text()).toContain('... --- ...')
  })
})
