import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('mac to ipv6 link local exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('mac-to-ipv6-link-local')
    expect(toolInfo.path).toBe('/tools/mac-to-ipv6-link-local')
    expect(toolInfo.tags).toContain('mac')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('MAC to IPv6 Link Local Converter')
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
