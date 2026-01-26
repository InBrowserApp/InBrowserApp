import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Base58EncoderView from './Base58EncoderView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('Base58EncoderView', () => {
  it('renders the base58 encoder', () => {
    const wrapper = mount(Base58EncoderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          Base58Encoder: {
            template: '<div data-testid="base58-encoder"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="base58-encoder"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('base58-encoder')
    expect(toolInfo.path).toBe('/tools/base58-encoder')
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
