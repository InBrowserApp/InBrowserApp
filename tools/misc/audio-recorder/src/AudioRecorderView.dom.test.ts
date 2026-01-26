import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AudioRecorderView from './AudioRecorderView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as toolIndex from './index'

describe('AudioRecorderView', () => {
  it('renders the controller', () => {
    const wrapper = mount(AudioRecorderView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          AudioRecorderController: {
            template: '<div data-testid="audio-recorder-controller"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="audio-recorder-controller"]').exists()).toBe(true)
  })

  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('audio-recorder')
    expect(toolInfo.path).toBe('/tools/audio-recorder')
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
