import { describe, expect, it, vi } from 'vitest'
import { routes } from './routes'

vi.mock('./Blake3HashTextOrFileView.vue', () => ({
  default: { name: 'Blake3HashTextOrFileView' },
}))

describe('blake3 hash text or file routes', () => {
  it('resolves the route component', async () => {
    const route = routes[0]

    expect(route).toBeDefined()

    if (!route || typeof route.component !== 'function') {
      throw new Error('Route component loader is missing')
    }

    const loader = route.component as unknown as () => Promise<unknown>
    const module = await loader()

    expect(module).toHaveProperty('default')
  })
})
