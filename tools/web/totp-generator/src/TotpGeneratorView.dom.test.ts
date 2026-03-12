import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TotpGeneratorView from './TotpGeneratorView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('TotpGeneratorView', () => {
  it('renders the totp generator tool', () => {
    const wrapper = mount(TotpGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          TotpGenerator: {
            template: '<div data-testid="totp-generator" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="totp-generator"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('totp-generator')
    expect(toolInfo.path).toBe('/tools/totp-generator')
    expect(toolInfo.features).toEqual(['offline'])
    expect(toolIndex.toolInfo.toolID).toBe(toolInfo.toolID)
    expect(routes[0]?.path).toBe(toolInfo.path)
    expect(routes[0]?.name).toBe(toolInfo.toolID)
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
