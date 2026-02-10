import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NavMenusExpanded from './NavMenusExpanded.vue'

const expandedOptions = [{ key: 'home', label: 'Home' }]

vi.mock('./sub-menus/use-menu-links', () => ({
  useExpandedMenuOptions: () => expandedOptions,
}))

describe('NavMenusExpanded', () => {
  it('renders expanded menu options with icon actions', () => {
    const wrapper = mount(NavMenusExpanded, {
      global: {
        stubs: {
          AirplaneModeToggle: { template: '<span class="airplane-toggle" />' },
          LanguageMenuIcon: { template: '<span class="language-icon" />' },
          GitHubMenuIcon: { template: '<span class="github-icon" />' },
        },
      },
    })

    expect(wrapper.text()).toContain('Home')
    expect(wrapper.find('.airplane-toggle').exists()).toBe(true)
    expect(wrapper.find('.language-icon').exists()).toBe(true)
    expect(wrapper.find('.github-icon').exists()).toBe(true)

    const setupState = (wrapper.vm.$ as unknown as { setupState: { menuOptions: unknown[] } })
      .setupState
    expect(setupState.menuOptions).toEqual(expandedOptions)
  })
})
