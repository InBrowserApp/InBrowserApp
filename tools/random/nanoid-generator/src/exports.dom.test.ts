import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('nanoid generator exports', () => {
  it('exposes tool info and routes', () => {
    expect(toolInfo.toolID).toBe('nanoid-generator')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(index).toHaveProperty('toolInfo')
  })
})
