import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Base85DecoderView from './Base85DecoderView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('Base85DecoderView', () => {
  it('renders the base85 decoder', () => {
    const wrapper = mount(Base85DecoderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          Base85Decoder: {
            template: '<div data-testid="base85-decoder"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="base85-decoder"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('base85-decoder')
    expect(toolInfo.path).toBe('/tools/base85-decoder')
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
