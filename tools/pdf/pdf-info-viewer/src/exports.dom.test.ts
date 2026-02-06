import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('pdf info viewer exports', () => {
  it('exposes tool info and routes', () => {
    expect(toolInfo.toolID).toBe('pdf-info-viewer')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(index).toHaveProperty('toolInfo')
  })

  it('loads the route component', async () => {
    const loader = routes[0]?.component

    expect(typeof loader).toBe('function')

    if (typeof loader !== 'function') {
      throw new Error('Route component loader is not a function')
    }

    const loadRouteComponent = loader as () => Promise<{ default: unknown }>
    const componentModule = await loadRouteComponent()
    expect(componentModule).toHaveProperty('default')
  })
})
