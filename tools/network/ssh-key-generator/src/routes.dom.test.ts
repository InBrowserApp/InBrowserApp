import { describe, expect, it } from 'vitest'
import { routes } from './routes'

describe('ssh-key-generator routes', () => {
  it('exports the expected tool route', async () => {
    expect(routes).toHaveLength(1)
    expect(routes[0]).toMatchObject({
      name: 'ssh-key-generator',
      path: '/tools/ssh-key-generator',
    })

    const lazyComponent = routes[0]?.component as (() => Promise<{ default: unknown }>) | undefined
    expect(typeof lazyComponent).toBe('function')
    const viewModule = await lazyComponent?.()
    expect(viewModule?.default).toBeDefined()
  })
})
