import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('url parser builder exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('url-parser-builder')
    expect(toolInfo.path).toBe('/tools/url-parser-builder')
    expect(toolInfo.tags).toEqual([
      'url',
      'parser',
      'builder',
      'uri',
      'protocol',
      'hostname',
      'port',
      'path',
      'query',
      'hash',
      'web',
      'network',
    ])
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('URL Parser and Builder')
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
