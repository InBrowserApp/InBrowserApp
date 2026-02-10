import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteBranding from './SiteBranding.vue'

describe('SiteBranding', () => {
  it('renders the app name inside the home link', () => {
    const wrapper = mount(SiteBranding, {
      global: {
        stubs: {
          CustomRouterLink: {
            template: '<a class="brand-link"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.get('a.brand-link').text()).toContain('InBrowser.App')
  })
})
