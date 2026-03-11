import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import OpenGraphMetaGeneratorView from './OpenGraphMetaGeneratorView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('OpenGraphMetaGeneratorView', () => {
  it('renders the tool and the explainer section', () => {
    const wrapper = mount(OpenGraphMetaGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          OpenGraphMetaGenerator: {
            template: '<div data-testid="generator" />',
          },
          WhatIsOpenGraphMetaGenerator: {
            template: '<div data-testid="what-is" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="generator"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })

  it('exposes metadata, routes, and package exports', () => {
    expect(toolInfo.toolID).toBe('open-graph-meta-generator')
    expect(toolInfo.path).toBe('/tools/open-graph-meta-generator')
    expect(toolInfo.features).toEqual(['offline'])
    expect(toolInfo.tags).toContain('open graph')

    const route = routes[0]
    expect(route).toBeDefined()
    if (!route) return

    expect(route.path).toBe(toolInfo.path)
    expect(route.name).toBe(toolInfo.toolID)
    expect(toolIndex.toolInfo.toolID).toBe(toolInfo.toolID)
  })

  it('resolves the lazy-loaded route component', async () => {
    const loader = routes[0]?.component as (() => Promise<{ default: unknown }>) | undefined
    expect(loader).toBeDefined()

    if (loader) {
      const module = await loader()
      expect(module.default).toBeDefined()
    }
  })
})
