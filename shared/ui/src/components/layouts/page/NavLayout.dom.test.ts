import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NavLayout from './NavLayout.vue'

describe('NavLayout', () => {
  it('renders nav bar and page slot content', () => {
    const wrapper = mount(NavLayout, {
      slots: {
        default: '<div class="page-content">content</div>',
      },
      global: {
        stubs: {
          NavBar: {
            template: '<header class="nav" />',
          },
        },
      },
    })

    expect(wrapper.find('.nav').exists()).toBe(true)
    expect(wrapper.find('.main-container').exists()).toBe(true)
    expect(wrapper.find('.page-content').text()).toBe('content')
  })
})
