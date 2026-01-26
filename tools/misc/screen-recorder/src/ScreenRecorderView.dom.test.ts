import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScreenRecorderView from './ScreenRecorderView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('ScreenRecorderView', () => {
  it('renders the controller', () => {
    const wrapper = mount(ScreenRecorderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          ScreenRecorderController: {
            template: '<div data-testid="screen-recorder-controller"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="screen-recorder-controller"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('screen-recorder')
    expect(toolInfo.path).toBe('/tools/screen-recorder')
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
