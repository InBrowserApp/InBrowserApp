import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('text statistics exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('text-statistics')
    expect(toolInfo.path).toBe('/tools/text-statistics')
    expect(toolInfo.tags).toContain('statistics')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('Text Statistics')
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
