import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FaviconAssetsGeneratorView from './FaviconAssetsGeneratorView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'

const ToolDefaultPageLayoutStub = {
  template: '<div><slot /></div>',
  props: ['info'],
}

const FaviconGeneratorStub = {
  template: '<div>Favicon Generator</div>',
}

describe('FaviconAssetsGeneratorView', () => {
  it('exposes tool metadata and routes', () => {
    expect(info.toolID).toBe('favicon-assets-generator')
    expect(info.path).toBe('/tools/favicon-assets-generator')
    expect(toolInfo.toolID).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)
  })

  it('renders the generator layout', () => {
    const wrapper = mount(FaviconAssetsGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          FaviconGenerator: FaviconGeneratorStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Favicon Generator')
  })
})
