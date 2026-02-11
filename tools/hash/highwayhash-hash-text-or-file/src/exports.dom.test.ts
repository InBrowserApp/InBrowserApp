import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import * as index from './index'
import { routes } from './routes'

describe('highwayhash hash text or file exports', () => {
  it('exposes tool info and routes', () => {
    expect(toolInfo.toolID).toBe('highwayhash-hash-text-or-file')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(index).toHaveProperty('toolInfo')

    const loader = routes[0]?.component
    expect(typeof loader).toBe('function')
  })
})
