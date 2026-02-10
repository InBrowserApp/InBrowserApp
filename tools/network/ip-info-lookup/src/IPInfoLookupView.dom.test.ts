import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IPInfoLookupView from './IPInfoLookupView.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('IPInfoLookupView', () => {
  it('renders the search input and info section', () => {
    const wrapper = mount(IPInfoLookupView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          ToolSectionHeader: {
            template: '<h2 class="section-header"><slot /></h2>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          IPAddressSearchInput: {
            template: '<div class="ip-search" />',
          },
          HowDoWeGetIPInfo: {
            template: '<div class="how-info" />',
          },
        },
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('ip-or-domain')
    expect(wrapper.find('.ip-search').exists()).toBe(true)
    expect(wrapper.find('.how-info').exists()).toBe(true)
  })
})
