import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IPInfoLookupView from './IPInfoLookupView.vue'

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

    expect(wrapper.find('.section-header').text()).toBe('IPv4 / IPv6 / Domain / URL')
    expect(wrapper.find('.ip-search').exists()).toBe(true)
    expect(wrapper.find('.how-info').exists()).toBe(true)
  })
})
