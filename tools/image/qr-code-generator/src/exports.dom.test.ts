import { describe, it, expect } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexExports from './index'

describe('qr-code-generator exports', () => {
  it('exposes tool info and routes', () => {
    expect(toolInfo.toolID).toBe('qr-code-generator')
    expect(routes[0]?.path).toBe(toolInfo.path)
  })

  it('re-exports tool info from index', () => {
    expect(indexExports.toolInfo.toolID).toBe(toolInfo.toolID)
  })
})
