import { describe, it, expect } from 'vitest'
import * as info from './info'
import { routes } from './routes'

describe('exif-viewer exports', () => {
  it('exposes tool info and routes', async () => {
    expect(info.toolID).toBe('exif-viewer')
    expect(info.path).toBe('/tools/exif-viewer')
    expect(info.features).toContain('offline')

    const route = routes[0]
    if (!route) {
      throw new Error('Missing exif viewer route')
    }

    expect(route).toMatchObject({
      name: info.toolID,
      path: info.path,
    })
    expect(typeof route.component).toBe('function')

    const componentLoader = route.component as () => Promise<{ default: unknown }>
    const module = await componentLoader()
    expect(module.default).toBeTruthy()
  })
})
