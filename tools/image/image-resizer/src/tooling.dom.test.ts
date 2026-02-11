import { describe, expect, it } from 'vitest'
import * as info from './info'
import { routes } from './routes'
import { toolInfo } from './index'

describe('image-resizer metadata', () => {
  it('exports consistent info', () => {
    expect(info.toolID).toBe('image-resizer')
    expect(info.path).toBe('/tools/image-resizer')
    expect(info.features).toContain('offline')
    expect(Object.keys(info.meta)).toHaveLength(25)
    expect(toolInfo.toolID).toBe(info.toolID)
  })

  it('defines one lazy route', async () => {
    expect(routes).toHaveLength(1)
    const route = routes[0]
    if (!route) {
      throw new Error('route missing')
    }

    expect(route.name).toBe(info.toolID)
    expect(route.path).toBe(info.path)
    expect(typeof route.component).toBe('function')

    if (typeof route.component !== 'function') {
      throw new Error('Expected lazy component loader')
    }

    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toHaveProperty('default')
  })
})
