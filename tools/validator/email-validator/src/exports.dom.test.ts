import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as tool from './index'

describe('email-validator exports', () => {
  it('exposes tool metadata and routes', () => {
    expect(toolInfo.toolID).toBe('email-validator')
    expect(toolInfo.path).toBe('/tools/email-validator')
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
