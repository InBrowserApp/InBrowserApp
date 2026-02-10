import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowToConvertIPv6ToMAC from './HowToConvertIPv6ToMAC.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const stubs = {
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}

describe('HowToConvertIPv6ToMAC', () => {
  it('renders the help content', () => {
    const wrapper = mount(HowToConvertIPv6ToMAC, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
  })
})
