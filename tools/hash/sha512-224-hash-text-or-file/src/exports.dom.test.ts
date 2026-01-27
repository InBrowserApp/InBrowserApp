import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('sha512-224 hash text or file exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('sha512-224-hash-text-or-file')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(index).toHaveProperty('toolInfo')
    const loader = routes[0]?.component as (() => Promise<unknown>) | undefined
    expect(loader).toBeDefined()
    const component = await loader?.()
    expect(component).toBeTruthy()
  })
})
