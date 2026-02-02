import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'

describe('network tools exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('network-tools')
    expect(toolInfo.path).toBe('/tools/network-tools')
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
