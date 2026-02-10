import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GeneralInfoHeader from './GeneralInfoHeader.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('GeneralInfoHeader', () => {
  it('renders the header and manifest reference link', () => {
    const wrapper = mount(GeneralInfoHeader, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<header class="section-header"><slot /></header>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          NIcon: {
            template: '<span class="icon" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('manifestReference')
    expect(wrapper.find('a').attributes('href')).toContain('developer.mozilla.org')
  })
})
