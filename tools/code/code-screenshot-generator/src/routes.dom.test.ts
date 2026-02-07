import { describe, expect, it } from 'vitest'
import { path as toolPath } from './info'
import { routes } from './routes'

describe('code-screenshot-generator routes', () => {
  it('exports the tool route with lazy component', async () => {
    expect(routes).toHaveLength(1)
    expect(routes[0]?.name).toBe('code-screenshot-generator')
    expect(routes[0]?.path).toBe(toolPath)

    const component = routes[0]?.component as (() => Promise<unknown>) | undefined
    expect(component).toBeTypeOf('function')
    await expect(component?.()).resolves.toBeTruthy()
  })
})
