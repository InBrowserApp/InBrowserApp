import { describe, it, expect } from 'vitest'
import { toolInfo } from './index'
import { routes } from './routes'

describe('color-converter exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('color-converter')
    expect(toolInfo.path).toBe('/tools/color-converter')
    expect(toolInfo.tags).toContain('color')
    expect(toolInfo.features).toContain('offline')

    expect(routes).toHaveLength(1)
    const route = routes[0]!
    expect(route.path).toBe(toolInfo.path)
    expect(route.name).toBe('color-converter')
    expect(typeof route.component).toBe('function')

    const view = await (route.component as () => Promise<{ default: unknown }>)()
    expect(view).toHaveProperty('default')
  })
})
