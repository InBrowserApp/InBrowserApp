import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexExports from './index'

describe('cron-expression-generator exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('cron-expression-generator')
    expect(routes[0]?.path).toBe(toolInfo.path)

    const componentLoader = routes[0]?.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })

  it('re-exports tool info from index', () => {
    expect(indexExports.toolInfo.toolID).toBe(toolInfo.toolID)
  })
})
