import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TimerView from './TimerView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('TimerView', () => {
  it('renders the countdown timer', () => {
    const wrapper = mount(TimerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          CountdownTimer: {
            template: '<div data-testid="countdown-timer"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="countdown-timer"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('timer')
    expect(toolInfo.path).toBe('/tools/timer')
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
