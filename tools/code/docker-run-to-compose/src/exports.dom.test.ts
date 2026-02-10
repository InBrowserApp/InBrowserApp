import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'

describe('docker run to compose exports', () => {
  it('exposes tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('docker-run-to-compose')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(indexModule).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route).toBeTruthy()

    const componentLoader = route!.component as () => Promise<{ default: unknown }>
    const loadedRoute = await componentLoader()
    expect(loadedRoute).toHaveProperty('default')
  })
})
