import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('my ip address exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('my-ip-address')
    expect(toolInfo.path).toBe('/tools/my-ip-address')
    expect(toolInfo.tags).toEqual(['ip', 'network', 'geolocation'])
    expect(toolInfo.features).toEqual([])
    expect(toolInfo.meta.en.name).toBe('My IP Address')
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
