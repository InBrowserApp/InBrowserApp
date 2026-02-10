import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('cidrs merger excluder exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('cidrs-merger-excluder')
    expect(toolInfo.path).toBe('/tools/cidrs-merger-excluder')
    expect(toolInfo.tags).toEqual([
      'cidr',
      'ip',
      'network',
      'merge',
      'exclude',
      'ipv4',
      'ipv6',
      'subnet',
    ])
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('CIDRs Merger & Excluder')
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
