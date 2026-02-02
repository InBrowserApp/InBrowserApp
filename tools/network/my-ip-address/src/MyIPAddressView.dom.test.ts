import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyIPAddressView from './MyIPAddressView.vue'

describe('MyIPAddressView', () => {
  it('renders the layout with the IP address tool', () => {
    const wrapper = mount(MyIPAddressView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          MyIPAddress: {
            template: '<div class="my-ip-address" />',
          },
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.my-ip-address').exists()).toBe(true)
  })
})
