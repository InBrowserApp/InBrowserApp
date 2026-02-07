import { describe, expect, it } from 'vitest'
import * as index from './index'
import * as toolInfo from './info'
import { routes } from './routes'

describe('case converter exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('case-converter')
    expect(toolInfo.path).toBe('/tools/case-converter')
    expect(toolInfo.tags).toContain('case')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('Case Converter')
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
