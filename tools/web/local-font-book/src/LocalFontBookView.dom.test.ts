import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LocalFontBookView from './LocalFontBookView.vue'
import { routes } from './routes'
import * as info from './info'
import { toolInfo } from './index'

const ToolDefaultPageLayoutStub = {
  template: '<div><slot /></div>',
  props: ['info'],
}

const LocalFontBookToolStub = {
  template: '<div>Local Font Book</div>',
}

describe('LocalFontBookView', () => {
  it('exposes tool metadata and routes', async () => {
    expect(info.toolID).toBe('local-font-book')
    expect(info.path).toBe('/tools/local-font-book')
    expect(toolInfo.toolID).toBe(info.toolID)
    expect(routes[0]?.path).toBe(info.path)
    expect(routes[0]?.component).toBeDefined()
    const routeLoader = routes[0]?.component as (() => Promise<unknown>) | undefined
    if (!routeLoader) throw new Error('Missing route definition')
    const routeModule = await routeLoader()
    expect(routeModule).toBeTruthy()
  })

  it('renders the local font book tool', () => {
    const wrapper = mount(LocalFontBookView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          LocalFontBookTool: LocalFontBookToolStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Local Font Book')
  })
})
