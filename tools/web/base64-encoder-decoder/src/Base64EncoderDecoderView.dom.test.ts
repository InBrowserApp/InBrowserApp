import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Base64EncoderDecoderView from './Base64EncoderDecoderView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('Base64EncoderDecoderView', () => {
  it('renders the base64 converter tool', () => {
    const wrapper = mount(Base64EncoderDecoderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          Base64Converter: {
            template: '<div data-testid="base64-converter" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="base64-converter"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('base64-encoder-decoder')
    expect(toolInfo.path).toBe('/tools/base64-encoder-decoder')
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
