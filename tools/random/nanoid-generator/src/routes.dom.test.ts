import { describe, expect, it } from 'vitest'
import { routes } from './routes'

describe('nanoid-generator routes', () => {
  it('loads the route component', async () => {
    expect(routes).toHaveLength(1)
    expect(routes[0]).toMatchObject({
      name: 'nanoid-generator',
      path: '/tools/random/nanoid-generator',
    })

    const loader = routes[0]?.component as (() => Promise<{ default: unknown }>) | undefined
    expect(typeof loader).toBe('function')

    const viewModule = await loader?.()
    expect(viewModule?.default).toBeDefined()
  })
})
