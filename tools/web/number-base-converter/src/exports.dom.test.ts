import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexExports from './index'

describe('number-base-converter exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('number-base-converter')
    expect(routes[0]?.path).toBe(toolInfo.path)

    const routeLoader = routes[0]?.component as (() => Promise<unknown>) | undefined
    if (routeLoader) {
      const loaded = await routeLoader()
      expect(loaded).toBeDefined()
    }
  })

  it('re-exports tool info from index', () => {
    expect(indexExports.toolInfo.toolID).toBe(toolInfo.toolID)
  })
})
