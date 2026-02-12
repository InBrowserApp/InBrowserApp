import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import * as index from './index'
import { routes } from './routes'

describe('sql formatter and linter exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('sql-formatter-and-linter')
    expect(toolInfo.path).toBe('/tools/sql-formatter-and-linter')
    expect(toolInfo.tags).toContain('sql')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('SQL Formatter & Linter')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(index).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route?.path).toBe(toolInfo.path)
    expect(route?.name).toBe(toolInfo.toolID)
    expect(routes.length).toBeGreaterThan(0)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })
})
