import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RadioTimecodeView from './RadioTimecodeView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('RadioTimecodeView', () => {
  it('renders the controller', () => {
    const wrapper = mount(RadioTimecodeView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          RadioTimecodeController: {
            template: '<div data-testid="radio-timecode-controller"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="radio-timecode-controller"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('radio-timecode')
    expect(toolInfo.path).toBe('/tools/radio-timecode')
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
