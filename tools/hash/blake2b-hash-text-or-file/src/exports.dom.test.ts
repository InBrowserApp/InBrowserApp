import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('blake2b hash text or file exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('blake2b-hash-text-or-file')
    expect(toolInfo.path).toBe('/tools/blake2b-hash-text-or-file')
    expect(toolInfo.tags).toContain('hash')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('BLAKE2b Hash Text or File')
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
