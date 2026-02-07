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
    expect(routes[0]?.path).toBe(toolInfo.path)
    expect(routes[0]?.name).toBe('color-converter')
    expect(typeof routes[0]?.component).toBe('function')

    const view = await (routes[0]?.component as () => Promise<{ default: unknown }>)()
    expect(view).toHaveProperty('default')
  })
})
