import { describe, it, expect } from 'vitest'
import * as info from './info'
import { routes } from './routes'

describe('qr-code-reader exports', () => {
  it('exposes tool info and routes', async () => {
    expect(info.toolID).toBe('qr-code-reader')
    expect(info.path).toBe('/tools/qr-code-reader')

    const route = routes[0]
    if (!route) {
      throw new Error('Missing QR code reader route')
    }

    expect(route).toMatchObject({
      name: info.toolID,
      path: info.path,
    })
    expect(typeof route.component).toBe('function')

    const routeModule = await (route.component as () => Promise<unknown>)()
    expect(routeModule).toBeTruthy()
  })
})
