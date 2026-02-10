import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AllToolsMenu from './AllToolsMenu.vue'
import GitHubMenu from './GitHubMenu.vue'
import GitHubMenuIcon from './GitHubMenuIcon.vue'
import IndexMenu from './IndexMenu.vue'
import { useCollapsedMenuOptions, useExpandedMenuOptions } from './use-menu-links'

describe('menu links', () => {
  it('renders index and all-tools menu links', () => {
    const indexWrapper = mount(IndexMenu, {
      global: {
        stubs: {
          CustomRouterLink: {
            template: '<a class="custom-router-link"><slot /></a>',
          },
        },
      },
    })

    const allToolsWrapper = mount(AllToolsMenu, {
      global: {
        stubs: {
          CustomRouterLink: {
            template: '<a class="custom-router-link"><slot /></a>',
          },
        },
      },
    })

    expect(indexWrapper.find('a.custom-router-link').text()).toContain('Home')
    expect(allToolsWrapper.find('a.custom-router-link').text()).toContain('All Tools')
  })

  it('renders github menu links and icon button', () => {
    const menuWrapper = mount(GitHubMenu)
    expect(menuWrapper.get('a').attributes('href')).toBe(
      'https://github.com/InBrowserApp/inbrowser.app',
    )
    expect(menuWrapper.text()).toContain('GitHub')

    const iconWrapper = mount(GitHubMenuIcon)
    const button = iconWrapper.get('a')
    expect(button.attributes('href')).toBe('https://github.com/InBrowserApp/inbrowser.app')
    expect(button.attributes('target')).toBe('_blank')
  })

  it('builds expanded and collapsed menu option lists', () => {
    const expanded = useExpandedMenuOptions()
    const collapsed = useCollapsedMenuOptions()

    expect(expanded.map((option) => option.key)).toEqual([
      'go-to-home-page',
      'go-to-all-tools-page',
    ])
    expect(collapsed.map((option) => option.key)).toEqual([
      'go-to-home-page',
      'go-to-all-tools-page',
      'go-to-github-page',
    ])

    const expandedLabels = expanded.map(
      (option) => (option.label as () => { type: unknown })().type,
    )
    expect(expandedLabels).toEqual([IndexMenu, AllToolsMenu])

    const githubLabel = collapsed[2]?.label as () => { type: unknown }
    expect(githubLabel().type).toBe(GitHubMenu)
  })
})
