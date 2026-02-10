import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('ip info lookup exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('ip-info-lookup')
    expect(toolInfo.path).toBe('/tools/ip-info-lookup')
    expect(toolInfo.tags).toContain('ip')
    expect(toolInfo.meta.en.name).toBe('IP Info Lookup')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(index).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe(toolInfo.toolID)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')

    const ipRoute = routes[1]
    expect(ipRoute?.name).toBe('ip-info-lookup-ip')
    expect(ipRoute?.path).toBe('/tools/ip-info-lookup/:ipdomain')

    const ipViewLoader = ipRoute?.component as () => Promise<{ default: unknown }>
    const loadedIpView = await ipViewLoader()
    expect(loadedIpView).toHaveProperty('default')
  })
})
