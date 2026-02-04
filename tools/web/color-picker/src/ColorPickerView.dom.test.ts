import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPickerView from './ColorPickerView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'

const ToolDefaultPageLayoutStub = {
  template: '<div><slot /></div>',
  props: ['info'],
}

const CopyToClipboardButtonStub = {
  template: '<button />',
}

describe('ColorPickerView', () => {
  it('exposes tool metadata and routes', async () => {
    expect(info.toolID).toBe('color-picker')
    expect(info.path).toBe('/tools/color-picker')
    expect(toolInfo.toolID).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)

    const componentLoader = routes[0]?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })

  it('renders the color picker tool', () => {
    const wrapper = mount(ColorPickerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Screen Color Picker')
  })
})
