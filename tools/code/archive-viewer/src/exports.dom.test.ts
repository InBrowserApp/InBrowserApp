import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('archive viewer exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('archive-viewer')
    expect(toolInfo.path).toBe('/tools/archive-viewer')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.tags).toContain('archive')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(index).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe(toolInfo.toolID)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })
})
