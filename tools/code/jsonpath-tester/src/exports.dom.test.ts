import { describe, expect, it } from 'vitest'
import * as index from './index'
import * as toolInfo from './info'
import { routes } from './routes'

describe('jsonpath tester exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('jsonpath-tester')
    expect(toolInfo.path).toBe('/tools/jsonpath-tester')
    expect(toolInfo.tags).toEqual(['jsonpath', 'json', 'query', 'filter', 'selector', 'data'])
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('JSONPath Tester')
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
