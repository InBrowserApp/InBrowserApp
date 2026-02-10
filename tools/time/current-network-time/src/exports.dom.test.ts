import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('current network time exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('current-network-time')
    expect(toolInfo.path).toBe('/tools/current-network-time')
    expect(toolInfo.tags).toEqual(['time', 'clock', 'timezone', 'network'])
    expect(toolInfo.features).toEqual([])
    expect(toolInfo.meta.en.name).toBe('Current Network Time')
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
