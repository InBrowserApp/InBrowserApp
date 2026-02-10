import { describe, expect, it, vi } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as tool from './index'

vi.mock('./FaviconAssetsGeneratorView.vue', () => ({
  default: {},
}))

describe('favicon-assets-generator exports', () => {
  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('favicon-assets-generator')
    expect(toolInfo.path).toBe('/tools/favicon-assets-generator')
    expect(routes[0]?.path).toBe(toolInfo.path)
    expect(tool.toolInfo).toBeDefined()
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
