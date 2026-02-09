import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NavBar from './NavBar.vue'

const state = vi.hoisted(() => ({
  width: { value: 1280 },
}))

vi.mock('@vueuse/core', () => ({
  useWindowSize: () => ({ width: state.width }),
}))

function mountNavBar() {
  return mount(NavBar, {
    global: {
      stubs: {
        NLayoutHeader: {
          template: '<header class="header"><slot /></header>',
        },
        NSpace: {
          template: '<div class="space"><slot /></div>',
        },
        SiteBranding: {
          template: '<div class="branding" />',
        },
        NavMenusExpanded: {
          template: '<div class="expanded-menu" />',
        },
        NavMenusCollapsed: {
          template: '<div class="collapsed-menu" />',
        },
      },
    },
  })
}

describe('NavBar', () => {
  it('renders expanded menu when width is greater than 1200', () => {
    state.width.value = 1280
    const wrapper = mountNavBar()

    expect(wrapper.find('.expanded-menu').exists()).toBe(true)
    expect(wrapper.find('.collapsed-menu').exists()).toBe(false)
  })

  it('renders collapsed menu when width is 1200 or less', () => {
    state.width.value = 1024
    const wrapper = mountNavBar()

    expect(wrapper.find('.expanded-menu').exists()).toBe(false)
    expect(wrapper.find('.collapsed-menu').exists()).toBe(true)
  })
})
