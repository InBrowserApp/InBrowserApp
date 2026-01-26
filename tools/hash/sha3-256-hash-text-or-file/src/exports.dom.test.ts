import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('sha3-256 hash text or file exports', () => {
  it('exposes tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('sha3-256-hash-text-or-file')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(index).toHaveProperty('toolInfo')
    const component = await routes[0]?.component()
    expect(component).toBeTruthy()
  })
})
