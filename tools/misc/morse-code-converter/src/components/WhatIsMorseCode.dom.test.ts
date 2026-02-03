import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsMorseCode from './WhatIsMorseCode.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('... --- ...')
  })
})
