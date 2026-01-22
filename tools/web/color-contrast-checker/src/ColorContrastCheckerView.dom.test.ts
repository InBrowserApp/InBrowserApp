import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorContrastCheckerView from './ColorContrastCheckerView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'

const ToolDefaultPageLayoutStub = {
  template: '<div><slot /></div>',
  props: ['info'],
}

const ColorContrastCheckerStub = {
  template: '<div>Color Contrast Checker</div>',
}

describe('ColorContrastCheckerView', () => {
  it('exposes tool metadata and routes', async () => {
    expect(info.toolID).toBe('color-contrast-checker')
    expect(info.path).toBe('/tools/color-contrast-checker')
    expect(toolInfo.toolID).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)
    expect(routes[0]?.component).toBeDefined()
  })

  it('renders the color contrast checker tool', () => {
    const wrapper = mount(ColorContrastCheckerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          ColorContrastChecker: ColorContrastCheckerStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Color Contrast Checker')
  })
})
