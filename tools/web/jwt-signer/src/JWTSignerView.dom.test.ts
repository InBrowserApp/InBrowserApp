import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import JWTSignerView from './JWTSignerView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('JWTSignerView', () => {
  it('renders the jwt signer tool', () => {
    const wrapper = mount(JWTSignerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          JWTSigner: {
            template: '<div data-testid="jwt-signer" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="jwt-signer"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('jwt-signer')
    expect(toolInfo.path).toBe('/tools/jwt-signer')
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
