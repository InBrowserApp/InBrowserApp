import { describe, expect, it } from 'vitest'
import { routes } from './routes'

describe('cron-expression-parser routes', () => {
  it('loads the route component', async () => {
    expect(routes).toHaveLength(1)
    expect(routes[0]).toMatchObject({
      name: 'cron-expression-parser',
      path: '/tools/cron-expression-parser',
    })

    const loader = routes[0]?.component as (() => Promise<{ default: unknown }>) | undefined
    expect(typeof loader).toBe('function')

    const viewModule = await loader?.()
    expect(viewModule?.default).toBeDefined()
  })
})
