import { describe, expect, it } from 'vitest'
import { toolInfo } from '.'
import { routes } from './routes'

describe('dotenv parser exports', () => {
  it('exports tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('dotenv-parser')
    expect(toolInfo.path).toBe('/tools/dotenv-parser')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.tags).toContain('dotenv')

    expect(routes).toHaveLength(1)
    expect(routes[0]).toMatchObject({
      name: 'dotenv-parser',
      path: '/tools/dotenv-parser',
    })
    const loader = routes[0]?.component
    expect(typeof loader).toBe('function')
    if (typeof loader !== 'function') {
      throw new Error('Route component loader is missing')
    }
    const routeComponent = await (loader as () => Promise<unknown>)()
    expect(routeComponent).toBeTruthy()
  })
})
