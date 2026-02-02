import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowToGetYourIPAddress from './HowToGetYourIPAddress.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('HowToGetYourIPAddress', () => {
  it('renders the title and description', () => {
    const wrapper = mount(HowToGetYourIPAddress, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
  })
})
