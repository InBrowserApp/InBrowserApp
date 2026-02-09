import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NavMenusCollapsed from './NavMenusCollapsed.vue'

const collapsedOptions = [{ key: 'tools', label: 'Tools' }]

vi.mock('./sub-menus/use-menu-links', () => ({
  useCollapsedMenuOptions: () => collapsedOptions,
}))

describe('NavMenusCollapsed', () => {
  it('renders collapsed menu controls and closes menu in handler', async () => {
    const wrapper = mount(NavMenusCollapsed, {
      global: {
        stubs: {
          AirplaneModeToggle: { template: '<div class="airplane-toggle" />' },
          LanguageMenuIcon: { template: '<div class="language-icon" />' },
        },
      },
    })

    expect(wrapper.find('.airplane-toggle').exists()).toBe(true)
    expect(wrapper.find('.language-icon').exists()).toBe(true)

    const setupState = (
      wrapper.vm.$ as unknown as {
        setupState: {
          show: boolean
          menuOptions: unknown[]
          handleUpdateMobileMenu: () => void
        }
      }
    ).setupState

    expect(setupState.menuOptions).toEqual(collapsedOptions)

    setupState.show = true
    setupState.handleUpdateMobileMenu()
    await wrapper.vm.$nextTick()

    expect(setupState.show).toBe(false)
  })
})
