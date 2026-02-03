import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as tool from './index'

describe('curl-converter exports', () => {
  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('curl-converter')
    expect(toolInfo.path).toBe('/tools/curl-converter')
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
