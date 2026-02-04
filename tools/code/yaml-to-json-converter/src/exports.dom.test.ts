import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import routes, { routes as namedRoutes } from './routes'
import * as index from './index'

describe('yaml to json converter exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('yaml-to-json-converter')
    expect(toolInfo.path).toBe('/tools/yaml-to-json-converter')
    expect(toolInfo.tags).toContain('yaml')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('YAML → JSON Converter')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(index).toHaveProperty('toolInfo')

    const route = namedRoutes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe(toolInfo.toolID)
    expect(routes).toHaveLength(namedRoutes.length)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })
})
