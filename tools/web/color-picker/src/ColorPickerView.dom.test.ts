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
  it('exposes tool metadata and routes', () => {
    expect(info.toolID).toBe('color-picker')
    expect(info.path).toBe('/tools/color-picker')
    expect(toolInfo.toolID).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)
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
