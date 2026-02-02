import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('ip range to cidr exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('ip-range-to-cidr')
    expect(toolInfo.path).toBe('/tools/ip-range-to-cidr')
    expect(toolInfo.tags).toEqual([
      'ip',
      'cidr',
      'network',
      'range',
      'ipv4',
      'ipv6',
      'converter',
      'subnet',
    ])
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('IP Range to CIDR Converter')
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
