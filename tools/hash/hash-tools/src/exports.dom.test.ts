import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'

describe('hash tools exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('hash-tools')
    expect(toolInfo.path).toBe('/tools/hash-tools')
    expect(indexModule.toolInfo.toolID).toBe(toolInfo.toolID)
    expect(routes[0]?.path).toBe(toolInfo.path)

    const route = routes[0]
    if (!route || !route.component) {
      throw new Error('Missing route definition')
    }

    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toHaveProperty('default')
  })
})
