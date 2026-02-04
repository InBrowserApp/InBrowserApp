import { describe, it, expect } from 'vitest'
import { toolInfo } from './index'
import { routes } from './routes'

describe('aes-encryptor exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('aes-encryptor')
    expect(toolInfo.path).toBe('/tools/aes-encryptor')
    expect(toolInfo.tags).toContain('aes')
    expect(toolInfo.features).toContain('offline')

    expect(routes).toHaveLength(1)
    expect(routes[0]?.path).toBe(toolInfo.path)
    expect(routes[0]?.name).toBe('aes-encryptor')
    expect(typeof routes[0]?.component).toBe('function')

    const route = routes[0]
    expect(route).toBeTruthy()

    const component = route?.component
    if (typeof component === 'function') {
      const resolved = await (component as () => Promise<unknown>)()
      expect(resolved).toBeTruthy()
    }
  })
})
