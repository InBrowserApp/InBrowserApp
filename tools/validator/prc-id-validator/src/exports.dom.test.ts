import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import * as indexExports from './index'
import { routes } from './routes'

describe('prc-id-validator exports', () => {
  it('exposes tool info and routes', () => {
    expect(toolInfo.toolID).toBe('prc-id-validator')
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
