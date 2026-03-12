import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import * as index from './index'
import { routes } from './routes'

describe('robots txt tester exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('robots-txt-tester')
    expect(toolInfo.path).toBe('/tools/robots-txt-tester')
    expect(toolInfo.tags).toContain('robots')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('robots.txt Tester')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(index).toHaveProperty('toolInfo')
    expect(index.toolInfo.toolID).toBe(toolInfo.toolID)

    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe(toolInfo.toolID)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })
})
