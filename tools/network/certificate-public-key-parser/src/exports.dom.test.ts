import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('certificate public key parser exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('certificate-public-key-parser')
    expect(toolInfo.path).toBe('/tools/certificate-public-key-parser')
    expect(toolInfo.tags).toContain('x509')
    expect(toolInfo.features).toContain('offline')
    expect(toolInfo.meta.en.name).toBe('Certificate & Public Key Parser')
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
