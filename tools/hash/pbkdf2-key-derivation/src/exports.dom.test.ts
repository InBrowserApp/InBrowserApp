import { describe, it, expect, vi } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

vi.mock('./Pbkdf2KeyDerivationView.vue', () => ({
  default: { name: 'Pbkdf2KeyDerivationView' },
}))

describe('pbkdf2 key derivation exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('pbkdf2-key-derivation')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(index).toHaveProperty('toolInfo')

    const route = routes[0]
    expect(route?.name).toBe(toolInfo.toolID)
    expect(route?.path).toBe(toolInfo.path)

    const componentLoader = route?.component as () => Promise<{ default: unknown }>
    const loaded = await componentLoader()
    expect(loaded).toHaveProperty('default')
  })
})
