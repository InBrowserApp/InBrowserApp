import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CSPParserBuilderView from './CSPParserBuilderView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('CSPParserBuilderView', () => {
  it('renders the csp parser builder', () => {
    const wrapper = mount(CSPParserBuilderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          CSPParserBuilder: {
            template: '<div data-testid="csp-parser-builder"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="csp-parser-builder"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('csp-parser-builder')
    expect(toolInfo.path).toBe('/tools/csp-parser-builder')
    expect(toolInfo.features).toEqual(['offline'])
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe(toolInfo.toolID)
    expect(toolIndex.toolInfo.toolID).toBe(toolInfo.toolID)
  })

  it('resolves the route component loader', async () => {
    const loader = routes[0]?.component as (() => Promise<{ default: unknown }>) | undefined
    expect(loader).toBeDefined()
    if (!loader) return

    const module = await loader()
    expect(module.default).toBeDefined()
  })
})
