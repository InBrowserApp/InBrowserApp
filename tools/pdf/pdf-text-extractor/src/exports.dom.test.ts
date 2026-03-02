import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as index from './index'

describe('pdf text extractor exports', () => {
  it('exposes tool info and routes', () => {
    expect(toolInfo.toolID).toBe('pdf-text-extractor')
    expect(toolInfo.path).toBe(routes[0]?.path)
    expect(index).toHaveProperty('toolInfo')
  })
})
