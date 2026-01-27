import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CookieParserView from './CookieParserView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('CookieParserView', () => {
  it('renders the cookie parser', () => {
    const wrapper = mount(CookieParserView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          CookieParser: {
            template: '<div data-testid="cookie-parser"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="cookie-parser"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('cookie-parser')
    expect(toolInfo.path).toBe('/tools/cookie-parser')
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
