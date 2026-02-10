import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SlugGeneratorView from './SlugGeneratorView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('SlugGeneratorView', () => {
  it('renders the slug generator tool sections', () => {
    const wrapper = mount(SlugGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          SlugGenerator: {
            template: '<div data-testid="slug-generator" />',
          },
          WhatIsSlug: {
            template: '<div data-testid="what-is-slug" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="slug-generator"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is-slug"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('slug-generator')
    expect(toolInfo.path).toBe('/tools/slug-generator')
    expect(toolInfo.features).toEqual(['offline'])

    const route = routes[0]
    expect(route).toBeDefined()
    if (!route) return

    expect(route.path).toBe(toolInfo.path)
    expect(route.name).toBe(toolInfo.toolID)
    expect(toolIndex.toolInfo.toolID).toBe(toolInfo.toolID)
  })

  it('resolves the route component loader', async () => {
    const loader = routes[0]?.component as (() => Promise<{ default: unknown }>) | undefined
    expect(loader).toBeDefined()

    if (loader) {
      const module = await loader()
      expect(module.default).toBeDefined()
    }
  })
})
