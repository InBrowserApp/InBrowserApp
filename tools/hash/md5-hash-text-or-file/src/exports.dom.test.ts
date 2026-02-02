import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('md5 hash text or file exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('md5-hash-text-or-file')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(index).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route).toBeTruthy()

    const componentLoader = route!.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })
})
