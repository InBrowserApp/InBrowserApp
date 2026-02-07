import { describe, expect, it } from 'vitest'
import { routes } from './routes'

describe('time-diff-calculator routes', () => {
  it('exports the tool route with lazy component', async () => {
    expect(routes).toHaveLength(1)
    expect(routes[0]?.name).toBe('time-diff-calculator')
    expect(routes[0]?.path).toBe('/tools/time-diff-calculator')

    const component = routes[0]?.component as (() => Promise<unknown>) | undefined
    expect(component).toBeTypeOf('function')
    await expect(component?.()).resolves.toBeTruthy()
  })
})
