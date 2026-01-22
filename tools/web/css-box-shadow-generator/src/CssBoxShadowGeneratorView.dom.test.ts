import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CssBoxShadowGeneratorView from './CssBoxShadowGeneratorView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'

const ToolDefaultPageLayoutStub = {
  template: '<div><slot /></div>',
  props: ['info'],
}

const CssBoxShadowGeneratorStub = {
  template: '<div>CSS Box Shadow Generator</div>',
}

describe('CssBoxShadowGeneratorView', () => {
  it('exposes tool metadata and routes', async () => {
    expect(info.toolID).toBe('css-box-shadow-generator')
    expect(info.path).toBe('/tools/css-box-shadow-generator')
    expect(toolInfo.toolID).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)
    expect(routes[0]?.component).toBeDefined()
    const routeLoader = routes[0]?.component as (() => Promise<unknown>) | undefined
    if (!routeLoader) throw new Error('Missing route definition')
    const routeModule = await routeLoader()
    expect(routeModule).toBeTruthy()
  })

  it('renders the css box shadow generator tool', () => {
    const wrapper = mount(CssBoxShadowGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          CssBoxShadowGenerator: CssBoxShadowGeneratorStub,
        },
      },
    })

    expect(wrapper.text()).toContain('CSS Box Shadow Generator')
  })
})
