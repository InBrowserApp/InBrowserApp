import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StopwatchView from './StopwatchView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('StopwatchView', () => {
  it('renders the stopwatch timer', () => {
    const wrapper = mount(StopwatchView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          StopwatchTimer: {
            template: '<div data-testid="stopwatch-timer"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="stopwatch-timer"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('stopwatch')
    expect(toolInfo.path).toBe('/tools/stopwatch')
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
