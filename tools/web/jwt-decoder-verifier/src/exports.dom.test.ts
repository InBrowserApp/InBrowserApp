import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('jwt decoder verifier exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('jwt-decoder-verifier')
    expect(toolInfo.path).toBe('/tools/jwt-decoder-verifier')
    expect(toolInfo.tags).toEqual([
      'jwt',
      'json web token',
      'json',
      'decode',
      'verify',
      'claims',
      'security',
      'auth',
      'web',
      'network',
    ])
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('JSON Web Token (JWT) Decoder & Verifier')
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
