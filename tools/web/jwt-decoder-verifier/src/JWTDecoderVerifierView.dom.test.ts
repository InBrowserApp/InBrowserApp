import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import JWTDecoderVerifierView from './JWTDecoderVerifierView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('JWTDecoderVerifierView', () => {
  it('renders the jwt decoder verifier tool', () => {
    const wrapper = mount(JWTDecoderVerifierView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          JWTDecoderVerifier: {
            template: '<div data-testid="jwt-decoder-verifier" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="jwt-decoder-verifier"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('jwt-decoder-verifier')
    expect(toolInfo.path).toBe('/tools/jwt-decoder-verifier')
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
