import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexExports from './index'

describe('duration-calculator exports', () => {
  it('exposes tool info and routes', () => {
    expect(toolInfo.toolID).toBe('duration-calculator')
    expect(routes[0]?.path).toBe(toolInfo.path)
  })

  it('loads the route component', async () => {
    const loader = routes[0]?.component
    expect(loader).toBeTypeOf('function')

    const routeLoader = loader as () => Promise<unknown>
    const module = await routeLoader()

    expect(module).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(indexExports.toolInfo.toolID).toBe(toolInfo.toolID)
  })
})
