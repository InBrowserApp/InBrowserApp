import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientGeneratorView from './CssGradientGeneratorView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'

const ToolDefaultPageLayoutStub = {
  template: '<div><slot /></div>',
  props: ['info'],
}

const CssGradientGeneratorToolStub = {
  template: '<div>CSS Gradient Generator Tool</div>',
}

describe('CssGradientGeneratorView', () => {
  it('exposes tool metadata and routes', async () => {
    expect(info.toolID).toBe('css-gradient-generator')
    expect(info.path).toBe('/tools/css-gradient-generator')
    expect(toolInfo.toolID).toBe(info.toolID)

    const route = routes[0]
    if (!route || !route.component) {
      throw new Error('Missing route definition')
    }

    expect(route.path).toBe(info.path)
    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toBeTruthy()
  })

  it('renders the gradient generator tool', () => {
    const wrapper = mount(CssGradientGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          CssGradientGeneratorTool: CssGradientGeneratorToolStub,
        },
      },
    })

    expect(wrapper.text()).toContain('CSS Gradient Generator Tool')
  })
})
