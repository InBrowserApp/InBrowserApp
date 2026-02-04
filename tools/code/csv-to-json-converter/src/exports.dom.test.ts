import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('csv to json converter exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('csv-to-json-converter')
    expect(toolInfo.path).toBe('/tools/csv-to-json-converter')
    expect(toolInfo.tags).toContain('csv')
    expect(toolInfo.tags).toContain('json')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toContain('CSV')
    expect(toolInfo.meta.en.name).toContain('JSON')
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
